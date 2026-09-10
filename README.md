# Portfolio — interactive UX case-study site

A hand-built dark-theme portfolio for a senior product designer. React + Vite on the
front, a small Express server reading and writing a local JSON file store on the back.
All content — case studies, about, testimonials — comes from that store, so swapping in
real projects is a content-only edit.

```bash
npm install
npm run dev      # boots the API (5174) and the client (5173) together
```

Open http://localhost:5173. `/styleguide` renders every design token.

| Command | Does |
|---|---|
| `npm run dev` | Client + server together via `concurrently` |
| `npm run seed` | Rewrites the JSON store and regenerates placeholder media |
| `npm run build` | Production client bundle into `client/dist` |
| `npm start` | Express serving the API **and** the built client on 5174 |

---

## 1. Stack

| Layer | Choice |
|---|---|
| Frontend | React 18 + Vite, React Router v6 |
| Backend | Node + Express over a local JSON file store (`server/data/*.json`) |
| Animation | GSAP 3 — ScrollTrigger, Flip, Draggable, InertiaPlugin, CustomEase, ScrambleText |
| Split text | Hand-rolled utility (`client/src/animations/splitText.js`) |
| Scroll | Lenis, driven from GSAP's ticker so ScrollTrigger never disagrees with it |
| Styling | Hand-written CSS Modules + a token layer. No UI kit. |
| Font | Manrope only, self-hosted variable font (300–800) |
| Theme | Dark only, and monochrome — white is the accent |

## 2. Layout

```
client/
  index.html
  vite.config.js
  public/fonts/            self-hosted Manrope (latin, latin-ext)
  public/media/            generated placeholder covers, UI shots, portrait
  src/
    animations/            gsapConfig.js · splitText.js · flipBridge.js
    components/            Header, Footer, Layout, Cursor, Transition, Hero,
                           FeaturedWork, DesignShots, Capabilities, WorkList,
                           Marquee, Magnetic, Stat,
                           SectionHeading, Testimonials, CtaBanner, Loader
    data-client/           api.js (only place that calls fetch) · useApi.js
    hooks/                 useMotionPreference · useSmoothScroll · useReveal
                           useMagnetic · useCountUp · usePageTitle
    pages/                 Home · Work · ProjectDetail · About · Contact
                           StyleGuide · NotFound
    styles/                tokens.css · reset.css · global.css
server/
  index.js                 boots, seeds if empty, serves /api and the built client
  routes/api.js            the four endpoints
  store.js                 read/write helpers over server/data
  seed.js                  writes the dataset · generateMedia.js draws the SVG assets
  content/                 projects.js · about.js · testimonials.js  ← edit these
  data/                    generated JSON store (projects, about, testimonials, messages)
```

## 3. API

| Method | Route | Returns |
|---|---|---|
| `GET` | `/api/projects` | Card-level fields (plus `metrics`, for the featured showcase) |
| `GET` | `/api/projects/:slug` | One full case study, plus a `next` pointer |
| `GET` | `/api/shots` | Design-shot list for the scroll-driven section |
| `GET` | `/api/testimonials` | Testimonial list |
| `GET` | `/api/about` | Everything about the person and the site's standing copy |
| `POST` | `/api/messages` | Validates and appends to `server/data/messages.json`. Still live, but nothing in the UI posts to it since the contact form was removed |
| `POST` | `/api/subscribers` | Footer newsletter signup — appends to `server/data/subscribers.json`, de-duplicated by address |

No component calls `fetch` directly — everything goes through `data-client/api.js`.

### Chapter structure

Every case-study section shares one frame: a sticky rail on the left carrying
the section number and its name set as a heading, and a wide content column
beside it. That rail is what gives the page a spine now that there are no
card outlines. Sections marked `wide` narrow the rail so tables and galleries
get more room.

### Shape

Corners are square. `--radius-sm/md/lg` are all `0`; the only rounding in the
product is `--radius-button` at 8px on actual buttons, and `--radius-pill` on
the handful of genuinely circular things (avatars, status dots). Solid button
fills use `--fill-solid`, a mild white rather than pure `#fff`.

### Colour

