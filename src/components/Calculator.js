export function setupCalculator() {
  const daysDisplay = document.getElementById('calc-days');
  const timelineDisplay = document.getElementById('calc-timeline');
  const serviceSummary = document.getElementById('summary-service');
  const scopeSummary = document.getElementById('summary-scope');
  const addonsSummary = document.getElementById('summary-addons');
  const bookBtn = document.getElementById('calc-book-btn');

  if (!daysDisplay) return;

  // Turnaround Matrix in Sprint Working Days (No Monetary Amounts)
  const serviceDays = {
    web: { days: 14, label: 'Web Development' },
    fullstack: { days: 21, label: 'Full Stack Development' },
    uiux: { days: 10, label: 'UI/UX Design' },
    video: { days: 7, label: 'Video Editing & Reels' },
    'it-services': { days: 10, label: 'Digital Marketing & IT Services' },
    bundle: { days: 28, label: 'Full Digital Stack Bundle (Web + UI/UX + Video + Marketing)' }
  };

  const scopeDays = {
    mvp: { extraDays: 0, label: 'Starter Scope' },
    scale: { extraDays: 7, label: 'Growth Scope' },
    enterprise: { extraDays: 14, label: 'Enterprise Scope' }
  };

  const addonDays = {
    webgl: { days: 4, label: 'Interactive 3D Visuals' },
    fasttrack: { days: -4, label: 'Priority Fast-Track' },
    devops: { days: 3, label: 'Cloud Infrastructure & DevOps' },
    seo: { days: 2, label: 'Comprehensive SEO Strategy' }
  };

  // State
  let currentService = 'fullstack';
  let currentScope = 'scale';
  let currentAddons = new Set(['webgl']);

  let currentDaysValue = 28;

  function calculate() {
    const s = serviceDays[currentService] || serviceDays.fullstack;
    const sc = scopeDays[currentScope] || scopeDays.scale;

    let days = Math.max(3, s.days + sc.extraDays);

    const activeAddonLabels = [];
    currentAddons.forEach(addonKey => {
      if (addonDays[addonKey]) {
        days += addonDays[addonKey].days;
        activeAddonLabels.push(addonDays[addonKey].label);
      }
    });

    // Animate day counter
    animateDays(days);

    const weeks = Math.ceil(days / 7);
    if (timelineDisplay) {
      timelineDisplay.textContent = `Approx. ~${weeks} ${weeks === 1 ? 'Week' : 'Weeks'}`;
    }

    if (serviceSummary) serviceSummary.textContent = s.label;
    if (scopeSummary) scopeSummary.textContent = sc.label;
    if (addonsSummary) {
      addonsSummary.textContent = activeAddonLabels.length > 0 ? activeAddonLabels.join(', ') : 'None selected';
    }
  }

  function animateDays(targetDays) {
    const duration = 300;
    const start = currentDaysValue;
    const startTime = performance.now();

    function step(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (targetDays - start) * ease);
      daysDisplay.textContent = `~${current} Days`;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        currentDaysValue = targetDays;
      }
    }
    requestAnimationFrame(step);
  }

  // Service selector buttons
  const serviceChips = document.querySelectorAll('.service-chip');
  serviceChips.forEach(chip => {
    chip.addEventListener('click', () => {
      serviceChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      currentService = chip.getAttribute('data-type');
      calculate();
    });
  });

  // Scope buttons
  const scopeChips = document.querySelectorAll('.scope-chip');
  scopeChips.forEach(chip => {
    chip.addEventListener('click', () => {
      scopeChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      currentScope = chip.getAttribute('data-scope');
      calculate();
    });
  });

  // Addon toggles
  const addonChips = document.querySelectorAll('.addon-chip');
  addonChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const addonKey = chip.getAttribute('data-addon');
      if (currentAddons.has(addonKey)) {
        currentAddons.delete(addonKey);
        chip.classList.remove('active');
      } else {
        currentAddons.add(addonKey);
        chip.classList.add('active');
      }
      calculate();
    });
  });

  // Book Project action
  bookBtn?.addEventListener('click', () => {
    const modal = document.getElementById('contact-modal');
    const projectField = document.getElementById('modal-project');
    const service = (serviceDays[currentService] || serviceDays.fullstack)?.label;
    const scope = (scopeDays[currentScope] || scopeDays.scale)?.label;

    if (projectField) {
      projectField.value = `Selected Scope: ${service} (${scope}) - Estimated Turnaround: ${daysDisplay.textContent}`;
    }
    if (modal) modal.classList.add('active');
  });

  // Initial calculation
  calculate();
}
