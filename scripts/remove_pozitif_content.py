"""Pozitif Dental Klinik'ten kalan tüm içerik/görsel izlerini temizler."""
import glob, io, re, os, shutil

ROOT = "E:/PROJELER/ghm-dis-klinigi"
PUB = f"{ROOT}/public"
BACKUP = "C:/Users/EyCodex/.gemini/antigravity/brain/01d5233a-acab-4d32-95c3-7446438520e3/scratch/backup_before_pozitif_cleanup"

def rd(p):
    with io.open(p, "r", encoding="utf-8", newline="") as f:
        return f.read()

def wr(p, s):
    with io.open(p, "w", encoding="utf-8", newline="") as f:
        f.write(s)

def remove_div_block(html, data_id):
    """data-id ile işaretlenmiş elementor div'ini (iç içe div'leri sayarak) tamamen siler."""
    m = re.search(r'[ \t]*<div class="elementor-element elementor-element-%s\b[^>]*>' % re.escape(data_id), html)
    if not m:
        return html, False
    start = m.start()
    depth, pos = 0, m.start()
    tag = re.compile(r'<div\b|</div>')
    for t in tag.finditer(html, m.start()):
        depth += 1 if t.group() == "<div" else -1
        if depth == 0:
            end = t.end()
            # satır sonunu da al
            nl = re.match(r'[ \t]*\r?\n', html[end:])
            if nl:
                end += nl.end()
            return html[:start] + html[end:], True
    raise RuntimeError("dengesiz div: " + data_id)

NEUTRAL_BIO = ("Dt. Gözde Hilal Morkoyunlu, Kırşehir’deki kliniğinde hastalarına modern ve güvenilir diş hekimliği hizmeti sunmaktadır. "
               "Hasta konforunu ve güvenini her zaman ön planda tutan Dt. Morkoyunlu; koruyucu diş hekimliği, estetik uygulamalar, implant "
               "ve dijital diş hekimliği alanlarındaki güncel yöntemleri takip ederek her hastası için kişiye özel bir tedavi planı oluşturmaktadır.")
CLINIC_ADDR = "Nasuh Dede Mah. Prof. Dr. Mehmet Ali Altın Bulvarı No:14/A, Merkez / Kırşehir"
FOUNDER = '"founder":[{"@type":"Person","name":"Dt. Gözde Hilal Morkoyunlu","@id":"/hekimimiz/#physician","url":"/hekimimiz/"}]'

IMG_MAP = [
    ("/images/klinik/klinik-oda-6-scaled.jpg", "/images/galeri/clinic-unit.jpg"),
    ("/images/klinik/klinik-oda-6.jpg", "/images/galeri/clinic-unit.jpg"),
    ("/images/klinik/klinik-oda-1.jpg", "/images/clinic-interior.jpg"),
    ("/images/klinik/klinik-oda-3.jpg", "/images/galeri/waiting-lounge.jpg"),
]

report = {}
def note(f, k, n=1):
    if n:
        report.setdefault(os.path.basename(f), {}).setdefault(k, 0)
        report[os.path.basename(f)][k] += n

# ---- yedek ----
os.makedirs(BACKUP, exist_ok=True)
for f in glob.glob(f"{PUB}/*.html") + [f"{ROOT}/scripts/generate_all_treatment_pages.ts"]:
    shutil.copy2(f, BACKUP)

files = glob.glob(f"{PUB}/*.html") + [f"{ROOT}/scripts/generate_all_treatment_pages.ts"]
for f in files:
    s = rd(f); o = s

    # 1) Menü: Prof. Dr. Kıvanç YAMANEL (2650) ve mükerrer "Dt. Gözde" (2496, eski Emre Uslu) öğeleri
    for mid in ("2650", "2496"):
        s, n = re.subn(r'<li\b[^>]*\bmenu-item-%s\b[^>]*>.*?</li>[ \t]*\r?\n?' % mid, "", s)
        note(f, f"menü-{mid}", n)

    # 2) JSON-LD founder (gokhan-torun / emre-uslu)
    s, n = re.subn(r'"founder":\[\{[^\]]*?(gokhan-torun|emre-uslu)[^\]]*?\]', FOUNDER, s)
    note(f, "founder", n)

    # 3) Pozitif'in Ankara adresi (harita title/aria-label)
    s, n = re.subn(r'Mustafa Kemal Mah\. Dumlupınar Bulvarı 274/7 B Blok 4\. Kat No:46 Mahall, 06520 Merkez / Kırşehir', CLINIC_ADDR, s)
    note(f, "adres", n)

    # 4) Elementor sayfa başlığındaki "Mahall"
    s, n = re.subn(r'ghm%20Dental%20Klinik%20%7C%20Mahall%20Kırşehir%20Di%C5%9F%20Poliklini%C4%9Fi',
                   'Dt.%20G%C3%B6zde%20Hilal%20Morkoyunlu%20Di%C5%9F%20Klini%C4%9Fi%20%7C%20K%C4%B1r%C5%9Fehir%20Di%C5%9F%20Poliklini%C4%9Fi', s)
    note(f, "mahall-başlık", n)

    # 5) Pozitif kliniğinin gerçek fotoğrafları -> stok klinik görselleri
    for a, b in IMG_MAP:
        n = s.count(a); s = s.replace(a, b); note(f, "foto", n)

    name = os.path.basename(f)

    # 6) Ekip sayfaları: Pozitif hekim/personel blokları
    if name in ("ekibimiz.html", "hekimimiz.html"):
        for did in ("eb03553", "a99e1c8", "6103d16"):   # 2. hekim (G. Torun özgeçmişi), Prof. K. Yamanel, personel (Ayşe/Sümeyye/Dilara)
            s, ok = remove_div_block(s, did); note(f, f"blok-{did}", int(ok))
        # E. Uslu özgeçmişi -> nötr metin
        s, n = re.subn(r'(<div class="elementor-element elementor-element-306ec5c[^>]*>\s*<div class="elementor-widget-container">\s*)(?:<p>.*?</p>)+',
                       lambda m: m.group(1) + f"<p>{NEUTRAL_BIO}</p>", s, flags=re.S)
        note(f, "özgeçmiş", n)
        s, n = re.subn(r'(<meta (?:property="og:description"|name="description"|name="twitter:description") content=")[^"]*Uslu[^"]*(")',
                       lambda m: m.group(1) + NEUTRAL_BIO + m.group(2), s)
        note(f, "meta-desc", n)
        s = s.replace("Diş Hekimi &amp; Kurucu Ortak", "Diş Hekimi &amp; Kurucu Hekim")

    # 7) Ana sayfa ekip kartları: sadece Dt. Gözde Hilal Morkoyunlu kalsın
    if name == "index.html":
        s, n = re.subn(r'<a class="pk-rvs" href="/ekibimiz/"><span class="pkt-img"><img[^>]*doctor-(?:ortodonti|kivanc)\.jpg.*?</a>', "", s, flags=re.S)
        note(f, "ana-sayfa-kart", n)
        s = s.replace('<div class="pkt"><a class="pk-rvs" href="/hekimimiz/">',
                      '<div class="pkt" style="grid-template-columns:minmax(0,420px);justify-content:center"><a class="pk-rvs" href="/hekimimiz/">')

    if s != o:
        wr(f, s)

for k, v in report.items():
    print(k, v)

