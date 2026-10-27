/*
  HICHCHI H4X PORTFOLIO — VANILLA JAVASCRIPT
  Organized into small, independent features so each one is easy to customize.
*/

'use strict';

document.documentElement.classList.add('js');

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

/* Optional skill levels: enter any integer from 0–100, or leave null. */
const skillLevels = {
  'HTML5': null,
  'CSS3': null,
  'JavaScript': null,
  'Responsive Web Design': null,
  'UI/UX Design': null,
  'Git & GitHub': null
};

function initializeSkillLevels() {
  document.querySelectorAll('[data-skill]').forEach((card) => {
    const value = skillLevels[card.dataset.skill];
    const output = card.querySelector('.skill-level');
    if (Number.isFinite(value) && value >= 0 && value <= 100) {
      output.textContent = `${value}%`;
      card.setAttribute('aria-label', `${card.dataset.skill}, configured level ${value} percent`);
    }
  });
}

/* Hero typing loop */
function initializeTyping() {
  const target = document.querySelector('#typing-text');
  if (!target) return;

  const phrases = [
    'Building the Digital Future.',
    'Turning Ideas Into Reality.',
    'Code. Create. Innovate.'
  ];

  if (reduceMotion.matches) {
    target.textContent = phrases[0];
    return;
  }

  let phraseIndex = 0;
  let characterIndex = phrases[0].length;
  let deleting = true;

  function tick() {
    const phrase = phrases[phraseIndex];

    if (deleting) {
      characterIndex -= 1;
      target.textContent = phrase.slice(0, characterIndex);
      if (characterIndex === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        window.setTimeout(tick, 350);
        return;
      }
      window.setTimeout(tick, 34);
      return;
    }

    const nextPhrase = phrases[phraseIndex];
    characterIndex += 1;
    target.textContent = nextPhrase.slice(0, characterIndex);

    if (characterIndex === nextPhrase.length) {
      deleting = true;
      window.setTimeout(tick, 1900);
      return;
    }
    window.setTimeout(tick, 62);
  }

  window.setTimeout(tick, 1700);
}

/* Reveal content only when JavaScript is active; content is visible by default otherwise. */
function initializeReveals() {
  const elements = document.querySelectorAll('.reveal');
  if (reduceMotion.matches || !('IntersectionObserver' in window)) {
    elements.forEach((element) => element.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px' });

  elements.forEach((element) => observer.observe(element));
}

/* Sticky navigation, mobile menu, and current-section indicator */
function initializeNavigation() {
  const header = document.querySelector('[data-header]');
  const toggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('#mobile-menu');
  const mobileLinks = mobileMenu.querySelectorAll('a');
  const desktopLinks = document.querySelectorAll('.desktop-nav .nav-link');

  function closeMenu(returnFocus = false) {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation menu');
    mobileMenu.hidden = true;
    document.body.classList.remove('menu-open');
    if (returnFocus) toggle.focus();
  }

  function openMenu() {
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close navigation menu');
    mobileMenu.hidden = false;
    document.body.classList.add('menu-open');
    mobileMenu.querySelector('a').focus();
  }

  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    isOpen ? closeMenu() : openMenu();
  });

  mobileLinks.forEach((link) => link.addEventListener('click', () => closeMenu()));

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      closeMenu(true);
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 820 && toggle.getAttribute('aria-expanded') === 'true') closeMenu();
  });

  function updateHeader() {
    header.classList.toggle('scrolled', window.scrollY > 24);
  }
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  const sections = [...document.querySelectorAll('main section[id]')];
  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;

      let activeId = visible.target.id;
      if (activeId === 'services') activeId = 'projects';
      desktopLinks.forEach((link) => {
        const active = link.getAttribute('href') === `#${activeId}`;
        link.classList.toggle('active', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }, { rootMargin: '-25% 0px -55%', threshold: [0, 0.1, 0.5] });
    sections.forEach((section) => sectionObserver.observe(section));
  }
}

/* Placeholder URLs are intercepted instead of pretending to be real project links. */
function initializePlaceholderLinks() {
  const dialog = document.querySelector('#link-dialog');
  const message = document.querySelector('#dialog-message');
  const path = document.querySelector('#dialog-path');
  const closeButton = dialog.querySelector('.dialog-close');
  const doneButton = dialog.querySelector('.dialog-done');
  let trigger = null;

  function openDialog(link, isSocial = false) {
    trigger = link;
    if (isSocial) {
      message.textContent = 'This social profile uses an editable placeholder URL. Replace “your-username” with your real username before publishing.';
      path.textContent = 'index.html → social links';
    } else {
      message.textContent = `${link.dataset.linkType} for “${link.dataset.project}” is a sample link. Replace the example.com URL with your real project URL.`;
      path.textContent = 'index.html → project links';
    }
    dialog.showModal();
  }

  document.querySelectorAll('.placeholder-link').forEach((link) => {
    link.addEventListener('click', (event) => {
      if (link.hostname === 'example.com') {
        event.preventDefault();
        openDialog(link);
      }
    });
  });

  document.querySelectorAll('.placeholder-social').forEach((link) => {
    link.addEventListener('click', (event) => {
      if (link.href.includes('your-username')) {
        event.preventDefault();
        openDialog(link, true);
      }
    });
  });

  function closeDialog() {
    dialog.close();
    if (trigger) trigger.focus();
  }

  closeButton.addEventListener('click', closeDialog);
  doneButton.addEventListener('click', closeDialog);
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) {
      const bounds = dialog.getBoundingClientRect();
      const inside = event.clientX >= bounds.left && event.clientX <= bounds.right && event.clientY >= bounds.top && event.clientY <= bounds.bottom;
      if (!inside) closeDialog();
    }
  });
}

