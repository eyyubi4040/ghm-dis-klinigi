import glob, re

footer_logo_replacement = '<a class="pkf-logo" href="/" aria-label="Dt. Gözde Hilal Morkoyunlu Diş Kliniği ana sayfa"><img class="pkl pkl--white" src="/images/logo-beyaz.png" alt="Dt. Gözde Hilal Morkoyunlu Diş Kliniği" width="1956" height="649" decoding="async" loading="lazy" style="height:52px; width:auto; max-width:240px; object-fit:contain; display:block !important;"></a>'

# 1. Update HTML files
html_files = glob.glob('E:/PROJELER/ghm-dis-klinigi/public/*.html')
for f in html_files:
    with open(f, 'r', encoding='utf-8') as fp:
        content = fp.read()
    
    # Match <a class="pkf-logo"[^>]*>[\s\S]*?<\/a>
    pattern = re.compile(r'<a class="pkf-logo"[^>]*>[\s\S]*?<\/a>')
    if pattern.search(content):
        new_content = pattern.sub(footer_logo_replacement, content)
        with open(f, 'w', encoding='utf-8') as fp:
            fp.write(new_content)
        print(f"Updated footer logo in {f}")
    else:
        print(f"No pkf-logo in {f}")

# 2. Update generate_all_treatment_pages.ts
gen_path = 'E:/PROJELER/ghm-dis-klinigi/scripts/generate_all_treatment_pages.ts'
with open(gen_path, 'r', encoding='utf-8') as fp:
    gen_content = fp.read()

pattern = re.compile(r'<a class="pkf-logo"[^>]*>[\s\S]*?<\/a>')
if pattern.search(gen_content):
    gen_content = pattern.sub(footer_logo_replacement, gen_content)
    with open(gen_path, 'w', encoding='utf-8') as fp:
        fp.write(gen_content)
    print("Updated generate_all_treatment_pages.ts footer logo")

# 3. Update generate_tedaviler_index.ts
ted_path = 'E:/PROJELER/ghm-dis-klinigi/scripts/generate_tedaviler_index.ts'
with open(ted_path, 'r', encoding='utf-8') as fp:
    ted_content = fp.read()

if pattern.search(ted_content):
    ted_content = pattern.sub(footer_logo_replacement, ted_content)
    with open(ted_path, 'w', encoding='utf-8') as fp:
        fp.write(ted_content)
    print("Updated generate_tedaviler_index.ts footer logo")

