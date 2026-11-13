import { readFileSync, readdirSync } from 'fs';

const cssFiles = [
  'public/css/theme/post-6.css',
  'public/css/theme/post-14.css',
  'public/css/theme/core-theme.css',
  'public/css/theme/layout.css',
  'public/css/theme/site.css',
  'public/css/theme/pages.css',
  'public/css/theme/randevu-modal.css',
  'public/css/style.css'
];

for (const f of cssFiles) {
  const content = readFileSync('E:/PROJELER/ghm-dis-klinigi/' + f, 'utf-8');
  const lines = content.split('\n');
  lines.forEach((l, i) => {
    if (l.includes('blue') || l.includes('#007') || l.includes('a {') || l.includes('a{') || l.includes('accordion') || l.includes('--swiper')) {
      console.log(`${f}:${i+1} -> ${l.substring(0, 120)}`);
    }
  });
}

