# RootByte: studio site

Static marketing site for the RootByte studio. Vanilla JS + Vite, no framework,
no build-time data fetching. Light, typographic, and quick to load.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # -> dist/
npm run preview
```

## Layout

```
index.html                 Homepage
privacy-policy.html        Legal pages: share the same stylesheet, no app bundle
terms-of-service.html
cookie-policy.html
src/
  config.js                Email + contact-form endpoint (see "Contact form")
  icons.js                 Inline SVG icon set
  main.js                  Boot sequence
  style.css                Imports the layers below, in order
  styles/
    variables.css          Design tokens: colours, type, space, elevation
    base.css               Resets, base type, focus, reduced-motion
    layout.css             Container, sections, brand, pill nav, mega-menu
    components.css         Everything on the page + scroll choreography
    footer.css  legal.css  utilities.css
  legal.js                 Entry point for the three policy pages
  components/
    Navigation.js          Floating pill + mega-menu, focus trap
    ScrollFx.js            Line-by-line heading reveals, parallax, counters
    Figures.js             FIG promise cards (data/figuresData.js)
    Ways.js                Engagement models (data/waysData.js)
    Work.js                Live client work (data/workData.js)
    Services.js            Service cards (data/servicesData.js)
    Portfolio.js           Filterable standards (data/portfolioData.js)
    Faq.js                 Accordion (data/faqData.js)
    ContactModal.js        Dialog, focus trap, submission
  data/                    All page copy that isn't in the HTML
```

## Editing copy

Work, figures, ways to work, services, standards and FAQ entries live in `src/data/`. Add or
reorder an object and the page follows: nothing else to touch. Section
headings, the hero and the statement section live directly in `index.html`.

The menu's groups and links are plain markup in the `<nav id="nav-menu">`
block of each page.

## Adding a project

Append an object to `src/data/workData.js` and drop its screenshot in
`public/work/`. The first entry with `featured: true` gets the wide two column
layout; the rest fall into the grid below it. Shots are captured at 1440x980
and saved around 1600px wide as JPEG.

## Contact form

`src/config.js` has `formEndpoint`. Leave it empty and the form opens the
visitor's mail client with the inquiry pre-filled, so nothing is silently
dropped. Set it to a Formspree / Basin / Web3Forms URL: or your own route: and the form POSTs JSON (`name`, `email`, `project`, `notes`) instead.

## Design tokens

Everything visual comes from `src/styles/variables.css`. Change `--brand`
and its `-strong` / `-ink` / `-soft` / `-line` companions to re-skin the site.
Display type is driven by `--display-weight`, `--display-tracking` and
`--display-leading`.

Full-bleed sections use the `--wash-*` tokens, applied with the `.band-cream`,
`.band-sky` and `.band-haze` classes (and directly on the hero and statement
sections). Every wash is designed to carry black type, not tinted ink.

## Motion

Headings marked `data-split` are measured after layout and rebuilt one typeset
line per mask, so each line rises in on scroll. `.reveal` lifts a block in,
`[data-reveal-group]` staggers its children, `[data-parallax="0.1"]` drifts a
layer against the scroll, `[data-parallax-children]` alternates that drift
across a row of cards, and `[data-count]` counts a numeral up. All of it is
skipped under `prefers-reduced-motion`.

The hero's radiating tick marks are a plain inline SVG turned by one CSS
`rotate` animation: no canvas, no WebGL, nothing to lazy-load.

## Before going live

- Set the canonical URL and `og:url` in `index.html` (both are commented out).
- Point `siteConfig.formEndpoint` at a real endpoint.
- Confirm the LinkedIn URL in the footer and `src/config.js`.
