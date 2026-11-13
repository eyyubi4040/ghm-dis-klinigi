import glob, re, os

html_files = glob.glob('E:/PROJELER/ghm-dis-klinigi/public/*.html')

english_phrases = [
    r'What\s*<strong>Dental Treatments</strong>\s*Do We Offer\?',
    r'Dental Treatments',
    r'Do We Offer',
    r'high-quality',
    r'look no further',
    r'dental care',
    r'Why choose',
    r'When can I',
    r'Can I get',
    r'Read More',
    r'View More',
    r'Learn More',
    r'Get in Touch',
    r'Book Appointment',
    r'Opening Hours',
    r'All Rights Reserved',
    r'Patient Reviews',
    r'Our Services',
    r'Our Team',
    r'About Us',
    r'Contact Us',
    r'Home',
    r'Sunday',
    r'Monday',
    r'Friday',
    r'Saturday',
    r'Closed',
    r'Submit',
    r'Send Message'
]

print("Scanning for all English phrases...")

for f in html_files:
    fname = os.path.basename(f)
    with open(f, 'r', encoding='utf-8') as fp:
        lines = fp.readlines()
    
    for idx, line in enumerate(lines):
        # Ignore script tags and CSS blocks
        if '<script' in line or '<style' in line or '/* ' in line:
            continue
        clean = re.sub(r'<[^>]+>', ' ', line).strip()
        if clean.startswith('{') or 'var ' in clean or 'const ' in clean:
            continue
            
        for p in english_phrases:
            if re.search(p, line, re.IGNORECASE):
                # Make sure it's not a false positive
                print(f"[{fname}:L{idx+1}] Pattern '{p}' matched:")
                print(f"   Line snippet: {line.strip()[:140]}")

