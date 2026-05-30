/* ====================================
   WX-2077 — Interactive Scripts
   ==================================== */

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initNavScroll();
  initMobileMenu();
  initTypingEffect();
  initParticles();
  initCounters();
  initCommandsFilter();
  initAccordion();
  initBackToTop();
});

/* --- Scroll Reveal (Intersection Observer) --- */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal--visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}

/* --- Nav Background on Scroll --- */
function initNavScroll() {
  const nav = document.getElementById('nav');
  if (!nav) return;

  const onScroll = () => {
    if (window.scrollY > 40) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* --- Mobile Menu --- */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const menu = document.getElementById('nav-menu');
  const overlay = document.getElementById('nav-overlay');
  if (!hamburger || !menu) return;

  const toggle = () => {
    const isOpen = menu.classList.toggle('nav__menu--open');
    hamburger.classList.toggle('nav__hamburger--active');
    if (overlay) overlay.classList.toggle('nav__overlay--visible');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  const close = () => {
    menu.classList.remove('nav__menu--open');
    hamburger.classList.remove('nav__hamburger--active');
    if (overlay) overlay.classList.remove('nav__overlay--visible');
    document.body.style.overflow = '';
  };

  hamburger.addEventListener('click', toggle);
  if (overlay) overlay.addEventListener('click', close);

  // Close on link click
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', close);
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });
}

/* --- Typing Effect --- */
function initTypingEffect() {
  const el = document.getElementById('typing-text');
  if (!el) return;

  const phrases = [
    'O OVERLORD DOS BOTS!!!',
    'PROTEÇÃO TOTAL DO SERVIDOR',
    'MODERAÇÃO AUTOMÁTICA',
    'MÚSICA SEM LIMITES',
    'OBEDEÇA AO MESTRE!!!'
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let timeout;

  function type() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      el.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
    } else {
      el.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
    }

    let delay = isDeleting ? 40 : 70;

    if (!isDeleting && charIndex === currentPhrase.length) {
      delay = 2200; // Pause at end
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      delay = 400; // Pause before next phrase
    }

    timeout = setTimeout(type, delay);
  }

  type();
}

/* --- Particle System (Canvas) --- */
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let animFrame;
  let w, h;

  const colors = [
    { r: 0, g: 229, b: 255 },    // cyan
    { r: 255, g: 215, b: 0 },     // gold
    { r: 217, g: 70, b: 239 },    // magenta
  ];

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    w = canvas.width = rect.width;
    h = canvas.height = rect.height;
  }

  function createParticle() {
    const color = colors[Math.floor(Math.random() * colors.length)];
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.3 - 0.15,
      radius: Math.random() * 2.5 + 0.5,
      alpha: Math.random() * 0.5 + 0.1,
      color,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.02 + 0.005,
    };
  }

  function init() {
    resize();
    const count = Math.min(Math.floor(w * h / 12000), 100);
    particles = Array.from({ length: count }, createParticle);
  }

  function animate() {
    ctx.clearRect(0, 0, w, h);

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.pulse += p.pulseSpeed;

      // Wrap around edges
      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;
      if (p.y < -10) p.y = h + 10;
      if (p.y > h + 10) p.y = -10;

      const currentAlpha = p.alpha * (0.6 + 0.4 * Math.sin(p.pulse));
      const { r, g, b } = p.color;

      // Glow
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius * 4, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r},${g},${b},${currentAlpha * 0.15})`;
      ctx.fill();

      // Core
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r},${g},${b},${currentAlpha})`;
      ctx.fill();
    });

    animFrame = requestAnimationFrame(animate);
  }

  init();
  animate();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resize();
      // Adjust particle count
      const count = Math.min(Math.floor(w * h / 12000), 100);
      while (particles.length < count) particles.push(createParticle());
      while (particles.length > count) particles.pop();
    }, 250);
  });

  // Pause when not visible
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (!animFrame) animate();
      } else {
        cancelAnimationFrame(animFrame);
        animFrame = null;
      }
    });
  });
  observer.observe(canvas);
}

/* --- Animated Counters --- */
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

function animateCounter(el) {
  const target = parseInt(el.dataset.count, 10);
  const suffix = el.dataset.suffix || '';
  const duration = 2000;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.floor(eased * target);

    el.textContent = value + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = target + suffix;
    }
  }

  requestAnimationFrame(update);
}

/* --- Commands Filter & Tabs --- */
function initCommandsFilter() {
  const tabs = document.querySelectorAll('.commands__tab');
  const searchInput = document.getElementById('command-search');
  const cards = document.querySelectorAll('.command-card');
  if (!tabs.length && !searchInput) return;

  let activeCategory = 'todos';

  function filterCards() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

    cards.forEach(card => {
      const category = card.dataset.category || '';
      const text = card.textContent.toLowerCase();

      const matchesCategory = activeCategory === 'todos' || category === activeCategory;
      const matchesSearch = !query || text.includes(query);

      card.dataset.hidden = !(matchesCategory && matchesSearch);
    });
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('commands__tab--active'));
      tab.classList.add('commands__tab--active');
      activeCategory = tab.dataset.filter || 'todos';
      filterCards();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', filterCards);
  }
}

/* --- Accordion --- */
function initAccordion() {
  const triggers = document.querySelectorAll('.accordion__trigger');
  if (!triggers.length) return;

  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.accordion__item');
      const isOpen = item.classList.contains('accordion__item--open');

      // Close all
      document.querySelectorAll('.accordion__item--open').forEach(openItem => {
        openItem.classList.remove('accordion__item--open');
      });

      // Toggle current
      if (!isOpen) {
        item.classList.add('accordion__item--open');
      }
    });
  });
}

/* --- Back To Top --- */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      btn.classList.add('back-to-top--visible');
    } else {
      btn.classList.remove('back-to-top--visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
