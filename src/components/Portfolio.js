import { standardsData } from '../data/portfolioData.js';

export function renderPortfolio() {
  const container = document.getElementById('portfolio-grid');
  const filterBtns = Array.from(document.querySelectorAll('.filter-btn'));
  if (!container) return;

  container.className = 'standards-list';

  function render(filter = 'all') {
    const filtered =
      filter === 'all' ? standardsData : standardsData.filter((item) => item.category === filter);

    if (!filtered.length) {
      container.innerHTML = `<p class="standards-empty">Nothing under this discipline yet: try “All disciplines”.</p>`;
      return;
    }

    container.innerHTML = filtered
      .map(
        (item, index) => `
        <article class="standard-item" data-category="${item.category}" style="animation-delay:${index * 60}ms">
          <div class="standard-header">
            <span class="standard-num">${String(index + 1).padStart(2, '0')}</span>
            <h3 class="standard-title">${item.title}</h3>
          </div>
          <p class="standard-desc">${item.description}</p>
        </article>`
      )
      .join('');
  }

  render('all');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      render(btn.getAttribute('data-filter'));
    });
  });
}
