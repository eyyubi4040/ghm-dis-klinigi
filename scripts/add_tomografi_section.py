import io, math

INDEX = "E:/PROJELER/ghm-dis-klinigi/public/index.html"

# ---- SVG dental arch (top view) ----
cx, cy, rx, ry = 260, 70, 165, 200
n = 14
teeth = []
for i in range(n):
    t = i / (n - 1)
    ang = math.radians(12 + t * 156)          # 12°..168° -> lower U
    x = cx + rx * math.cos(ang)
    y = cy + ry * math.sin(ang)
    # tooth size: molars at ends, incisors in front
    d = abs(t - 0.5) * 2                      # 0 front, 1 back
    w = 21 + d * 19
    h = 27 + d * 11
    rot = math.degrees(ang) - 90
    teeth.append((x, y, w, h, rot, i))

def tooth_svg(x, y, w, h, rot, i):
    cls = "pk-tomo-tooth"
    if i in (3, 10):
        cls += " is-hit"
    return (f'<rect class="{cls}" x="{x - w/2:.1f}" y="{y - h/2:.1f}" width="{w:.1f}" height="{h:.1f}" '
            f'rx="{min(w, h)/2.4:.1f}" transform="rotate({rot:.1f} {x:.1f} {y:.1f})"/>')

teeth_svg = "".join(tooth_svg(*tt) for tt in teeth)

# AI detection boxes around two teeth
boxes = ""
for (x, y, w, h, rot, i) in teeth:
    if i in (3, 10):
        s = max(w, h) + 18
        label = "AI Tespit" if i == 3 else "Kanal"
        boxes += (f'<g class="pk-tomo-box"><rect x="{x - s/2:.1f}" y="{y - s/2:.1f}" width="{s:.1f}" height="{s:.1f}" rx="6"/>'
                  f'<text x="{x - s/2:.1f}" y="{y - s/2 - 6:.1f}">{label}</text></g>')

# nerve canal curves (mandibular canal hint)
canal = (f'<path class="pk-tomo-canal" d="M{cx - rx - 10:.0f} {cy + 10:.0f} Q {cx - rx + 20:.0f} {cy + ry + 30:.0f} {cx:.0f} {cy + ry + 34:.0f} '
         f'Q {cx + rx - 20:.0f} {cy + ry + 30:.0f} {cx + rx + 10:.0f} {cy + 10:.0f}"/>')
bone = (f'<path class="pk-tomo-bone" d="M{cx - rx - 38:.0f} {cy - 20:.0f} Q {cx - rx - 30:.0f} {cy + ry + 70:.0f} {cx:.0f} {cy + ry + 66:.0f} '
        f'Q {cx + rx + 30:.0f} {cy + ry + 70:.0f} {cx + rx + 38:.0f} {cy - 20:.0f}"/>')

svg = f'''<svg class="pk-tomo-svg" viewBox="0 0 520 400" role="img" aria-label="Yapay zeka destekli 3D tomografi diş arkı analizi">
<defs><linearGradient id="pkTomoScan" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#D4AF37" stop-opacity="0"/><stop offset=".5" stop-color="#D4AF37" stop-opacity=".55"/><stop offset="1" stop-color="#D4AF37" stop-opacity="0"/></linearGradient>
<pattern id="pkTomoGrid" width="26" height="26" patternUnits="userSpaceOnUse"><path d="M26 0H0V26" fill="none" stroke="rgba(255,255,255,.06)" stroke-width="1"/></pattern></defs>
<rect width="520" height="400" fill="url(#pkTomoGrid)"/>
<g class="pk-tomo-cross"><line x1="260" y1="16" x2="260" y2="384"/><line x1="16" y1="200" x2="504" y2="200"/></g>
{bone}{canal}
<g class="pk-tomo-teeth">{teeth_svg}</g>
{boxes}
<rect class="pk-tomo-scan" x="0" y="-60" width="520" height="60" fill="url(#pkTomoScan)"/>
</svg>'''

