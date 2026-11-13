from bs4 import BeautifulSoup
import re

with open('E:/PROJELER/ghm-dis-klinigi/public/index.html', 'r', encoding='utf-8') as fp:
    soup = BeautifulSoup(fp.read(), 'html.parser')

print("=== All Headings (h1, h2, h3, h4, .elementor-heading-title) in index.html ===")
for h in soup.find_all(['h1', 'h2', 'h3', 'h4', 'div']):
    classes = h.get('class', [])
    if h.name.startswith('h') or 'elementor-heading-title' in classes or 'baslik' in classes:
        txt = h.get_text().strip()
        if txt and len(txt) > 2:
            print(f"<{h.name}>: {txt.replace('\n', ' ')}")

