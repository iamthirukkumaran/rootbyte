import confetti from 'canvas-confetti';

export function setupContactModal() {
  const modal = document.getElementById('contact-modal');
  const closeBtn = document.getElementById('modal-close-btn');
  const openBtns = document.querySelectorAll('.open-contact-modal');
  const form = document.getElementById('contact-form');
  const statusMsg = document.getElementById('modal-status-msg');

  if (!modal) return;

  function openModal() {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  openBtns.forEach(btn => btn.addEventListener('click', openModal));
  closeBtn?.addEventListener('click', closeModal);

  // Close when clicking backdrop
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // ESC key to close
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  // Form submission
  form?.addEventListener('submit', (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span>Submitting Inquiry...</span>`;

    setTimeout(() => {
      if (statusMsg) {
        statusMsg.style.display = 'block';
        statusMsg.innerHTML = `
          <div style="background: #141815; border: 1px solid #10b981; color: #10b981; padding: 0.85rem; border-radius: 4px; margin-bottom: 1rem; font-size: 0.9rem; text-align: center;">
            <strong>Inquiry Received.</strong> A RootByte team member will review your scope and reply within 12 hours.
          </div>
        `;
      }

      form.reset();
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;

      // Close modal after 3 seconds
      setTimeout(() => {
        closeModal();
        if (statusMsg) statusMsg.style.display = 'none';
      }, 3500);
    }, 800);
  });
}
