/**
 * Sesalie Bawanya — Portfolio
 * main.js — Interactivity, Animations, UX
 */

/* ── Footer Year ── */
const yearEl = document.getElementById('footer-year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ── Navbar Scroll Behavior ── */
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const current = window.scrollY;
  if (current > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  lastScroll = current;
}, { passive: true });

/* ── Mobile Menu Toggle ── */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

hamburger.addEventListener('click', () => {
  const isOpen = hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', String(isOpen));
  mobileMenu.setAttribute('aria-hidden', String(!isOpen));
});

// Close mobile menu on link click
document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
  });
});

// Close on outside click
document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target) && mobileMenu.classList.contains('open')) {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
  }
});

/* ── Intersection Observer — Reveal Animations ── */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
);

document.querySelectorAll(
  '.reveal-up, .reveal-left, .reveal-right, .reveal-card'
).forEach(el => revealObserver.observe(el));

/* ── Active Nav Link Highlight on Scroll ── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          link.classList.toggle('nav-link--active', href === `#${id}`);
        });
      }
    });
  },
  { threshold: 0.3, rootMargin: '-80px 0px 0px 0px' }
);

sections.forEach(section => sectionObserver.observe(section));

/* ── Contact Form Submit Handler ── */
const form = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = document.getElementById('form-submit');
    const originalContent = submitBtn.innerHTML;

    // Validate
    const name    = document.getElementById('form-name').value.trim();
    const email   = document.getElementById('form-email').value.trim();
    const subject = document.getElementById('form-subject').value.trim();
    const message = document.getElementById('form-message').value.trim();

    if (!name || !email || !subject || !message) {
      formStatus.textContent = '⚠ Please fill in all fields.';
      formStatus.className = 'form-note error';
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      formStatus.textContent = '⚠ Please enter a valid email address.';
      formStatus.className = 'form-note error';
      return;
    }

    // Simulate sending (replace with actual backend/emailjs integration)
    submitBtn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="animation: spin 1s linear infinite;" aria-hidden="true">
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
      </svg>
      <span>Sending…</span>`;
    submitBtn.disabled = true;

    // Add spinning keyframe
    if (!document.getElementById('spin-style')) {
      const style = document.createElement('style');
      style.id = 'spin-style';
      style.textContent = '@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }';
      document.head.appendChild(style);
    }

    // Configure your Formspree Form ID here
    // Create a free account at https://formspree.io/ to get your Form ID!
    const FORMSPREE_FORM_ID = 'YOUR_FORMSPREE_FORM_ID';

    if (FORMSPREE_FORM_ID && FORMSPREE_FORM_ID !== 'YOUR_FORMSPREE_FORM_ID') {
      // Real submission in the background using Formspree API
      try {
        const response = await fetch(`https://formspree.io/f/${FORMSPREE_FORM_ID}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            name: name,
            email: email,
            subject: subject,
            message: message
          })
        });

        if (response.ok) {
          formStatus.textContent = `✓ Message sent successfully! Thanks, ${name}. I'll get back to you soon.`;
          formStatus.className = 'form-note success';
          form.reset();
        } else {
          const data = await response.json();
          formStatus.textContent = `⚠ Error: ${data.errors ? data.errors.map(err => err.message).join(', ') : 'Failed to send message.'}`;
          formStatus.className = 'form-note error';
        }
      } catch (error) {
        formStatus.textContent = '⚠ Network error. Please try again later or contact me via links above.';
        formStatus.className = 'form-note error';
      } finally {
        submitBtn.innerHTML = originalContent;
        submitBtn.disabled = false;
      }
    } else {
      // Graceful local fallback (simulation + mailto link)
      await new Promise(resolve => setTimeout(resolve, 1500));

      formStatus.textContent = `✓ Opening your email client to send... Thanks, ${name}!`;
      formStatus.className = 'form-note success';
      form.reset();

      submitBtn.innerHTML = originalContent;
      submitBtn.disabled = false;

      const mailtoLink = `mailto:sesaliebawanya4@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Hi Sesalie,\n\n${message}\n\n— ${name} (${email})`)}`;
      window.location.href = mailtoLink;
    }
  });
}

/* ── Smooth scroll for all anchor links ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const targetId = anchor.getAttribute('href');
    if (targetId === '#') return;
    const targetEl = document.querySelector(targetId);
    if (targetEl) {
      e.preventDefault();
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ── Tilt Effect on Project Cards ── */
const cards = document.querySelectorAll('.project-card, .skill-card');

cards.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ── Cursor Glow Effect (Desktop only) ── */
if (window.matchMedia('(pointer: fine)').matches) {
  const cursor = document.createElement('div');
  cursor.style.cssText = `
    position: fixed;
    width: 350px;
    height: 350px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255, 0, 127, 0.04) 0%, transparent 70%);
    pointer-events: none;
    z-index: 9999;
    transform: translate(-50%, -50%);
    transition: left 0.18s ease, top 0.18s ease;
  `;
  document.body.appendChild(cursor);

  document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top  = e.clientY + 'px';
  }, { passive: true });
}

/* ── Typewriter effect for hero subtitle ── */
(function () {
  const roles = [
    'Data Science Undergraduate',
    'Full-Stack Developer',
    'AI/ML Engineer',
    'React Native Developer',
  ];
  const targetEl = document.querySelector('.hero-subtitle .highlight');
  if (!targetEl) return;

  let roleIdx  = 0;
  let charIdx  = 0;
  let deleting = false;
  let paused   = false;

  const originalText = targetEl.textContent;

  // Replace with cursor span
  targetEl.innerHTML = `<span class="typewriter-text"></span><span class="typewriter-cursor">|</span>`;
  const textEl   = targetEl.querySelector('.typewriter-text');
  const cursorEl = targetEl.querySelector('.typewriter-cursor');

  const cursorStyle = document.createElement('style');
  cursorStyle.textContent = `
    .typewriter-cursor {
      opacity: 1;
      animation: blink-cursor 0.8s step-end infinite;
      color: var(--clr-cyan);
      font-weight: 300;
    }
    @keyframes blink-cursor { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
  `;
  document.head.appendChild(cursorStyle);

  function type() {
    if (paused) { setTimeout(type, 100); return; }

    const current = roles[roleIdx];

    if (deleting) {
      charIdx--;
      textEl.textContent = current.slice(0, charIdx);
      if (charIdx === 0) {
        deleting = false;
        roleIdx  = (roleIdx + 1) % roles.length;
        setTimeout(type, 500);
        return;
      }
      setTimeout(type, 50);
    } else {
      charIdx++;
      textEl.textContent = current.slice(0, charIdx);
      if (charIdx === current.length) {
        deleting = true;
        setTimeout(type, 2200);
        return;
      }
      setTimeout(type, 80);
    }
  }

  // Start after hero animation settles
  setTimeout(type, 1400);
})();

/* ── Particle / Dot trail on hero ── */
(function () {
  const hero = document.querySelector('.hero');
  if (!hero || !window.matchMedia('(pointer: fine)').matches) return;

  hero.addEventListener('mousemove', (e) => {
    const dot = document.createElement('span');
    const rect = hero.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    dot.style.cssText = `
      position: absolute;
      width: 4px; height: 4px;
      border-radius: 50%;
      background: rgba(255, 0, 127, 0.6);
      left: ${x}px; top: ${y}px;
      pointer-events: none;
      z-index: 1;
      transform: translate(-50%, -50%);
      transition: opacity 0.8s, transform 0.8s;
    `;
    hero.appendChild(dot);

    requestAnimationFrame(() => {
      dot.style.opacity = '0';
      dot.style.transform = `translate(-50%, -50%) scale(3)`;
    });

    setTimeout(() => dot.remove(), 900);
  }, { passive: true });
})();

console.log(`
  ╔═══════════════════════════════════════╗
  ║  Sesalie Bawanya — Portfolio v1.0    ║
  ║  Data Science & Full-Stack Developer  ║
  ║  Built with passion & precision 💖    ║
  ╚═══════════════════════════════════════╝
`);
