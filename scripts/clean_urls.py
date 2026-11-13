"""Linklerden '#' ve '.html' kullanımını kaldırır (idempotent).

- /sayfa#bolum-N        -> /sayfa/<bolum-basligi-slug>   (sunucu sayfayı verir, JS bölüme kaydırır)
- href="#randevu"       -> href="/randevu"               (JS randevu penceresini açar)
- href="#" (alt menü)   -> href kaldırılır, role=button + tabindex
- href="#content"       -> href kaldırılır (JS ile içeriğe atlar)
"""
import glob, html as htmllib, io, os, re, shutil, json

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUB = os.path.join(ROOT, "public")

TR = str.maketrans({"ç": "c", "ğ": "g", "ı": "i", "İ": "i", "ö": "o", "ş": "s", "ü": "u",
                    "Ç": "c", "Ğ": "g", "Ö": "o", "Ş": "s", "Ü": "u", "â": "a", "î": "i", "û": "u", "Â": "a", "Î": "i", "Û": "u"})

def slugify(title):
    t = htmllib.unescape(title)
    t = re.sub(r"\s*\([^)]*\)", "", t)
    t = re.sub(r"[’'`]", "", t)
    t = t.replace("&", " ve ")
    t = t.translate(TR).lower()
    t = re.sub(r"[^a-z0-9]+", "-", t).strip("-")
    return t

def rd(p):
    with io.open(p, "r", encoding="utf-8", newline="") as f:
        return f.read()

def wr(p, s):
    with io.open(p, "w", encoding="utf-8", newline="") as f:
        f.write(s)

SEC_RX = re.compile(r'(<section class="pk-treatment-card[^"]*" id="(bolum-\d+)")((?: data-slug="[^"]*")?)(>)([\s\S]*?<h2 class="pk-treatment-title">)([\s\S]*?)(</h2>)')

# ---- 1) bölüm haritası + data-slug ----
maps = {}
for f in glob.glob(os.path.join(PUB, "*.html")):
    s = rd(f)
    if 'class="pk-treatment-card' not in s:
        continue
    page = os.path.basename(f)[:-5]
    used, m = set(), {}
    def add_slug(mo):
        bid, title = mo.group(2), mo.group(6)
        sl = slugify(title); base, k = sl, 2
        while sl in used:
            sl = f"{base}-{k}"; k += 1
        used.add(sl); m[bid] = sl
        return mo.group(1) + f' data-slug="{sl}"' + mo.group(4) + mo.group(5) + mo.group(6) + mo.group(7)
    s2 = SEC_RX.sub(add_slug, s)
    maps[page] = m
    if s2 != s:
        wr(f, s2)

# ---- 2) link dönüşümleri ----
files = (glob.glob(os.path.join(PUB, "*.html")) + glob.glob(os.path.join(ROOT, "hidden-pages", "*.html")) +
         [os.path.join(ROOT, "scripts", "generate_all_treatment_pages.ts"),
          os.path.join(ROOT, "scripts", "generate_tedaviler_index.ts"),
          os.path.join(PUB, "js", "main.js")])

def sec_link(mo):
    page, n = mo.group(1), mo.group(2)
    sl = maps.get(page, {}).get(f"bolum-{n}")
    return f'href="/{page}/{sl}"' if sl else mo.group(0)

stats = {}
for f in files:
    if not os.path.exists(f):
        continue
    s = rd(f); o = s; st = {}
    s, st["bolum"] = re.subn(r'href="/([\w-]+)/?#bolum-(\d+)"', sec_link, s)
    s, st["randevu"] = re.subn(r'href="#randevu"', 'href="/randevu"', s)
    s, st["altmenu"] = re.subn(r'<a href="#" role="button" data-pk-sub', '<a role="button" tabindex="0" data-pk-sub', s)
    s, st["randevu-btn"] = re.subn(r'(<a class="elementor-button[^"]*") href="#"(>\s*<span class="elementor-button-content-wrapper">\s*<span class="elementor-button-text">Randevu)',
                                   r'\1 href="/randevu"\2', s)
    s, st["skip"] = re.subn(r'<a class="skip-link screen-reader-text" href="#content">', '<a class="skip-link screen-reader-text" role="link" tabindex="0" data-pk-skip>', s)
    s, st["bos"] = re.subn(r'<a href="#">', '<a>', s)
    if s != o:
        wr(f, s)
        stats[os.path.basename(f)] = {k: v for k, v in st.items() if v}

for k, v in stats.items():
    print(k, v)
print("\nBÖLÜM HARİTASI:")
print(json.dumps(maps, ensure_ascii=False, indent=1))

