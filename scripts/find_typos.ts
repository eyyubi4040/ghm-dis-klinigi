import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

function scan(dir: string) {
  for (const f of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, f.name);
    if (f.isDirectory() && f.name !== 'node_modules' && f.name !== '.git') scan(full);
    else if (f.name.endsWith('.html') || f.name.endsWith('.ts')) {
      const content = readFileSync(full, 'utf-8');
      
      // Typos
      const typoChecks = [
        'Kırşehir’nın', 'Kırşehir\'nın', 'Kırşehir&#8217;nın', 'Kırşehirde', 'Kırşehire', 'Kırşehirin',
        'diş hekimliği’nin', 'hekimliği’nın', 'hastahane', 'herşey', 'bir çok', 'bir kaç',
        'sağlığı’nın', 'sağlığı’na', 'kliniği’miz', 'kliniği’mizde',
        'Make Your Smile', 'Brighter With Us'
      ];
      
      for (const t of typoChecks) {
        if (content.includes(t)) {
          console.log(`[Typo] ${t} in ${full}`);
        }
      }
    }
  }
}
scan('public');
scan('scripts');

