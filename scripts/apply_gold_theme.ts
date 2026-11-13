import { readFileSync, writeFileSync } from 'fs';

// 1. Replace #23827A and #1F6F69 in CSS files
const cssFiles = [
  'E:/PROJELER/ghm-dis-klinigi/public/css/theme/layout.css',
  'E:/PROJELER/ghm-dis-klinigi/public/css/theme/mobile.css',
  'E:/PROJELER/ghm-dis-klinigi/public/css/theme/pages.css',
  'E:/PROJELER/ghm-dis-klinigi/public/css/theme/randevu-modal.css',
];

for (const f of cssFiles) {
  let content = readFileSync(f, 'utf-8');
  const count1 = (content.match(/#23827[Aa]/g) || []).length;
  const count2 = (content.match(/#1[Ff]6[Ff]69/g) || []).length;
  content = content.replace(/#23827[Aa]/g, '#C59B27');
  content = content.replace(/#1[Ff]6[Ff]69/g, '#A67C1E');
  writeFileSync(f, content, 'utf-8');
  console.log(`Updated ${f}: replaced ${count1} teal, ${count2} dark teal`);
}

// 2. Swiper CSS override: replace #007aff with #C59B27
const swiperPath = 'E:/PROJELER/ghm-dis-klinigi/public/css/theme/swiper.min.css';
let swiperContent = readFileSync(swiperPath, 'utf-8');
const swiperCount = (swiperContent.match(/#007aff/gi) || []).length;
swiperContent = swiperContent.replace(/#007aff/gi, '#C59B27');
writeFileSync(swiperPath, swiperContent, 'utf-8');
console.log(`Updated ${swiperPath}: replaced ${swiperCount} swiper blue`);

// 3. Update public/css/theme/site.css for .pk-hero-plus and .pkm-sep
const siteCssPath = 'E:/PROJELER/ghm-dis-klinigi/public/css/theme/site.css';
let siteCss = readFileSync(siteCssPath, 'utf-8');

// Replace squished .pk-hero-plus
siteCss = siteCss.replace(
  /\.elementor-14 \.elementor-element\.elementor-element-3b7678c > \.pk-hero-plus \{[^}]*\}/g,
  `.elementor-14 .elementor-element.elementor-element-3b7678c > .pk-hero-plus, .pk-hero-plus { right: 5% !important; top: 18% !important; width: min(440px, 38vw) !important; height: auto !important; max-height: 180px !important; z-index: 1 !important; position: absolute !important; pointer-events: none !important; }`
);

// Append rules for .pk-hero-plus .pk-float img and .pkm-sep
const extraSiteCss = `
/* GHM Proportional Animated Logo & Marquee Separator Fix */
.pk-hero-plus .pk-float {
  width: 100% !important;
  height: auto !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}
.pk-hero-plus .pk-float img {
  width: 100% !important;
  height: auto !important;
  max-width: 440px !important;
  max-height: 170px !important;
  object-fit: contain !important;
  filter: drop-shadow(0 15px 35px rgba(0,0,0,0.22)) !important;
}
@media (max-width: 767px) {
  .elementor-14 .elementor-element.elementor-element-3b7678c > .pk-hero-plus,
  .pk-hero-plus {
    right: 15px !important;
    top: 75px !important;
    width: min(230px, 55vw) !important;
    max-height: 90px !important;
    opacity: 0.85 !important;
  }
}
.pkm-sep {
  width: auto !important;
  height: 22px !important;
  max-width: 65px !important;
  object-fit: contain !important;
  flex: 0 0 auto !important;
  margin: 0 16px !important;
  vertical-align: middle !important;
  display: inline-block !important;
}
@media (max-width: 1024px) {
  .pkm-sep { height: 18px !important; max-width: 50px !important; margin: 0 12px !important; }
}
@media (max-width: 767px) {
  .pkm-sep { height: 15px !important; max-width: 40px !important; margin: 0 8px !important; }
}
`;

if (!siteCss.includes('GHM Proportional Animated Logo')) {
  siteCss += extraSiteCss;
}
writeFileSync(siteCssPath, siteCss, 'utf-8');
console.log('Updated site.css for .pk-hero-plus and .pkm-sep');

// 4. Update public/css/theme/core-theme.css with comprehensive Gold styling
const coreThemePath = 'E:/PROJELER/ghm-dis-klinigi/public/css/theme/core-theme.css';
let coreTheme = readFileSync(coreThemePath, 'utf-8');

const goldRules = `
/* ========================================================
   Dt. Gözde Hilal Morkoyunlu Diş Kliniği - Gold Brand Theme
   ======================================================== */
:root {
	--pk-teal: #C59B27 !important;
	--pk-teal-2: #A67C1E !important;
	--e-global-color-accent: #C59B27 !important;
	--e-global-color-pkteal2: #A67C1E !important;
	--swiper-theme-color: #C59B27 !important;
	--swiper-navigation-color: #C59B27 !important;
}

/* Global Link Colors: strictly brand gold, no default blue */
a {
	color: #C59B27;
	text-decoration: none;
	transition: color 0.2s ease, opacity 0.2s ease;
}
a:hover, a:focus {
	color: #A67C1E;
}

/* Header & Megamenu text stays clean ink, turns gold on hover */
.pkh-nav a, .pkh-menu a, .pkm-label, .pk-mega a {
	color: #373736 !important;
}
.pkh-nav a:hover, .pkh-menu a:hover, .pkm-label:hover, .pk-mega a:hover,
.pkh-nav li.current-menu-item > a, .pkh-nav li.current-menu-ancestor > a {
	color: #C59B27 !important;
}

/* Brand Buttons */
.pk-btn--primary .elementor-button, .elementor-button.elementor-size-sm,
a.pk-btn--primary, button.pk-btn--primary,
a.pk-b--primary, button.pk-b--primary, .pkh-cta, .pkr-send {
	background: #C59B27 !important;
	border-color: #C59B27 !important;
	color: #FFFFFF !important;
}
.pk-btn--primary .elementor-button:hover,
a.pk-btn--primary:hover, button.pk-btn--primary:hover,
a.pk-b--primary:hover, button.pk-b--primary:hover, .pkh-cta:hover, .pkr-send:hover {
	background: #A67C1E !important;
	border-color: #A67C1E !important;
	color: #FFFFFF !important;
}

/* Accordion Question Titles */
.elementor-accordion .elementor-tab-title,
.elementor-accordion .elementor-tab-title a,
.elementor-accordion-title {
	color: #1E293B !important;
}
.elementor-accordion .elementor-tab-title:hover a,
.elementor-accordion .elementor-tab-title.elementor-active a,
.elementor-accordion .elementor-tab-title:hover .elementor-accordion-title,
.elementor-accordion .elementor-tab-title.elementor-active .elementor-accordion-title {
	color: #C59B27 !important;
}

/* Swiper Controls */
.swiper-button-prev, .swiper-button-next,
.elementor-swiper-button-prev, .elementor-swiper-button-next {
	color: #C59B27 !important;
	fill: #C59B27 !important;
}
.swiper-pagination-bullet-active {
	background: #C59B27 !important;
}
`;

if (!coreTheme.includes('Dt. Gözde Hilal Morkoyunlu Diş Kliniği - Gold Brand Theme')) {
  coreTheme += goldRules;
  writeFileSync(coreThemePath, coreTheme, 'utf-8');
  console.log('Appended Gold Brand Theme to core-theme.css');
}

