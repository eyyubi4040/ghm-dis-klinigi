/**
 * Dt. Gözde Hilal Morkoyunlu Diş Kliniği - İnteraktif İstemci Scripti
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileMenu();
  initBeforeAfterSlider();
  initFaqAccordion();
  initTreatmentFilters();
  initAppointmentBooking();
  initContactForm();
  initReviewForm();
  initCounters();
});

// 1. Header scroll effect
function initHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

// 2. Mobile Menu Toggle
function initMobileMenu() {
  const toggle = document.querySelector('.mobile-toggle');
  const menu = document.querySelector('.nav-menu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    menu.classList.toggle('active');
    const isExpanded = menu.classList.contains('active');
    toggle.setAttribute('aria-expanded', isExpanded);
  });

  // Mobile submenu accordion
  const navItems = document.querySelectorAll('.nav-item.has-dropdown');
  navItems.forEach(item => {
    const link = item.querySelector('.nav-link');
    if (link) {
      link.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          item.classList.toggle('open');
        }
      });
    }
  });
}

// 3. Before / After Interactive Slider
function initBeforeAfterSlider() {
  const container = document.querySelector('.before-after-container');
  if (!container) return;

  const afterImg = container.querySelector('.ba-after');
  const handle = container.querySelector('.ba-handle');
  if (!afterImg || !handle) return;

  let isDragging = false;

  function updateSlider(xPos) {
    const rect = container.getBoundingClientRect();
    let pos = ((xPos - rect.left) / rect.width) * 100;
    if (pos < 0) pos = 0;
    if (pos > 100) pos = 100;

    afterImg.style.clipPath = `inset(0 0 0 ${pos}%)`;
    handle.style.left = `${pos}%`;
  }

  function onMove(e) {
    if (!isDragging) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    updateSlider(clientX);
  }

  handle.addEventListener('mousedown', () => isDragging = true);
  window.addEventListener('mouseup', () => isDragging = false);
  window.addEventListener('mousemove', onMove);

  handle.addEventListener('touchstart', () => isDragging = true);
  window.addEventListener('touchend', () => isDragging = false);
  window.addEventListener('touchmove', onMove);

  // Click on container
  container.addEventListener('click', (e) => {
    updateSlider(e.clientX);
  });
}

// 4. FAQ Accordion
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!question || !answer) return;

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all others
      faqItems.forEach(other => {
        if (other !== item) {
          other.classList.remove('active');
          const otherAns = other.querySelector('.faq-answer');
          if (otherAns) otherAns.style.maxHeight = null;
        }
      });

      if (isActive) {
        item.classList.remove('active');
        answer.style.maxHeight = null;
      } else {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
}

// 5. Treatment Catalog Filtering
function initTreatmentFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.treatment-card');
  if (!filterBtns.length || !cards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      cards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// 6. Online Appointment Booking Form Submission
function initAppointmentBooking() {
  const form = document.querySelector('#appointment-form');
  if (!form) return;

  // Set min date to tomorrow
  const dateInput = form.querySelector('input[type="date"]');
  if (dateInput) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    dateInput.min = tomorrow.toISOString().split('T')[0];
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn ? submitBtn.innerHTML : 'Randevu Oluştur';

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'İşleniyor...';
    }

    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.success) {
        showToast('Randevu talebiniz başarıyla alındı! Kliniğimiz sizi arayarak teyit edecektir.', 'success');
        form.reset();

        // Optional WhatsApp confirmation prompt
        setTimeout(() => {
          const confirmWa = confirm('Randevu bilginizi WhatsApp üzerinden de kliniğe iletmek ister misiniz?');
          if (confirmWa) {
            const waMsg = encodeURIComponent(`Merhaba Dt. Gözde Hilal Morkoyunlu Kliniği, web sitenizden randevu oluşturdum:\n\nAd Soyad: ${payload.name}\nTelefon: ${payload.phone}\nTedavi: ${payload.treatment}\nTarih: ${payload.appointment_date} ${payload.appointment_time}`);
            window.open(`https://wa.me/905402134040?text=${waMsg}`, '_blank');
          }
        }, 1200);
      } else {
        showToast(data.error || 'Bir hata oluştu, lütfen tekrar deneyin.', 'error');
      }
    } catch (err) {
      showToast('Sunucu bağlantı hatası oluştu.', 'error');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    }
  });
}

// 7. Contact Message Form
function initContactForm() {
  const form = document.querySelector('#contact-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn ? submitBtn.innerHTML : 'Mesajı Gönder';

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Gönderiliyor...';
    }

    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.success) {
        showToast('Mesajınız başarıyla iletildi. En kısa sürede dönüş yapacağız.', 'success');
        form.reset();
      } else {
        showToast(data.error || 'Mesaj iletilemedi.', 'error');
      }
    } catch (err) {
      showToast('Sunucu hatası oluştu.', 'error');
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    }
  });
}

// 8. Patient Review Submission
function initReviewForm() {
  const form = document.querySelector('#review-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        showToast('Değerli yorumunuz kaydedildi, teşekkür ederiz!', 'success');
        form.reset();
      }
    } catch (e) {
      showToast('Yorum kaydedilemedi.', 'error');
    }
  });
}

// 9. Statistics Counter Animation
function initCounters() {
  const statNumbers = document.querySelectorAll('.stat-item strong');
  if (!statNumbers.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('counted');
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(num => observer.observe(num));
}

// Toast Helper
function showToast(message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// Modal Helper
window.openTreatmentModal = function(title, category, desc, points, imgUrl) {
  let modal = document.querySelector('#treatment-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'treatment-modal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-box">
        <button class="modal-close" onclick="closeTreatmentModal()">&times;</button>
        <img class="modal-header-img" src="" alt="">
        <div class="modal-body">
          <span class="treatment-category-badge" style="position:static; display:inline-block; margin-bottom:12px;"></span>
          <h3 id="modal-title" style="font-size:1.6rem; margin-bottom:12px; font-weight:800;"></h3>
          <p id="modal-desc" style="color:var(--light-muted); line-height:1.7; margin-bottom:20px;"></p>
          <h4 style="font-size:1.1rem; margin-bottom:10px; font-weight:700;">Tedavi Aşamaları ve Avantajları</h4>
          <div id="modal-points" class="treatment-points" style="margin-bottom:24px;"></div>
          <a href="/randevu" onclick="closeTreatmentModal()" class="btn btn-gold" style="width:100%;">Bu Tedavi İçin Randevu Al</a>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeTreatmentModal();
    });
  }

  modal.querySelector('.modal-header-img').src = imgUrl;
  modal.querySelector('.treatment-category-badge').textContent = category;
  modal.querySelector('#modal-title').textContent = title;
  modal.querySelector('#modal-desc').textContent = desc;

  const pointsContainer = modal.querySelector('#modal-points');
  pointsContainer.innerHTML = points.map(p => `
    <div class="treatment-point-item">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
      <span>${p}</span>
    </div>
  `).join('');

  modal.classList.add('active');
};

window.closeTreatmentModal = function() {
  const modal = document.querySelector('#treatment-modal');
  if (modal) modal.classList.remove('active');
};

