const preloader = document.getElementById('preloader');
const header = document.getElementById('siteHeader');
const navToggle = document.getElementById('navToggle');
const siteNav = document.getElementById('siteNav');
const year = document.getElementById('year');
const heroBg = document.querySelector('.hero__bg');

window.addEventListener('load', () => {
  setTimeout(() => {
    preloader?.classList.add('hidden');
    document.querySelectorAll('.reveal-on-load').forEach((el) => el.classList.add('visible'));
  }, 420);
});

if (year) year.textContent = new Date().getFullYear();

function handleHeader() {
  header?.classList.toggle('scrolled', window.scrollY > 40);

  if (heroBg) {
    const offset = Math.min(window.scrollY * 0.16, 110);
    heroBg.style.transform = `translateY(${offset}px) scale(1.02)`;
  }
}
window.addEventListener('scroll', handleHeader, { passive: true });
handleHeader();

navToggle?.addEventListener('click', () => {
  const isOpen = siteNav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
});

document.querySelectorAll('.site-nav a').forEach((link) => {
  link.addEventListener('click', () => {
    siteNav.classList.remove('open');
    navToggle?.setAttribute('aria-expanded', 'false');
  });
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.16 });

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

const counters = document.querySelectorAll('[data-counter]');
let countersStarted = false;

function animateCounter(el) {
  const target = Number(el.dataset.counter);
  const duration = 1400;
  const start = performance.now();

  function update(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(target * eased);
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting && !countersStarted) {
      countersStarted = true;
      counters.forEach(animateCounter);
      counterObserver.disconnect();
    }
  });
}, { threshold: 0.4 });

const stats = document.querySelector('.hero__stats');
if (stats && counters.length) counterObserver.observe(stats);

const sections = [...document.querySelectorAll('main section[id]')];
const navLinks = [...document.querySelectorAll('.site-nav a')];

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const id = entry.target.getAttribute('id');
    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
    });
  });
}, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });

sections.forEach((section) => sectionObserver.observe(section));
