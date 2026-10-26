import { faqData } from '../data/faqData.js';
import { icons } from '../icons.js';

export function renderFaq() {
  const container = document.getElementById('faq-list');
  if (!container) return;

  container.innerHTML = faqData
    .map(
      (item, i) => `
      <div class="faq-item">
        <h3>
          <button class="faq-question" type="button" aria-expanded="false" aria-controls="faq-panel-${i}" id="faq-trigger-${i}">
            <span>${item.q}</span>
            <span class="faq-icon">${icons.plus}</span>
          </button>
        </h3>
        <div class="faq-answer" id="faq-panel-${i}" role="region" aria-labelledby="faq-trigger-${i}">
          <div><p>${item.a}</p></div>
        </div>
      </div>`
    )
    .join('');

  const triggers = Array.from(container.querySelectorAll('.faq-question'));

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const isOpen = trigger.getAttribute('aria-expanded') === 'true';

      // Accordion: only one panel open at a time keeps the section scannable
      triggers.forEach((other) => {
        other.setAttribute('aria-expanded', 'false');
        other.closest('.faq-item').classList.remove('open');
      });

      if (!isOpen) {
        trigger.setAttribute('aria-expanded', 'true');
        trigger.closest('.faq-item').classList.add('open');
      }
    });
  });
}
