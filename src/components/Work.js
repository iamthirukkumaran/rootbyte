import { workData } from '../data/workData.js';
import { icons } from '../icons.js';

const externalIcon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8"/></svg>`;

const card = (project) => `
  <article class="work-card${project.featured ? ' is-featured' : ''}">
    <a class="work-shot" href="${project.url}" target="_blank" rel="noopener"
       aria-label="Open ${project.client} in a new tab">
      <img src="${project.image}" alt="${project.alt}" loading="lazy" width="1600" height="1089" />
      <span class="work-shot-badge">${project.domain}${externalIcon}</span>
    </a>

    <div class="work-body">
      <p class="work-meta">${project.sector} <span>/</span> ${project.year}</p>
      <h3 class="work-client">${project.client}</h3>
      <p class="work-headline">${project.headline}</p>
      <p class="work-summary">${project.summary}</p>

      <ul class="work-scope">
        ${project.scope.map((item) => `<li>${item}</li>`).join('')}
      </ul>

      <a class="btn btn-secondary work-visit" href="${project.url}" target="_blank" rel="noopener">
        Visit ${project.domain}${icons.arrow}
      </a>
    </div>
  </article>`;

export function renderWork() {
  const container = document.getElementById('work-grid');
  if (!container) return;

  container.setAttribute('data-reveal-group', '');
  container.innerHTML = workData.map(card).join('');
}
