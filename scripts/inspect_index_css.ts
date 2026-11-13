import { readFileSync } from 'fs';

const html = readFileSync('E:/PROJELER/ghm-dis-klinigi/public/index.html', 'utf-8');
const match = html.match(/<style id="ghm-luxury-theme">([\s\S]*?)<\/style>/);
if (match) {
  console.log('=== ghm-luxury-theme ===');
  console.log(match[1]);
}
