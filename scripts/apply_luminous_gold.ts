import { readFileSync, writeFileSync } from 'fs';

// 1. Update core-theme.css with luminous luxury gold buttons and accents
const corePath = 'E:/PROJELER/ghm-dis-klinigi/public/css/theme/core-theme.css';
let coreCss = readFileSync(corePath, 'utf-8');

const enhancedGoldRules = `
/* Enhanced Radiant Luxury Gold Button & Accent Styling */
.pk-btn--primary .elementor-button, .elementor-button.elementor-size-sm,
a.pk-btn--primary, button.pk-btn--primary,
a.pk-b--primary, button.pk-b--primary, .pkh-cta, .pkr-send {
	background: linear-gradient(135deg, #D4AF37 0%, #C59B27 100%) !important;
	border-color: #D4AF37 !important;
	color: #FFFFFF !important;
	box-shadow: 0 4px 15px rgba(197, 155, 39, 0.3) !important;
	text-shadow: 0 1px 2px rgba(0, 0, 0, 0.15) !important;
}
.pk-btn--primary .elementor-button:hover,
a.pk-btn--primary:hover, button.pk-btn--primary:hover,
a.pk-b--primary:hover, button.pk-b--primary:hover, .pkh-cta:hover, .pkr-send:hover {
	background: linear-gradient(135deg, #C59B27 0%, #A67C1E 100%) !important;
	border-color: #A67C1E !important;
	box-shadow: 0 6px 20px rgba(197, 155, 39, 0.45) !important;
}

.pkf-more {
	color: #D4AF37 !important;
	font-weight: 600 !important;
	transition: color 0.2s ease !important;
}
.pkf-more:hover {
	color: #F3E5AB !important;
	text-decoration: underline !important;
}
`;

if (!coreCss.includes('Enhanced Radiant Luxury Gold Button')) {
  coreCss += enhancedGoldRules;
  writeFileSync(corePath, coreCss, 'utf-8');
  console.log('Appended enhanced gold rules to core-theme.css');
}

// 2. Update index.html luxury theme
const indexPath = 'E:/PROJELER/ghm-dis-klinigi/public/index.html';
let indexHtml = readFileSync(indexPath, 'utf-8');
if (!indexHtml.includes('Enhanced Radiant Luxury Gold Button')) {
  indexHtml = indexHtml.replace('</style>', enhancedGoldRules + '\n</style>');
  writeFileSync(indexPath, indexHtml, 'utf-8');
  console.log('Appended enhanced gold rules to index.html style tag');
}

