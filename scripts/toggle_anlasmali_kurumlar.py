"""Anlaşmalı Kurumlar sayfasını gizler / tekrar aktif eder.

Kullanım:
    python scripts/toggle_anlasmali_kurumlar.py gizle
    python scripts/toggle_anlasmali_kurumlar.py goster

gizle : menü linklerini HTML yorumuna alır, sayfa dosyasını public/ dışına
        (hidden-pages/) taşır -> /anlasmali-kurumlar/ adresi 404 döner.
goster: her şeyi eski haline getirir.
"""
import glob, io, os, re, shutil, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUB = os.path.join(ROOT, "public")
HIDDEN = os.path.join(ROOT, "hidden-pages")
PAGE = "anlasmali-kurumlar.html"
GEN = os.path.join(ROOT, "scripts", "generate_all_treatment_pages.ts")
TAG = "gizli:anlasmali-kurumlar"

LI_RX = re.compile(r'<li\b[^>]*>(?:(?!</li>|<li\b).)*?href="/anlasmali-kurumlar/"(?:(?!</li>).)*?</li>')
HIDDEN_RX = re.compile(r'<!--' + re.escape(TAG) + r' (.*?) -->')

def rd(p):
    with io.open(p, "r", encoding="utf-8", newline="") as f:
        return f.read()

def wr(p, s):
    with io.open(p, "w", encoding="utf-8", newline="") as f:
        f.write(s)

def targets():
    return [f for f in glob.glob(os.path.join(PUB, "*.html")) if os.path.basename(f) != PAGE] + [GEN]

def hide():
    total = 0
    for f in targets():
        s = rd(f)
        # zaten yorumdakilere dokunma
        parts = re.split(r'(<!--' + re.escape(TAG) + r' .*? -->)', s)
        n = 0
        for i in range(0, len(parts), 2):
            parts[i], k = LI_RX.subn(lambda m: f'<!--{TAG} {m.group(0)} -->', parts[i])
            n += k
        if n:
            wr(f, "".join(parts)); total += n
            print(f"  {os.path.basename(f)}: {n} link gizlendi")
    src = os.path.join(PUB, PAGE)
    if os.path.exists(src):
        os.makedirs(HIDDEN, exist_ok=True)
        shutil.move(src, os.path.join(HIDDEN, PAGE))
        print(f"  {PAGE} -> hidden-pages/")
    g = rd(GEN).replace("const ANLASMALI_KURUMLAR_AKTIF = true;", "const ANLASMALI_KURUMLAR_AKTIF = false;")
    wr(GEN, g)
    print(f"Toplam {total} link gizlendi.")

def show():
    total = 0
    for f in targets():
        s = rd(f)
        s2, n = HIDDEN_RX.subn(r"\1", s)
        if n:
            wr(f, s2); total += n
            print(f"  {os.path.basename(f)}: {n} link geri açıldı")
    src = os.path.join(HIDDEN, PAGE)
    if os.path.exists(src):
        shutil.move(src, os.path.join(PUB, PAGE))
        print(f"  hidden-pages/{PAGE} -> public/")
    g = rd(GEN).replace("const ANLASMALI_KURUMLAR_AKTIF = false;", "const ANLASMALI_KURUMLAR_AKTIF = true;")
    wr(GEN, g)
    print(f"Toplam {total} link geri açıldı.")

if __name__ == "__main__":
    cmd = (sys.argv[1] if len(sys.argv) > 1 else "").lower()
    if cmd in ("gizle", "hide"):
        hide()
    elif cmd in ("goster", "göster", "show"):
        show()
    else:
        print(__doc__)