The interface is monochrome by design. `--accent` is white; hierarchy comes
from weight, scale and opacity rather than hue. `--state-negative` is the one
survivor — a form error has to be able to shout. Journey emotion is drawn as a
four-bar level (`--tone-low` … `--tone-high`), not as red-amber-green.
Separation is carried by space and hairline rules; there are no card fills or
outlines around content.

## 4. Animation inventory

| Where | What | Lives in |
|---|---|---|
| First load | One-time masked char reveal + counter, gated by `sessionStorage` | `components/Loader/Intro.jsx` |
| Global | Dot + lagging ring cursor with contextual labels (`View`/`Read`/`Drag`/`Copy`), `mix-blend-mode: difference`, off on touch | `components/Cursor/Cursor.jsx` |
| Global | Smooth scroll on GSAP's ticker | `hooks/useSmoothScroll.js` |
| Global nav | Menu button at every width opening a right-hand panel: page blurs and dims, panel slides in, links unmask by word, footer columns rise. Closing reverses the same timeline, so it is the exact inverse | `components/Header/Header.jsx` |
| Route change | Five-panel curtain wipe gating the actual navigation | `components/Transition/TransitionProvider.jsx` |
| Home hero | Full-bleed image with scroll parallax, char-stagger wordmark, pill marquee, scroll cue | `components/Hero/Hero.jsx` |
| Design shots | Pinned section where scroll drives a *fractional* index — the name column slides continuously and images cross-fade by distance from it, so there is no step or snap | `components/DesignShots/DesignShots.jsx` |
| Selected work | One case study: the frame unmasks, the image scales in and parallaxes, the title unmasks across its lower edge, headline numbers scramble-count | `components/FeaturedWork/FeaturedWork.jsx` |
| What I do | Ruled rows whose rules wipe in on scroll; hovering a row lifts the name, colours its rule, expands its tags and slides a still into the column gutter | `components/Capabilities/Capabilities.jsx` |
| Work grid | Aligned two-column image listing — square covers with a slow zoom on hover, name and outcome line beneath. `Flip` filter re-flow and staggered reveal on top | `pages/Work/Work.jsx` |
| Grid → detail | `Flip` shared-element morph from card image to detail hero, with a cross-fade fallback | `animations/flipBridge.js` + `parts/ProjectHero.jsx` |
| Detail hero | Date + oversized light-weight name, meta ledger, breathing accent glow, full-bleed image | `parts/ProjectHero.jsx` |
| Detail | Full-width read-progress bar flush to the bottom edge, driven from a ScrollTrigger on the article | `components/ScrollProgress/ScrollProgress.jsx` |
| Detail | Full-bleed chapter bands that unmask and parallax between sections | `parts/ImageBand.jsx` |
| Detail | Competitive matrix with the "ours" column pulled forward; falls back to ruled verdicts | `parts/AuditTable.jsx` |
| Detail | Metrics count up while scrambling their digits | `hooks/useCountUp.js` |
| Detail | Journey map as a real map — stages across, dimensions down, sticky row labels, emotional register drawn as level rather than colour | `parts/JourneyMap.jsx` |
| Detail | Personas fully open, goals set against frustrations in two columns | `parts/PersonaCard.jsx` |
| Detail | Inertia-draggable visual-design gallery | `parts/Gallery.jsx` |
| About | Timeline reveal with a scrubbed connecting line; two opposing marquees; pinned split-scroll | `pages/About/About.jsx` |
| Contact | The address set as the page headline with a char-stagger reveal, magnetic pull, clipboard copy with an icon morph, pulsing availability dot | `pages/Contact/Contact.jsx` |
| Footer | Newsletter signup with a drawn focus rule, magnetic subscribe button, oversized sunken wordmark | `components/Footer/Footer.jsx` |

Every animation is created inside a `gsap.context()` scoped to its component and reverted
on unmount, so no ScrollTriggers survive a route change.

### Reduced motion

`prefers-reduced-motion: reduce` is detected in `hooks/useMotionPreference.jsx` and
changes behaviour rather than just shortening durations: the intro is skipped, the custom
cursor is not rendered at all, Lenis is not booted (native scroll takes over), every pin
and horizontal hijack is dropped for a stacked layout, parallax and drag are disabled, and
reveals become plain cross-fades.

## 5. Content-swap guide

