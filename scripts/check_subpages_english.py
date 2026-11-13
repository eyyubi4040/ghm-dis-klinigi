import glob, re, os

files = ['hakkimizda.html', 'galeri.html', 'ekibimiz.html', 'hekimimiz.html', 'iletisim.html', 'tedaviler.html', 'anlasmali-kurumlar.html']

for fname in files:
    path = os.path.join('E:/PROJELER/ghm-dis-klinigi/public', fname)
    if not os.path.exists(path):
        continue
    with open(path, 'r', encoding='utf-8') as fp:
        lines = fp.readlines()
    
    found = []
    for idx, line in enumerate(lines):
        if '<script' in line or '<style' in line or '/* ' in line:
            continue
        clean = re.sub(r'<[^>]+>', ' ', line).strip()
        if len(clean) < 3 or clean.startswith('{') or 'var ' in clean:
            continue
        
        # Look for English words: welcome, about, our, clinic, dental, doctor, we, you, with, care, health, etc.
        words = [w.lower() for w in re.findall(r'[a-zA-Z]+', clean)]
        eng_words = [w for w in words if w in [
            'welcome', 'about', 'clinic', 'dental', 'care', 'health', 'smile', 'more',
            'team', 'doctor', 'services', 'appointment', 'treatment', 'view', 'read',
            'quality', 'best', 'years', 'experience', 'patients', 'hours', 'monday',
            'friday', 'closed', 'saturday', 'sunday', 'phone', 'email', 'message',
            'submit', 'send', 'privacy', 'policy', 'terms', 'rights', 'reserved'
        ]]
        if len(eng_words) >= 2:
            found.append((idx + 1, clean, eng_words))
            
    if found:
        print(f"\n=== {fname} ({len(found)} findings) ===")
        for f in found:
            print(f"  L{f[0]}: {f[1][:100]} | Words: {f[2]}")

