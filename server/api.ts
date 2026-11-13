import { db } from "./db";
import { uploadToGcs, listGcsMedia, isGcsConfigured } from "./gcs";
import { createHmac, randomBytes, timingSafeEqual } from "crypto";

// ---- Yönetici oturumu (imzalı, süreli token) ----
const SESSION_SECRET = process.env.SESSION_SECRET || randomBytes(32).toString("hex");
const TOKEN_TTL_MS = 12 * 60 * 60 * 1000; // 12 saat
const IS_PROD = process.env.NODE_ENV === "production";

function getAdminPassword(): string {
  if (process.env.ADMIN_PASSWORD) return process.env.ADMIN_PASSWORD;
  if (IS_PROD) return ""; // canlıda parola mutlaka ortam değişkeninden gelmeli
  const row = db.query("SELECT value FROM settings WHERE key = 'admin_password'").get() as { value: string } | undefined;
  return row?.value || "";
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a), bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

function sign(payload: string): string {
  return createHmac("sha256", SESSION_SECRET).update(payload).digest("hex");
}

function createAdminToken(): string {
  const exp = String(Date.now() + TOKEN_TTL_MS);
  return `${exp}.${sign(exp)}`;
}

function isAdmin(req: Request): boolean {
  const token = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");
  const [exp, sig] = token.split(".");
  if (!exp || !sig || !/^\d+$/.test(exp) || Number(exp) < Date.now()) return false;
  return safeEqual(sig, sign(exp));
}

