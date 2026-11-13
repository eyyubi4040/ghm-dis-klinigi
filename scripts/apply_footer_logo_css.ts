import { readFileSync, writeFileSync } from 'fs';

// 1. Update public/css/theme/layout.css
const layoutPath = 'E:/PROJELER/ghm-dis-klinigi/public/css/theme/layout.css';
let layoutCss = readFileSync(layoutPath, 'utf-8');
const layoutTarget = `.pkf-logo { display: block; line-height: 0; }
.pkf-logo .pkl { width: 180px; }`;
const layoutReplacement = `.pkf-logo { display: block !important; line-height: 0; }
.pkf-logo img,
.pkf-logo .pkl,
.pkf-logo .pkl--white {
	display: block !important;
	height: 52px !important;
	width: auto !important;
	max-width: 240px !important;
	object-fit: contain !important;
	opacity: 1 !important;
	visibility: visible !important;
}`;

if (layoutCss.includes(layoutTarget)) {
  layoutCss = layoutCss.replace(layoutTarget, layoutReplacement);
  writeFileSync(layoutPath, layoutCss, 'utf-8');
  console.log('Updated layout.css footer logo styling');
} else {
  console.log('layoutTarget not found, appending rule');
  layoutCss += '\n' + layoutReplacement;
  writeFileSync(layoutPath, layoutCss, 'utf-8');
}

// 2. Update public/css/theme/core-theme.css
const corePath = 'E:/PROJELER/ghm-dis-klinigi/public/css/theme/core-theme.css';
let coreCss = readFileSync(corePath, 'utf-8');
const coreFooterRule = `
/* Footer Logo: Pure White on dark footer background */
.pkf-logo {
	display: block !important;
	line-height: 0 !important;
}
.pkf-logo img,
.pkf-logo .pkl,
.pkf-logo .pkl--white {
	display: block !important;
	height: 52px !important;
	width: auto !important;
	max-width: 240px !important;
	object-fit: contain !important;
	opacity: 1 !important;
	visibility: visible !important;
}
`;

if (!coreCss.includes('Footer Logo: Pure White')) {
  coreCss += coreFooterRule;
  writeFileSync(corePath, coreCss, 'utf-8');
  console.log('Updated core-theme.css with white footer logo rules');
}

// 3. Update public/index.html ghm-luxury-theme
const indexPath = 'E:/PROJELER/ghm-dis-klinigi/public/index.html';
let indexHtml = readFileSync(indexPath, 'utf-8');
if (indexHtml.includes('</style>') && !indexHtml.includes('.pkf-logo .pkl--white')) {
  indexHtml = indexHtml.replace('</style>', `  .pkf-logo img, .pkf-logo .pkl, .pkf-logo .pkl--white { display: block !important; height: 52px !important; width: auto !important; max-width: 240px !important; object-fit: contain !important; opacity: 1 !important; visibility: visible !important; }\n</style>`);
  writeFileSync(indexPath, indexHtml, 'utf-8');
  console.log('Updated index.html luxury theme with footer logo rules');
}

