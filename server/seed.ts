import { db } from "./db";

console.log("Başlangıç verileri yükleniyor...");

// Clinic settings
const settings = [
  ["clinic_name", "Dt. Gözde Hilal Morkoyunlu Diş Kliniği"],
  ["clinic_tagline", "Kırşehir'in Öncü ve Modern Ağız ve Diş Sağlığı Kliniği"],
  ["phone_main", "0386 213 40 40"],
  ["phone_mobile", "0540 213 40 40"],
  ["whatsapp", "905402134040"],
  ["email", "iletisim@gozdehilalmorkoyunlu.com"],
  ["address", "Nasuh Dede Mah. Prof. Dr. Mehmet Ali Altın Bulvarı No:14/A, Merkez / KIRŞEHİR"],
  ["working_hours", "Pazartesi - Cumartesi: 09:00 - 19:00"],
  ["emergency_hours", "Acil Nöbetçi Diş Hekimi Hattı: 7/24"],
  ["instagram", "https://www.instagram.com/gozde_hilal_morkoyunlu/"],
  ["google_maps", "https://maps.google.com/?q=Kırşehir+Merkez"],
  ["experience_years", "12+"],
  ["happy_patients", "7500+"],
  ["google_rating", "5.00"],
];

const insertSetting = db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)");
for (const [k, v] of settings) {
  insertSetting.run(k, v);
}

// Yönetici parolası: canlıda ADMIN_PASSWORD ortam değişkeninden okunur (veritabanına yazılmaz).
// Yalnızca yerel geliştirmede, hiç parola yoksa varsayılan bir değer eklenir.
if (process.env.NODE_ENV !== "production" && !process.env.ADMIN_PASSWORD) {
  db.prepare("INSERT OR IGNORE INTO settings (key, value) VALUES ('admin_password', ?)").run("kirsehir40");
}

// Initial realistic patient reviews
const sampleReviews = [
  {
    author: "Elif Karaca",
    city: "Kırşehir / Merkez",
    rating: 5,
    treatment: "Zirkonyum Kaplama & Gülüş Tasarımı",
    comment: "Gözde Hanım ve ekibine sonsuz teşekkürler. Yıllardır gülerken dişlerimi saklardım, yapılan zirkonyum kaplamalar hem o kadar doğal hem de o kadar estetik oldu ki herkes dişlerimi soruyor. Kırşehir'de böylesine üst düzey bir klinik olması büyük şans.",
    date: "2026-11-04"
  },
  {
    author: "Ahmet Turan Kaya",
    city: "Kırşehir / Kaman",
    rating: 5,
    treatment: "Straumann İmplant Tedavisi",
    comment: "Çok korkarak gittiğim implant operasyonunu sıfır ağrıyla tamamladık. Kliniğin hijyeni, kullanılan cihazların son teknoloji oluşu ve Gözde Hocamın güven veren samimi yaklaşımı harikaydı. Kesinlikle tavsiye ederim.",
    date: "2026-10-28"
  },
  {
    author: "Merve Çetinkaya",
    city: "Kırşehir / Mucur",
    rating: 5,
    treatment: "Invisalign (Şeffaf Plak Tedavisi)",
    comment: "Diş teli takmak istemiyordum. Gözde Hanım şeffaf plak sürecimi başlattı. 3D ağız içi tarama ile sonucun nasıl olacağını ilk günden ekranda gördüm. 6 ay gibi kısa sürede mükemmel bir hizalanma oldu.",
    date: "2026-10-15"
  },
  {
    author: "Serkan Doğan",
    city: "Kırşehir / Merkez",
    rating: 5,
    treatment: "20'lik Gömülü Diş Çekimi & Dolgu",
    comment: "Gömülü 20'lik dişim çok ağrı yapıyordu. 15 dakikada hiç acı hissetmeden dikişsiz gibi tertemiz aldı. Klinikteki nezaket ve profesyonellik takdire şayan.",
    date: "2026-10-02"
  },
  {
    author: "Selin Yıldırım",
    city: "Kırşehir / Merkez",
    rating: 5,
    treatment: "Lazerle Diş Beyazlatma (Bleaching)",
    comment: "Tek seansta 4-5 ton açıldı dişlerim. Özel günüm öncesi yaptırdım, hiçbir sızlama ya da hassasiyet yaşamadım. ghm ve güler yüzlü hizmet için teşekkürler!",
    date: "2026-09-20"
  }
];

const checkReviews = db.query("SELECT COUNT(*) as count FROM reviews").get() as { count: number };
if (checkReviews.count === 0) {
  const insertReview = db.prepare("INSERT INTO reviews (author, city, rating, treatment, comment, date) VALUES (?, ?, ?, ?, ?, ?)");
  for (const r of sampleReviews) {
    insertReview.run(r.author, r.city, r.rating, r.treatment, r.comment, r.date);
  }
  console.log("✓ Örnek hasta yorumları eklendi.");
}

// Örnek randevular yalnızca yerel geliştirmede eklenir
const checkAppointments = db.query("SELECT COUNT(*) as count FROM appointments").get() as { count: number };
if (process.env.NODE_ENV !== "production" && checkAppointments.count === 0) {
  const insertApt = db.prepare("INSERT INTO appointments (name, phone, email, treatment, appointment_date, appointment_time, notes, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
  insertApt.run("Canan Özdemir", "05551234567", "canan@example.com", "Estetik Gülüş Tasarımı", "2026-11-16", "10:30", "Ön dişlerde estetik değerlendirme talebi", "pending");
  insertApt.run("Murat Yılmaz", "05329876543", "murat@example.com", "İmplant Muayenesi", "2026-11-17", "14:00", "Sol alt azı dişi için implant danışma", "confirmed");
  console.log("✓ Örnek randevular eklendi.");
}

console.log("✓ Tohumlama tamamlandı.");

