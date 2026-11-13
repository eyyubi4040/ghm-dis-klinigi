import { readFileSync, readdirSync } from "fs";
import { join } from "path";

const PUBLIC_DIR = "E:\\PROJELER\\ghm-dis-klinigi\\public";
const htmlFiles = readdirSync(PUBLIC_DIR).filter((f) => f.endsWith(".html"));

const assetSet = new Set<string>();

for (const file of htmlFiles) {
  const content = readFileSync(join(PUBLIC_DIR, file), "utf-8");
  // Find src="..." and href="/css/..." or href="/images/..."
  const srcMatches = content.matchAll(/src=["'](\/[^"']+)["']/g);
  for (const m of srcMatches) {
    if (!m[1].startsWith("//") && !m[1].startsWith("/wp-json")) {
      assetSet.add(m[1].split("?")[0]);
    }
  }
  const hrefMatches = content.matchAll(/href=["'](\/(?:css|images|js)\/[^"']+)["']/g);
  for (const m of hrefMatches) {
    assetSet.add(m[1].split("?")[0]);
  }
}

console.log(`Checking ${assetSet.size} unique static assets over HTTP http://localhost:3000...`);

let okCount = 0;
let failCount = 0;

for (const asset of assetSet) {
  try {
    const res = await fetch(`http://localhost:3000${asset}`);
    if (res.status === 200) {
      okCount++;
    } else {
      console.log(`❌ ${res.status}: ${asset}`);
      failCount++;
    }
  } catch (err: any) {
    console.log(`💥 ERR: ${asset} -> ${err.message}`);
    failCount++;
  }
}

console.log(`\nResults: ${okCount} OK, ${failCount} Failed.`);
