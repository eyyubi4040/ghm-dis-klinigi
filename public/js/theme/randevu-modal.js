/* Dt. Gözde Hilal Morkoyunlu Diş Kliniği */
(function () {
	'use strict';

	var cfg = window.pkRandevu || {};
	var body = document.body;
	var lastFocus = null;
	var token = '';
	var rcLoaded = false;

	var fetchToken = function () {
		return fetch(cfg.rest + 'randevu-token', { credentials: 'same-origin', cache: 'no-store' })
			.then(function (r) { return r.json(); })
			.then(function (j) { token = j.t || ''; })
			.catch(function () {});
	};

	var loadRecaptcha = function () {
		if (!cfg.site || rcLoaded) { return; }
		rcLoaded = true;
		var s = document.createElement('script');
		s.src = 'https://www.google.com/recaptcha/api.js?render=' + encodeURIComponent(cfg.site);
		s.async = true;
		document.head.appendChild(s);
	};

	var loadDoktorTakvimi = function () {
		if (document.getElementById('zl-widget-s')) { return; }
		var s = document.createElement('script');
		s.id = 'zl-widget-s';
		s.src = 'https://platform.docplanner.com/js/widget.js';
		s.async = true;
		document.head.appendChild(s);
	};

	var open = function (id) {
		var dlg = document.getElementById(id);
		if (!dlg || typeof dlg.showModal !== 'function') { return false; }
		if (dlg.open) { return true; }
		lastFocus = document.activeElement;
		dlg.showModal();
		dlg.focus(); // ilk alana odaklanıp mobilde klavyeyi açmasın
		body.classList.add('pkr-lock');
		if (id === 'pk-randevu') {
			fetchToken();
			loadRecaptcha();
		} else if (id === 'pk-dt-2807') {
			loadDoktorTakvimi();
		}
		return true;
	};

	var close = function (dlg) {
		if (!dlg) {
			dlg = document.querySelector('dialog[open]') || document.getElementById('pk-randevu');
		}
		if (!dlg) { return; }
		dlg.classList.add('is-closing');
		body.classList.remove('pkr-lock');
		var doClose = function () {
			dlg.classList.remove('is-closing');
			try {
				if (typeof dlg.close === 'function' && dlg.open) {
					dlg.close();
				}
			} catch (err) {}
			dlg.removeAttribute('open');
			body.classList.remove('pkr-lock');
			if (lastFocus && typeof lastFocus.focus === 'function') {
				try { lastFocus.focus(); } catch (fErr) {}
			}
		};
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			doClose();
		} else {
			setTimeout(doClose, 160);
		}
	};

	/* Dialog element listeners */
	document.querySelectorAll('dialog, dialog.pkr, dialog.pkr-modal').forEach(function (dlg) {
		dlg.addEventListener('close', function () {
			body.classList.remove('pkr-lock');
			if (lastFocus && lastFocus.focus) { try { lastFocus.focus(); } catch (err) {} }
		});
		dlg.addEventListener('cancel', function (e) {
			e.preventDefault();
			close(dlg);
		});
		dlg.addEventListener('click', function (e) {
			if (e.target === dlg || (e.target.closest && e.target.closest('[data-pkr-close], .pkr-close, [aria-label="Kapat"]'))) {
				close(dlg);
			}
		});
	});

	/* Global delegated click listener for close buttons & backdrops */
	document.addEventListener('click', function (e) {
		if (!e.target) { return; }
		var closeBtn = e.target.closest && e.target.closest('[data-pkr-close], .pkr-close, [aria-label="Kapat"]');
		if (closeBtn) {
			e.preventDefault();
			e.stopPropagation();
			var dlg = closeBtn.closest('dialog') || document.querySelector('dialog[open]') || document.getElementById('pk-randevu');
			close(dlg);
			return;
		}

		if (e.target.tagName === 'DIALOG' && e.target.open) {
			close(e.target);
		}
	}, true);

	/* Escape key to close dialog */
	document.addEventListener('keydown', function (e) {
		if (e.key === 'Escape' || e.key === 'Esc' || e.keyCode === 27) {
			var openDlg = document.querySelector('dialog[open]') || (document.getElementById('pk-randevu') && document.getElementById('pk-randevu').open ? document.getElementById('pk-randevu') : null);
			if (openDlg) {
				e.preventDefault();
				close(openDlg);
			}
		}
	});

	/* ghm.js: #randevu ve "Randevu Oluştur" butonları */
	document.addEventListener('pk:randevu', function (e) {
		if (open('pk-randevu')) { e.preventDefault(); }
	});

	/* Eski Elementor popup bağlantıları (#elementor-action:...popup:open...) */
	var popupId = function (href) {
		try {
			var h = decodeURIComponent(href);
			if (h.indexOf('popup:open') === -1) { return 0; }
			var m = h.match(/settings=([A-Za-z0-9+/=_-]+)/);
			return m ? parseInt(JSON.parse(atob(m[1])).id, 10) || 0 : 0;
		} catch (err) { return 0; }
	};
	window.addEventListener('click', function (e) {
		var a = e.target.closest && e.target.closest('a[href^="#elementor-action"]');
		if (!a) { return; }
		var id = (cfg.popups || {})[popupId(a.getAttribute('href'))];
		if (id && open(id)) {
			e.preventDefault();
			e.stopImmediatePropagation();
		}
	}, true);

	/* Formlar: randevu penceresindeki form ve sayfadaki iletişim formu */
	var getCaptcha = function (action) {
		if (!cfg.site || !window.grecaptcha || !grecaptcha.execute) { return Promise.resolve(''); }
		return new Promise(function (resolve) {
			grecaptcha.ready(function () {
				grecaptcha.execute(cfg.site, { action: action }).then(resolve, function () { resolve(''); });
			});
		});
	};

	var setup = function (form) {
		var type = form.getAttribute('data-pk-form') || 'randevu';
		var status = form.querySelector('.pkr-status');
		var btn = form.querySelector('.pkr-send');

		/* Sayfadaki formda jeton ve reCAPTCHA, kullanıcı forma dokununca yüklenir. */
		if (type !== 'randevu') {
			form.addEventListener('focusin', function () {
				if (!token) { fetchToken(); }
				loadRecaptcha();
			}, { once: true });
		}

		var setStatus = function (msg, kind) {
			status.textContent = msg || '';
			status.className = 'pkr-status' + (kind ? ' is-' + kind : '');
		};

		var markInvalid = function (fields) {
			form.querySelectorAll('.is-invalid').forEach(function (el) { el.classList.remove('is-invalid'); });
			Object.keys(fields || {}).forEach(function (k) {
				var el = form.elements[k];
				if (el) { el.closest('label').classList.add('is-invalid'); el.setAttribute('aria-invalid', 'true'); }
			});
		};

		form.addEventListener('input', function (e) {
			var l = e.target.closest('label');
			if (l) { l.classList.remove('is-invalid'); e.target.removeAttribute('aria-invalid'); }
		});

		form.addEventListener('submit', function (e) {
			e.preventDefault();
			if (btn.disabled) { return; }

			var bad = {};
			Array.prototype.forEach.call(form.elements, function (el) {
				if (el.name && el.willValidate && !el.checkValidity()) { bad[el.name] = 1; }
			});
			markInvalid(bad);
			if (Object.keys(bad).length) {
				setStatus(cfg.invalid, 'error');
				var first = form.querySelector('.is-invalid input, .is-invalid textarea');
				if (first) { first.focus(); }
				return;
			}

			btn.disabled = true;
			btn.setAttribute('aria-busy', 'true');
			setStatus('');

			var send = function () {
				return getCaptcha(type).then(function (g) {
					var data = {};
					new FormData(form).forEach(function (v, k) { data[k] = v; });
					data.t = token;
					data.g = g;
					data.page = location.href.split('#')[0];
					return fetch(cfg.rest + type, {
						method: 'POST',
						credentials: 'same-origin',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify(data)
					});
				});
			};

			(token ? Promise.resolve() : fetchToken())
				.then(send)
				.then(function (r) { return r.json().catch(function () { return { ok: false }; }); })
				.then(function (j) {
					if (j && j.ok) {
						form.reset();
						form.classList.add('is-sent');
						setStatus(j.message, 'ok');
						fetchToken();
					} else {
						markInvalid(j && j.fields);
						setStatus((j && j.message) || cfg.failed, 'error');
					}
				})
				.catch(function () { setStatus(cfg.failed, 'error'); })
				.then(function () {
					btn.disabled = false;
					btn.removeAttribute('aria-busy');
				});
		});
	};

	document.querySelectorAll('#pk-randevu .pkr-form, form[data-pk-form]').forEach(setup);
})();
