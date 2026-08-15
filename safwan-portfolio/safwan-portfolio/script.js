document.addEventListener('DOMContentLoaded', () => {

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Mobile nav toggle ---- */
  const navToggle = document.getElementById('navToggle');
  const sidebar = document.getElementById('sidebar');
  const navOverlay = document.getElementById('navOverlay');

  function closeNav() {
    sidebar.classList.remove('open');
    navOverlay.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }
  function toggleNav() {
    const isOpen = sidebar.classList.toggle('open');
    navOverlay.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
  }

  navToggle.addEventListener('click', toggleNav);
  navOverlay.addEventListener('click', closeNav);

  /* ---- Nav links: smooth scroll + close mobile menu ---- */
  const navLinks = Array.from(document.querySelectorAll('.nav-link'));

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
        history.replaceState(null, '', targetId);
      }
      closeNav();
    });
  });

  /* ---- Scrollspy ---- */
  const sections = Array.from(document.querySelectorAll('.section[id]'));

  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = entry.target.getAttribute('id');
      const link = navLinks.find(l => l.getAttribute('href') === '#' + id);
      if (!link) return;
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    });
  }, { rootMargin: '-20% 0px -65% 0px', threshold: 0 });

  sections.forEach(sec => spyObserver.observe(sec));

});
