import glob, re, os

html_files = glob.glob('E:/PROJELER/ghm-dis-klinigi/public/*.html')

english_indicators = [
    r'\bthe\b', r'\bwith\b', r'\bfrom\b', r'\babout\b', r'\bour\b', r'\byour\b',
    r'\btreatment\b', r'\bcare\b', r'\bhealth\b', r'\bmore\b', r'\blook\b',
    r'\bwhat\b', r'\bwhy\b', r'\bwhen\b', r'\bwhere\b', r'\bwhich\b', r'\bwho\b',
    r'\bhow\b', r'\bbraces\b', r'\baligners\b', r'\bteeth\b', r'\btooth\b',
    r'\bdoctor\b', r'\bwelcome\b', r'\bpatient\b', r'\bpatients\b', r'\bclinic\b',
    r'\bhigh-quality\b', r'\bquality\b', r'\bfriendly\b', r'\bprofessional\b'
]

print("Scanning for all English text snippets...")

for f in html_files:
    fname = os.path.basename(f)
    with open(f, 'r', encoding='utf-8') as fp:
        lines = fp.readlines()
    
    for idx, line in enumerate(lines):
        clean = re.sub(r'<[^>]+>', ' ', line).strip()
        # Skip pure scripts, css, comments
        if clean.startswith('/*') or clean.startswith('//') or '{' in clean or 'var ' in clean or 'const ' in clean:
            continue
        
        # Check against indicators
        matches = [ind for ind in english_indicators if re.search(ind, clean, re.IGNORECASE)]
        if len(matches) >= 2:
            print(f"[{fname}:L{idx+1}] Matches: {matches}")
            print(f"   Text: {clean[:140]}")

