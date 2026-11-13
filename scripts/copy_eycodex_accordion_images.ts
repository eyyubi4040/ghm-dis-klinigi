import { copyFileSync, existsSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";

const SRC_DIR = "E:/PROJELER/eycodex-dis-klinigi/public/images/tedaviler";
const DEST_DIR = "E:/PROJELER/ghm-dis-klinigi/public/images/tedaviler";
const POZITIF_DIR = "E:/PROJELER/ghm-dis-klinigi/public/images/pozitif";

const ACCORDION_IMAGES = [
  {
    file: "treatment-genel.jpg",
    shortName: "genel-dis.jpg",
    pozitifName: "genel-dis-tedavileri-scaled.jpeg",
  },
  {
    file: "treatment-invisalign.jpg",
    shortName: "invisalign.jpg",
    pozitifName: "invisalign.jpg",
  },
  {
    file: "treatment-implant.jpg",
    shortName: "implant.jpg",
    pozitifName: "implant-tedavisi.jpg",
  },
  {
    file: "treatment-pedodonti.jpg",
    shortName: "pedodonti.jpg",
    pozitifName: "cocuk-dis-hekimligi.jpg",
  },
  {
    file: "treatment-koruyucu.jpg",
    shortName: "koruyucu.jpg",
    pozitifName: "koruyucu-dis-tedavileri.jpg",
  },
  {
    file: "treatment-kozmetik.jpg",
    shortName: "kozmetik.jpg",
    pozitifName: "kozmetik-dis-hekimligi.webp",
  },
  {
    file: "treatment-eksik-dis.jpg",
    shortName: "eksik-dis.jpg",
    pozitifName: "eksik-dis-tedavileri.jpg",
  },
  {
    file: "treatment-dis-eti.jpg",
    shortName: "dis-eti.jpg",
    pozitifName: "dis-eti-tedavileri.jpg",
  },
  {
    file: "treatment-ozel.jpg",
    shortName: "ozel-tedaviler.jpg",
    pozitifName: "ozel-dis-tedavileri.jpg",
  },
];

console.log("Eycodex Diş Kliniği akordeon görselleri kopyalanıyor...");

for (const item of ACCORDION_IMAGES) {
  const srcPath = join(SRC_DIR, item.file);
  if (!existsSync(srcPath)) {
    console.error(`Bulunamadı: ${srcPath}`);
    continue;
  }

  // Copy to destination as treatment-*.jpg
  const destTreatmentPath = join(DEST_DIR, item.file);
  copyFileSync(srcPath, destTreatmentPath);
  console.log(`✓ Kopyalandı: ${item.file}`);

  // Copy to destination as shortName (e.g. genel-dis.jpg)
  const destShortPath = join(DEST_DIR, item.shortName);
  copyFileSync(srcPath, destShortPath);

  // Copy to pozitif dir
  const destPozitifPath = join(POZITIF_DIR, item.pozitifName);
  copyFileSync(srcPath, destPozitifPath);
}

// Update public/index.html accordion (.pka)
const indexPath = "E:/PROJELER/ghm-dis-klinigi/public/index.html";
let html = readFileSync(indexPath, "utf-8");

// Replace .pka image sources with exact treatment-*.jpg paths
html = html.replace(
  /<img src="\/images\/tedaviler\/genel-dis\.jpg"/g,
  '<img src="/images/tedaviler/treatment-genel.jpg"'
);
html = html.replace(
  /<img src="\/images\/tedaviler\/invisalign\.jpg"/g,
  '<img src="/images/tedaviler/treatment-invisalign.jpg"'
);
html = html.replace(
  /<img src="\/images\/tedaviler\/implant\.jpg"/g,
  '<img src="/images/tedaviler/treatment-implant.jpg"'
);
html = html.replace(
  /<img src="\/images\/tedaviler\/pedodonti\.jpg"/g,
  '<img src="/images/tedaviler/treatment-pedodonti.jpg"'
);
html = html.replace(
  /<img src="\/images\/tedaviler\/koruyucu\.jpg"/g,
  '<img src="/images/tedaviler/treatment-koruyucu.jpg"'
);
html = html.replace(
  /<img src="\/images\/tedaviler\/kozmetik\.jpg"/g,
  '<img src="/images/tedaviler/treatment-kozmetik.jpg"'
);
html = html.replace(
  /<img src="\/images\/tedaviler\/eksik-dis\.jpg"/g,
  '<img src="/images/tedaviler/treatment-eksik-dis.jpg"'
);
html = html.replace(
  /<img src="\/images\/tedaviler\/dis-eti\.jpg"/g,
  '<img src="/images/tedaviler/treatment-dis-eti.jpg"'
);
html = html.replace(
  /<img src="\/images\/tedaviler\/ozel-tedaviler\.jpg"/g,
  '<img src="/images/tedaviler/treatment-ozel.jpg"'
);

writeFileSync(indexPath, html, "utf-8");
console.log("✓ index.html akordeon (.pka) görselleri güncellendi!");

