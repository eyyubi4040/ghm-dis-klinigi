// GHM Diş Kliniği - İnteraktif Gülüş Tasarımı (Before & After Slider)
document.addEventListener("DOMContentLoaded", function () {
  const container = document.querySelector(".ghm-ba-wrapper");
  if (!container) return;

  const slider = container.querySelector(".ghm-ba-range");
  const afterWrap = container.querySelector(".ghm-ba-after-wrap");
  const divider = container.querySelector(".ghm-ba-divider");

  if (!slider || !afterWrap || !divider) return;

  function updateSlider(val) {
    afterWrap.style.clipPath = `polygon(0 0, ${val}% 0, ${val}% 100%, 0 100%)`;
    divider.style.left = `${val}%`;
  }

  slider.addEventListener("input", function (e) {
    updateSlider(e.target.value);
  });

  // Smooth drag support for mouse & touch
  let isDragging = false;

  function getPosition(e) {
    const rect = container.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    let pos = ((clientX - rect.left) / rect.width) * 100;
    if (pos < 0) pos = 0;
    if (pos > 100) pos = 100;
    return pos;
  }

  container.addEventListener("mousedown", function () { isDragging = true; });
  window.addEventListener("mouseup", function () { isDragging = false; });
  window.addEventListener("mousemove", function (e) {
    if (!isDragging) return;
    const pos = getPosition(e);
    slider.value = pos;
    updateSlider(pos);
  });

  container.addEventListener("touchstart", function () { isDragging = true; }, { passive: true });
  window.addEventListener("touchend", function () { isDragging = false; });
  window.addEventListener("touchmove", function (e) {
    if (!isDragging) return;
    const pos = getPosition(e);
    slider.value = pos;
    updateSlider(pos);
  }, { passive: true });
});
