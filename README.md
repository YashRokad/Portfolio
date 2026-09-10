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
| Theme | Dark only |

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
                           WorkList, Preview, Marquee, Magnetic, Stat,
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
| `GET` | `/api/projects` | Card-level fields for every project |
| `GET` | `/api/projects/:slug` | One full case study, plus a `next` pointer |
| `GET` | `/api/testimonials` | Testimonial list |
| `GET` | `/api/about` | Everything about the person and the site's standing copy |
| `POST` | `/api/messages` | Validates and appends to `server/data/messages.json` |

No component calls `fetch` directly — everything goes through `data-client/api.js`.

## 4. Animation inventory

| Where | What | Lives in |
|---|---|---|
| First load | One-time masked char reveal + counter, gated by `sessionStorage` | `components/Loader/Intro.jsx` |
| Global | Dot + lagging ring cursor with contextual labels (`View`/`Read`/`Drag`/`Copy`), `mix-blend-mode: difference`, off on touch | `components/Cursor/Cursor.jsx` |
| Global | Smooth scroll on GSAP's ticker | `hooks/useSmoothScroll.js` |
| Global nav | Magnetic pill on desktop links; full-screen mobile takeover whose close is a true timeline reverse | `components/Header/Header.jsx` |
| Route change | Five-panel curtain wipe gating the actual navigation | `components/Transition/TransitionProvider.jsx` |
| Home hero | Char-stagger headline, drifting mesh, animated scroll cue | `components/Hero/Hero.jsx` |
| Selected work | Masked row reveal + cursor-following live preview panel | `components/WorkList` + `components/Preview` |
| Work grid | `Flip` filter re-flow, staggered card reveal, Ken-Burns image scale | `pages/Work/Work.jsx` |
| Grid → detail | `Flip` shared-element morph from card image to detail hero, with a cross-fade fallback | `animations/flipBridge.js` + `parts/ProjectHero.jsx` |
| Detail | Sticky section rail driven by per-section ScrollTriggers | `parts/SectionRail.jsx` |
| Detail | Metrics count up while scrambling their digits | `hooks/useCountUp.js` |
| Detail | Journey map pinned and scrolled horizontally | `parts/JourneyMap.jsx` |
| Detail | Persona expand, staggered pain-point cards | `parts/PersonaCard.jsx`, `ProjectDetail.jsx` |
| Detail | Inertia-draggable visual-design gallery | `parts/Gallery.jsx` |
| About | Timeline reveal with a scrubbed connecting line; two opposing marquees; pinned split-scroll | `pages/About/About.jsx` |
| Contact | Magnetic email, clipboard copy with an icon morph, pulsing availability dot, GSAP focus states | `pages/Contact/Contact.jsx` |
| Footer | Marquee CTA, magnetic social links | `components/Footer/Footer.jsx` |

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
| `accent` | Per-project accent driving borders, badges, rail ticks, preview frame |
| `cover` | Card image, preview panel, detail hero, next-project thumbnail |
| `about` | §2 About project |
| `metrics[]` `{value, prefix, suffix, decimals, label, note}` | §3 Impact metrics — `value` is the number the counter scrambles into |
| `research.intro`, `research.methods[] {name, detail}` | §4 method cards |
| `research.insight`, `research.insightAttribution` | §4 pull-quote callout |
| `painPoints[] {label, detail}` | §5 pain-point cards |
| `competitiveAudit.competitors[] {name, verdict}` | §6 audit rows |
| `competitiveAudit.whitespace` | §6 whitespace-opportunity panel |
| `personas[] {name, role, goal, frustration, quote}` | §7 persona cards (initials are derived from `name`) |
| `journey.label`, `journey.stages[] {name, detail, emotion, tone}` | §8 pinned horizontal map. `tone` is `low` / `mid` / `high` / `neutral` and colours the card edge and emotion dot |
| `solutions[] {name, resolves, detail}` | §9 — `resolves` should quote the matching `painPoints[].label` |
| `visualDesign.statement` | §10 curatorial statement |
| `visualDesign.gallery[] {src, caption}` | §10 draggable gallery |
| `next` | Generated by the API from list order — do not author it |

### `about.js`

| Field | Feeds |
|---|---|
| `name`, `role`, `location` | Wordmark, hero meta, footer |
| `portrait` | Home about-teaser and About page portrait — **drop a real photo at `client/public/media/portrait.svg`, or change this path** |
| `heroHeadline`, `heroSub` | Home hero |
| `aboutHeadline`, `introStatement` | About page headline and lead; `introStatement` also leads the Work page |
| `philosophy[] {title, body}` | About — approach cards |
| `timeline[] {period, role, org, note}` | About — career timeline |
| `skills[]` | Home skills strip and the two About marquees |
| `tools[] {name, use}` | About — stack list |
| `capabilities[] {title, body, deliverables[]}` | Home capabilities grid; first four also feed the About split-scroll |
| `process[] {step, title, body}` | Home process list |
| `stats[] {value, suffix, label, note}` | Home proof strip counters |
| `personalNote` | Home about-teaser and About page |
| `availability {status, label, detail}` | Contact status dot (`available` green, `busy` amber) and CTA bodies |
| `contact {email, phoneNote, socials[]}` | Contact page, footer, mobile menu |
| `faq[] {q, a}` | Contact mini-FAQ |
| `closingCta {line, action}` | Footer marquee and the home closing banner |

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
- Every interactive element is keyboard-reachable with a visible focus ring; Escape closes
  the mobile menu and returns focus to its toggle.
- The contact form appends to `server/data/messages.json`; copy-to-clipboard morphs its icon.

## 7. Known follow-ups

- Placeholder media is generated SVG. Real screenshots and a real portrait are a
  file-drop, per §5.
- Case-study content is invented. Company names are fictional.
- The seed script overwrites `projects.json`, `about.json` and `testimonials.json` on every
  run; `messages.json` is only created if missing.
- Hospitality and SaaS filter tabs are present but currently empty — the empty state is
  built and handled.
