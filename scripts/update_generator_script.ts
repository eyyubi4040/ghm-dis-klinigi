import { readFileSync, writeFileSync } from 'fs';

const path = 'E:/PROJELER/ghm-dis-klinigi/scripts/generate_all_treatment_pages.ts';
let code = readFileSync(path, 'utf-8');

const targetStr = `.pkh-nav a:hover, .pkm-label:hover {
			color: #C59B27 !important;
		}`;

const replacementStr = `a {
			color: #C59B27;
			text-decoration: none;
			transition: color 0.2s ease;
		}
		a:hover, a:focus {
			color: #A67C1E;
		}
		.pkh-nav a, .pkh-menu a, .pkm-label, .pk-mega a {
			color: #373736 !important;
		}
		.pkh-nav a:hover, .pkh-menu a:hover, .pkm-label:hover, .pk-mega a:hover,
		.pkh-nav li.current-menu-item > a, .pkh-nav li.current-menu-ancestor > a {
			color: #C59B27 !important;
		}`;

if (code.includes(targetStr)) {
  code = code.replace(targetStr, replacementStr);
  writeFileSync(path, code, 'utf-8');
  console.log('Replaced luxury theme in generate_all_treatment_pages.ts');
} else {
  console.log('Target string not found in generate_all_treatment_pages.ts');
}

