import { handleApiRequest } from "./api";
import { join } from "path";
import { existsSync, statSync } from "fs";
import "./seed";

const PORT = Number(process.env.PORT) || 3000;
const PUBLIC_DIR = join(__dirname, "../public");

const MIME_TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".txt": "text/plain; charset=utf-8",
};

const server = Bun.serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);
    const pathname = url.pathname;

    // API routes & WordPress REST compatibility
    if (pathname.startsWith("/api/") || pathname.startsWith("/wp-json/")) {
      return handleApiRequest(req);
    }

    // Direct static file resolution
    let cleanPath = pathname === "/" ? "index" : pathname.replace(/^\/+|\/+$/g, "");

    // Temiz adresler: /sayfa.html -> /sayfa (kalıcı yönlendirme)
    if (/\.html$/i.test(cleanPath) && !cleanPath.includes("/")) {
      const target = cleanPath.replace(/\.html$/i, "");
      return Response.redirect(new URL((target === "index" ? "/" : `/${target}`) + url.search, url).toString(), 301);
    }

    // Temiz adresler: /sayfa/bolum -> sayfa.html (bölüme JS kaydırır)
    const parts = cleanPath.split("/");
    if (parts.length === 2 && !parts[1].includes(".") && /^[\w-]+$/.test(parts[0])
        && existsSync(join(PUBLIC_DIR, `${parts[0]}.html`))) {
      cleanPath = parts[0];
    }
    
    // URL Aliases
    const aliases: Record<string, string> = {
      "dis-eti-tedavileri": "dis-eti-periodontal-hastaliklar-ve-tedavileri",
      "emre-uslu": "hekimimiz",
      "gokhan-torun": "hekimimiz",
      "kivanc-yamanel": "hekimimiz",
      "tedavilerimiz": "tedaviler",
    };
    if (aliases[cleanPath]) {
      cleanPath = aliases[cleanPath];
    }

    let relativePath = cleanPath;
    if (!relativePath.includes(".")) {
      if (existsSync(join(PUBLIC_DIR, `${relativePath}.html`))) {
        relativePath = `${relativePath}.html`;
      }
    }

    let filePath = join(PUBLIC_DIR, relativePath);

    // Fallback search for WordPress paths (/wp-content/..., /wp-includes/...)
    if (!existsSync(filePath) || !statSync(filePath).isFile()) {
      const filename = pathname.split("/").pop() || "";
      const candidates = [
        join(PUBLIC_DIR, "css/theme", filename),
        join(PUBLIC_DIR, "js/theme", filename),
        join(PUBLIC_DIR, "images/klinik", filename),
        join(PUBLIC_DIR, "images/brands", filename),
        join(PUBLIC_DIR, "images", filename),
      ];
      for (const cand of candidates) {
        if (existsSync(cand) && statSync(cand).isFile()) {
          filePath = cand;
          break;
        }
      }
    }

    if (existsSync(filePath) && statSync(filePath).isFile()) {
      const ext = ("." + (filePath.split(".").pop() || "")).toLowerCase();
      const contentType = MIME_TYPES[ext] || "application/octet-stream";
      const file = Bun.file(filePath);

      return new Response(file, {
        headers: {
          "Content-Type": contentType,
          "Cache-Control": ext === ".html" ? "no-cache" : "public, max-age=86400",
        },
      });
    }

    // Fallback to index.html or 404
    const notFoundPath = join(PUBLIC_DIR, "404.html");
    if (existsSync(notFoundPath)) {
      return new Response(Bun.file(notFoundPath), {
        status: 404,
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    return new Response("Sayfa bulunamadı (404)", { status: 404 });
  },
});

console.log(`\n============================================================`);
console.log(`✨ Dt. Gözde Hilal Morkoyunlu Diş Kliniği Web Platformu`);
console.log(`🚀 Bun Sunucusu Başlatıldı: http://localhost:${server.port}`);
console.log(`📁 Statik Dizin: ${PUBLIC_DIR}`);
console.log(`============================================================\n`);
