import { readdirSync, readFileSync } from "fs";
import { join } from "path";

const BASE_DIR = "E:/PROJELER/ghm-dis-klinigi";
const htmlFiles = readdirSync(join(BASE_DIR, "public")).filter(f => f.endsWith(".html"));

const usedImagePaths = new Set<string>();
const allRefs: { file: string; ref: string }[] = [];

for (const file of htmlFiles) {
  const content = readFileSync(join(BASE_DIR, "public", file), "utf-8");
  // Match any image path in src, href, url(), content, etc.
  const regex = /(?:src|href|background-image:\s*url\()[\s"']*(?:https?:\/\/[^\/]+)?(\/?(?:images|assets)[^"'\)\s,]+)/gi;
  let match;
  while ((match = regex.exec(content)) !== null) {
    let clean = match[1].replace(/^[.\/]+/, "").split("?")[0].split("#")[0];
    clean = "public/" + clean.replace(/^public\//, "");
    usedImagePaths.add(clean);
    allRefs.push({ file, ref: clean });
  }

  // Also check srcset
  const srcsetRegex = /srcset=["']([^"']+)["']/gi;
  while ((match = srcsetRegex.exec(content)) !== null) {
    const parts = match[1].split(",");
    for (const part of parts) {
      const p = part.trim().split(" ")[0];
      if (p.includes("images/") || p.includes("assets/")) {
        let clean = p.replace(/^https?:\/\/[^\/]+/, "").replace(/^[.\/]+/, "").split("?")[0];
        clean = "public/" + clean.replace(/^public\//, "");
        usedImagePaths.add(clean);
        allRefs.push({ file, ref: clean });
      }
    }
  }
}

console.log("Total unique referenced images in HTML:", usedImagePaths.size);
for (const p of Array.from(usedImagePaths).sort()) {
  console.log(" - " + p);
}

