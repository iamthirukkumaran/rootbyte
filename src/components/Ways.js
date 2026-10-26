import { waysData } from '../data/waysData.js';
import { icons } from '../icons.js';

export function renderWays() {
  const container = document.getElementById('ways-grid');
  if (!container) return;

  container.setAttribute('data-reveal-group', '');

  container.innerHTML = waysData
    .map(
      (way) => `
      <article class="way-card${way.featured ? ' is-featured' : ''}">
        ${way.featured ? '<span class="way-flag">Most chosen</span>' : ''}

        <header class="way-head">
          <h3 class="way-name">${way.name}</h3>
          <p class="way-terms">${way.terms}</p>
        </header>

        <p class="way-pitch">${way.pitch}</p>
        <p class="way-body">${way.body}</p>

        <div class="way-best">
          <p class="way-best-label">Best for</p>
          <ul>
            ${way.bestFor.map((item) => `<li>${icons.check}<span>${item}</span></li>`).join('')}
          </ul>
        </div>

        <button class="btn ${way.featured ? 'btn-primary' : 'btn-secondary'} btn-block way-cta" data-way="${way.name}">
          ${way.cta}${icons.arrow}
        </button>
      </article>`
    )
    .join('');

  // Carry the choice into the contact form so nobody retypes it
  container.querySelectorAll('.way-cta').forEach((btn) => {
    btn.addEventListener('click', () => {
      const field = document.getElementById('modal-project');
      if (field) field.value = `${btn.dataset.way} engagement`;
      document.dispatchEvent(new CustomEvent('rootbyte:open-contact'));
    });
  });
}