/* Contact validation: deliberately no fake sending or network request. */
function initializeContactForm() {
  const form = document.querySelector('#contact-form');
  const status = document.querySelector('#form-status');
  const fields = [...form.querySelectorAll('input, textarea')];

  const messages = {
    name: 'Please enter at least 2 characters.',
    email: 'Please enter a valid email address.',
    subject: 'Please enter a subject with at least 3 characters.',
    message: 'Please write a message with at least 10 characters.'
  };

  function isValid(field) {
    const value = field.value.trim();
    if (field.id === 'email') return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
    return value.length >= Number(field.getAttribute('minlength') || 1);
  }

  function validateField(field) {
    const valid = isValid(field);
    const error = document.querySelector(`#${field.id}-error`);
    field.setAttribute('aria-invalid', String(!valid));
    error.textContent = valid ? '' : messages[field.id];
    return valid;
  }

  fields.forEach((field) => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      if (field.getAttribute('aria-invalid') === 'true') validateField(field);
      status.hidden = true;
    });
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const validity = fields.map(validateField);
    const firstInvalid = fields[validity.indexOf(false)];

    status.hidden = false;
    if (firstInvalid) {
      status.className = 'form-status error';
      status.textContent = 'Please correct the highlighted fields. No message has been sent.';
      firstInvalid.focus();
      return;
    }

    status.className = 'form-status';
    status.textContent = 'Your message is valid and ready. No message was sent — connect a form service or backend to enable delivery.';
  });
}

/* Utilities */
function showToast(text) {
  const toast = document.querySelector('#toast');
  toast.textContent = text;
  toast.hidden = false;
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => { toast.hidden = true; }, 2400);
}

function initializeCopyButton() {
  const button = document.querySelector('[data-copy]');
  button.addEventListener('click', async () => {
    const value = button.dataset.copy;
    try {
      await navigator.clipboard.writeText(value);
      showToast('Email address copied to clipboard.');
    } catch {
      const temporary = document.createElement('textarea');
      temporary.value = value;
      temporary.style.position = 'fixed';
      temporary.style.opacity = '0';
      document.body.appendChild(temporary);
      temporary.select();
      const copied = document.execCommand('copy');
      temporary.remove();
      showToast(copied ? 'Email address copied to clipboard.' : `Copy manually: ${value}`);
    }
  });
}

function initializeBackToTop() {
  document.querySelector('.back-to-top').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reduceMotion.matches ? 'auto' : 'smooth' });
  });
}

function initializeLocalTime() {
  const output = document.querySelector('.local-time');
  function update() {
    const time = new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
    }).format(new Date());
    output.textContent = `LOCAL TIME ${time}`;
  }
  update();
  window.setInterval(update, 1000);
}

/* Desktop-only cursor. Native cursor remains visible for maximum usability. */
function initializeCursor() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches || reduceMotion.matches) return;

  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  let mouseX = -50;
  let mouseY = -50;
  let ringX = -50;
  let ringY = -50;
  let visible = false;

  document.addEventListener('mousemove', (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
    dot.style.transform = `translate3d(${mouseX - 2.5}px, ${mouseY - 2.5}px, 0)`;
    if (!visible) {
      visible = true;
      dot.style.opacity = '1';
      ring.style.opacity = '1';
    }
  }, { passive: true });

  document.addEventListener('mouseleave', () => {
    visible = false;
    dot.style.opacity = '0';
    ring.style.opacity = '0';
  });

  document.addEventListener('mouseover', (event) => {
    ring.classList.toggle('is-active', Boolean(event.target.closest('.interactive, input, textarea')));
  });

  function render() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    const size = ring.classList.contains('is-active') ? 44 : 28;
    ring.style.transform = `translate3d(${ringX - size / 2}px, ${ringY - size / 2}px, 0)`;
    window.requestAnimationFrame(render);
  }
  render();
}

initializeSkillLevels();
initializeTyping();
initializeReveals();
initializeNavigation();
initializePlaceholderLinks();
initializeContactForm();
initializeCopyButton();
initializeBackToTop();
initializeLocalTime();
initializeCursor();
