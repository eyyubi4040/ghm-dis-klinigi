import { readFileSync } from 'fs';

const html = readFileSync('E:/PROJELER/ghm-dis-klinigi/public/index.html', 'utf-8');
const lines = html.split('\n');

for (let i = 300; i < 665; i++) {
  const line = lines[i];
  if (!line) continue;
  const clean = line.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').trim();
  if (clean.length > 3 && !clean.startsWith('/*')) {
    console.log(`L${i+1}: ${clean}`);
  }
}