ICON = {
 "cube": '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2 3 7v10l9 5 9-5V7l-9-5Zm0 2.3L18.7 8 12 11.7 5.3 8 12 4.3ZM5 9.7l6 3.3v6.6l-6-3.3V9.7Zm8 9.9V13l6-3.3v6.6l-6 3.3Z" fill="currentColor"/></svg>',
 "ai": '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 3h6v2h2a2 2 0 0 1 2 2v2h2v6h-2v2a2 2 0 0 1-2 2h-2v2H9v-2H7a2 2 0 0 1-2-2v-2H3V9h2V7a2 2 0 0 1 2-2h2V3Zm-2 4v10h10V7H7Zm2 2h6v6H9V9Z" fill="currentColor"/></svg>',
 "shield": '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5l-8-3Zm-1.2 13.6-3.3-3.3 1.4-1.4 1.9 1.9 4.6-4.6 1.4 1.4-6 6Z" fill="currentColor"/></svg>',
 "target": '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8Zm0-14a6 6 0 1 0 6 6 6 6 0 0 0-6-6Zm0 10a4 4 0 1 1 4-4 4 4 0 0 1-4 4Zm0-6a2 2 0 1 0 2 2 2 2 0 0 0-2-2Z" fill="currentColor"/></svg>',
}

features = [
 ("cube", "Üç Boyutlu Net Görüntü", "Dişler, kökler, çene kemiği ve sinir kanalları tek çekimde milimetrik detayla görüntülenir."),
 ("ai", "Yapay Zeka ile Analiz", "Yapay zeka destekli yazılım; çürük, kist, kemik kaybı ve kanal anatomisini hekimimize işaretleyerek teşhisi destekler."),
 ("target", "Hassas Tedavi Planlaması", "İmplant yerleşimi, gömülü diş çekimi, kanal ve ortodonti tedavileri dijital ortamda önceden planlanır."),
 ("shield", "Hızlı ve Konforlu Çekim", "Birkaç saniyelik çekim, düşük radyasyon dozu ve sonuçların aynı seansta değerlendirilmesi."),
]
feat_html = "".join(
    f'<li class="pk-tomo-f"><span class="pk-tomo-ic">{ICON[ic]}</span><span><strong>{t}</strong><span>{d}</span></span></li>'
    for ic, t, d in features)

