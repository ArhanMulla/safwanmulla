document.addEventListener('DOMContentLoaded', () => {

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navMobile = document.getElementById('navMobile');

  /* ---- Solid nav on scroll ---- */
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 60);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---- Mobile menu toggle ---- */
  navToggle.addEventListener('click', () => {
    const isOpen = navMobile.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  /* ---- Smooth scroll + close mobile menu ---- */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetEl = document.querySelector(link.getAttribute('href'));
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      }
      navMobile.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---- Certificate carousel ---- */
  const certViewport = document.querySelector('.cert-carousel__viewport');
  const certTrack = document.getElementById('certTrack');
  const certSlides = certTrack ? Array.from(certTrack.children) : [];
  const certPrev = document.getElementById('certPrev');
  const certNext = document.getElementById('certNext');
  const certCounterNum = document.getElementById('certCounterNum');
  const certCounterTotal = document.getElementById('certCounterTotal');
  let certIndex = 0;

  function updateCertCarousel() {
    if (!certSlides.length) return;
    const slide = certSlides[certIndex];
    const viewportWidth = certViewport.offsetWidth;
    const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
    const offset = viewportWidth / 2 - slideCenter;
    certTrack.style.transform = `translateX(${offset}px)`;

    certSlides.forEach((s, i) => s.classList.toggle('is-active', i === certIndex));
    certCounterNum.textContent = certIndex + 1;
    certPrev.disabled = certIndex === 0;
    certNext.disabled = certIndex === certSlides.length - 1;
  }

  function goToCert(i) {
    certIndex = Math.max(0, Math.min(certSlides.length - 1, i));
    updateCertCarousel();
  }

  if (certSlides.length) {
    if (certCounterTotal) certCounterTotal.textContent = certSlides.length;

    certPrev.addEventListener('click', () => goToCert(certIndex - 1));
    certNext.addEventListener('click', () => goToCert(certIndex + 1));

    certSlides.forEach((s, i) => {
      s.addEventListener('click', () => goToCert(i));
      s.style.cursor = 'pointer';
    });

    certViewport.setAttribute('tabindex', '0');
    certViewport.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') goToCert(certIndex - 1);
      if (e.key === 'ArrowRight') goToCert(certIndex + 1);
    });

    let touchStartX = 0;
    certViewport.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
    certViewport.addEventListener('touchend', (e) => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) goToCert(certIndex + (diff > 0 ? 1 : -1));
    }, { passive: true });

    window.addEventListener('resize', updateCertCarousel);
    updateCertCarousel();
  }

  /* ---- Lightbox ---- */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');

  function openLightbox(src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    lightboxCaption.textContent = alt || '';
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
  });

  // Carousel slide images: if the slide is already active/centered, open the
  // full image; otherwise let the click bubble up to center the slide first.
  document.querySelectorAll('.cert-slide__img').forEach(img => {
    img.addEventListener('click', (e) => {
      const slide = img.closest('.cert-slide');
      if (slide && slide.classList.contains('is-active')) {
        e.stopPropagation();
        openLightbox(img.src, img.alt);
      }
    });
  });

  // Standalone certificate images: always open directly.
  document.querySelectorAll('.feature-card__img, .honor-card img, .edu-card__img').forEach(img => {
    img.addEventListener('click', () => openLightbox(img.src, img.alt));
  });

});
