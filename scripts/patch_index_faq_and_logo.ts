import { readFileSync, writeFileSync } from 'fs';

const indexPath = 'E:/PROJELER/ghm-dis-klinigi/public/index.html';
let html = readFileSync(indexPath, 'utf-8');

// 1. Fix hero floating animated logo
const oldLogoRegex = /<div aria-hidden="true" class="pk-float"[^>]*><img fetchpriority="high" src="\/images\/logo\.png"[^>]*><\/div>/;
const newLogoMarkup = `<div aria-hidden="true" class="pk-float" style="pointer-events:none;width:100%;height:auto;display:flex;align-items:center;justify-content:center;"><img fetchpriority="high" src="/images/logo-beyaz.png" alt="Dt. Gözde Hilal Morkoyunlu Diş Kliniği" width="440" height="146" decoding="async" style="width:100%;max-width:440px;height:auto;max-height:170px;object-fit:contain;opacity:.95;filter:drop-shadow(0 15px 30px rgba(0,0,0,0.22));"></div>`;

if (oldLogoRegex.test(html)) {
  html = html.replace(oldLogoRegex, newLogoMarkup);
  console.log('Successfully patched hero floating logo in index.html');
} else {
  console.log('WARNING: old logo pattern not matched in index.html');
}

// 2. Fix accordion dummy English and Lorem Ipsum
const oldAccordionTarget = `<div class="elementor-accordion">
							<div class="elementor-accordion-item">
					<div id="elementor-tab-title-5591" class="elementor-tab-title" data-tab="1" role="button" aria-controls="elementor-tab-content-5591" aria-expanded="false">
													<span class="elementor-accordion-icon elementor-accordion-icon-left" aria-hidden="true">
															<span class="elementor-accordion-icon-closed"><svg class="e-font-icon-svg e-fas-plus" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"></path></svg></span>
								<span class="elementor-accordion-icon-opened"><svg class="e-font-icon-svg e-fas-minus" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M416 208H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"></path></svg></span>
														</span>
												<a class="elementor-accordion-title" tabindex="0">Why choose braces?</a>
					</div>
					<div id="elementor-tab-content-5591" class="elementor-tab-content elementor-clearfix" data-tab="1" role="region" aria-labelledby="elementor-tab-title-5591">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.</div>
				</div>
							<div class="elementor-accordion-item">
					<div id="elementor-tab-title-5592" class="elementor-tab-title" data-tab="2" role="button" aria-controls="elementor-tab-content-5592" aria-expanded="false">
													<span class="elementor-accordion-icon elementor-accordion-icon-left" aria-hidden="true">
															<span class="elementor-accordion-icon-closed"><svg class="e-font-icon-svg e-fas-plus" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"></path></svg></span>
								<span class="elementor-accordion-icon-opened"><svg class="e-font-icon-svg e-fas-minus" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M416 208H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"></path></svg></span>
														</span>
												<a class="elementor-accordion-title" tabindex="0">When can I start treatment with aligners?</a>
					</div>
					<div id="elementor-tab-content-5592" class="elementor-tab-content elementor-clearfix" data-tab="2" role="region" aria-labelledby="elementor-tab-title-5592">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.</div>
				</div>
							<div class="elementor-accordion-item">
					<div id="elementor-tab-title-5593" class="elementor-tab-title" data-tab="3" role="button" aria-controls="elementor-tab-content-5593" aria-expanded="false">
													<span class="elementor-accordion-icon elementor-accordion-icon-left" aria-hidden="true">
															<span class="elementor-accordion-icon-closed"><svg class="e-font-icon-svg e-fas-plus" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"></path></svg></span>
								<span class="elementor-accordion-icon-opened"><svg class="e-font-icon-svg e-fas-minus" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M416 208H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"></path></svg></span>
														</span>
												<a class="elementor-accordion-title" tabindex="0">When can I check patient fees?</a>
					</div>
					<div id="elementor-tab-content-5593" class="elementor-tab-content elementor-clearfix" data-tab="3" role="region" aria-labelledby="elementor-tab-title-5593">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.</div>
				</div>
							<div class="elementor-accordion-item">
					<div id="elementor-tab-title-5594" class="elementor-tab-title" data-tab="4" role="button" aria-controls="elementor-tab-content-5594" aria-expanded="false">
													<span class="elementor-accordion-icon elementor-accordion-icon-left" aria-hidden="true">
															<span class="elementor-accordion-icon-closed"><svg class="e-font-icon-svg e-fas-plus" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"></path></svg></span>
								<span class="elementor-accordion-icon-opened"><svg class="e-font-icon-svg e-fas-minus" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M416 208H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"></path></svg></span>
														</span>
												<a class="elementor-accordion-title" tabindex="0">Can I get a loan for my treatment?</a>
					</div>
					<div id="elementor-tab-content-5594" class="elementor-tab-content elementor-clearfix" data-tab="4" role="region" aria-labelledby="elementor-tab-title-5594">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.</div>
				</div>
								</div>`;

