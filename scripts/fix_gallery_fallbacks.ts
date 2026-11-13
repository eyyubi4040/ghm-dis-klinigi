import { readFileSync, writeFileSync, readdirSync, copyFileSync, existsSync } from "fs";
import { join } from "path";

const PUBLIC_DIR = "E:/PROJELER/ghm-dis-klinigi/public";

// 1. Ensure all pozitif-dental-klinik-1 through 8 exist in public/images/pozitif
const clinicFallbacks = [
  "waiting-lounge.jpg",
  "clinic-unit.jpg",
  "sterilization.jpg",
  "xray-tomography.jpg",
  "waiting-lounge.jpg",
  "clinic-unit.jpg",
  "sterilization.jpg",
  "xray-tomography.jpg",
];

for (let i = 1; i <= 8; i++) {
  const target768 = join(PUBLIC_DIR, `images/pozitif/pozitif-dental-klinik-${i}-768x513.jpg`);
  const targetScaled = join(PUBLIC_DIR, `images/pozitif/pozitif-dental-klinik-${i}-scaled.jpg`);
  const src = join(PUBLIC_DIR, "images/galeri", clinicFallbacks[i - 1]);

  if (!existsSync(target768) && existsSync(src)) {
    copyFileSync(src, target768);
    console.log(`Created fallback for: pozitif-dental-klinik-${i}-768x513.jpg`);
  }
  if (!existsSync(targetScaled) && existsSync(src)) {
    copyFileSync(src, targetScaled);
    console.log(`Created fallback for: pozitif-dental-klinik-${i}-scaled.jpg`);
  }
}

// Ensure DSC02362-scaled.jpg exists
const dscSrc = join(PUBLIC_DIR, "images/doctor-gozde.jpg");
const dscTarget = join(PUBLIC_DIR, "images/pozitif/DSC02362-scaled.jpg");
if (existsSync(dscSrc)) {
  copyFileSync(dscSrc, dscTarget);
  console.log("Created fallback for DSC02362-scaled.jpg");
}

// 2. Remove all leftover srcset pointing to unneeded thumbnail sizes from all HTML files
const htmlFiles = readdirSync(PUBLIC_DIR).filter(f => f.endsWith(".html"));
for (const file of htmlFiles) {
  const p = join(PUBLIC_DIR, file);
  let html = readFileSync(p, "utf-8");

  // Remove any srcset that has pozitif-dental-klinik
  html = html.replace(/srcset=["'][^"']*pozitif-dental-klinik[^"']*["']/gi, "");
  // Remove any srcset that has DSC02
  html = html.replace(/srcset=["'][^"']*DSC02[^"']*["']/gi, "");
  // Remove any srcset that has make-your-smile
  html = html.replace(/srcset=["'][^"']*make-your-smile[^"']*["']/gi, "");

  // Update galeri.html lightbox hrefs to point to scaled / real images
  for (let i = 1; i <= 8; i++) {
    html = html.replace(
      new RegExp(`href=['"][^'"]*pozitif-dental-klinik-${i}[^'"]*['"]`, "gi"),
      `href='/images/pozitif/pozitif-dental-klinik-${i}-scaled.jpg'`
    );
  }

  writeFileSync(p, html, "utf-8");
  console.log(`✓ Cleaned srcsets in ${file}`);
}

console.log("Subpage and gallery assets patched!");