section = f'''		<section class="pk-tomo" id="tomografi" aria-labelledby="pk-tomo-title">
<style>
.pk-tomo{{padding:24px 16px 8px;font-family:var(--pk-font,"Poppins",sans-serif)}}
.pk-tomo-in{{max-width:1240px;margin:0 auto;display:grid;grid-template-columns:minmax(0,1.05fr) minmax(0,1fr);gap:48px;align-items:center;background:radial-gradient(120% 140% at 100% 0%,#3a352a 0%,#262625 45%,#1c1c1b 100%);border-radius:36px;padding:64px 56px;color:#fff;position:relative;overflow:hidden;box-shadow:0 30px 60px rgba(28,28,27,.18)}}
.pk-tomo-in::before{{content:"";position:absolute;inset:0;border-radius:inherit;padding:1px;background:linear-gradient(135deg,rgba(212,175,55,.55),rgba(212,175,55,0) 40%,rgba(212,175,55,.25));-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude;pointer-events:none}}
.pk-tomo-eyebrow{{display:inline-flex;align-items:center;gap:8px;font-size:13px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#D4AF37;background:rgba(212,175,55,.1);border:1px solid rgba(212,175,55,.3);padding:7px 14px;border-radius:999px}}
.pk-tomo-eyebrow i{{width:7px;height:7px;border-radius:50%;background:#D4AF37;box-shadow:0 0 0 0 rgba(212,175,55,.7);animation:pkTomoPulse 1.8s infinite}}
.pk-tomo h2{{margin:20px 0 0;color:#fff;font-size:clamp(32px,3.6vw,50px);line-height:1.08;font-weight:600;letter-spacing:-.035em}}
.pk-tomo h2 span{{color:#D4AF37}}
.pk-tomo-lead{{margin:18px 0 0;color:#CBD1D0;font-size:1.05rem;line-height:1.75;max-width:560px}}
.pk-tomo-list{{list-style:none;margin:28px 0 0;padding:0;display:grid;grid-template-columns:1fr 1fr;gap:18px 22px}}
.pk-tomo-f{{display:flex;gap:14px;align-items:flex-start}}
.pk-tomo-f strong{{display:block;color:#fff;font-size:15.5px;font-weight:600;margin-bottom:4px}}
.pk-tomo-f span span{{display:block;color:#A9AFAE;font-size:13.5px;line-height:1.6}}
.pk-tomo-ic{{flex:0 0 42px;width:42px;height:42px;border-radius:12px;display:grid;place-items:center;color:#D4AF37;background:rgba(212,175,55,.12);border:1px solid rgba(212,175,55,.28)}}
.pk-tomo-ic svg{{width:21px;height:21px}}
.pk-tomo-cta{{display:flex;flex-wrap:wrap;gap:12px;margin-top:32px}}
.pk-tomo-cta a{{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:14px 26px;border-radius:999px;font-weight:600;font-size:15px;text-decoration:none;transition:transform .25s var(--pk-ease,ease),background .25s,box-shadow .25s}}
.pk-tomo-cta .is-primary{{background:linear-gradient(135deg,#D4AF37 0%,#C59B27 100%);color:#fff;box-shadow:0 6px 20px rgba(197,155,39,.35)}}
.pk-tomo-cta .is-primary:hover{{transform:translateY(-2px);box-shadow:0 10px 26px rgba(197,155,39,.5)}}
.pk-tomo-cta .is-ghost{{color:#fff;border:1px solid rgba(255,255,255,.28)}}
.pk-tomo-cta .is-ghost:hover{{background:rgba(255,255,255,.08)}}
.pk-tomo-viz{{position:relative;aspect-ratio:13/10;border-radius:26px;background:radial-gradient(80% 80% at 50% 45%,rgba(120,200,220,.12),rgba(0,0,0,0) 70%),#151515;border:1px solid rgba(255,255,255,.08);overflow:hidden}}
.pk-tomo-svg{{position:absolute;inset:0;width:100%;height:100%}}
.pk-tomo-cross line{{stroke:rgba(212,175,55,.18);stroke-width:1;stroke-dasharray:4 6}}
.pk-tomo-bone{{fill:rgba(190,225,235,.05);stroke:rgba(190,225,235,.22);stroke-width:1.5}}
.pk-tomo-canal{{fill:none;stroke:#D4AF37;stroke-width:1.6;stroke-dasharray:6 6;opacity:.65;animation:pkTomoDash 6s linear infinite}}
.pk-tomo-tooth{{fill:rgba(225,240,245,.16);stroke:rgba(225,240,245,.75);stroke-width:1.4}}
.pk-tomo-tooth.is-hit{{fill:rgba(212,175,55,.28);stroke:#D4AF37}}
.pk-tomo-box rect{{fill:none;stroke:#D4AF37;stroke-width:1.6;animation:pkTomoBlink 2.4s ease-in-out infinite}}
.pk-tomo-box text{{fill:#D4AF37;font:600 12px var(--pk-font,"Poppins",sans-serif);letter-spacing:.04em}}
.pk-tomo-scan{{animation:pkTomoScan 3.6s cubic-bezier(.45,0,.55,1) infinite}}
.pk-tomo-chip{{position:absolute;display:flex;align-items:center;gap:8px;padding:9px 14px;border-radius:14px;background:rgba(20,20,20,.72);border:1px solid rgba(255,255,255,.12);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);color:#fff;font-size:12.5px;font-weight:600;white-space:nowrap}}
.pk-tomo-chip b{{color:#D4AF37;font-weight:700}}
.pk-tomo-chip.c1{{top:16px;left:16px}}
.pk-tomo-chip.c2{{bottom:16px;right:16px}}
.pk-tomo-chip i{{width:8px;height:8px;border-radius:50%;background:#4ade80;box-shadow:0 0 10px #4ade80}}
@keyframes pkTomoScan{{0%{{transform:translateY(0)}}100%{{transform:translateY(460px)}}}}
@keyframes pkTomoDash{{to{{stroke-dashoffset:-120}}}}
@keyframes pkTomoBlink{{0%,100%{{opacity:1}}50%{{opacity:.35}}}}
@keyframes pkTomoPulse{{0%{{box-shadow:0 0 0 0 rgba(212,175,55,.7)}}70%{{box-shadow:0 0 0 9px rgba(212,175,55,0)}}100%{{box-shadow:0 0 0 0 rgba(212,175,55,0)}}}}
@media (prefers-reduced-motion:reduce){{.pk-tomo-scan,.pk-tomo-canal,.pk-tomo-box rect,.pk-tomo-eyebrow i{{animation:none}}}}
@media (max-width:1024px){{.pk-tomo-in{{grid-template-columns:minmax(0,1fr);padding:48px 32px;gap:36px}}.pk-tomo-viz{{max-width:640px;width:100%;margin:0 auto}}}}
@media (max-width:640px){{.pk-tomo{{padding:16px 10px 0}}.pk-tomo-in{{padding:36px 20px;border-radius:26px}}.pk-tomo-list{{grid-template-columns:minmax(0,1fr)}}.pk-tomo-cta a{{flex:1 1 100%}}}}
</style>
<div class="pk-tomo-in">
<div class="pk-tomo-txt pk-rv">
<span class="pk-tomo-eyebrow"><i></i>Yeni Nesil Dijital Teşhis</span>
<h2 id="pk-tomo-title">Yapay Zeka Destekli <span>3D Tomografi</span></h2>
<p class="pk-tomo-lead">Kliniğimizde kullanılan yapay zeka destekli 3D dental tomografi (CBCT) ile ağız ve çene yapınızı üç boyutlu olarak inceliyor; teşhisten tedavi planlamasına kadar her adımı daha güvenli, hassas ve öngörülebilir hale getiriyoruz.</p>
<ul class="pk-tomo-list">{feat_html}</ul>
<div class="pk-tomo-cta"><a class="is-primary" href="#randevu">Tomografi İçin Randevu Alın</a><a class="is-ghost" href="tel:+903862134040"><svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1l-2.3 2.2Z"/></svg>0386 213 40 40</a></div>
</div>
<div class="pk-tomo-viz pk-rvs" aria-hidden="false">
{svg}
<span class="pk-tomo-chip c1"><i></i>AI Analiz <b>Aktif</b></span>
<span class="pk-tomo-chip c2">3D CBCT · <b>Yüksek Çözünürlük</b></span>
</div>
</div>
</section>
'''

with io.open(INDEX, "r", encoding="utf-8", newline="") as fp:
    html = fp.read()

if 'id="tomografi"' in html:
    # mevcut bölümü yenisiyle değiştir
    a = html.index('\t\t<section class="pk-tomo"')
    b = html.index('</section>\n', a) + len('</section>\n')
    html = html[:a] + section + html[b:]
else:
    anchor = '\t\t<div class="elementor-element elementor-element-bac9df9 '
    assert html.count(anchor) == 1, html.count(anchor)
    html = html.replace(anchor, section + anchor, 1)

# marquee: add item to front band (both sets)
sep = '<img class="pkm-sep" src="/images/ikon.png" alt="" width="22" height="22" decoding="async">'
old = '<span class="pkm-item">Dijital Gülüş Tasarımı</span>' + sep
new = old + '<span class="pkm-item">Yapay Zeka Destekli 3D Tomografi</span>' + sep
c = 0
if 'Yapay Zeka Destekli 3D Tomografi</span>' not in html:
    c = html.count(old)
    html = html.replace(old, new)

with io.open(INDEX, "w", encoding="utf-8", newline="") as fp:
    fp.write(html)
print("inserted section; marquee items added:", c)
