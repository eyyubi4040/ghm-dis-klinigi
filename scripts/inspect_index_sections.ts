import { readFileSync } from "fs";

const content = readFileSync("E:/PROJELER/ghm-dis-klinigi/public/index.html", "utf-8");
const lines = content.split("\n");

console.log("Total lines:", lines.length);
for (let i = 0; i < lines.length; i++) {
  if (
    lines[i].includes("genel-dis") ||
    lines[i].includes("treatment-") ||
    lines[i].includes("make-your-smile") ||
    lines[i].includes("doctor-gozde") ||
    lines[i].includes("DSC0") ||
    lines[i].includes("gokhan-torun") ||
    lines[i].includes("pozitif-dental-klinik")
  ) {
    console.log(`L${i+1}: ${lines[i].trim().slice(0, 130)}`);
  }
}

