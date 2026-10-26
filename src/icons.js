/**
 * Inline 24x24 stroke icons. Inlined rather than sprited so a card can be
 * rendered from data without a second network request.
 */
const wrap = (paths, stroke = true) =>
  `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" ${
    stroke
      ? 'stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"'
      : 'fill="currentColor"'
  } aria-hidden="true">${paths}</svg>`;

export const icons = {
  globe: wrap('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18"/>'),
  server: wrap('<rect x="3" y="4" width="18" height="7" rx="2"/><rect x="3" y="13" width="18" height="7" rx="2"/><path d="M7 7.5h.01M7 16.5h.01"/>'),
  pen: wrap('<path d="M12 20h9"/><path d="M16.4 3.6a2.1 2.1 0 0 1 3 3L7.5 18.5 3 20l1.5-4.5z"/>'),
  video: wrap('<rect x="2" y="5" width="14" height="14" rx="3"/><path d="m16 10 5-3v10l-5-3z"/>'),
  trend: wrap('<path d="m3 17 6-6 4 4 7-7"/><path d="M14 8h6v6"/>'),
  check: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 5 5L20 7"/></svg>`,
  plus: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>`,
  arrow: `<svg class="arrow" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`,
  close: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>`,
  bolt: wrap('<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>'),
  shield: wrap('<path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z"/>'),
  cloud: wrap('<path d="M7 18a4 4 0 0 1 0-8 5.5 5.5 0 0 1 10.5 1.5A3.5 3.5 0 0 1 17 18z"/>'),
  sparkle: wrap('<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6.3 6.3l2.8 2.8M14.9 14.9l2.8 2.8M17.7 6.3l-2.8 2.8M9.1 14.9l-2.8 2.8"/>')
};
