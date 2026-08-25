// ===== R&T BEAUTY HUB - ANIMATIONS =====

(function() {
  'use strict';

  // ===== CUSTOM CURSOR =====
  function initCustomCursor() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const dot = document.createElement('div');
    dot.className = 'cursor-dot';
    document.body.appendChild(dot);

    const ring = document.createElement('div');
    ring.className = 'cursor-ring';
    document.body.appendChild(ring);

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + 'px';
      dot.style.top = mouseY + 'px';
    });

    function animateRing() {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      ring.style.left = ringX + 'px';
      ring.style.top = ringY + 'px';
      requestAnimationFrame(animateRing);
    }
    animateRing();

    const interactives = 'a, button, input, select, textarea, .product-card, .btn';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(interactives)) {
        dot.classList.add('hover');
        ring.classList.add('hover');
      }
    });

    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(interactives)) {
        dot.classList.remove('hover');
        ring.classList.remove('hover');
      }
    });

    document.addEventListener('mousedown', () => dot.classList.add('click'));
    document.addEventListener('mouseup', () => dot.classList.remove('click'));
  }

  // ===== SCROLL PROGRESS BAR =====
  function initScrollProgress() {
    const bar = document.createElement('div');
    bar.className = 'scroll-progress';
    document.body.appendChild(bar);

    window.addEventListener('scroll', () => {
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = (scrollTop / scrollHeight) * 100;
      bar.style.width = progress + '%';
    }, { passive: true });
  }

  // ===== SCROLL REVEAL =====
  function initScrollReveal() {
    const elements = document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale');
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    elements.forEach(el => observer.observe(el));
  }

  // ===== AUTO SCROLL REVEAL =====
  function initAutoScrollReveal() {
    const selectors = ['.product-card', '.promo-card', '.cat-strip-item', '.brand-card'];
    const elements = document.querySelectorAll(selectors.join(', '));

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05 });

    elements.forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
      observer.observe(el);
    });
  }

  // ===== BACK TO TOP =====
  function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;

    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 400);
    });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ===== RIPPLE EFFECT =====
  function initRipple() {
    document.querySelectorAll('.btn, .product-action-btn').forEach(btn => {
      btn.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const ripple = document.createElement('span');
        ripple.style.cssText = `
          position: absolute;
          width: 20px;
          height: 20px;
          background: rgba(255,255,255,0.5);
          border-radius: 50%;
          left: ${x}px;
          top: ${y}px;
          transform: translate(-50%, -50%) scale(0);
          animation: ripple 0.5s ease-out;
          pointer-events: none;
        `;

        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);

        setTimeout(() => ripple.remove(), 500);
      });
    });
  }

  // ===== ANNOUNCEMENT BAR =====
  function initAnnouncementBar() {
    const messages = [
      'Free shipping on orders over ₦50,000',
      'Up to 50% OFF on Beauty Essentials',
      'New Arrivals Every Week',
      'Pay on Delivery Available',
      '100% Authentic Products'
    ];

    const container = document.getElementById('announcementText');
    if (!container) return;

    let currentIndex = 0;

    setInterval(() => {
      container.style.opacity = '0';
      setTimeout(() => {
        currentIndex = (currentIndex + 1) % messages.length;
        container.textContent = messages[currentIndex];
        container.style.opacity = '1';
      }, 300);
    }, 3000);
  }

  // ===== SMOOTH SCROLL =====
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  // ===== INITIALIZE =====
  document.addEventListener('DOMContentLoaded', () => {
    try { initCustomCursor(); } catch(e) {}
    try { initScrollProgress(); } catch(e) {}
    try { initScrollReveal(); } catch(e) {}
    try { initAutoScrollReveal(); } catch(e) {}
    try { initBackToTop(); } catch(e) {}
    try { initRipple(); } catch(e) {}
    try { initAnnouncementBar(); } catch(e) {}
    try { initSmoothScroll(); } catch(e) {}
  });

})();
