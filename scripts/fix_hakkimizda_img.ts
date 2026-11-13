import { copyFileSync, readFileSync, writeFileSync } from "fs";

copyFileSync("public/images/pozitif/pozitif-dental-klinik-1-scaled.jpg", "public/images/pozitif/pozitif-dental-klinik-1-1536x1025.jpg");
let h = readFileSync("public/hakkimizda.html", "utf-8");
h = h.replace(/pozitif-dental-klinik-1-1536x1025\.jpg/g, "pozitif-dental-klinik-1-scaled.jpg");
writeFileSync("public/hakkimizda.html", h);
console.log("Fixed hakkimizda.html!");

