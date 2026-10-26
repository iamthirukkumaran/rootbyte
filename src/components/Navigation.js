/**
 * Floating pill nav with a full mega-menu.
 *
 * The pill fades out as the panel scales up from the same origin, so the menu
 * reads as the pill expanding rather than a separate overlay arriving.
 */
export function setupNavigation() {
  const pill = document.querySelector('.nav-pill');
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.getElementById('nav-menu');
  const inner = menu?.querySelector('.nav-menu-inner');
  const tab = document.querySelector('.nav-menu-tab');
  const scrim = document.querySelector('.nav-scrim');
  const closeBtn = document.querySelector('.menu-close');

  let lastFocused = null;

  const focusables = () =>
    Array.from(menu?.querySelectorAll('a[href], button:not([disabled])') || []).filter(
      (el) => el.offsetParent !== null
    );

  /**
   * The panel animates height, so it needs a number rather than `auto`.
   * scrollHeight is the full content height even while max-height clips it.
   */
  function measure() {
    if (!inner) return;
    const navTop = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-top')) || 16;
    const cap = window.innerHeight - navTop * 2 - 72;
    const height = Math.min(inner.scrollHeight, cap);
    document.documentElement.style.setProperty('--menu-h', `${Math.round(height)}px`);
  }

  function setMenu(open) {
    if (!menu) return;

    if (open) measure();

    menu.classList.toggle('open', open);
    tab?.classList.toggle('open', open);
    scrim?.classList.toggle('open', open);
    pill?.classList.toggle('is-hidden', open);
    document.body.classList.toggle('no-scroll', open);

    toggle?.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-hidden', String(!open));

    if (open) {
      lastFocused = document.activeElement;
      setTimeout(() => closeBtn?.focus(), 120);
    } else {
      lastFocused?.focus();
    }
  }

  measure();
  window.addEventListener('resize', () => {
    measure();
    if (window.innerWidth > 1200 && menu?.classList.contains('open')) measure();
  });

  toggle?.addEventListener('click', () =>
    setMenu(toggle.getAttribute('aria-expanded') !== 'true')
  );
  closeBtn?.addEventListener('click', () => setMenu(false));
  scrim?.addEventListener('click', () => setMenu(false));

  menu?.querySelectorAll('a, .open-contact-modal').forEach((el) =>
    el.addEventListener('click', () => setMenu(false))
  );

  window.addEventListener('keydown', (e) => {
    if (!menu?.classList.contains('open')) return;

    if (e.key === 'Escape') {
      setMenu(false);
      return;
    }

    if (e.key !== 'Tab') return;
    const items = focusables();
    if (!items.length) return;

    const first = items[0];
    const last = items[items.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });

  /* --- Smooth anchor scrolling ----------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 96;

      // The menu takes ~280ms to clear; start the scroll behind it
      setTimeout(() => {
        window.scrollTo({
          top: Math.max(0, top),
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
            ? 'auto'
            : 'smooth'
        });
      }, menu?.classList.contains('open') ? 220 : 0);

      history.replaceState(null, '', href);
    });
  });
}