export async function handleApiRequest(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const path = url.pathname;
  const method = req.method;

  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Content-Type": "application/json",
  };

  if (method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  // Yalnızca yöneticinin erişebileceği uç noktalar
  const adminOnly =
    (path === "/api/appointments" && method === "GET") ||
    (path.startsWith("/api/appointments/") && (method === "PATCH" || method === "DELETE")) ||
    (path === "/api/messages" && method === "GET") ||
    path.startsWith("/api/gcs/");
  if (adminOnly && !isAdmin(req)) {
    return Response.json({ success: false, error: "Yetkisiz erişim. Lütfen yönetici olarak giriş yapın." }, { status: 401, headers: corsHeaders });
  }

  try {
    // 0. Online Randevu REST Compatibility
    if (path === "/wp-json/ghm/v1/randevu-token") {
      return Response.json({ t: "ghm_token_" + Date.now() }, { headers: corsHeaders });
    }

    if (path === "/wp-json/ghm/v1/randevu" && method === "POST") {
      const body = await req.json();
      const name = `${body.adiniz || ""} ${body.soyadiniz || ""}`.trim() || body.name || "İsimsiz";
      const phone = body.telefon || body.phone || "";
      const email = body.email || "";
      const treatment = body.bolum || body.treatment || "Genel Muayene";
      const notes = `${body.aciklama || body.notes || ""} [TC: ${body.kimlik || "-"}, Tercih Saat: ${body.saat || "-"}]`;
      const today = new Date().toISOString().split("T")[0];

      const stmt = db.prepare(
        "INSERT INTO appointments (name, phone, email, treatment, appointment_date, appointment_time, notes, status) VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')"
      );
      stmt.run(name, phone, email, treatment, today, body.saat || "10:00", notes);

      return Response.json({
        ok: true,
        message: "Randevu talebiniz başarıyla alındı. Dt. Gözde Hilal Morkoyunlu Kliniği olarak en kısa sürede sizi arayacağız.",
      }, { headers: corsHeaders });
    }

    // 1. Settings
    if (path === "/api/settings" && method === "GET") {
      const rows = db.query("SELECT key, value FROM settings").all() as { key: string; value: string }[];
      const settingsMap = Object.fromEntries(rows.map(r => [r.key, r.value]));
      delete settingsMap.admin_password;
      return Response.json({ success: true, data: settingsMap }, { headers: corsHeaders });
    }

    // 2. Reviews
    if (path === "/api/reviews") {
      if (method === "GET") {
        const reviews = db.query("SELECT * FROM reviews WHERE approved = 1 ORDER BY id DESC").all();
        return Response.json({ success: true, data: reviews }, { headers: corsHeaders });
      }
      if (method === "POST") {
        const body = await req.json();
        const { author, city, rating, treatment, comment } = body;
        if (!author || !comment) {
          return Response.json({ success: false, error: "İsim ve yorum zorunludur" }, { status: 400, headers: corsHeaders });
        }
        const today = new Date().toISOString().split("T")[0];
        const stmt = db.prepare("INSERT INTO reviews (author, city, rating, treatment, comment, date, approved) VALUES (?, ?, ?, ?, ?, ?, 1)");
        const res = stmt.run(author, city || "Kırşehir", Number(rating) || 5, treatment || "Genel Muayene", comment, today);
        return Response.json({ success: true, message: "Yorumunuz kaydedildi.", id: res.lastInsertRowid }, { headers: corsHeaders });
      }
    }

    // 3. Appointments Standard Endpoint
    if (path === "/api/appointments") {
      if (method === "GET") {
        const appointments = db.query("SELECT * FROM appointments ORDER BY appointment_date DESC, appointment_time ASC").all();
        return Response.json({ success: true, data: appointments }, { headers: corsHeaders });
      }
      if (method === "POST") {
        const body = await req.json();
        const { name, phone, email, treatment, appointment_date, appointment_time, notes } = body;
        if (!name || !phone) {
          return Response.json({ success: false, error: "Lütfen isim ve telefon bilgilerini girin." }, { status: 400, headers: corsHeaders });
        }
        const today = new Date().toISOString().split("T")[0];
        const stmt = db.prepare("INSERT INTO appointments (name, phone, email, treatment, appointment_date, appointment_time, notes, status) VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')");
        const res = stmt.run(name, phone, email || "", treatment || "Genel Muayene", appointment_date || today, appointment_time || "10:00", notes || "");
        return Response.json({
          success: true,
          message: "Randevu talebiniz başarıyla alındı.",
          appointmentId: res.lastInsertRowid,
        }, { headers: corsHeaders });
      }
    }

    if (path.startsWith("/api/appointments/") && method === "PATCH") {
      const id = path.split("/").pop();
      const body = await req.json();
      const { status } = body;
      const stmt = db.prepare("UPDATE appointments SET status = ? WHERE id = ?");
      stmt.run(status, Number(id));
      return Response.json({ success: true, message: "Randevu durumu güncellendi." }, { headers: corsHeaders });
    }

    if (path.startsWith("/api/appointments/") && method === "DELETE") {
      const id = path.split("/").pop();
      const stmt = db.prepare("DELETE FROM appointments WHERE id = ?");
      stmt.run(Number(id));
      return Response.json({ success: true, message: "Randevu silindi." }, { headers: corsHeaders });
    }

    // 4. Contact Messages
    if (path === "/api/messages") {
      if (method === "GET") {
        const messages = db.query("SELECT * FROM messages ORDER BY id DESC").all();
        return Response.json({ success: true, data: messages }, { headers: corsHeaders });
      }
      if (method === "POST") {
        const body = await req.json();
        const { name, phone, email, subject, message } = body;
        const stmt = db.prepare("INSERT INTO messages (name, phone, email, subject, message) VALUES (?, ?, ?, ?, ?)");
        const res = stmt.run(name || "İsimsiz", phone || "", email || "", subject || "Genel Bilgi", message || "");
        return Response.json({ success: true, message: "Mesajınız iletildi, teşekkürler.", id: res.lastInsertRowid }, { headers: corsHeaders });
      }
    }

    // 5. Admin Login
    if (path === "/api/admin/login" && method === "POST") {
      const body = await req.json();
      const { password } = body;
      const expected = getAdminPassword();
      if (!expected) {
        return Response.json({ success: false, error: "Yönetici parolası tanımlı değil (ADMIN_PASSWORD)." }, { status: 503, headers: corsHeaders });
      }
      if (typeof password === "string" && safeEqual(password, expected)) {
        return Response.json({ success: true, token: createAdminToken() }, { headers: corsHeaders });
      } else {
        return Response.json({ success: false, error: "Hatalı yönetici parolası!" }, { status: 401, headers: corsHeaders });
      }
    }

    // 6. Google Cloud Storage Media
    if (path === "/api/gcs/media" && method === "GET") {
      const files = await listGcsMedia("ghm-dis-klinigi");
      return Response.json({
        success: true,
        configured: isGcsConfigured(),
        folder: "ghm-dis-klinigi",
        bucket: process.env.GCS_BUCKET_NAME || "eycodex",
        data: files,
      }, { headers: corsHeaders });
    }

    // 7. Media Upload to GCS
    if (path === "/api/gcs/upload" && method === "POST") {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;
      if (!file) {
        return Response.json({ success: false, error: "Dosya bulunamadı" }, { status: 400, headers: corsHeaders });
      }
      const buffer = await file.arrayBuffer();
      const res = await uploadToGcs(buffer, file.name, file.type, "ghm-dis-klinigi");
      return Response.json(res, { headers: corsHeaders });
    }

    return Response.json({ error: "Endpoint bulunamadı" }, { status: 404, headers: corsHeaders });
  } catch (err: any) {
    console.error("API Hatası:", err);
    return Response.json({ success: false, error: err.message }, { status: 500, headers: corsHeaders });
  }
}
