/**
 * The three shapes an engagement actually takes. More useful to a prospect
 * than a guessed timeline, because it answers "how does this work" before
 * they have to ask.
 */
export const waysData = [
  {
    id: 'project',
    name: 'Project',
    terms: 'Fixed scope · Milestone payments',
    pitch: 'A defined thing, built and handed over.',
    body: 'We scope it once, agree a date, and ship it. Payments land on milestones you can see, not hours you have to trust.',
    bestFor: ['A new site or product', 'A rebuild that is overdue', 'A launch with a hard date'],
    cta: 'Scope a project',
    featured: false
  },
  {
    id: 'sprint',
    name: 'Sprint',
    terms: 'Two weeks at a time · Cancel anytime',
    pitch: 'Two weeks of us, pointed at whatever matters most.',
    body: 'You set the priority on Monday. We work in the open and hand over whatever is finished on Friday week. Stop whenever it stops being worth it.',
    bestFor: ['A backlog that never clears', 'A redesign in stages', 'Testing us before a bigger build'],
    cta: 'Book a sprint',
    featured: true
  },
  {
    id: 'embedded',
    name: 'Embedded',
    terms: 'Monthly · Your tools, your process',
    pitch: 'We join your team and work the way you already do.',
    body: 'Your tracker, your standups, your review process. An extra pair of hands on design, front end or infrastructure, without the hiring cycle.',
    bestFor: ['A team short a designer', 'Front end capacity for a quarter', 'Infrastructure nobody owns'],
    cta: 'Embed us',
    featured: false
  }
];
