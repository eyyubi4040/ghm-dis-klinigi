import { readdirSync, readFileSync } from "fs";
import { join, relative } from "path";

const BASE_DIR = "E:/PROJELER/ghm-dis-klinigi";
const targets = ["public", "server"];
let found = 0;

for (const t of targets) {
  function scan(dir: string) {
    for (const item of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, item.name);
      if (item.isDirectory()) {
        scan(full);
      } else {
        try {
          const content = readFileSync(full, "utf-8");
          if (/pozitif/i.test(content)) {
            console.log(`⚠️ Bulundu: ${relative(BASE_DIR, full)}`);
            found++;
          }
        } catch {}
      }
    }
  }
  scan(join(BASE_DIR, t));
}

if (found === 0) {
  console.log("🎉 HARİKA! public ve server dizinlerinde 'pozitif' ifadesi SIFIR (0)! Tamamen temiz.");
} else {
  console.log(`Toplam ${found} dosyada hala pozitif var.`);
}

