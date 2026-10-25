export function setupNavigation() {
  const header = document.querySelector('.header');
  const mobileBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  const links = document.querySelectorAll('.nav-link');

  // Glass header on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }

    // Update active nav link based on scroll position
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;

    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const headerHeight = header?.offsetHeight || 85;
      const sectionTop = current.offsetTop - headerHeight - 50;
      const sectionId = current.getAttribute('id');
      const targetLink = document.querySelector(`.nav-link[href*="${sectionId}"]`);

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        links.forEach((l) => l.classList.remove('active'));
        targetLink?.classList.add('active');
      }
    });
  });

  // Dynamic centered scroll navigation
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  anchorLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;

      const targetEl = document.querySelector(href);
      if (targetEl) {
        e.preventDefault();

        const headerHeight = header?.offsetHeight || 85;
        const windowHeight = window.innerHeight;
        const targetHeight = targetEl.offsetHeight;

        let targetScrollTop;
        // If the section fits within the viewport, vertically center it!
        if (targetHeight + headerHeight < windowHeight) {
          const verticalSlack = windowHeight - headerHeight - targetHeight;
          targetScrollTop = targetEl.offsetTop - headerHeight - (verticalSlack / 2);
        } else {
          // If taller, align the top right below the header with comfortable breathing room
          targetScrollTop = targetEl.offsetTop - headerHeight - 16;
        }

        window.scrollTo({
          top: Math.max(0, targetScrollTop),
          behavior: 'smooth'
        });

        // Update active state
        if (link.classList.contains('nav-link')) {
          links.forEach((l) => l.classList.remove('active'));
          link.classList.add('active');
        }

        history.pushState(null, null, href);
      }
    });
  });
}
