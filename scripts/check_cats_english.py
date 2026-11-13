import glob, re, os

cat_files = [
    'genel-dis-tedavileri.html',
    'ortodontik-tedaviler.html',
    'implant-tedavisi.html',
    'cocuk-dis-hekimligi.html',
    'koruyucu-dis-tedavileri.html',
    'kozmetik-dis-hekimligi.html',
    'eksik-dis-tedavileri.html',
    'dis-eti-periodontal-hastaliklar-ve-tedavileri.html',
    'ozel-dis-tedavileri.html'
]

for fname in cat_files:
    path = os.path.join('E:/PROJELER/ghm-dis-klinigi/public', fname)
    with open(path, 'r', encoding='utf-8') as fp:
        lines = fp.readlines()
    
    found = []
    for idx, line in enumerate(lines):
        if '<script' in line or '<style' in line or '/* ' in line:
            continue
        clean = re.sub(r'<[^>]+>', ' ', line).strip()
        if len(clean) < 3 or clean.startswith('{') or 'var ' in clean:
            continue
        
        words = [w.lower() for w in re.findall(r'[a-zA-Z]+', clean)]
        eng_words = [w for w in words if w in [
            'welcome', 'about', 'clinic', 'dental', 'care', 'health', 'smile', 'more',
            'team', 'doctor', 'services', 'appointment', 'treatment', 'view', 'read',
            'quality', 'best', 'years', 'experience', 'patients', 'hours', 'monday',
            'friday', 'closed', 'saturday', 'sunday', 'phone', 'email', 'message',
            'submit', 'send', 'privacy', 'policy', 'terms', 'rights', 'reserved', 'the', 'with', 'for'
        ]]
        if len(eng_words) >= 3:
            found.append((idx + 1, clean, eng_words))
            
    if found:
        print(f"\n=== {fname} ({len(found)} findings) ===")
        for f in found:
            print(f"  L{f[0]}: {f[1][:100]} | Words: {f[2]}")

print("Category files scan complete.")

