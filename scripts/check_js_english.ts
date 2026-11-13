import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

function scanJs(dir: string) {
  for (const f of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, f.name);
    if (f.isDirectory()) scanJs(full);
    else if (f.name.endsWith('.js') && !f.name.includes('.min.')) {
      const content = readFileSync(full, 'utf-8');
      ['error', 'success', 'please', 'required', 'loading', 'submitting', 'sent', 'invalid'].forEach(term => {
        if (content.toLowerCase().includes(term)) {
          console.log(`[JS text] ${term} in ${full}`);
        }
      });
    }
  }
}
scanJs('E:/PROJELER/ghm-dis-klinigi/public/js');