Real case studies go into `server/content/*.js`, then `npm run seed`. Nothing in
`client/src` needs to change. Field → UI mapping:

### `projects.js` — one object per case study

| Field | Feeds |
|---|---|
| `slug` | URL at `/work/:slug`, and the Flip morph identity |
| `title` | Card title, detail hero headline, next-project link |
| `tagline` | Outcome line under every title, in the work list and the grid |
| `summary` | Short card line (list endpoint only) |
| `industry` | Filter tab matching on `/work`, badges, detail eyebrow |
| `year`, `role`, `timeline`, `team`, `tools[]`, `client` | Detail hero meta block (§1) and the About-project client line |
| `accent` | Per-project UI accent. White across the board — the interface carries no hue |
| `artTone` | A quiet grey used *only* by the media generator, so covers and bands differ slightly without colouring the UI |
| `cover` | Card image, detail hero, next-project thumbnail |
| `bands {about, problem, solution}` + matching `*Caption` | The three full-bleed chapter bands on the detail page. Every one is optional — omit a key and that band simply does not render, so a case study with fewer visuals has fewer bands |
| `about` | §2 About project |
| `metrics[]` `{value, prefix, suffix, decimals, label, note}` | §3 Impact metrics — `value` is the number the counter scrambles into |
| `research.intro`, `research.methods[] {name, detail}` | §4 method cards |
| `research.insight`, `research.insightAttribution` | §4 pull-quote callout |
| `painPoints[] {label, detail, evidence?}` | §5 ruled rows — `evidence` renders as a sourced footnote under the detail, and is optional |
| `competitiveAudit.matrix {caption, dimensionLabel, columns[{name, ours}], rows[{label, values[]}]}` | §6 comparison table when present — mark your own column `ours: true`. Cells reading yes/no/none are toned automatically |
| `competitiveAudit.competitors[] {name, verdict}` | §6 ruled fallback when there is no `matrix` |
| `competitiveAudit.whitespace` | §6 whitespace-opportunity panel |
| `personas[] {name, role, quote, photo?, company?, region?, tech?, goals[]?, frustrations[]?, note?}` | §7 portrait-led rows: the photo carries an identity plate, the quote is set at size beside it, and `goals`/`frustrations` are laid out against each other line by line. The older singular `goal`/`frustration` still work. `photo` defaults to a generated silhouette placeholder — drop a real portrait at the same path |
| `journey.label`, `journey.stages[] {name, goal, actions, touchpoints, pain, opportunity, emotion, tone}` | §8 journey map table — one column per stage, one row per dimension. Any dimension absent from every stage drops its row entirely; a stage carrying only the older `detail` field falls back into the Actions row. `tone` (`low`/`mid`/`neutral`/`high`) drives the four-bar emotional register |
| `solutions[] {name, resolves, detail}` | §9 — `resolves` should quote the matching `painPoints[].label` |
| `visualDesign.statement` | §10 curatorial statement |
| `visualDesign.gallery[] {src, caption}` | §10 draggable gallery |
| `next` | Generated by the API from list order — do not author it |

### `about.js`

| Field | Feeds |
|---|---|
| `name`, `role`, `location` | Wordmark, hero meta, footer |
| `portrait` | Home about-teaser and About page portrait — **drop a real photo at `client/public/media/portrait.svg`, or change this path** |
| `heroImage` | Full-bleed home hero backdrop — **drop the real photograph at `client/public/media/hero-backdrop.svg`, or point this at a `.jpg`** |
| `wordmark` | The oversized name across the bottom of the hero |
| `ledger[] {label, body}` | The About page label/answer rows |
| `heroHeadline` | The standing statement mid-left in the hero |
| `heroSub` | The paragraph under the hero wordmark |
| `aboutHeadline`, `introStatement` | About page headline and lead; `introStatement` also leads the Work page |
| `philosophy[] {title, body}` | About — approach cards |
| `timeline[] {period, role, org, note}` | About — career timeline |
| `skills[]` | Home skills strip and the two About marquees |
| `tools[] {name, use}` | About — stack list |
| `capabilities[] {slug, title, body, deliverables[], accent, image}` | The What-I-do rows — `body` is one line, `deliverables` become the tags revealed on hover, `image` is the still that slides into the gutter |
| `process[] {step, title, body}` | Home process list |
| `stats[] {value, suffix, label, note}` | Home proof strip counters |
| `personalNote` | Home about-teaser and About page |
| `availability {status, label, detail}` | Contact status dot (`available` green, `busy` amber) and CTA bodies |
| `contact {email, phoneNote, socials[]}` | Contact page headline, footer, menu panel |
| `footer {newsletterLabel, newsletterLine, location[], contacts[{label, value}], credit}` | The footer's newsletter block, Location column, contact row and copyright line |
| `faq[] {q, a}` | Contact mini-FAQ |
| `closingCta {line, action}` | Footer marquee and the home closing banner |

