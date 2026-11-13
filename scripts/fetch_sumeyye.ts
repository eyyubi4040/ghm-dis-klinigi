import { writeFileSync } from "fs";

async function test() {
  const url = "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=85";
  const res = await fetch(url);
  console.log("Status:", res.status);
  if (res.ok) {
    const buf = Buffer.from(await res.arrayBuffer());
    writeFileSync("public/images/ekip-sumeyye.jpg", buf);
    writeFileSync("public/images/pozitif/DSC02303-768x1152.jpg", buf);
    console.log("Saved ekip-sumeyye.jpg!", buf.byteLength);
  }
}
test();

