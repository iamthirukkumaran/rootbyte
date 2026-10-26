import confetti from 'canvas-confetti';
import { siteConfig } from '../config.js';

export function setupContactModal() {
  const modal = document.getElementById('contact-modal');
  if (!modal) return;

  const content = modal.querySelector('.modal-content');
  const closeBtn = document.getElementById('modal-close-btn');
  const form = document.getElementById('contact-form');
  const statusMsg = document.getElementById('modal-status-msg');
  let lastFocused = null;

  const focusables = () =>
    Array.from(
      content.querySelectorAll('a[href], button:not([disabled]), input, textarea, select')
    ).filter((el) => el.offsetParent !== null);

  function openModal() {
    lastFocused = document.activeElement;
    modal.classList.add('active');
    modal.removeAttribute('aria-hidden');
    document.body.classList.add('no-scroll');
    setTimeout(() => focusables()[1]?.focus(), 60); // skip the close button
  }

  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
    lastFocused?.focus();
  }

  document.querySelectorAll('.open-contact-modal').forEach((btn) =>
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    })
  );
  document.addEventListener('rootbyte:open-contact', openModal);

  closeBtn?.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Esc closes; Tab stays inside the dialog while it is open
  window.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;

    if (e.key === 'Escape') {
      closeModal();
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

  /* --- Submission ------------------------------------------------------- */
  function setStatus(kind, html) {
    if (!statusMsg) return;
    statusMsg.className = `form-status is-${kind}`;
    statusMsg.innerHTML = html;
    statusMsg.style.display = 'block';
  }

  function celebrate() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    confetti({
      particleCount: 70,
      spread: 62,
      origin: { y: 0.6 },
      colors: ['#12936a', '#34d399', '#0e1a16', '#cbe7da'],
      disableForReducedMotion: true
    });
  }

  /** No endpoint configured: hand the inquiry to the visitor's mail client
   *  rather than pretending it was delivered. */
  function mailtoFallback(data) {
    const body = [
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      `Scope: ${data.project || ''}`,
      '',
      data.notes || ''
    ].join('\n');

    window.location.href = `mailto:${siteConfig.email}?subject=${encodeURIComponent(
      `Project inquiry: ${data.name}`
    )}&body=${encodeURIComponent(body)}`;

    setStatus(
      'success',
      `<strong>Almost there.</strong> Your mail app is opening with the inquiry pre-filled: hit send and we'll reply within 12 hours.`
    );
  }

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const original = submitBtn.innerHTML;
    // form.elements, not form.name: HTMLFormElement.name shadows the field
    const field = (n) => form.elements.namedItem(n)?.value.trim() || '';
    const data = {
      name: field('name'),
      email: field('email'),
      project: field('project'),
      notes: field('notes')
    };

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Sending…</span>';

    try {
      if (!siteConfig.formEndpoint) {
        mailtoFallback(data);
      } else {
        const res = await fetch(siteConfig.formEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);

        setStatus(
          'success',
          `<strong>Inquiry received.</strong> An engineering lead will review your scope and reply within 12 hours.`
        );
        celebrate();
        form.reset();
        setTimeout(() => {
          closeModal();
          if (statusMsg) statusMsg.style.display = 'none';
        }, 3200);
      }
    } catch (err) {
      console.error(err);
      setStatus(
        'error',
        `Something went wrong sending that. Email us directly at <a href="mailto:${siteConfig.email}">${siteConfig.email}</a>.`
      );
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = original;
    }
  });
}
