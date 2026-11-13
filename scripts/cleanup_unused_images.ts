import { readdirSync, readFileSync, unlinkSync, statSync } from "fs";
import { join, relative } from "path";

const BASE_DIR = "E:/PROJELER/ghm-dis-klinigi";
const PUBLIC_DIR = join(BASE_DIR, "public");

// 1. Scan all HTML and CSS files for image references
const referencedImages = new Set<string>();

function scanText(content: string) {
  // Regex to match image filenames or paths
  const imgRegex = /[\/'"a-zA-Z0-9_\-\.]+\.(?:png|jpg|jpeg|webp|svg|gif)/gi;
  let m;
  while ((m = imgRegex.exec(content)) !== null) {
    const raw = m[0];
    const filename = raw.split("/").pop() || "";
    if (filename) {
      referencedImages.add(filename.toLowerCase());
    }
  }
}

// Read all HTML files
const htmlFiles = readdirSync(PUBLIC_DIR).filter(f => f.endsWith(".html"));
for (const f of htmlFiles) {
  scanText(readFileSync(join(PUBLIC_DIR, f), "utf-8"));
}

// Read all CSS files
function scanCss(dir: string) {
  for (const item of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, item.name);
    if (item.isDirectory()) scanCss(full);
    else if (item.name.endsWith(".css")) scanText(readFileSync(full, "utf-8"));
  }
}
scanCss(join(PUBLIC_DIR, "css"));

console.log(`Toplam ${referencedImages.size} benzersiz görsel referansı bulundu.`);

// Critical protected files that must NEVER be deleted
const PROTECTED_FILENAMES = new Set([
  "logo.png",
  "ghmdisklinigilogosu.png",
  "kirsehirwebdesign-logo-trans.png",
  "kirsehirwebdesign-logo.png",
  "kirsehirwebdesign-logo-dark.png",
  "waiting-lounge.jpg",
  "clinic-unit.jpg",
  "sterilization.jpg",
  "xray-tomography.jpg",
  "clinic-interior.jpg",
  "smile-transformation.jpg",
  "gulus-once.jpg",
  "gulus-sonra.jpg",
  "doctor-gozde.jpg",
  "doctor-kivanc.jpg",
  "doctor-ortodonti.jpg",
  "ekip-ayse.jpg",
  "ekip-sumeyye.jpg",
  "ekip-dilara.jpg",
  "genel-dis.jpg",
  "invisalign.jpg",
  "implant.jpg",
  "pedodonti.jpg",
  "koruyucu.jpg",
  "kozmetik.jpg",
  "eksik-dis.jpg",
  "dis-eti.jpg",
  "ozel-tedaviler.jpg",
  "treatment-genel.jpg",
  "treatment-invisalign.jpg",
  "treatment-implant.jpg",
  "treatment-pedodonti.jpg",
  "treatment-koruyucu.jpg",
  "treatment-kozmetik.jpg",
  "treatment-eksik-dis.jpg",
  "treatment-dis-eti.jpg",
  "treatment-ozel.jpg",
  "smile-01.jpg",
  "smile-02.jpg",
  "smile-03.jpg",
  "smile-04.jpg",
  "smile-05.jpg",
  "smile-06.jpg",
  "insta-01.jpg",
  "insta-02.jpg",
  "insta-03.jpg",
  "insta-04.jpg",
  "insta-05.jpg",
  "insta-06.jpg",
  "insta-07.jpg",
  "insta-08.jpg",
  "bego.svg",
  "invisalign.svg",
  "medentika.svg",
  "nobel-biocare.svg",
  "osstem.svg",
  "straumann.svg",
  // Clinic photos
  "pozitif-dental-klinik-1-768x513.jpg",
  "pozitif-dental-klinik-2-768x513.jpg",
  "pozitif-dental-klinik-3-768x513.jpg",
  "pozitif-dental-klinik-4-768x513.jpg",
  "pozitif-dental-klinik-5-768x513.jpg",
  "pozitif-dental-klinik-6-768x513.jpg",
  "pozitif-dental-klinik-7-768x513.jpg",
  "pozitif-dental-klinik-8-768x513.jpg",
  "pozitif-dental-klinik-6-scaled.jpg",
]);

// 2. Scan all physical files in public/images
const allImageFiles: string[] = [];
function collectFiles(dir: string) {
  for (const item of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, item.name);
    if (item.isDirectory()) {
      collectFiles(full);
    } else {
      allImageFiles.push(full);
    }
  }
}
collectFiles(join(PUBLIC_DIR, "images"));

console.log(`Disk üzerinde toplam ${allImageFiles.length} görsel dosyası var.`);

let deletedCount = 0;
let deletedBytes = 0;
let keptCount = 0;

for (const fullPath of allImageFiles) {
  const filename = fullPath.split(/[\/\\]/).pop() || "";
  const lower = filename.toLowerCase();

  const isProtected = PROTECTED_FILENAMES.has(lower);
  const isReferenced = referencedImages.has(lower);

  if (isProtected || isReferenced) {
    keptCount++;
    console.log(`  [KORUNDU] ${relative(PUBLIC_DIR, fullPath)}`);
  } else {
    // Unused image to delete
    const size = statSync(fullPath).size;
    deletedBytes += size;
    deletedCount++;
    unlinkSync(fullPath);
    console.log(`  🗑 [SİLİNDİ] ${relative(PUBLIC_DIR, fullPath)} (${Math.round(size / 1024)} KB)`);
  }
}

console.log(`\nTemizlik Özeti:`);
console.log(`- Korunan Görsel Sayısı: ${keptCount}`);
console.log(`- Silinen Gereksiz Görsel Sayısı: ${deletedCount}`);
console.log(`- Açılan Disk Alanı: ${Math.round(deletedBytes / 1024 / 1024 * 100) / 100} MB`);

