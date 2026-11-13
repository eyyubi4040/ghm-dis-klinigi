import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const commonEnglishWords = [
  'about', 'contact', 'services', 'appointment', 'smile', 'dental', 'braces', 'aligners',
  'treatment', 'doctor', 'clinic', 'welcome', 'make', 'your', 'brighter', 'with', 'us',
  'what', 'why', 'when', 'how', 'choose', 'read', 'more', 'view', 'explore', 'follow',
  'hours', 'monday', 'friday', 'saturday', 'sunday', 'closed', 'call', 'send', 'message',
  'name', 'email', 'phone', 'submit', 'back', 'next', 'previous', 'close', 'search',
  'all', 'rights', 'reserved', 'copyright', 'privacy', 'policy', 'terms', 'conditions',
  'testimonials', 'patients', 'reviews', 'faq', 'frequently', 'asked', 'questions',
  'experience', 'care', 'healthy', 'beautiful', 'expert', 'team', 'staff', 'location',
  'address', 'map', 'directions', 'get', 'in', 'touch', 'book', 'now', 'online'
];

const htmlFiles = readdirSync('E:/PROJELER/ghm-dis-klinigi/public').filter(f => f.endsWith('.html'));

for (const file of htmlFiles) {
  const content = readFileSync(join('E:/PROJELER/ghm-dis-klinigi/public', file), 'utf-8');
  const lines = content.split('\n');
  const findings: { line: number, text: string }[] = [];
  
  lines.forEach((line, idx) => {
    // Strip HTML tags and entities
    const textOnly = line.replace(/<[^>]+>/g, ' ').replace(/&[a-z0-9#]+;/gi, ' ').trim();
    if (textOnly.length < 3) return;
    
    // Check if line contains noticeable English phrases
    const words = textOnly.toLowerCase().split(/[\s,.:;!?"'()\[\]{}]+/).filter(w => w.length > 2);
    let engCount = 0;
    const matched: string[] = [];
    for (const w of words) {
      if (commonEnglishWords.includes(w)) {
        engCount++;
        matched.push(w);
      }
    }
    // If multiple English words or specific English phrases
    if (engCount >= 2 || /make your|read more|dental care|why choose|our team|open hours|get in touch|book now|view more|all rights|learn more/i.test(textOnly)) {
      // Exclude css properties or pure technical lines
      if (!line.includes('{') && !line.includes('var(') && !line.includes('display:') && !line.includes('color:') && !line.includes('script')) {
        findings.push({ line: idx + 1, text: textOnly });
      }
    }
  });

  if (findings.length > 0) {
    console.log(`\n=================== ${file} (${findings.length} findings) ===================`);
    findings.forEach(f => console.log(`  L${f.line}: ${f.text.substring(0, 120)}`));
  }
}