### `shots.js` — the design-shots section

| Field | Feeds |
|---|---|
| `name`, `subtitle` | The scrolling name column |
| `tags[]` | Pills over the top-right of the image |
| `year`, `note` | Caption block over the bottom of the image |
| `accent` | The year colour and the stacked-card accent |
| `image` | The cross-fading image |

Order in the file is the scroll order. Add or remove entries freely — the
scroll runway is computed from the count.

### `testimonials.js`

`quote`, `name`, `role`, `org`, `initials`, `accent` → the avatar-dot testimonial
swapper on the home page.

### Replacing the placeholder imagery

`server/generateMedia.js` draws every SVG in `client/public/media`. To use real assets,
drop files in with the same names referenced by `cover` / `gallery[].src` / `portrait`,
and delete the `generateMedia()` call from `seed.js`.

## 6. Verified

- `npm run dev` boots both processes; **zero console errors or warnings** on all ten routes.
- Manrope is the only typeface, self-hosted, confirmed loaded (not a fallback).
- All four case studies render all eleven sections in the required order.
- Twelve route pairs transition through the curtain and land on the right URL.
- No horizontal overflow at 390 / 480 / 834 / 1440 / 1920.
- ScrollTrigger and tween counts are flat between 12 and 24 navigations — no leaks.
- Body text passes WCAG AA (`--text-primary` 16.2:1, `--text-secondary` 7.4:1,
  `--text-tertiary` 4.8:1 on the lightest surface).
- Every interactive element is keyboard-reachable with a visible focus ring. The menu
  panel traps Tab, closes on Escape, and hands focus back to its toggle once the close
  animation finishes.
- The contact form appends to `server/data/messages.json`; copy-to-clipboard morphs its icon.

## 7. Known follow-ups

- Placeholder media is generated SVG. Real screenshots and a real portrait are a
  file-drop, per §5.
- Case-study content is invented. Company names are fictional.
- The seed script overwrites `projects.json`, `about.json` and `testimonials.json` on every
  run; `messages.json` is only created if missing.
- The contact page has no form — the email address is the page. The footer's newsletter
  signup is the only form left, and `studio@yashrokad.design` in the footer contacts is
  invented placeholder copy.
- APTEN's audit matrix lists competitors only — its own column was removed at the
  client's direction, so the `ours` column flag is supported but currently unused.
- APTEN is seeded as the second case study, transcribed from the supplied research PDFs.
  Fields still carrying a PLACEHOLDER marker: tagline, role, timeline, team, all four
  impact metrics, the visual-design statement, every gallery caption and the three band
  captions.
- The home page runs hero → design shots → one featured case study → what I do →
  process → proof → testimonials → about teaser → CTA. Only the first project is
  featured; the full grid lives on `/work`.
- Hospitality and SaaS filter tabs are present but currently empty — the empty state is
  built and handled.
- Site navigation now lives entirely in the menu panel — there is no persistent desktop
  nav row. The footer still carries page links as a secondary path.
- The cursor-following work preview was removed at the client's direction (it could be
  left stranded over a section when the pointer left without a move event). Grid cards
  still morph into the detail hero via `Flip`; home list rows use the curtain transition.
- The menu scrim's `backdrop-filter` blur is applied and computes correctly, but headless
  Chromium does not composite it, so it is unverified in screenshots — check it in a real
  browser.
- The About page was simplified to a single ledger at the client's direction. The
  philosophy cards, the separate career timeline section and the pinned split-scroll
  were removed; `about.philosophy` is still in the data if any of it should come back.
