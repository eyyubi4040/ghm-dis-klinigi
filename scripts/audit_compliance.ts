import { readFileSync, readdirSync, existsSync } from "fs";
import { join } from "path";

const PUBLIC_DIR = "E:\\PROJELER\\ghm-dis-klinigi\\public";
const files = readdirSync(PUBLIC_DIR).filter((f) => f.endsWith(".html"));

let pozitifCount = 0;
let ankaraCount = 0;

for (const file of files) {
  const content = readFileSync(join(PUBLIC_DIR, file), "utf-8");
  const pozMatches = content.match(/pozitif/gi) || [];
  if (pozMatches.length > 0) {
    console.log(`❌ Found ${pozMatches.length} 'pozitif' in ${file}`);
    pozitifCount += pozMatches.length;
  }
  const ankaraMatches = content.match(/ankara|çankaya/gi) || [];
  if (ankaraMatches.length > 0) {
    console.log(`❌ Found ${ankaraMatches.length} 'ankara/çankaya' in ${file}`);
    ankaraCount += ankaraMatches.length;
  }
}

console.log("\n--- AUDIT RESULTS ---");
console.log(`Total HTML files scanned: ${files.length}`);
console.log(`Pozitif occurrences: ${pozitifCount}`);
console.log(`Ankara/Çankaya occurrences: ${ankaraCount}`);

