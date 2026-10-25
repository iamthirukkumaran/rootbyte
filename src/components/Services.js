import { servicesData } from '../data/servicesData.js';

export function renderServices() {
  const container = document.getElementById('services-grid');
  if (!container) return;

  container.className = 'services-grid-cards';
  container.innerHTML = servicesData.map((service, index) => {
    const num = String(index + 1).padStart(2, '0');
    return `
      <article class="service-card" data-category="${service.category}">
        <div class="service-card-header">
          <span class="service-card-num">${num}</span>
          <h3 class="service-card-title">${service.title}</h3>
        </div>
        <p class="service-card-tagline">${service.tagline}</p>
        
        <div class="service-card-divider"></div>

        <ul class="service-card-features">
          ${service.features.map(f => `
            <li>
              <span class="feature-bullet">•</span>
              <span>${f}</span>
            </li>
          `).join('')}
        </ul>

        <div class="service-card-action">
          <button class="btn btn-secondary btn-sm select-service-btn" data-service-id="${service.id}" data-service-title="${service.title}">
            <span>Configure Scope →</span>
          </button>
        </div>
      </article>
    `;
  }).join('');

  // Attach event listeners to customize buttons
  container.querySelectorAll('.select-service-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const serviceId = e.currentTarget.getAttribute('data-service-id');
      const estimator = document.getElementById('quote-calculator');
      if (estimator) {
        estimator.scrollIntoView({ behavior: 'smooth' });
        const chip = document.querySelector(`.chip-btn[data-type="${serviceId}"]`);
        if (chip) chip.click();
      }
    });
  });
}
