document.addEventListener('DOMContentLoaded', () => {

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const topnav = document.getElementById('topnav');
  const masthead = document.querySelector('.masthead');

  /* ---- Show top nav after scrolling past masthead ---- */
  const mastheadObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      topnav.classList.toggle('visible', !entry.isIntersecting);
    });
  }, { rootMargin: '-58px 0px 0px 0px', threshold: 0 });
  mastheadObserver.observe(masthead);

  /* ---- Mobile dropdown toggle ---- */
  const navToggle = document.getElementById('navToggle');
  const navDropdown = document.getElementById('navDropdown');

  navToggle.addEventListener('click', () => {
    const isOpen = navDropdown.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  /* ---- Smooth scroll + close dropdown on nav click ---- */
  document.querySelectorAll('.topnav__links a, .topnav__dropdown a').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetEl = document.querySelector(link.getAttribute('href'));
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      }
      navDropdown.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---- Scrollspy ---- */
  const sections = Array.from(document.querySelectorAll('.section[id]'));
  const topLinks = Array.from(document.querySelectorAll('.topnav__links a'));

  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.getAttribute('id');
      topLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + id));
    });
  }, { rootMargin: '-20% 0px -65% 0px', threshold: 0 });

  sections.forEach(sec => spyObserver.observe(sec));

  window.addEventListener('scroll', () => {
    const nearBottom = window.innerHeight + window.scrollY >= document.body.scrollHeight - 4;
    if (nearBottom) {
      topLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#contact'));
    }
  }, { passive: true });

});
