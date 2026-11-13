import glob, re, os

css_files = glob.glob('E:/PROJELER/ghm-dis-klinigi/public/css/**/*.css', recursive=True)

print("Scanning all CSS files for rgb/rgba or hex blues/teals...")

for f in css_files:
    fname = os.path.relpath(f, 'E:/PROJELER/ghm-dis-klinigi/public')
    with open(f, 'r', encoding='utf-8') as fp:
        lines = fp.readlines()
        
    for idx, line in enumerate(lines):
        # 1. Match rgb/rgba
        for m in re.finditer(r'rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)', line):
            r, g, b = int(m.group(1)), int(m.group(2)), int(m.group(3))
            # Check if bluish or cyan/teal (e.g. 55, 182, 172)
            if (b > 120 and b > r * 1.2) or (g > 150 and b > 140 and r < 100):
                print(f"[{fname}:L{idx+1}] RGB match: {m.group(0)}) in rule:")
                print(f"   {line.strip()[:140]}")
                
        # 2. Match hex colors
        for m in re.finditer(r'#([0-9a-fA-F]{6})', line):
            hex_val = m.group(1)
            r = int(hex_val[0:2], 16)
            g = int(hex_val[2:4], 16)
            b = int(hex_val[4:6], 16)
            if (b > 120 and b > r * 1.2) or (g > 150 and b > 140 and r < 100):
                print(f"[{fname}:L{idx+1}] HEX match: #{hex_val} in rule:")
                print(f"   {line.strip()[:140]}")

print("Scan complete.")

