import { readdirSync, readFileSync } from "fs";
import { join } from "path";

const BASE_DIR = "E:/PROJELER/ghm-dis-klinigi/public/css";
function scan(dir: string) {
  const items = readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    const full = join(dir, item.name);
    if (item.isDirectory()) {
      scan(full);
    } else if (item.name.endsWith(".css")) {
      const content = readFileSync(full, "utf-8");
      const matches = content.match(/url\(['"]?([^'"\)]+)['"]?\)/g) || [];
      for (const m of matches) {
        if (m.includes(".png") || m.includes(".jpg") || m.includes(".jpeg") || m.includes(".svg") || m.includes(".webp")) {
          console.log(`${item.name}: ${m}`);
        }
      }
    }
  }
}

scan(BASE_DIR);

