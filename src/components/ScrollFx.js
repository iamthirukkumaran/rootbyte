/**
 * Scroll choreography.
 *
 *  - [data-split]      headings rise into view one typeset line at a time
 *  - .reveal           blocks fade and lift once
 *  - [data-parallax]   decorative layers drift against the scroll
 *  - [data-count]      numerals count up when they first appear
 *  - .scroll-progress  a hairline read-out of page position
 *
 * Everything degrades to "already visible" under prefers-reduced-motion.
 */
const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ------------------------------------------------------------------ *
 * Line splitting
 * ------------------------------------------------------------------ */

/**
 * Wrap each word, measure where the browser actually broke the text, then
 * regroup those words into one masked element per visual line. Re-run on
 * resize, because the line breaks move.
 */
function splitIntoLines(el) {
  if (!el.dataset.originalHtml) el.dataset.originalHtml = el.innerHTML;
  el.innerHTML = el.dataset.originalHtml;

  // Step 1: wrap every word, keeping inline markup (<em>, <br>) intact
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode);

  // Tracked across text nodes so punctuation that hugs a tag: the full stop
  // after </em>: is not pushed away by a space when the line is rebuilt
  let pendingSpace = false;

  textNodes.forEach((node) => {
    const parent = node.parentElement;
    const isAccent = Boolean(parent?.closest('.accent'));
    const frag = document.createDocumentFragment();

    node.textContent.split(/(\s+)/).forEach((token) => {
      if (!token) return;
      if (!token.trim()) {
        pendingSpace = true;
        frag.appendChild(document.createTextNode(token));
        return;
      }
      const span = document.createElement('span');
      span.className = 'word';
      // Carry the accent down onto the word itself: regrouping into lines
      // drops the wrapper element, and with it the colour
      if (isAccent) span.classList.add('accent');
      span.dataset.space = pendingSpace ? '1' : '0';
      span.textContent = token;
      pendingSpace = false;
      frag.appendChild(span);
    });

    node.parentNode.replaceChild(frag, node);
  });

  // Step 2: group words by their vertical position
  const words = Array.from(el.querySelectorAll('.word'));
  if (!words.length) return;

  const lines = [];
  let currentTop = null;
  words.forEach((word) => {
    const top = Math.round(word.offsetTop);
    if (currentTop === null || Math.abs(top - currentTop) > 4) {
      lines.push([]);
      currentTop = top;
    }
    lines[lines.length - 1].push(word);
  });

  // Step 3: rebuild as masked lines
  const frag = document.createDocumentFragment();
  lines.forEach((line, i) => {
    const mask = document.createElement('span');
    mask.className = 'line-mask';

    const inner = document.createElement('span');
    inner.className = 'line-inner';
    inner.style.transitionDelay = `${i * 110}ms`;

    line.forEach((word, j) => {
      if (j > 0 && word.dataset.space === '1') {
        inner.appendChild(document.createTextNode(' '));
      }
      inner.appendChild(word.cloneNode(true));
    });

    mask.appendChild(inner);
    frag.appendChild(mask);
  });

  el.innerHTML = '';
  el.appendChild(frag);
  el.classList.add('is-split');
}

function setupSplitHeadings(observer) {
  const headings = Array.from(document.querySelectorAll('[data-split]'));
  if (!headings.length) return () => {};

  if (reduced()) {
    headings.forEach((h) => h.classList.add('is-visible'));
    return () => {};
  }

  // Colour the accent words before splitting, so the clone carries the class
  headings.forEach((h) => {
    h.querySelectorAll('em').forEach((em) => {
      em.outerHTML = `<span class="accent">${em.innerHTML}</span>`;
    });
  });

  const run = () =>
    headings.forEach((h) => {
      const wasVisible = h.classList.contains('is-visible');
      splitIntoLines(h);
      if (wasVisible) h.classList.add('is-visible');
      else observer.observe(h);
    });

  run();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(run, 180);
  });

  return run;
}

/* ------------------------------------------------------------------ *
 * Counters
 * ------------------------------------------------------------------ */
function countUp(el) {
  const raw = el.dataset.count;
  const target = parseFloat(raw);
  if (Number.isNaN(target)) return;

  const suffix = el.dataset.countSuffix || '';
  const duration = 1100;
  const start = performance.now();

  const step = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 4);
    el.textContent = `${Math.round(target * eased)}${suffix}`;
    if (progress < 1) requestAnimationFrame(step);
  };

  requestAnimationFrame(step);
}

/* ------------------------------------------------------------------ *
 * Background flow
 *
 * Whichever section is crossing the middle band of the viewport owns the
 * page colour. The transition lives in CSS, so the handover crossfades.
 * ------------------------------------------------------------------ */
