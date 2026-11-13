import { readFileSync, writeFileSync } from 'fs';

const path = 'E:/PROJELER/ghm-dis-klinigi/public/index.html';
let html = readFileSync(path, 'utf-8');

// 1. Replace "What Dental Treatments Do We Offer?"
const oldTitle = 'What <strong>Dental Treatments</strong> Do We Offer?';
const newTitle = 'Hangi <strong>Diş Tedavilerini</strong> Sunuyoruz?';
if (html.includes(oldTitle)) {
  html = html.replace(oldTitle, newTitle);
  console.log('Successfully replaced What Dental Treatments Do We Offer');
} else {
  console.log('WARNING: oldTitle not found');
}

// 2. Replace "If you are in need of high-quality, professional and friendly dental care, look no further than our clinic."
const oldFaqDesc = 'If you are in need of high-quality, professional and friendly dental care, look no further than our clinic.';
const newFaqDesc = 'Ağız ve diş sağlığınız için yüksek standartlarda, profesyonel ve samimi bir klinik ortamı sunuyoruz.';
if (html.includes(oldFaqDesc)) {
  html = html.replace(oldFaqDesc, newFaqDesc);
  console.log('Successfully replaced English FAQ description');
} else {
  console.log('WARNING: oldFaqDesc not found');
}

writeFileSync(path, html, 'utf-8');
console.log('index.html updated successfully.');

