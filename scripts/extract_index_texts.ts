import { readFileSync } from 'fs';

const html = readFileSync('E:/PROJELER/ghm-dis-klinigi/public/index.html', 'utf-8');

// Strip tags and get texts
const textBlocks: { line: number, text: string }[] = [];
const lines = html.split('\n');

lines.forEach((line, idx) => {
  // Extract visible Turkish or English text
  const clean = line.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&#8217;/g, "'").trim();
  if (clean.length > 5 && !clean.startsWith('/*') && !clean.startsWith('{') && !clean.startsWith('.') && !clean.startsWith('@') && !clean.startsWith('var ') && !clean.startsWith('const ') && !clean.startsWith('function') && !clean.startsWith('import')) {
    textBlocks.push({ line: idx + 1, text: clean });
  }
});

for (const b of textBlocks) {
  // Let's print interesting lines
  console.log(`L${b.line}: ${b.text}`);
}

