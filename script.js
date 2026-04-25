/* ═══════════════════════════════════════════════
   M Zubair Aslam — Portfolio Script
   Features: Typing, Theme, AOS, Nav, Cursor,
             Counter, Skill Bars, Form Validation
═══════════════════════════════════════════════ */

'use strict';

// ── DOM ready ──────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initCursor();
  initNavbar();
  initTyping();
  initAOS();
  initSkillBars();
  initCounters();
  initContactForm();
  initBackToTop();
  initFooterYear();
  initSmoothScroll();
});

/* ═══════════════ THEME TOGGLE ═══════════════ */
function initTheme() {
  const btn  = document.getElementById('themeToggle');
  const icon = document.getElementById('themeIcon');
  const html = document.documentElement;

  // Restore saved preference
  const saved = localStorage.getItem('theme') || 'dark';
  html.setAttribute('data-theme', saved);
  updateIcon(saved);

  btn.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next    = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateIcon(next);
  });

  function updateIcon(theme) {
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
  }
}

/* ═══════════════ CUSTOM CURSOR ═══════════════ */
function initCursor() {
  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  // Only show on devices with fine pointer (mouse)
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  let mx = 0, my = 0;
  let rx = 0, ry = 0;
  let rafId;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left  = mx + 'px';
    dot.style.top   = my + 'px';
  });

  // Smooth ring follow
  function animateRing() {
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    rafId = requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover effect on interactive elements
  const hoverEls = 'a, button, .project-card, .skill-card, .service-card';
  document.querySelectorAll(hoverEls).forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
  });
}

/* ═══════════════ STICKY NAVBAR ═══════════════ */
function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  const links     = document.querySelectorAll('.nav-link');

  // Scroll → add .scrolled class
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
    updateActiveLink();
  }, { passive: true });

  // Hamburger toggle
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  // Close mobile menu on link click
  links.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Active nav link based on scroll position
  function updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    let current = '';

    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      if (window.scrollY >= top) current = sec.getAttribute('id');
    });

    links.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }

  updateActiveLink();
}

/* ═══════════════ TYPING ANIMATION ═══════════════ */
function initTyping() {
  const el     = document.getElementById('typedText');
  if (!el) return;

  const phrases = [
    'Frontend Developer',
    'Software Engineer',
    'Problem Solver',
    'DSA Enthusiast',
    'Open to Freelance',
  ];

  let phraseIdx = 0;
  let charIdx   = 0;
  let isDeleting = false;
  let delay     = 120;

  function type() {
    const current = phrases[phraseIdx];
    el.textContent = isDeleting
      ? current.substring(0, charIdx - 1)
      : current.substring(0, charIdx + 1);

    charIdx = isDeleting ? charIdx - 1 : charIdx + 1;

    if (!isDeleting && charIdx === current.length) {
      // Finished typing — pause then delete
      delay = 1800;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      // Finished deleting — next phrase
      isDeleting = false;
      phraseIdx  = (phraseIdx + 1) % phrases.length;
      delay = 400;
    } else {
      delay = isDeleting ? 60 : 120;
    }

    setTimeout(type, delay);
  }

  type();
}

