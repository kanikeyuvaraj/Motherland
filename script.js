/* ════════════════════════════════════════════════════
   MOTHERLAND ENGLISH SCHOOL — PREMIUM JAVASCRIPT
   GSAP + ScrollTrigger + Custom Cursor + Particles
   ════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─── Register GSAP Plugins ─── */
  gsap.registerPlugin(ScrollTrigger);

  /* ─── Page Loader ─── */
  const loader = document.getElementById('page-loader');

  window.addEventListener('load', () => {
    gsap.to(loader, {
      opacity: 0,
      duration: 0.6,
      delay: 1.6,
      ease: 'power2.out',
      onComplete: () => {
        loader.style.display = 'none';
        initPage();
      }
    });
  });

  /* ─── Scroll Progress ─── */
  const progressBar = document.getElementById('scroll-progress');
  function updateProgress() {
    const scrolled = window.scrollY;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const pct = (scrolled / total) * 100;
    progressBar.style.width = pct + '%';
  }
  window.addEventListener('scroll', updateProgress, { passive: true });

  /* ─── Custom Cursor ─── */
  const cursorDot  = document.querySelector('.cursor-dot');
  const cursorRing = document.querySelector('.cursor-ring');
  let mouseX = -100, mouseY = -100;
  let ringX = -100, ringY = -100;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    gsap.to(cursorDot, { x: mouseX, y: mouseY, duration: 0.1, ease: 'none' });
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    gsap.set(cursorRing, { x: ringX, y: ringY });
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover states
  document.querySelectorAll('a, button, .fac-card, .mi, .why-card, .ach-card, .testi-card').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  document.addEventListener('mouseleave', () => {
    gsap.to([cursorDot, cursorRing], { opacity: 0, duration: 0.3 });
  });
  document.addEventListener('mouseenter', () => {
    gsap.to([cursorDot, cursorRing], { opacity: 1, duration: 0.3 });
  });

  /* ─── Particle Canvas ─── */
  function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];

    function resize() {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 1.5 + 0.3;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.speedY = -Math.random() * 0.4 - 0.1;
        this.opacity = Math.random() * 0.4 + 0.05;
        this.life = 0;
        this.maxLife = Math.random() * 300 + 100;
        // Color: gold or white
        this.isGold = Math.random() > 0.6;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life++;
        if (this.life > this.maxLife || this.y < -10) this.reset();
      }
      draw() {
        const fade = Math.min(this.life / 30, 1) * Math.min((this.maxLife - this.life) / 30, 1);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        if (this.isGold) {
          ctx.fillStyle = `rgba(199,162,72,${this.opacity * fade})`;
        } else {
          ctx.fillStyle = `rgba(248,248,245,${this.opacity * 0.4 * fade})`;
        }
        ctx.fill();
      }
    }

    for (let i = 0; i < 80; i++) {
      const p = new Particle();
      p.life = Math.random() * p.maxLife;
      particles.push(p);
    }

    let mouseParticle = { x: canvas.width / 2, y: canvas.height / 2 };
    document.addEventListener('mousemove', (e) => {
      mouseParticle.x = e.clientX;
      mouseParticle.y = e.clientY;
    });

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });
      requestAnimationFrame(animate);
    }
    animate();
  }

  /* ─── Magnetic Buttons ─── */
  function initMagneticButtons() {
    document.querySelectorAll('.magnetic-btn').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const cx = rect.left + rect.width  / 2;
        const cy = rect.top  + rect.height / 2;
        const dx = (e.clientX - cx) * 0.25;
        const dy = (e.clientY - cy) * 0.25;
        gsap.to(btn, { x: dx, y: dy, duration: 0.35, ease: 'power2.out' });
      });
      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.55, ease: 'elastic.out(1, 0.4)' });
      });
    });
  }

  /* ─── Header Scroll Behavior ─── */
  function initHeader() {
    const header = document.getElementById('header');
    function onScroll() {
      if (window.scrollY > 60) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ─── Hamburger / Mobile Menu ─── */
  function initMobileMenu() {
    const btn  = document.getElementById('hamburger');
    const menu = document.getElementById('mobile-menu');
    let open = false;

    btn.addEventListener('click', () => {
      open = !open;
      btn.classList.toggle('active', open);
      menu.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', open);
    });

    document.querySelectorAll('.mob-link').forEach(link => {
      link.addEventListener('click', () => {
        open = false;
        btn.classList.remove('active');
        menu.classList.remove('open');
        btn.setAttribute('aria-expanded', false);
      });
    });
  }

  /* ─── Smooth Scroll for nav links ─── */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', (e) => {
        const target = document.querySelector(a.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        const offset = 88;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      });
    });
  }

  /* ─── Mouse Parallax for Hero ─── */
  function initHeroParallax() {
    const content = document.getElementById('hero-content');
    const floats  = document.querySelectorAll('.float-el');
    if (!content) return;

    let ticking = false;
    document.addEventListener('mousemove', (e) => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const xPct = (e.clientX / window.innerWidth  - 0.5);
        const yPct = (e.clientY / window.innerHeight - 0.5);
        gsap.to(content, { x: xPct * 10, y: yPct * 6, duration: 1.2, ease: 'power2.out' });
        floats.forEach((el, i) => {
          const depth = (i + 1) * 0.5;
          gsap.to(el, { x: xPct * 20 * depth, y: yPct * 14 * depth, duration: 1.4 + i * 0.2, ease: 'power2.out' });
        });
        ticking = false;
      });
    });
  }

  /* ─── GSAP ScrollTrigger Animations ─── */
  function initScrollAnimations() {
    // Generic reveal-up (stagger)
    gsap.utils.toArray('.reveal-up').forEach(el => {
      const delay = parseFloat(el.style.getPropertyValue('--d') || '0');
      gsap.fromTo(el,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0,
          duration: 0.9,
          delay: delay,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    // Reveal cards
    gsap.utils.toArray('.reveal-card').forEach(el => {
      const delay = parseFloat(el.style.getPropertyValue('--d') || '0');
      gsap.fromTo(el,
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0,
          duration: 0.8, delay, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none none' }
        }
      );
    });

    // Reveal left
    gsap.utils.toArray('.reveal-left').forEach(el => {
      gsap.fromTo(el,
        { opacity: 0, x: -50 },
        {
          opacity: 1, x: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 80%', toggleActions: 'play none none none' }
        }
      );
    });

    // Reveal right
    gsap.utils.toArray('.reveal-right').forEach(el => {
      gsap.fromTo(el,
        { opacity: 0, x: 50 },
        {
          opacity: 1, x: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 80%', toggleActions: 'play none none none' }
        }
      );
    });

    // Section headers — elegant fade
    document.querySelectorAll('.sec-head').forEach(head => {
      const children = head.querySelectorAll('.eyebrow, .sec-title, .sec-desc');
      gsap.fromTo(children,
        { opacity: 0, y: 24 },
        {
          opacity: 1, y: 0, stagger: 0.15, duration: 0.85, ease: 'power3.out',
          scrollTrigger: { trigger: head, start: 'top 85%', toggleActions: 'play none none none' }
        }
      );
    });

    // Timeline items
    gsap.utils.toArray('.tl-item').forEach((item, i) => {
      gsap.fromTo(item,
        { opacity: 0, x: -20 },
        {
          opacity: 1, x: 0, duration: 0.6, delay: i * 0.12, ease: 'power2.out',
          scrollTrigger: { trigger: item, start: 'top 88%', toggleActions: 'play none none none' }
        }
      );
    });

    // Academic timeline items
    gsap.utils.toArray('.acad-item').forEach((item, i) => {
      gsap.fromTo(item,
        { opacity: 0, x: -30 },
        {
          opacity: 1, x: 0, duration: 0.75, delay: i * 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: item, start: 'top 88%', toggleActions: 'play none none none' }
        }
      );
    });

    // Value pills stagger
    const pills = document.querySelectorAll('.val-pill');
    if (pills.length) {
      gsap.fromTo(pills,
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1, scale: 1, stagger: 0.06, duration: 0.5, ease: 'back.out(1.7)',
          scrollTrigger: { trigger: '.values-row', start: 'top 85%', toggleActions: 'play none none none' }
        }
      );
    }
  }

  /* ─── Counter Animation ─── */
  function initCounters() {
    // Hero hero counters (simpler — just run on load after delay)
    document.querySelectorAll('.counter-h').forEach(el => {
      const target  = parseInt(el.dataset.target);
      const suffix  = el.dataset.suffix || '';
      el.textContent = '0' + suffix;
      gsap.to({ val: 0 }, {
        val: target, duration: 2.2, delay: 3,
        ease: 'power2.out',
        onUpdate: function () {
          el.textContent = Math.round(this.targets()[0].val) + suffix;
        }
      });
    });

    // Scroll-triggered counters
    document.querySelectorAll('.counter').forEach(el => {
      const target  = parseInt(el.dataset.target);
      const suffix  = el.dataset.suffix || '';
      let started = false;

      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        onEnter: () => {
          if (started) return;
          started = true;
          gsap.to({ val: 0 }, {
            val: target, duration: 2, ease: 'power2.out',
            onUpdate: function () {
              el.textContent = Math.round(this.targets()[0].val) + suffix;
            }
          });
        }
      });
    });
  }

  /* ─── Testimonials Swiper ─── */
  function initSwiper() {
    new Swiper('.testi-swiper', {
      slidesPerView: 1,
      spaceBetween: 24,
      loop: true,
      autoplay: { delay: 5000, disableOnInteraction: false },
      pagination: { el: '.swiper-pagination', clickable: true },
      navigation: { prevEl: '.swiper-button-prev', nextEl: '.swiper-button-next' },
      breakpoints: {
        680: { slidesPerView: 2 },
        1024: { slidesPerView: 3 }
      },
      effect: 'slide'
    });
  }

  /* ─── Enquiry Form ─── */
  function initForm() {
    const form    = document.getElementById('enq-form');
    const success = document.getElementById('form-ok');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      // Simple client-side validation
      const required = form.querySelectorAll('[required]');
      let valid = true;
      required.forEach(field => {
        if (!field.value.trim()) { field.style.borderColor = '#c0392b'; valid = false; }
        else { field.style.borderColor = ''; }
      });
      if (!valid) return;
      // Simulate submission
      const btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      btn.style.opacity = '0.7';
      setTimeout(() => {
        form.reset();
        btn.disabled = false;
        btn.style.opacity = '1';
        success.classList.add('show');
        setTimeout(() => success.classList.remove('show'), 5000);
      }, 1200);
    });

    // Clear error styling on input
    form.querySelectorAll('input, select, textarea').forEach(field => {
      field.addEventListener('input', () => { field.style.borderColor = ''; });
    });
  }

  /* ─── Footer Year ─── */
  function initYear() {
    const el = document.getElementById('yr');
    if (el) el.textContent = new Date().getFullYear();
  }

  /* ─── Parallax on facility cards ─── */
  function initFacilityParallax() {
    document.querySelectorAll('.fac-card').forEach(card => {
      const img = card.querySelector('.fc-img');
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const xPct = (e.clientX - rect.left) / rect.width  - 0.5;
        const yPct = (e.clientY - rect.top)  / rect.height - 0.5;
        gsap.to(img, { x: xPct * 12, y: yPct * 8, duration: 0.6, ease: 'power2.out' });
      });
      card.addEventListener('mouseleave', () => {
        gsap.to(img, { x: 0, y: 0, duration: 0.8, ease: 'power2.out' });
      });
    });
  }

  /* ─── Masonry item parallax ─── */
  function initMasonryParallax() {
    document.querySelectorAll('.mi').forEach(item => {
      const img = item.querySelector('.mi-bg');
      item.addEventListener('mousemove', (e) => {
        const rect = item.getBoundingClientRect();
        const xPct = (e.clientX - rect.left) / rect.width  - 0.5;
        const yPct = (e.clientY - rect.top)  / rect.height - 0.5;
        gsap.to(img, { x: xPct * 10, y: yPct * 6, duration: 0.5, ease: 'power2.out' });
      });
      item.addEventListener('mouseleave', () => {
        gsap.to(img, { x: 0, y: 0, duration: 0.7, ease: 'power2.out' });
      });
    });
  }

  /* ─── Page Transition (soft) ─── */
  function initPageTransition() {
    // Fade out when leaving (links to external)
    document.querySelectorAll('a[target="_blank"]').forEach(a => {
      a.addEventListener('click', () => {
        // Nothing special needed for external links
      });
    });
  }

  /* ─── Active Nav Link Highlighting ─── */
  function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks  = document.querySelectorAll('.nav-link');

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    }, { rootMargin: '-40% 0px -50% 0px' });

    sections.forEach(s => io.observe(s));
  }

  /* ─── Subtle background gradient follows mouse ─── */
  function initBgFollowMouse() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    document.addEventListener('mousemove', (e) => {
      const xPct = (e.clientX / window.innerWidth * 100).toFixed(1);
      const yPct = (e.clientY / window.innerHeight * 100).toFixed(1);
      const overlay = hero.querySelector('.hero-overlay');
      if (overlay) {
        gsap.to(overlay, {
          background: `radial-gradient(ellipse at ${xPct}% ${yPct}%, rgba(199,162,72,0.07) 0%, transparent 55%), radial-gradient(ellipse at ${100 - xPct}% ${100 - yPct}%, rgba(62,107,72,0.06) 0%, transparent 55%)`,
          duration: 2, ease: 'none'
        });
      }
    });
  }

  /* ─── Init Everything ─── */
  function initPage() {
    initParticles();
    initMagneticButtons();
    initHeader();
    initMobileMenu();
    initSmoothScroll();
    initHeroParallax();
    initScrollAnimations();
    initCounters();
    initSwiper();
    initForm();
    initYear();
    initFacilityParallax();
    initMasonryParallax();
    initPageTransition();
    initActiveNav();
    initBgFollowMouse();

    // Refresh ScrollTrigger after init
    setTimeout(() => ScrollTrigger.refresh(), 200);
  }

  // Active nav link style
  const style = document.createElement('style');
  style.textContent = `.nav-link.active { color: var(--gold) !important; } .nav-link.active::after { transform: scaleX(1) !important; }`;
  document.head.appendChild(style);

})();
