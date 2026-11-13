import { readFileSync } from 'fs';

const html = readFileSync('E:/PROJELER/ghm-dis-klinigi/public/index.html', 'utf-8');
const lines = html.split('\n');
lines.forEach((l, idx) => {
  if (l.includes('<footer') || l.includes('class="pkf') || l.includes('pkf-')) {
    console.log(`${idx + 1}: ${l}`);
  }
});