/* ═══════════════ SCROLL ANIMATIONS (AOS-like) ═══════════════ */
function initAOS() {
  const elements = document.querySelectorAll('[data-aos]');
  if (!elements.length) return;

  // Apply delay from data attribute
  elements.forEach(el => {
    const delay = el.getAttribute('data-aos-delay');
    if (delay) el.style.transitionDelay = delay + 'ms';
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('aos-animate');
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

/* ═══════════════ SKILL BARS ═══════════════ */
function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar');
  if (!bars.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar   = entry.target;
        const width = bar.getAttribute('data-width');
        const fill  = bar.querySelector('.skill-fill');
        if (fill) {
          setTimeout(() => { fill.style.width = width + '%'; }, 200);
        }
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(bar => observer.observe(bar));
}

/* ═══════════════ HERO COUNTERS ═══════════════ */
function initCounters() {
  const stats = document.querySelectorAll('.stat-num');
  if (!stats.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  stats.forEach(el => observer.observe(el));

  function animateCounter(el) {
    const target   = +el.getAttribute('data-target');
    const duration = 1400;
    const step     = 16;
    const increment = target / (duration / step);
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        el.textContent = target;
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(current);
      }
    }, step);
  }
}

/* ═══════════════ CONTACT FORM ═══════════════ */
function initContactForm() {
  const form      = document.getElementById('contactForm');
  if (!form) return;

  const submitBtn = document.getElementById('submitBtn');
  const success   = document.getElementById('formSuccess');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Simulate sending
    submitBtn.classList.add('loading');
    submitBtn.querySelector('.btn-text').style.display = 'none';
    submitBtn.querySelector('.btn-loading').style.display = 'flex';
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.querySelector('.btn-text').style.display = 'flex';
      submitBtn.querySelector('.btn-loading').style.display = 'none';
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
      success.classList.add('show');
      form.reset();

      // Hide success after 5 seconds
      setTimeout(() => success.classList.remove('show'), 5000);
    }, 1800);
  });

  // Clear errors on input
  ['name', 'email', 'message'].forEach(id => {
    const input = document.getElementById(id);
    if (input) {
      input.addEventListener('input', () => {
        input.classList.remove('error');
        const err = document.getElementById(id + 'Error');
        if (err) err.classList.remove('show');
      });
    }
  });

  function validateForm() {
    let valid = true;

    // Name
    const name = document.getElementById('name');
    if (!name.value.trim()) {
      showError(name, 'nameError'); valid = false;
    }

    // Email
    const email = document.getElementById('email');
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim() || !emailRe.test(email.value)) {
      showError(email, 'emailError'); valid = false;
    }

    // Message
    const message = document.getElementById('message');
    if (!message.value.trim()) {
      showError(message, 'messageError'); valid = false;
    }

    return valid;
  }

  function showError(input, errorId) {
    input.classList.add('error');
    const err = document.getElementById(errorId);
    if (err) err.classList.add('show');
  }
}

/* ═══════════════ BACK TO TOP ═══════════════ */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('show', window.scrollY > 500);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ═══════════════ FOOTER YEAR ═══════════════ */
function initFooterYear() {
  const el = document.getElementById('currentYear');
  if (el) el.textContent = new Date().getFullYear();
}

/* ═══════════════ SMOOTH SCROLL ═══════════════ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      const target   = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const navH   = document.getElementById('navbar')?.offsetHeight || 72;
      const top    = target.getBoundingClientRect().top + window.scrollY - navH;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ═══════════════ PROJECT CARD TILT EFFECT ═══════════════ */
document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.project-card, .service-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const x      = e.clientX - rect.left;
      const y      = e.clientY - rect.top;
      const cx     = rect.width  / 2;
      const cy     = rect.height / 2;
      const rx     = ((y - cy) / cy) * 4;
      const ry     = ((x - cx) / cx) * -4;

      card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
});

/* ═══════════════ HERO PARALLAX ═══════════════ */
document.addEventListener('DOMContentLoaded', () => {
  const orbs = document.querySelectorAll('.orb');
  if (!orbs.length) return;

  document.addEventListener('mousemove', (e) => {
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;

    orbs.forEach((orb, i) => {
      const factor = (i + 1) * 8;
      orb.style.transform = `translate(${dx * factor}px, ${dy * factor}px)`;
    });
  });
});

/* ═══════════════ NAV HIGHLIGHT INDICATOR ═══════════════ */
document.addEventListener('DOMContentLoaded', () => {
  // Add glowing line under active nav link
  const activeLink = document.querySelector('.nav-link.active');
  if (activeLink) activeLink.style.position = 'relative';
});
