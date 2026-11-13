import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const htmlFiles = readdirSync('E:/PROJELER/ghm-dis-klinigi/public').filter(f => f.endsWith('.html'));

for (const file of htmlFiles) {
  const content = readFileSync(join('E:/PROJELER/ghm-dis-klinigi/public', file), 'utf-8');
  const hasStyle = content.includes('id="ghm-luxury-theme"');
  console.log(`${file}: has ghm-luxury-theme? ${hasStyle}`);
}

