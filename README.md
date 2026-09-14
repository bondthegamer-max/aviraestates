# aviraestates.com

Static marketing site for Avira — two service lines:

| Page | What it is |
|---|---|
| `index.html` | Parent brand home — both service lines |
| `estates.html` | Avira Estates — Siolim (24 private-pool residences) |
| `stays.html` | Avira Stays — property management + Trayantaa Stays, Vagator |
| `site.css` | Shared stylesheet, built on the Avira-ui design tokens |
| `site.js` | Floor-plan tabs + WhatsApp enquiry hand-off |
| `img/` | Project renders, floor plans, logo |

No build step, no dependencies, no server code. Served as-is.

## Deployment
GitHub Pages, from `main` / root. `CNAME` pins the custom domain;
`.nojekyll` skips Jekyll processing.

## Editing
Plain HTML and CSS. `site.css` holds the design tokens at the top —
colours, type and spacing all derive from them.
