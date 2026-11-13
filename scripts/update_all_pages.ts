import { readFileSync, writeFileSync, readdirSync } from "fs";
import { join } from "path";

const BASE_DIR = "E:/PROJELER/ghm-dis-klinigi";
const PUBLIC_DIR = join(BASE_DIR, "public");

const FOOTER_KIRSEHIR_HTML = `<div class="pkf-copy-right" style="display: inline-flex; align-items: center; justify-content: center; gap: 10px;">
  <span>Tasarım &amp; Altyapı:</span>
  <a href="https://kirsehirwebdesign.com/" target="_blank" rel="noopener" title="Kırşehir Web Design" style="display: inline-flex; align-items: center; text-decoration: none;">
    <img src="/images/kirsehirwebdesign-logo-trans.png" alt="Kırşehir Web Design" style="height: 28px; width: auto; max-width: 140px; object-fit: contain; vertical-align: middle;">
  </a>
</div>`;

const ADDRESS_TEXT = "Ahi Evran Mah. Prof. Dr. Mehmet Ali Altın Bulvarı No:14/A, Merkez / KIRŞEHİR";

function updateHtmlFiles() {
  const files = readdirSync(PUBLIC_DIR).filter(f => f.endsWith(".html"));

  for (const filename of files) {
    const filePath = join(PUBLIC_DIR, filename);
    let html = readFileSync(filePath, "utf-8");

    // 1. Remove Turuncu Yazılım and replace with Kırşehir Web Design
    html = html.replace(/<a[^>]*turuncuyazilim[^>]*>[\s\S]*?<\/a>/gi, FOOTER_KIRSEHIR_HTML);
    html = html.replace(/Turuncu\s+Yazılım/gi, "Kırşehir Web Design");
    html = html.replace(/https?:\/\/(?:www\.)?turuncuyazilim\.com\.tr/gi, "https://kirsehirwebdesign.com/");

    // 2. Fix leftover Ankara/Çankaya addresses
    html = html.replace(/Mustafa Kemal Mah\. Dumlupınar Blv\. 274\/7[^<]*Çankaya \/ ANKARA/gi, ADDRESS_TEXT);
    html = html.replace(/Dumlupınar Bulvarı No:\s*274\/7[^<]*Çankaya\/Ankara/gi, ADDRESS_TEXT);
    html = html.replace(/Mahall Ankara C2 Blok[^<]*/gi, "Ahi Evran Mah. Merkez / Kırşehir");

    // 3. Treatment images: map to new high-res clean paths
    html = html.replace(/\/images\/pozitif\/genel-dis-tedavileri-scaled\.jpeg/g, "/images/tedaviler/genel-dis.jpg");
    html = html.replace(/\/images\/pozitif\/invisalign\.jpg/g, "/images/tedaviler/invisalign.jpg");
    html = html.replace(/\/images\/pozitif\/implant-tedavisi\.jpg/g, "/images/tedaviler/implant.jpg");
    html = html.replace(/\/images\/pozitif\/cocuk-dis-hekimligi\.jpg/g, "/images/tedaviler/pedodonti.jpg");
    html = html.replace(/\/images\/pozitif\/koruyucu-dis-tedavileri\.jpg/g, "/images/tedaviler/koruyucu.jpg");
    html = html.replace(/\/images\/pozitif\/kozmetik-dis-hekimligi\.webp/g, "/images/tedaviler/kozmetik.jpg");
    html = html.replace(/\/images\/pozitif\/eksik-dis-tedavileri\.jpg/g, "/images/tedaviler/eksik-dis.jpg");
    html = html.replace(/\/images\/pozitif\/dis-eti-tedavileri\.jpg/g, "/images/tedaviler/dis-eti.jpg");
    html = html.replace(/\/images\/pozitif\/ozel-dis-tedavileri\.jpg/g, "/images/tedaviler/ozel-tedaviler.jpg");

    // 4. Smile ticker: map to new clean smiling faces and remove old srcset
    for (let i = 1; i <= 6; i++) {
      const numStr = i < 10 ? `0${i}` : `${i}`;
      const pattern = new RegExp(`src=["'][^"']*make-your-smile-${numStr}[^"']*["'][^>]*srcset=["'][^"']*["']`, "gi");
      html = html.replace(pattern, `src="/images/gulus/smile-${numStr}.jpg"`);
      html = html.replace(new RegExp(`\\/images\\/pozitif\\/make-your-smile-${numStr}[^"']*\\.png`, "g"), `/images/gulus/smile-${numStr}.jpg`);
    }

    // 5. Doctor & Specialists & Team Members
    // Dt. Gözde Hilal Morkoyunlu
    html = html.replace(/\/images\/pozitif\/DSC02362-683x1024\.jpg/g, "/images/doctor-gozde.jpg");
    // Kivanc Yamanel
    html = html.replace(/\/images\/pozitif\/DSC02344-683x1024\.jpg/g, "/images/doctor-kivanc.jpg");
    // Team assistants
    html = html.replace(/\/images\/pozitif\/DSC02298-768x1152\.jpg/g, "/images/ekip-ayse.jpg");
    html = html.replace(/\/images\/pozitif\/DSC02303-768x1152\.jpg/g, "/images/ekip-sumeyye.jpg");
    html = html.replace(/\/images\/pozitif\/DSC02339-768x1152\.jpg/g, "/images/ekip-dilara.jpg");
    // Old Pozitif doctor
    html = html.replace(/\/images\/pozitif\/gokhan-torun-682x1024\.jpg/g, "/images/doctor-ortodonti.jpg");
    html = html.replace(/\/images\/pozitif\/gokhan-torun\.jpg/g, "/images/doctor-ortodonti.jpg");

    // 6. Clean up redundant WordPress srcset attributes for doctors and clinic photos
    html = html.replace(/srcset=["'][^"']*(?:DSC02|make-your-smile|gokhan-torun|genel-dis)[^"']*["']/gi, "");

    // 7. Ensure Header and Footer logos are single clean img tag
    html = html.replace(
      /<a class="pkh-logo"[^>]*>[\s\S]*?<\/a>/gi,
      `<a class="pkh-logo" href="/" aria-label="Dt. Gözde Hilal Morkoyunlu Diş Kliniği ana sayfa"><img class="pkl" src="/images/logo.png" alt="Dt. Gözde Hilal Morkoyunlu Diş Kliniği" style="height:54px; width:auto; max-width:240px; object-fit:contain;"></a>`
    );

    // Write back
    writeFileSync(filePath, html, "utf-8");
    console.log(`✓ Güncellendi: ${filename}`);
  }
}

// Also update CSS references
function updateCssFiles() {
  const cssPath = join(PUBLIC_DIR, "css/pozitif/post-14.css");
  let css = readFileSync(cssPath, "utf-8");
  css = css.replace(/https:\/\/pozitifklinik\.com\/wp-content\/uploads\/2024\/03\/pozitif-dental-klinik-6-scaled\.jpg/g, "/images/galeri/waiting-lounge.jpg");
  css = css.replace(/https:\/\/pozitifklinik\.com\/wp-content\/uploads\/2024\/03\/pozitif-dental-klinik-8-scaled\.jpg/g, "/images/galeri/clinic-unit.jpg");
  writeFileSync(cssPath, css, "utf-8");
  console.log("✓ Güncellendi: post-14.css");

  const cssPagesPath = join(PUBLIC_DIR, "css/pozitif/pozitif-pages.css");
  let cssPages = readFileSync(cssPagesPath, "utf-8");
  cssPages = cssPages.replace(/\.\.\/\.\.\/\.\.\/\.\.\/uploads\/2024\/04\/Pozitif-Klinik-Ikon\.svg/g, "/images/logo.png");
  writeFileSync(cssPagesPath, cssPages, "utf-8");
  console.log("✓ Güncellendi: pozitif-pages.css");
}

console.log("Sayfa ve stiller güncelleniyor...");
updateHtmlFiles();
updateCssFiles();
console.log("Tamamlandı!");

