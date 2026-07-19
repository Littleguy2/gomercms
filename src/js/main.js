// Gomer Faith Ministries — shared site behaviour
document.addEventListener('DOMContentLoaded', () => {

  /* Mobile nav toggle */
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      links.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }));
  }

  /* Mark current nav link */
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === path) a.setAttribute('aria-current', 'page');
  });

  /* Scroll reveal (skipped entirely for reduced-motion users) */
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reveals = document.querySelectorAll('.reveal');
  if (prefersReduced) {
    reveals.forEach(el => el.classList.add('is-visible'));
  } else if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('is-visible'));
  }

  /* Generic "demo" form handling — prayer request, contact, newsletter, volunteer */
  document.querySelectorAll('form[data-demo-form]').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      form.style.display = 'none';
      const confirmEl = document.querySelector(form.dataset.confirmTarget);
      if (confirmEl) {
        confirmEl.classList.add('is-visible');
        confirmEl.setAttribute('tabindex', '-1');
        confirmEl.focus();
      }
    });
  });

  /* Sermon / resource tag filter */
  const filterButtons = document.querySelectorAll('.tag-filter button');
  const filterCards = document.querySelectorAll('[data-tags]');
  if (filterButtons.length && filterCards.length) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        const tag = btn.dataset.tag;
        filterCards.forEach(card => {
          const tags = card.dataset.tags.split(',');
          card.style.display = (tag === 'all' || tags.includes(tag)) ? '' : 'none';
        });
      });
    });
  }

  /* Give page: one-time / recurring toggle */
  const giveToggle = document.querySelectorAll('[data-give-toggle]');
  if (giveToggle.length) {
    giveToggle.forEach(btn => {
      btn.addEventListener('click', () => {
        giveToggle.forEach(b => { b.classList.remove('is-active'); b.setAttribute('aria-pressed', 'false'); });
        btn.classList.add('is-active');
        btn.setAttribute('aria-pressed', 'true');
        const label = document.querySelector('[data-give-frequency-label]');
        if (label) label.textContent = btn.dataset.giveToggle === 'recurring' ? 'monthly' : 'one time';
      });
    });
  }
});
