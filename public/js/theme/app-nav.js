/* Dt. Gözde Hilal Morkoyunlu Diş Kliniği */
(function () {
	'use strict';

	var body = document.body;
	var hdr = document.querySelector('[data-pkh]');

	/* --- Kaydırma: üstte şeffaf, aşağı inince gizlen, yukarı çıkınca beyaz bar --- */
	if (hdr) {
		var last = window.scrollY, ticking = false;
		var setH = function () { document.documentElement.style.setProperty('--pk-hdr-h', hdr.offsetHeight + 'px'); };
		var run = function () {
			var y = window.scrollY;
			hdr.classList.toggle('is-solid', y > 40);
			if (y < 140 || body.classList.contains('pk-menu-open') || y < last - 4) {
				body.classList.remove('pk-hdr-hide');
			} else if (y > last + 4) {
				body.classList.add('pk-hdr-hide');
			}
			last = y;
			ticking = false;
		};
		window.addEventListener('scroll', function () {
			if (!ticking) { ticking = true; requestAnimationFrame(run); }
		}, { passive: true });
		window.addEventListener('resize', setH, { passive: true });
		setH();
		run();
	}

	/* --- Mobil menü --- */
	var toggle = document.querySelector('.pkh-toggle');
	var panel = document.getElementById('pkh-mobile');
	var closeMobile = function () {
		if (!toggle || !panel) { return; }
		toggle.setAttribute('aria-expanded', 'false');
		toggle.setAttribute('aria-label', 'Menüyü aç');
		panel.hidden = true;
		body.classList.remove('pk-menu-open');
	};
	if (toggle && panel) {
		toggle.addEventListener('click', function () {
			var open = toggle.getAttribute('aria-expanded') !== 'true';
			toggle.setAttribute('aria-expanded', String(open));
			toggle.setAttribute('aria-label', open ? 'Menüyü kapat' : 'Menüyü aç');
			panel.hidden = !open;
			body.classList.toggle('pk-menu-open', open);
		});
		window.matchMedia('(min-width: 1025px)').addEventListener('change', function (e) { if (e.matches) { closeMobile(); } });
	}

	/* --- Alt menü aç/kapa (dokunmatik, klavye, mobil akordeon) --- */
	var setOpen = function (li, open) {
		li.classList.toggle('is-open', open);
		var a = li.querySelector(':scope > a');
		var b = li.querySelector(':scope > .pkm-toggle');
		if (a && a.hasAttribute('aria-expanded')) { a.setAttribute('aria-expanded', String(open)); }
		if (b) { b.setAttribute('aria-expanded', String(open)); }
	};
	document.addEventListener('click', function (e) {
		var t = e.target.closest('.pkm-toggle, a[data-pk-sub]');
		if (t) {
			e.preventDefault();
			var li = t.closest('li');
			var open = !li.classList.contains('is-open');
			li.parentElement.querySelectorAll(':scope > li.is-open').forEach(function (o) { if (o !== li) { setOpen(o, false); } });
			setOpen(li, open);
			return;
		}
		if (!e.target.closest('.pkh-menu')) {
			document.querySelectorAll('.pkh-nav li.is-open').forEach(function (o) { setOpen(o, false); });
		}
	});
	document.addEventListener('keydown', function (e) {
		if (e.key !== 'Escape') { return; }
		document.querySelectorAll('.pkh-menu li.is-open').forEach(function (o) { setOpen(o, false); });
		if (body.classList.contains('pk-menu-open')) { closeMobile(); toggle.focus(); }
	});

	/* --- Randevu penceresi ---
	   #randevu bağlantıları ve eski Elementor popup bağlantıları aynı pencereyi açar. */
	var openRandevu = function () {
		var ev = new CustomEvent('pk:randevu', { cancelable: true });
		if (!document.dispatchEvent(ev)) { return true; } // tema penceresi açtı
		if (window.elementorProFrontend && elementorProFrontend.modules && elementorProFrontend.modules.popup) {
			elementorProFrontend.modules.popup.showPopup({ id: 1229 });
			return true;
		}
		return false;
	};
	document.addEventListener('click', function (e) {
		var a = e.target.closest('a[href="/randevu"], a[href="/randevu/"], a[href="#randevu"], a[data-pk-randevu]');
		if (!a) { return; }
		if (openRandevu()) {
			e.preventDefault();
			closeMobile();
		}
	});

	/* --- Temiz adresler: '#' yerine /sayfa/bolum biçimi ---
	   /kozmetik-dis-hekimligi/bonding-uygulamasi -> sayfadaki [data-slug="bonding-uygulamasi"] bölümüne kaydırır. */
	var segs = function (path) { return path.replace(/^\/+|\/+$/g, '').split('/'); };
	var findSection = function (slug) {
		if (!slug) { return null; }
		try { return document.querySelector('[data-slug="' + slug.replace(/"/g, '') + '"]') || document.getElementById(slug); } catch (err) { return null; }
	};
	var scrollToEl = function (el, smooth) {
		if (!el) { return; }
		var root = document.documentElement, prev = root.style.scrollBehavior;
		if (!smooth) { root.style.scrollBehavior = 'auto'; }
		el.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
		if (!smooth) { root.style.scrollBehavior = prev; }
	};
	var pathSection = function () { return findSection(segs(location.pathname)[1]); };
	// Sayfa açılışında bölüme git; geç yüklenen görseller düzeni kaydırırsa birkaç kez düzelt
	var settle = function (getEl) {
		var stop = false;
		var cancel = function () { stop = true; };
		['wheel', 'touchstart', 'keydown', 'mousedown'].forEach(function (ev) { window.addEventListener(ev, cancel, { once: true, passive: true }); });
		[0, 200, 600, 1200, 2000].forEach(function (t) {
			setTimeout(function () { if (!stop) { scrollToEl(getEl(), false); } }, t);
		});
	};
	var onReady = function (fn) {
		if (document.readyState === 'complete') { fn(); } else { window.addEventListener('load', fn); }
	};
	if ('scrollRestoration' in history && (segs(location.pathname)[1] || location.hash)) { history.scrollRestoration = 'manual'; }

	// Eski '#...' adreslerini temiz adrese çevir
	(function legacyHash() {
		var h = location.hash;
		if (!h || h.length < 2) { return; }
		var id = decodeURIComponent(h.slice(1));
		var base = '/' + segs(location.pathname)[0];
		history.replaceState(null, '', location.pathname + location.search);
		if (id === 'randevu') { onReady(openRandevu); return; }
		onReady(function () {
			var el = document.getElementById(id) || document.querySelector('[data-slug="' + id + '"]');
			if (!el) { return; }
			var slug = el.getAttribute('data-slug');
			if (slug) { history.replaceState(null, '', (base === '/' || base === '/index' ? '' : base) + '/' + slug); }
			settle(function () { return el; });
		});
	})();

	// Doğrudan /sayfa/bolum açıldığında bölüme kaydır
	if (segs(location.pathname)[1]) {
		onReady(function () { if (pathSection()) { settle(pathSection); } });
	}

	// Aynı sayfadaki bölüm linkleri: sayfayı yeniden yüklemeden kaydır
	document.addEventListener('click', function (e) {
		if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) { return; }
		var a = e.target.closest('a[href^="/"]');
		if (!a || a.target === '_blank') { return; }
		var to = segs(a.getAttribute('href').split('?')[0]);
		if (to.length !== 2 || to[0] !== segs(location.pathname)[0]) { return; }
		var el = findSection(to[1]);
		if (!el) { return; }
		e.preventDefault();
		closeMobile();
		document.querySelectorAll('.pkh-menu li.is-open').forEach(function (o) { setOpen(o, false); });
		if (location.pathname.replace(/\/$/, '') !== '/' + to.join('/')) { history.pushState(null, '', '/' + to.join('/')); }
		scrollToEl(el, true);
	});
	window.addEventListener('popstate', function () {
		var el = pathSection();
		if (el) { scrollToEl(el, true); } else if (segs(location.pathname).length === 1) { window.scrollTo({ top: 0, behavior: 'smooth' }); }
	});

	/* --- href'siz düğmeler: alt menü başlıkları ve "içeriğe atla" klavye ile de çalışsın --- */
	document.addEventListener('keydown', function (e) {
		if (e.key !== 'Enter' && e.key !== ' ') { return; }
		var t = e.target.closest && e.target.closest('a[data-pk-sub], a[data-pk-skip]');
		if (!t) { return; }
		e.preventDefault();
		t.click();
	});
	document.addEventListener('click', function (e) {
		var s = e.target.closest('a[data-pk-skip]');
		if (!s) { return; }
		var main = document.getElementById('content');
		if (main) {
			if (!main.hasAttribute('tabindex')) { main.setAttribute('tabindex', '-1'); }
			main.focus();
			scrollToEl(main, false);
		}
	});

	/*
	 * Ana sayfa tedavileri (telefon ve tablet): masaüstündeki görsel akordeon alta doğru açılır.
	 * İlk dokunuş kartı açar, açık karta dokunmak tedavi sayfasına gider.
	 */
	var pkaMq = window.matchMedia('(max-width: 1024px)');
	var pkaLists = document.querySelectorAll('.pka');
	function pkaSync() {
		pkaLists.forEach(function (list) {
			var cards = list.querySelectorAll('.pka-card');
			cards.forEach(function (c, i) { c.classList.toggle('is-open', pkaMq.matches && i === 0); });
		});
	}
	if (pkaLists.length) {
		pkaSync();
		if (pkaMq.addEventListener) { pkaMq.addEventListener('change', pkaSync); }
		pkaLists.forEach(function (list) {
			list.addEventListener('click', function (e) {
				var card = e.target.closest('.pka-card');
				if (!card || !pkaMq.matches || card.classList.contains('is-open')) { return; }
				e.preventDefault();
				list.querySelectorAll('.pka-card').forEach(function (c) { c.classList.toggle('is-open', c === card); });
			});
		});
	}
})();
