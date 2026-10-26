import { figuresData } from '../data/figuresData.js';

export function renderFigures() {
  const container = document.getElementById('figures-grid');
  if (!container) return;

  container.setAttribute('data-reveal-group', '');

  container.innerHTML = figuresData
    .map(
      (fig, i) => `
      <article class="fig-card fig-${fig.tone}">
        <p class="fig-label">
          <span class="fig-bracket" aria-hidden="true">
            <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.6">
              <path d="M1 5.5V1h4.5M12.5 1H17v4.5M17 12.5V17h-4.5M5.5 17H1v-4.5"/>
              <circle cx="9" cy="9" r="2.4" fill="currentColor" stroke="none"/>
            </svg>
          </span>
          FIG ${String(i + 1).padStart(2, '0')}: ${fig.label.toUpperCase()}
        </p>
        <h3 class="fig-headline">${fig.headline}</h3>
        <p class="fig-body">${fig.body}</p>
      </article>`
    )
    .join('');
}
