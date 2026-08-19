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

});
