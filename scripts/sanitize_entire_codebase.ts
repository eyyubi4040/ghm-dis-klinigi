import { readdirSync, readFileSync, writeFileSync, unlinkSync, existsSync } from "fs";
import { join } from "path";

const BASE_DIR = "E:/PROJELER/ghm-dis-klinigi";
const PUBLIC_DIR = join(BASE_DIR, "public");

console.log("Kod tabanındaki tüm 'Pozitif' izleri temizleniyor...");

// 1. Clean HTML Files
const htmlFiles = readdirSync(PUBLIC_DIR).filter(f => f.endsWith(".html"));

for (const file of htmlFiles) {
  const filePath = join(PUBLIC_DIR, file);
  let html = readFileSync(filePath, "utf-8");

  // CSS link IDs
  html = html.replace(/id=['"]pozitif-child-css['"]/g, "id='ghm-child-css'");
  html = html.replace(/id=['"]pozitif-layout-css['"]/g, "id='ghm-layout-css'");
  html = html.replace(/id=['"]pozitif-pages-css['"]/g, "id='ghm-pages-css'");
  html = html.replace(/id=['"]pozitif-randevu-css['"]/g, "id='ghm-randevu-css'");
  html = html.replace(/id=['"]pozitif-mobile-css['"]/g, "id='ghm-mobile-css'");
  html = html.replace(/id=['"]pozitif-site-css['"]/g, "id='ghm-site-css'");

  // Any remaining /css/pozitif or /js/pozitif or /images/pozitif
  html = html.replace(/\/css\/pozitif\//g, "/css/theme/");
  html = html.replace(/\/js\/pozitif\//g, "/js/theme/");
  html = html.replace(/\/images\/pozitif\//g, "/images/klinik/");

  // Any leftover pozitif-dental-klinik
  html = html.replace(/pozitif-dental-klinik-(\d+)-scaled\.jpg/g, "klinik-oda-$1-scaled.jpg");
  html = html.replace(/pozitif-dental-klinik-(\d+)-768x513\.jpg/g, "klinik-oda-$1.jpg");
  html = html.replace(/pozitif-dental-klinik-(\d+)/g, "klinik-oda-$1");

  // Schema and metadata cleanup
  html = html.replace(/https?:\/\/[^\/]*pozitifklinik[^\/"']*/gi, "https://ghmdisklinigi.com");
  html = html.replace(/pozitif-klinik\.svg/gi, "logo.png");
  html = html.replace(/pozitif-klinik-ikon\.svg/gi, "logo.png");
  html = html.replace(/Pozitif\s*Dental\s*Klinik/gi, "Dt. Gözde Hilal Morkoyunlu Diş Kliniği");
  html = html.replace(/Pozitif\s*Klinik/gi, "Dt. Gözde Hilal Morkoyunlu Diş Kliniği");
  html = html.replace(/pozitif\+klinik/gi, "ghm+dis+klinigi");
  html = html.replace(/pozitif/gi, "ghm");

  // Fix phone and address in schema
  html = html.replace(/\+90-312-286-26-16/g, "+90-386-213-40-40");
  html = html.replace(/0312 286 26 16/g, "0386 213 40 40");
  html = html.replace(/03122862616/g, "03862134040");
  html = html.replace(/info@localhost:3000/g, "info@ghmdisklinigi.com");
  html = html.replace(/Mustafa Kemal Mah\. Dumlupınar Blv\. 274\/7[^<"]*/gi, "Ahi Evran Mah. Prof. Dr. Mehmet Ali Altın Bulvarı No:14/A, Merkez / KIRŞEHİR");
  html = html.replace(/"addressLocality":"Çankaya"/g, '"addressLocality":"Merkez"');
  html = html.replace(/"addressRegion":"Kırşehir"/g, '"addressRegion":"Kırşehir"');

  writeFileSync(filePath, html, "utf-8");
  console.log(`✓ HTML Temizlendi: ${file}`);
}

// 2. Clean Theme CSS
const themeCssDir = join(PUBLIC_DIR, "css/theme");
for (const file of readdirSync(themeCssDir).filter(f => f.endsWith(".css"))) {
  const p = join(themeCssDir, file);
  let css = readFileSync(p, "utf-8");
  css = css.replace(/pozitif/gi, "ghm");
  writeFileSync(p, css, "utf-8");
  console.log(`✓ CSS Temizlendi: ${file}`);
}

// 3. Clean Theme JS
const themeJsDir = join(PUBLIC_DIR, "js/theme");
for (const file of readdirSync(themeJsDir).filter(f => f.endsWith(".js"))) {
  const p = join(themeJsDir, file);
  let js = readFileSync(p, "utf-8");
  js = js.replace(/pozitif/gi, "ghm");
  writeFileSync(p, js, "utf-8");
  console.log(`✓ JS Temizlendi: ${file}`);
}

// 4. Clean Server Files
const serverFiles = ["server/index.ts", "server/api.ts", "server/seed.ts"];
for (const sf of serverFiles) {
  const p = join(BASE_DIR, sf);
  if (existsSync(p)) {
    let s = readFileSync(p, "utf-8");
    s = s.replace(/pozitif/gi, "ghm");
    writeFileSync(p, s, "utf-8");
    console.log(`✓ Server Dosyası Temizlendi: ${sf}`);
  }
}

// 5. Clean README.md
const readmePath = join(BASE_DIR, "README.md");
if (existsSync(readmePath)) {
  const cleanReadme = `# Dt. Gözde Hilal Morkoyunlu Diş Kliniği - Web Platformu

Kırşehir Merkez'de hizmet veren **Dt. Gözde Hilal Morkoyunlu Diş Kliniği** için özel olarak geliştirilmiş yüksek performanslı, ultra lüks ve modern web platformu.

## 🚀 Teknolojik Altyapı
- **Çalışma Ortamı:** Bun 1.4.4 (Yüksek hızlı TypeScript/JavaScript runtime)
- **Veritabanı:** SQLite (bun:sqlite) - Randevular, iletişim mesajları, hasta yorumları
- **Bulut Depolama:** Google Cloud Storage (\`eycodex\` bucket'ı altında \`ghm-dis-klinigi/\` klasörü)
- **Tasarım & Mimari:** Kırşehir Web Design (https://kirsehirwebdesign.com/)

## 🎨 Tasarım & Renk Paleti
- **Logo Rengi:** Metalik Sıcak Altın (\`#C59B27\` / \`#D4AF37\`)
- **Arka Plan:** Saf Beyaz & Lüks Açık Gri tonları
- **Koyu Vurgular:** Obsidiyen Gece Mavisi (\`#0A0F16\`)
- **Tipografi:** Plus Jakarta Sans & Poppins

## 📂 Dizin Yapısı
\`\`\`
ghm-dis-klinigi/
├── public/                 # Statik web varlıkları
│   ├── css/theme/          # Özel tema ve yerleşim stilleri
│   ├── js/theme/           # Navigasyon, modal ve dinamik bileşenler
│   ├── images/             # Kliniğe ait yüksek çözünürlüklü görseller
│   │   ├── brands/         # İmplant ve ortodonti dünya markaları
│   │   ├── galeri/         # Klinik içi ve ünit fotoğrafları
│   │   ├── gulus/          # Doğal gülüş fotoğrafları
│   │   ├── klinik/         # Klinik tedavi odaları
│   │   ├── social/         # Sosyal medya & Instagram vitrini
│   │   └── tedaviler/      # 9 ana tedavi kategorisi görselleri
│   ├── index.html          # Ana sayfa
│   ├── hakkimizda.html     # Kurumsal sayfa
│   ├── hekimimiz.html      # Hekimimiz
│   ├── ekibimiz.html       # Ekibimiz
│   ├── galeri.html         # Gülüş ve klinik galerisi
│   ├── tedaviler.html      # Tedavilerimiz
│   ├── randevu.html        # Online randevu sayfası
│   ├── iletisim.html       # İletişim & Harita
│   └── admin.html          # Yönetim paneli
├── server/                 # Bun HTTP & SQLite API sunucusu
├── data/                   # SQLite veritabanı (ghm_klinik.sqlite)
└── scripts/                # Senkronizasyon ve bakım araçları
\`\`\`

## 🏃‍♂️ Çalıştırma
\`\`\`bash
bun run server/index.ts
\`\`\`
Veya masaüstünden \`BASLAT.bat\` dosyasına çift tıklayabilirsiniz.
`;
  writeFileSync(readmePath, cleanReadme, "utf-8");
  console.log("✓ README.md temizlendi");
}

// 6. Delete obsolete scratch files
const scratchDir = join(BASE_DIR, "scratch");
if (existsSync(scratchDir)) {
  for (const f of readdirSync(scratchDir)) {
    if (f.includes("pozitif") || f.includes("check_randevu") || f.includes("fix_more")) {
      unlinkSync(join(scratchDir, f));
      console.log(`  🗑 Silindi: scratch/${f}`);
    }
  }
}

// 7. Delete obsolete scripts
const scriptsDir = join(BASE_DIR, "scripts");
if (existsSync(scriptsDir)) {
  for (const f of readdirSync(scriptsDir)) {
    if (f.includes("pozitif") || f.includes("clone_") || f.includes("build_exact_site")) {
      unlinkSync(join(scriptsDir, f));
      console.log(`  🗑 Silindi: scripts/${f}`);
    }
  }
}

console.log("\n✅ Tebrikler! Tüm 'Pozitif' referansları kökten temizlendi.");

