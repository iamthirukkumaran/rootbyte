import { servicesData } from '../data/servicesData.js';
import { icons } from '../icons.js';

export function renderServices() {
  const container = document.getElementById('services-grid');
  if (!container) return;

  container.className = 'services-grid-cards';
  container.setAttribute('data-reveal-group', '');

  container.innerHTML = servicesData
    .map(
      (service) => `
      <article class="service-card" data-category="${service.category}">
        <span class="service-icon">${icons[service.icon] || icons.sparkle}</span>
        <h3 class="service-card-title">${service.title}</h3>
        <p class="service-card-tagline">${service.tagline}</p>

        <ul class="service-card-features">
          ${service.features
            .map((f) => `<li>${icons.check}<span>${f}</span></li>`)
            .join('')}
        </ul>

        <div class="service-card-action">
          <button class="btn btn-secondary btn-sm select-service-btn" data-service-id="${service.id}">
            <span>Configure scope</span>${icons.arrow}
          </button>
        </div>
      </article>`
    )
    .join('');

  // Jumping to the estimator with the matching chip already selected removes
  // a step between "this is what I want" and a concrete timeline.
  container.querySelectorAll('.select-service-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const serviceId = btn.getAttribute('data-service-id');
      const estimator = document.getElementById('quote-calculator');
      document.querySelector(`.service-chip[data-type="${serviceId}"]`)?.click();
      estimator?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}
