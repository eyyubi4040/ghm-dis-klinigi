import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const htmlFiles = readdirSync('E:/PROJELER/ghm-dis-klinigi/public').filter(f => f.endsWith('.html'));

for (const file of htmlFiles) {
  const content = readFileSync(join('E:/PROJELER/ghm-dis-klinigi/public', file), 'utf-8');
  // Check any hex color starting with #0 or #1 or #2 or rgb
  const hexes = content.match(/#[0-9a-fA-F]{3,6}/g) || [];
  const blues: string[] = [];
  for (const h of hexes) {
    if (h.length === 7) {
      const r = parseInt(h.substring(1, 3), 16);
      const g = parseInt(h.substring(3, 5), 16);
      const b = parseInt(h.substring(5, 7), 16);
      // Check if blue dominant
      if (b > 120 && b > r * 1.3 && b > g * 1.1) {
        blues.push(h);
      }
    }
  }
  if (blues.length > 0) {
    console.log(`Blue hexes in ${file}:`, Array.from(new Set(blues)));
  }
}

