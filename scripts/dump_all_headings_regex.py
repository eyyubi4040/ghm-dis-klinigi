import re

with open('E:/PROJELER/ghm-dis-klinigi/public/index.html', 'r', encoding='utf-8') as fp:
    html = fp.read()

# Extract headings
headings = re.findall(r'<(h[1-6]|div)[^>]*class="[^"]*elementor-heading-title[^"]*"[^>]*>([\s\S]*?)<\/\1>', html)
print("=== Headings found with elementor-heading-title ===")
for tag, text in headings:
    clean = re.sub(r'<[^>]+>', ' ', text).strip().replace('\n', ' ')
    print(f"<{tag}>: {clean}")

# Also extract all <p> tags
p_tags = re.findall(r'<p[^>]*>([\s\S]*?)<\/p>', html)
print("\n=== Paragraphs found ===")
for p in p_tags:
    clean = re.sub(r'<[^>]+>', ' ', p).strip().replace('\n', ' ')
    if len(clean) > 5:
        print(f"<p>: {clean}")

