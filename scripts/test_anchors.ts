import { readFileSync, existsSync } from "fs";
import { join } from "path";

const indexHtml = readFileSync("E:/PROJELER/ghm-dis-klinigi/public/index.html", "utf-8");
const anchorRegex = /href="(\/[a-z0-9-]+)(#[a-z0-9-]+)"/g;
let match;
let count = 0;
let errors = 0;

while ((match = anchorRegex.exec(indexHtml)) !== null) {
  count++;
  const route = match[1].slice(1);
  const hash = match[2].slice(1);
  const file = join("E:/PROJELER/ghm-dis-klinigi/public", route + ".html");
  if (!existsSync(file)) {
    console.log("❌ File not found for route:", route);
    errors++;
  } else {
    const content = readFileSync(file, "utf-8");
    if (!content.includes('id="' + hash + '"')) {
      console.log('❌ Hash id="' + hash + '" not found in ' + route + '.html');
      errors++;
    } else {
      console.log('✅ Found id="' + hash + '" in ' + route + '.html');
    }
  }
}
console.log(`\n🎯 Total anchors checked: ${count} | Total errors: ${errors}`);