const newAccordionMarkup = `<div class="elementor-accordion">
							<div class="elementor-accordion-item">
					<div id="elementor-tab-title-5591" class="elementor-tab-title" data-tab="1" role="button" aria-controls="elementor-tab-content-5591" aria-expanded="false">
													<span class="elementor-accordion-icon elementor-accordion-icon-left" aria-hidden="true">
															<span class="elementor-accordion-icon-closed"><svg class="e-font-icon-svg e-fas-plus" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"></path></svg></span>
								<span class="elementor-accordion-icon-opened"><svg class="e-font-icon-svg e-fas-minus" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M416 208H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"></path></svg></span>
														</span>
												<a class="elementor-accordion-title" tabindex="0">Ortodonti (diş teli veya şeffaf plak) tedavisine ne zaman başlanabilir?</a>
					</div>
					<div id="elementor-tab-content-5591" class="elementor-tab-content elementor-clearfix" data-tab="1" role="region" aria-labelledby="elementor-tab-title-5591">Ortodontik tedavi her yaşta güvenle uygulanabilir. Çocuklarda erken dönemde çene gelişimi kontrol altına alınırken, yetişkin bireylerde de şeffaf plaklar (Invisalign) ya da estetik porselen braketler ile diş çapraşıklıkları sosyal hayatı etkilemeden konforla düzeltilir.</div>
				</div>
							<div class="elementor-accordion-item">
					<div id="elementor-tab-title-5592" class="elementor-tab-title" data-tab="2" role="button" aria-controls="elementor-tab-content-5592" aria-expanded="false">
													<span class="elementor-accordion-icon elementor-accordion-icon-left" aria-hidden="true">
															<span class="elementor-accordion-icon-closed"><svg class="e-font-icon-svg e-fas-plus" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"></path></svg></span>
								<span class="elementor-accordion-icon-opened"><svg class="e-font-icon-svg e-fas-minus" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M416 208H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"></path></svg></span>
														</span>
												<a class="elementor-accordion-title" tabindex="0">İmplant tedavisi ağrılı mıdır ve ne kadar sürede tamamlanır?</a>
					</div>
					<div id="elementor-tab-content-5592" class="elementor-tab-content elementor-clearfix" data-tab="2" role="region" aria-labelledby="elementor-tab-title-5592">İmplant yerleşimi modern lokal anestezi teknikleriyle tamamen acısız ve konforlu biçimde tamamlanır; bir implantın cerrahi yerleşimi ortalama 15-20 dakika sürer. Kemikle biyolojik kaynaşma (osseointegrasyon) evresi tamamlandıktan sonra kişiye özel zirkonyum veya porselen kuronunuz takılır.</div>
				</div>
							<div class="elementor-accordion-item">
					<div id="elementor-tab-title-5593" class="elementor-tab-title" data-tab="3" role="button" aria-controls="elementor-tab-content-5593" aria-expanded="false">
													<span class="elementor-accordion-icon elementor-accordion-icon-left" aria-hidden="true">
															<span class="elementor-accordion-icon-closed"><svg class="e-font-icon-svg e-fas-plus" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"></path></svg></span>
								<span class="elementor-accordion-icon-opened"><svg class="e-font-icon-svg e-fas-minus" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M416 208H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"></path></svg></span>
														</span>
												<a class="elementor-accordion-title" tabindex="0">Diş beyazlatma (bleaching) işlemi diş mineme zarar verir mi?</a>
					</div>
					<div id="elementor-tab-content-5593" class="elementor-tab-content elementor-clearfix" data-tab="3" role="region" aria-labelledby="elementor-tab-title-5593">Kliniğimizde uzman hekim kontrolünde uygulanan yeni nesil ofis tipi lazer/ışık aktivasyonlu beyazlatma tedavileri diş minesine kesinlikle zarar vermez. Dişin doğal yapısı tamamen korunarak ortalama 45 dakikalık tek seansta 3-4 ton belirgin ve kalıcı beyazlık elde edilir.</div>
				</div>
							<div class="elementor-accordion-item">
					<div id="elementor-tab-title-5594" class="elementor-tab-title" data-tab="4" role="button" aria-controls="elementor-tab-content-5594" aria-expanded="false">
													<span class="elementor-accordion-icon elementor-accordion-icon-left" aria-hidden="true">
															<span class="elementor-accordion-icon-closed"><svg class="e-font-icon-svg e-fas-plus" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"></path></svg></span>
								<span class="elementor-accordion-icon-opened"><svg class="e-font-icon-svg e-fas-minus" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M416 208H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"></path></svg></span>
														</span>
												<a class="elementor-accordion-title" tabindex="0">Tedavi ücretleri ve ödeme kolaylıkları nasıldır?</a>
					</div>
					<div id="elementor-tab-content-5594" class="elementor-tab-content elementor-clearfix" data-tab="4" role="region" aria-labelledby="elementor-tab-title-5594">Her hastanın ağız yapısı ve tedavi gereksinimi farklı olduğundan, detaylı muayene ve dijital röntgen analizinin ardından şeffaf bir tedavi planı sunulur. Kliniğimizde anlaşmalı kurumlara özel indirimler ve anlaşmalı kredi kartlarına taksit imkanları sağlanmaktadır.</div>
				</div>
								</div>`;

