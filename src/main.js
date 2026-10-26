import { setupNavigation } from './components/Navigation.js';
import { renderFigures } from './components/Figures.js';
import { renderWays } from './components/Ways.js';
import { renderServices } from './components/Services.js';
import { renderWork } from './components/Work.js';
import { renderPortfolio } from './components/Portfolio.js';
import { renderFaq } from './components/Faq.js';
import { setupContactModal } from './components/ContactModal.js';
import { setupScrollFx } from './components/ScrollFx.js';

function boot() {
  setupNavigation();
  renderFigures();
  renderWays();
  renderServices();
  renderWork();
  renderPortfolio();
  renderFaq();
  setupContactModal();

  // Last, so it sees every node the renderers above just created
  setupScrollFx();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
