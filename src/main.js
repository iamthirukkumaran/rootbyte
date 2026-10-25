import { SceneManager } from './3d/SceneManager.js';
import { setupNavigation } from './components/Navigation.js';
import { renderServices } from './components/Services.js';
import { renderPortfolio } from './components/Portfolio.js';
import { setupCalculator } from './components/Calculator.js';
import { setupContactModal } from './components/ContactModal.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Lightweight 3D Canvas
  const canvas = document.getElementById('canvas3d');
  let sceneManager = null;
  if (canvas) {
    try {
      sceneManager = new SceneManager(canvas);
    } catch (err) {
      console.warn('WebGL initialization fallback:', err);
    }
  }

  // 2. Initialize Navigation and scroll behaviors
  setupNavigation();

  // 3. Render linear service rows
  renderServices();

  // 4. Render engineering & architecture standards
  renderPortfolio();

  // 5. Initialize Interactive Cost Estimator
  setupCalculator();

  // 6. Initialize Contact Inquiry Modal
  setupContactModal();
});
