/* ============================================================
   DARKSUN_DENNOW — main.js
   - Particle canvas (orange/warm embers)
   - Scroll reveal
   - Nav scroll state
   - Mobile sidebar
   - Card tap-to-flip (mobile)
   ============================================================ */

// ---- CANVAS PARTICLE SYSTEM ----
(function initCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W = canvas.width  = window.innerWidth;
  let H = canvas.height = canvas.parentElement.offsetHeight || window.innerHeight;

  const PARTICLE_COUNT = 60;
  const particles = [];

  class Particle {
    constructor() { this.reset(true); }
    reset(initial) {
      this.x  = Math.random() * W;
      this.y  = initial ? Math.random() * H : H + 10;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = -(Math.random() * 0.8 + 0.3);
      this.alpha = Math.random() * 0.5 + 0.1;
      this.size  = Math.random() * 1.5 + 0.5;
      // orange or warm white
      this.color = Math.random() > 0.6
        ? `rgba(232,100,10,${this.alpha})`
        : `rgba(200,192,176,${this.alpha * 0.5})`;
      this.life   = 0;
      this.maxLife = Math.random() * 200 + 150;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.life++;
      // fade in/out
      const progress = this.life / this.maxLife;
      const fade = progress < 0.2
        ? progress / 0.2
        : progress > 0.7
          ? 1 - (progress - 0.7) / 0.3
          : 1;
      ctx.globalAlpha = this.alpha * fade;
      ctx.fillStyle   = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      if (this.life >= this.maxLife) this.reset(false);
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    ctx.globalAlpha = 1;
    particles.forEach(p => p.update());
    requestAnimationFrame(animate);
  }
  animate();

  window.addEventListener('resize', () => {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = canvas.parentElement.offsetHeight || window.innerHeight;
  });
})();

// ---- SCROLL REVEAL ----
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(el => obs.observe(el));
})();

// ---- NAV SCROLL STATE ----
(function initNav() {
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  });
})();

// ---- MOBILE SIDEBAR ----
(function initSidebar() {
  const hamburger = document.getElementById('navHamburger');
  const sidebar   = document.getElementById('sidebar');
  const overlay   = document.getElementById('sidebarOverlay');
  const closeBtn  = document.getElementById('sidebarClose');
  const links     = sidebar.querySelectorAll('a');

  function open()  { sidebar.classList.add('open'); overlay.classList.add('open'); document.body.style.overflow = 'hidden'; }
  function close() { sidebar.classList.remove('open'); overlay.classList.remove('open'); document.body.style.overflow = ''; }

  hamburger.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', close);
  links.forEach(l => l.addEventListener('click', close));
})();

// ---- CARD TAP TO FLIP (mobile) ----
(function initCardFlip() {
  const cards = document.querySelectorAll('.pcard');
  cards.forEach(card => {
    card.addEventListener('click', function() {
      // Only toggle on touch devices
      if (window.matchMedia('(hover: none)').matches) {
        this.classList.toggle('flipped');
      }
    });
  });
})();

// ---- TICKER DUPLICATION (ensure seamless loop) ----
(function initTicker() {
  const track = document.querySelector('.ticker-track');
  if (!track) return;
  // Clone children for seamless loop
  const clone = track.cloneNode(true);
  track.parentElement.appendChild(clone);
})();