function setupBackgroundFlow() {
  const sections = document.querySelectorAll('[data-bg]');
  if (!sections.length || !('IntersectionObserver' in window)) return;

  const root = document.documentElement;
  const apply = (el) => {
    root.style.setProperty('--page-bg', el.dataset.bg);
    if (el.dataset.fg) root.style.setProperty('--page-fg', el.dataset.fg);
  };

  apply(sections[0]);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => entry.isIntersecting && apply(entry.target));
    },
    { rootMargin: '-42% 0px -52% 0px' }
  );

  sections.forEach((section) => observer.observe(section));
}

/* ------------------------------------------------------------------ *
 * Cursor-tracked gloss
 * ------------------------------------------------------------------ */
function setupSheen() {
  if (reduced() || !window.matchMedia('(hover: hover)').matches) return;

  document
    .querySelectorAll('.fig-card, .way-card, .service-card, .standard-item, .work-shot')
    .forEach((card) => {
      card.classList.add('sheen');
      card.addEventListener(
        'pointermove',
        (e) => {
          const rect = card.getBoundingClientRect();
          card.style.setProperty('--mx', `${((e.clientX - rect.left) / rect.width) * 100}%`);
          card.style.setProperty('--my', `${((e.clientY - rect.top) / rect.height) * 100}%`);
        },
        { passive: true }
      );
    });
}

/* ------------------------------------------------------------------ *
 * Parallax + progress, on a single rAF loop
 * ------------------------------------------------------------------ */
function setupScrollLoop() {
  const layers = Array.from(document.querySelectorAll('[data-parallax]'));
  const progress = document.querySelector('.scroll-progress');
  const hero = document.querySelector('.hero-section');
  const heroContent = hero?.querySelector('.hero-content');
  const heroRays = hero?.querySelector('.hero-rays');
  if ((!layers.length && !progress && !hero) || reduced()) return;

  let ticking = false;

  const update = () => {
    ticking = false;
    const viewportH = window.innerHeight;

    layers.forEach((layer) => {
      const rect = layer.getBoundingClientRect();
      if (rect.bottom < -200 || rect.top > viewportH + 200) return;
      // -1..1 as the element travels through the viewport
      const centre = (rect.top + rect.height / 2 - viewportH / 2) / viewportH;
      const strength = parseFloat(layer.dataset.parallax) || 0.1;
      layer.style.transform = `translate3d(0, ${(-centre * strength * 100).toFixed(2)}px, 0)`;
    });

    // The hero recedes as you leave it, rather than just scrolling off
    if (hero && heroContent) {
      const p = Math.min(Math.max(window.scrollY / (hero.offsetHeight || 1), 0), 1);
      heroContent.style.opacity = `${Math.max(0, 1 - p * 1.5)}`;
      heroContent.style.transform = `translate3d(0, ${(-p * 90).toFixed(1)}px, 0) scale(${(1 - p * 0.07).toFixed(4)})`;
      if (heroRays) {
        heroRays.style.transform = `scale(${(1 + p * 0.3).toFixed(4)})`;
        heroRays.style.opacity = `${Math.max(0, 1 - p * 0.9)}`;
      }
    }

    if (progress) {
      const max = document.documentElement.scrollHeight - viewportH;
      progress.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
    }
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
}

/* ------------------------------------------------------------------ *
 * Entry point
 * ------------------------------------------------------------------ */
export function setupScrollFx() {
  const prefersReduced = reduced();

  /* Alternating drift on a row of cards, set up before the groups below */
  document.querySelectorAll('[data-parallax-children]').forEach((row) => {
    Array.from(row.children).forEach((child, i) => {
      child.setAttribute('data-parallax', (i % 2 ? 0.06 : -0.06).toString());
    });
  });

  /* Stagger the children of any declared group */
  document.querySelectorAll('[data-reveal-group]').forEach((group) => {
    Array.from(group.children).forEach((child, i) => {
      child.classList.add('reveal');
      child.style.setProperty('--reveal-delay', `${Math.min(i, 8) * 110}ms`);
    });
  });

  setupBackgroundFlow();

  if (prefersReduced || !('IntersectionObserver' in window)) {
    document
      .querySelectorAll('.reveal, [data-split], [data-count]')
      .forEach((el) => {
        el.classList.add('is-visible');
        if (el.dataset.count) el.textContent = `${el.dataset.count}${el.dataset.countSuffix || ''}`;
      });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        if (entry.target.dataset.count) countUp(entry.target);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -12% 0px' }
  );

  setupSplitHeadings(observer);
  document.querySelectorAll('.reveal, [data-count]').forEach((el) => observer.observe(el));
  setupSheen();
  setupScrollLoop();
}
