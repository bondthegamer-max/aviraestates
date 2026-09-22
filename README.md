# aviraestates.com

Static marketing site for Avira — two service lines:

| Page | What it is |
|---|---|
| `index.html` | Parent brand home — both service lines |
| `estates.html` | Avira Estates — Siolim (24 private-pool residences) |
| `stays.html` | Avira Stays — property management + rooms in Vagator |
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

## Pages

- `index.html`   — parent hub: what we do, how the two lines fit together, enquiry form
- `estates.html` — Real Estate division (the Siolim development)
- `stays.html`   — Hospitality division (Avira Stays)
- `about.html`   — About us, Mission, Vision, the two divisions, contact

## Navigation

Two tiers. Tier 1 (`.nav`) is identical on every page and carries the four
divisions: Real Estate, Hospitality, About, Contact. The current one is marked
`aria-current="page"` and underlined in the service-line colour. Tier 2
(`.subnav`) carries the anchors local to whichever page you are on.

Both tiers pin together on desktop inside `.navstack`. On phones that wrapper
becomes `display: contents` so only the brand bar pins and the second tier
scrolls away.

Service-line colour comes from `--spine`: orange (`--accent`) on Real Estate,
maroon (`--stays`) on Hospitality, set by `body.line-estates` / `body.line-stays`.

## Logos

`img/logo-avira*.svg` — three lockups, each with a reversed variant for dark
grounds. Nav uses the parent Avira mark on every page; each footer carries its
own division lockup. Full kit and usage rules: `Avira-ui/logo/README.md`.
