import glob, re, os

html_files = glob.glob('E:/PROJELER/ghm-dis-klinigi/public/*.html')

typos_found = []

for f in html_files:
    fname = os.path.basename(f)
    with open(f, 'r', encoding='utf-8') as fp:
        c = fp.read()
    
    # 1. Kırşehir typos
    for m in re.finditer(r'Kırşehir[’\'&#8217;]+nın', c):
        typos_found.append((fname, m.group(0), 'Kırşehir\'in'))
    for m in re.finditer(r'\bKırşehirde\b', c):
        typos_found.append((fname, m.group(0), 'Kırşehir\'de'))
    for m in re.finditer(r'\bKırşehire\b', c):
        typos_found.append((fname, m.group(0), 'Kırşehir\'e'))
    
    # 2. Kliniğite / Kliniğimizte
    for m in re.finditer(r'Kliniği[’\'&#8217;]*te', c):
        typos_found.append((fname, m.group(0), 'Kliniği\'nde'))
    for m in re.finditer(r'Kliniğimizte', c):
        typos_found.append((fname, m.group(0), 'Kliniğimizde'))
        
    # 3. Instagramda
    for m in re.finditer(r'\bInstagramda\b', c):
        typos_found.append((fname, m.group(0), 'Instagram\'da'))

    # 4. "Array" in menu text
    for m in re.finditer(r'>\s*Array\s*<', c):
        typos_found.append((fname, '>Array<', '>Uzman Diş Hekimi<'))

    # 5. English hero or section titles
    for m in re.finditer(r'Make Your Smile|Brighter With Us|What Dental Treatments Do We Offer|Why choose braces', c):
        typos_found.append((fname, m.group(0), 'Türkçe Başlık'))

    # 6. Pozitif leftovers
    for m in re.finditer(r'Emre Uslu|emre-uslu|Gökhan Torun|gokhan-torun', c, re.IGNORECASE):
        typos_found.append((fname, m.group(0), 'Gözde Hilal Morkoyunlu'))

for item in set(typos_found):
    print(f"File: {item[0]} | Found: {item[1]} -> Suggestion: {item[2]}")