if (html.includes('Why choose braces?')) {
  html = html.replace(oldAccordionTarget, newAccordionMarkup);
  console.log('Successfully replaced dummy accordion with Turkish FAQ in index.html');
} else {
  console.log('Accordion was already translated or pattern mismatch');
}

// 3. Update <style id="ghm-luxury-theme"> in index.html with comprehensive gold overrides
const oldStyleRegex = /<style id="ghm-luxury-theme">[\s\S]*?<\/style>/;
const newStyleTag = `<style id="ghm-luxury-theme">
  .screen-reader-text, .skip-link {
    position: absolute !important;
    overflow: hidden !important;
    clip: rect(1px, 1px, 1px, 1px) !important;
    width: 1px !important;
    height: 1px !important;
  }
  :root {
    --pk-teal: #C59B27 !important;
    --pk-teal-2: #A67C1E !important;
    --e-global-color-accent: #C59B27 !important;
    --e-global-color-pkteal2: #A67C1E !important;
    --e-global-color-c1fe6f4: rgba(197, 155, 39, 0.3) !important;
    --swiper-theme-color: #C59B27 !important;
    --swiper-navigation-color: #C59B27 !important;
  }
  /* Global links: gold by default, no browser blue */
  a {
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
  }
  .pkh-logo img {
    height: 54px !important;
    width: auto !important;
    object-fit: contain !important;
  }
  .pkl--light {
    display: none !important;
  }
  .pkl--dark {
    display: block !important;
  }
  .pk-b--primary, button.pk-b--primary, a.pk-b--primary,
  .pk-btn--primary .elementor-button, .pkh-cta, .pkr-send {
    background: #C59B27 !important;
    border-color: #C59B27 !important;
    color: #FFFFFF !important;
  }
  .pk-b--primary:hover, button.pk-b--primary:hover, a.pk-b--primary:hover,
  .pk-btn--primary .elementor-button:hover, .pkh-cta:hover, .pkr-send:hover {
    background: #A67C1E !important;
    border-color: #A67C1E !important;
    color: #FFFFFF !important;
  }
  .pk-b--outline {
    border-color: #C59B27 !important;
    color: #C59B27 !important;
  }
  .pk-b--outline:hover {
    background: #C59B27 !important;
    color: #FFFFFF !important;
  }
  .elementor-element .elementor-heading-title span,
  .pkh-nav a:hover,
  .pkm-label:hover {
    color: #C59B27 !important;
  }
  /* Proportional Animated Floating Logo */
  .elementor-14 .elementor-element.elementor-element-3b7678c > .pk-hero-plus,
  .pk-hero-plus {
    right: 5% !important;
    top: 18% !important;
    width: min(440px, 38vw) !important;
    height: auto !important;
    max-height: 180px !important;
    z-index: 1 !important;
    position: absolute !important;
    pointer-events: none !important;
  }
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
  /* Accordion styling */
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
  /* Swiper controls */
  .swiper-button-prev, .swiper-button-next,
  .elementor-swiper-button-prev, .elementor-swiper-button-next {
    color: #C59B27 !important;
    fill: #C59B27 !important;
  }
  .swiper-pagination-bullet-active {
    background: #C59B27 !important;
  }
  .pkr-check a {
    color: #C59B27 !important;
  }
</style>`;

if (oldStyleRegex.test(html)) {
  html = html.replace(oldStyleRegex, newStyleTag);
  console.log('Successfully updated ghm-luxury-theme style tag in index.html');
}

writeFileSync(indexPath, html, 'utf-8');
console.log('index.html saved successfully.');

