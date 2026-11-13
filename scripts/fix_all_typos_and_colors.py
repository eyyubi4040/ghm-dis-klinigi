import glob, re, os

html_files = glob.glob('E:/PROJELER/ghm-dis-klinigi/public/*.html')

print("Starting thorough typo and color fix across all pages...")

for f in html_files:
    fname = os.path.basename(f)
    with open(f, 'r', encoding='utf-8') as fp:
        c = fp.read()
    
    orig = c
    
    # 1. Fix Kırşehir'nın -> Kırşehir'in
    c = re.sub(r'Kırşehir[’\'&#8217;]+nın', "Kırşehir'in", c)
    c = re.sub(r'\bKırşehirde\b', "Kırşehir'de", c)
    c = re.sub(r'\bKırşehire\b', "Kırşehir'e", c)
    
    # 2. Fix Kliniğite / Kliniğimizte -> Kliniği'nde / Kliniğimizde
    c = re.sub(r'Kliniği[’\'&#8217;]*te', "Kliniği'nde", c)
    c = re.sub(r'Kliniğimizte', "Kliniğimizde", c)
    c = re.sub(r'Kliniğinde', "Kliniği'nde", c)
    
    # 3. Fix Instagramda -> Instagram'da
    c = re.sub(r'\bInstagramda\b', "Instagram'da", c)
    
    # 4. Fix >Array< in menu items -> >Uzman Diş Hekimi< or >Diş Hekimi<
    c = re.sub(r'<span class="pkm-sub">\s*Array\s*</span>', '<span class="pkm-sub">Diş Hekimi</span>', c)
    
    # 5. Fix Pozitif leftovers: emre-uslu, gokhan-torun
    c = re.sub(r'href="/emre-uslu/?"', 'href="/hekimimiz/"', c)
    c = re.sub(r'href="/gokhan-torun/?"', 'href="/ekibimiz/"', c)
    c = re.sub(r'Dr\.\s*Dt\.\s*Gökhan Torun', 'Dt. Gözde Hilal Morkoyunlu', c)
    c = re.sub(r'Gökhan TORUN', 'Gözde Hilal MORKOYUNLU', c)
    c = re.sub(r'Emre USLU', 'Gözde Hilal MORKOYUNLU', c)
    c = re.sub(r'Emre Uslu', 'Gözde Hilal Morkoyunlu', c)

    # 6. Specific to index.html: Hero titles & section titles
    if fname == 'index.html':
        # Hero title: Make Your Smile Brighter With Us -> Sağlıklı ve Işıltılı Bir Gülüş Sizi Bekliyor
        c = c.replace(
            '<h1 class="elementor-heading-title elementor-size-default">Make Your Smile<br><strong>Brighter</strong> With Us</h1>',
            '<h1 class="elementor-heading-title elementor-size-default">Sağlıklı ve Işıltılı Bir<br><strong>Gülüş</strong> Sizi Bekliyor</h1>'
        )
        c = c.replace(
            'Make Your Smile<br><strong>Brighter</strong> With Us',
            'Sağlıklı ve Işıltılı Bir<br><strong>Gülüş</strong> Sizi Bekliyor'
        )
        # Treatment section title: What Dental Treatments Do We Offer? -> Hangi Diş Tedavilerini Sunuyoruz?
        c = c.replace('What Dental Treatments Do We Offer?', 'Hangi Diş Tedavilerini Sunuyoruz?')
        c = c.replace('What  Dental Treatments  Do We Offer?', 'Hangi Diş Tedavilerini Sunuyoruz?')
        
        # Instagram section follower CTA
        c = c.replace("Instagram'da Bizi Takip Et!", "Instagram'da Bizi Takip Edin!")
        
        # Footer "Yol tarifi al" color in footer info
        c = re.sub(r'class="pkf-more"', 'class="pkf-more" style="color:#D4AF37 !important; font-weight:600;"', c)

    if c != orig:
        with open(f, 'w', encoding='utf-8') as fp:
            fp.write(c)
        print(f"Patched typos in {fname}")

print("HTML typos cleanup finished.")

