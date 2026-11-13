import { readFileSync, readdirSync } from "fs";
import { join } from "path";

const files = readdirSync("E:/PROJELER/ghm-dis-klinigi/public").filter((f) => f.endsWith(".html"));
let count = 0;
for (const f of files) {
  const content = readFileSync(join("E:/PROJELER/ghm-dis-klinigi/public", f), "utf-8");
  if (content.includes("${") || content.includes("cat.")) {
    console.log("❌ Found literal template in:", f);
    count++;
  }
}
if (count === 0) {
  console.log("✅ All HTML files are 100% clean of unrendered template variables!");
}

