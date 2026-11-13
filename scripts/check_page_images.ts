import { readFileSync } from "fs";
import { join } from "path";

const BASE_DIR = "E:/PROJELER/ghm-dis-klinigi";
const files = ["index.html", "hakkimizda.html", "hekimimiz.html", "ekibimiz.html", "galeri.html", "tedaviler.html", "randevu.html", "iletisim.html"];

for (const file of files) {
  const content = readFileSync(join(BASE_DIR, "public", file), "utf-8");
  console.log(`\n=================== ${file} ===================`);
  
  // Find all img tags
  const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
  let m;
  const imgs: string[] = [];
  while ((m = imgRegex.exec(content)) !== null) {
    imgs.push(m[1]);
  }
  console.log(`IMG tags (${imgs.length}):`, [...new Set(imgs)]);

  // Find all background images or elementor background
  const bgRegex = /url\(["']?([^"')]+)["']?\)/gi;
  const bgs: string[] = [];
  while ((m = bgRegex.exec(content)) !== null) {
    if (m[1].match(/\.(png|jpg|jpeg|webp|svg)/i)) {
      bgs.push(m[1]);
    }
  }
  if (bgs.length > 0) {
    console.log(`Background URLs (${bgs.length}):`, [...new Set(bgs)]);
  }
}

