import { standardsData } from '../data/portfolioData.js';

export function renderPortfolio() {
  const container = document.getElementById('portfolio-grid');
  const filterBtns = document.querySelectorAll('.filter-btn');
  if (!container) return;

  container.className = 'standards-list';

  function render(filter = 'all') {
    const filtered = filter === 'all' 
      ? standardsData 
      : standardsData.filter(item => item.category === filter);

    container.innerHTML = filtered.map((item, index) => {
      const num = String(index + 1).padStart(2, '0');
      return `
        <article class="standard-item" data-category="${item.category}">
          <div class="standard-header">
            <span class="standard-num">${num}</span>
            <h3 class="standard-title">${item.title}</h3>
          </div>
          <p class="standard-desc">${item.description}</p>
        </article>
      `;
    }).join('');
  }

  // Initial render
  render('all');

  // Filter handlers
  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      filterBtns.forEach(b => b.classList.remove('active'));
      e.currentTarget.classList.add('active');
      const category = e.currentTarget.getAttribute('data-filter');
      render(category);
    });
  });
}
