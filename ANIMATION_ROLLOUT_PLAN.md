# Site-wide Animation Rollout Plan

**Audience:** an LLM (Claude Opus 4.8 / Sonnet 4.6 or similar) executing in
Claude Code with file edit + bash + playwright. Self-contained — no prior
session context required.

**Goal:** extend the motion pattern already shipped for `/` (home) and
`/chips` (chips category) to every other route in the site, one page at a
time, in a consistent and verifiable way.

**Status snapshot at time of writing**

| Route | State |
| --- | --- |
| `/` | DONE — `src/pages/home/HomePage.css` (HomePage.jsx is PROTECTED — never edit) |
| `/chips` | DONE — chips block at the bottom of `src/pages/category/CategoryPage.css`, scoped to `.category-main--chips`. Hero packs wrapped in `.chips-wide-hero-ring` in `CategoryPage.jsx`. |
| Header nav | DONE — hover rule in `public/styles.css` (uses `--color-accent-light`) |
| Product subnav | DONE — hover rule in `src/components/ProductSubNav.css` |
| All other routes | TO DO — listed below |

---

## 0. How to read this doc

Each route has a self-contained section with:

- **URL** — the route to visit (dev server: `http://127.0.0.1:5173`).
- **Files** — JSX path(s), CSS path(s), and the scoping class.
- **Audit checklist** — concrete elements to inspect on this page.
- **Entrance motions** — what to animate on first paint.
- **Hover/focus motions** — what to animate on user interaction.
- **Scroll reveals** — what to fade-up as the user scrolls down.
- **Quirks / traps** — page-specific gotchas.

Work one route at a time. Open the page in a browser tab as you go.

---

## 1. The Established Pattern (read this first)

Everything below was derived from the home page and chips page work.
Re-apply it. Don't reinvent it.

### 1.1 Where animation CSS lives

- **Animation CSS lives with the page** that owns it, not in
  `public/styles.css`. The only exception is the *header nav* hover
  (which lives in `public/styles.css` because that's where `.nav-list`
  is defined) and the `--color-accent-light` design token (also in
  `public/styles.css` because it's site-wide).
- Each page has its own `*.css` file in `src/pages/<page>/` —
  reuse it. Append a clearly-fenced "motion layer" block at the bottom.
- Some pages also have a `*.mobile.css` imported at the top of the
  desktop sheet via `@import`. Leave the mobile sheet alone unless
  there's a mobile-only motion rule needed.
- `HomePage.jsx` is **PROTECTED** by a header banner — never edit it.
  Everything was done CSS-only on the home page. Use the same
  CSS-only approach by default; only add JSX wrappers when a `transform`
  effect *requires* a wrapper (see chips hero ring as the one example).

### 1.2 Scoping

Every rule you add must be scoped to the page it belongs to so it can't
leak. Use the page's existing top-level class, e.g.:

- Home: top-level elements are unique to home (`.hero`, `.mood-section`,
  `.story-section`, etc.) — they're effectively self-scoped, but if you
  add a generic-sounding selector, prefix it with the section class.
- Category pages share `CategoryPage.css` and 9 different `pageKey`s —
  always scope as `.category-main--<key> .selector` (e.g.
  `.category-main--namkeen .category-product-card`).
- Investor pages share the same chrome — scope as `.investor-main--<key>`
  where the page is unique, and `.investor-main` where shared.
- Other pages have their own root class (`.about-main`, `.career-main`,
  `.dealers-main`, `.contact-main`, `.achievements-main`,
  `.exports-main`) — scope under it.

### 1.3 The compose-over-transform rule (CRITICAL)

Many cards in this codebase carry a *resting* `transform: rotate(...)`
or `transform: rotate(...) skewX(...)` to give them a tilted look (e.g.
`.product-card--lavender`, `.story-photo-bg`, `.partner-panel`,
`.tilt-left`, `.chips-wide-pack-chilli`, etc.).

If your animation also touches `transform`, you will *clobber* the
resting tilt. The fix used throughout home + chips:

- **Use the individual CSS properties `translate`, `scale`, `rotate`**
  for animations and hover changes. The browser composes them on top of
  `transform`, so tilts survive.

```css
/* GOOD — keeps the card's resting rotate(-2deg) */
.partner-panel:hover { translate: 0 -6px; scale: 1.02; }

/* BAD — flattens the resting rotation */
.partner-panel:hover { transform: translateY(-6px) scale(1.02); }
```

### 1.4 The `animation-fill-mode: both` trap

If you write an entrance animation with `animation: foo 0.7s ... both`,
the keyframe's final state is *pinned* on the element forever. That
means a later `:hover { scale: 1.12 }` will silently lose to the
animation's final `scale: 1`. Fix by marking the hover value
`!important`:

```css
.chips-wide-hero-pack:hover {
  scale: 1.12 !important;  /* beats chips-pack-in's pinned scale: 1 */
}
```

Only add `!important` when there is a real animation-vs-hover collision.

### 1.5 Motion-preference gating

All *ambient* and *entrance* motion goes inside:

```css
@media (prefers-reduced-motion: no-preference) { ... }
```

Hover/focus effects stay outside the media query (they are
user-initiated and considered acceptable for reduced-motion users).

### 1.6 Scroll-driven reveals — progressive enhancement

Use modern CSS view-timeline so we don't need a JS scroll observer.
Always wrap in `@supports` so browsers without view-timeline still show
content (they just won't have the fade-up):

```css
@media (prefers-reduced-motion: no-preference) {
  @supports (animation-timeline: view()) {
    .my-card {
      animation: rise 0.8s cubic-bezier(0.22, 1, 0.36, 1) both;
      animation-timeline: view();
      animation-range: entry 0% entry 45%;
    }
  }
}
```

Stagger grid siblings by varying `animation-range`:

```css
.my-card:nth-child(2) { animation-range: entry 4% entry 49%; }
.my-card:nth-child(3) { animation-range: entry 8% entry 53%; }
```

### 1.7 Keyframe naming

Prefix every keyframe with the page slug to avoid collisions across the
stylesheet bundle: `home-rise`, `chips-pack-in`, `about-rise`,
`investor-rise`, etc. Don't reuse a sibling page's keyframes (cheap,
predictable, no spooky cross-talk).

### 1.8 The site-wide hover convention (already shipped)

- `--color-accent` = `#be004b` (active state)
- `--color-accent-light` = `#cf336f` (hover preview of the active state)

**Header nav** (`public/styles.css`): non-active links lighten text +
underline to `--color-accent-light` on hover.

**Product subnav** (`src/components/ProductSubNav.css`): non-active
tabs get a `--color-accent-light` filled pill with white text on
hover.

When you add navigation/tab UIs on other pages (e.g. the investor
filter nav, year tabs), apply the same convention — active stays at
`--color-accent`, hover-non-active uses `--color-accent-light`.

### 1.9 Standard hover idioms (apply consistently)

| Element type | On hover |
| --- | --- |
| Primary CTA / button | `translate: 0 -3px; scale: 1.03;` + stronger `box-shadow`. `:active { translate: 0 -1px; scale: 1; }` |
| Card (with photo) | `translate: 0 -8px; scale: ~1.025`. Inside, `img { scale: 1.06; }`. Add `transition` to the card. |
| Tilted card (resting `transform: rotate`) | Same hover, but use `translate`/`scale` (per §1.3). |
| Icon inside a card | `scale: 1.12; rotate: -6deg;` with springy bezier |
| Form input/textarea on focus | `border-color: var(--color-accent); background: #fff; box-shadow: 0 0 0 3px rgba(190, 0, 75, 0.12);` |
| Link with arrow | Slide the arrow on hover: `translate: 6px 0;` (rotate slightly for whimsy) |
| Carousel arrow / icon button | `scale: 1.12;` + soft glow shadow |
| Floating PNG (no card behind it) | `translate: 0 -10px; scale: 1.1;` + `filter: drop-shadow(...)` (because PNG has no card boundary) |
| Tab in a nav | `background: var(--color-accent-light); color: #fff;` on `:not(.is-active):hover` |

Transition curve defaults:
- General lift: `cubic-bezier(0.22, 1, 0.36, 1)` (smooth ease-out).
- Springy/playful (icons, pack pops): `cubic-bezier(0.34, 1.56, 0.64, 1)`.
- Duration: `0.3s`–`0.4s` for hover, `0.6s`–`0.9s` for entrance.

### 1.10 Standard entrance idioms

| Element | Animation |
| --- | --- |
| Background wash / gradient | `bg-grow`: fade in + `scale: 1.05 → 1` |
| Headline | Reveal `<span>`-by-`<span>` if multi-line, else just `rise` from 28px below |
| Subhead / paragraph | `rise` delayed 150–250ms after headline |
| Primary CTA | `pop` (scale 0.6 → 1.08 → 1) delayed 400–600ms |
| Hero product photo | `rise` (or `rise-left`/`rise-right` if asymmetric layout) |
| Floating chips / tags / badges | `pop` then optional continuous `bob` (translate ±10px) — use sparingly |
| Cards in a grid | scroll-reveal `rise`, staggered by `animation-range` |

### 1.11 Standard keyframe set to copy into each page

Each page's motion block should declare its *own* prefixed copies of
these (don't try to share). Replace `<slug>` with the page slug.

```css
@keyframes <slug>-rise {
  from { opacity: 0; translate: 0 28px; }
  to   { opacity: 1; translate: 0 0; }
}
@keyframes <slug>-rise-left {
  from { opacity: 0; translate: -36px 0; }
  to   { opacity: 1; translate: 0 0; }
}
@keyframes <slug>-rise-right {
  from { opacity: 0; translate: 36px 0; }
  to   { opacity: 1; translate: 0 0; }
}
@keyframes <slug>-pop {
  0%   { opacity: 0; scale: 0.6; }
  70%  { opacity: 1; scale: 1.08; }
  100% { opacity: 1; scale: 1; }
}
@keyframes <slug>-bg-grow {
  from { opacity: 0; scale: 1.05; }
  to   { opacity: 1; scale: 1; }
}
```

Add ambient ones (`-float`, `-bob`) only if the page actually needs
them. Chips intentionally dropped its pack-float for restraint;
follow that lead — *less* ambient motion is usually better.

### 1.12 Per-page block layout (copy-paste template)

Append this block to the bottom of the page's CSS, with `<slug>` and
`<root>` substituted. Keep the comment header — it's the contract.

```css
/* =====================================================================
 * <PageName> page motion layer
 * ---------------------------------------------------------------------
 * Scoped to <root> so other pages are unaffected. CSS-only.
 *
 * Drives individual translate/scale/rotate so animations compose over
 * resting `transform: rotate(...)` on tilted elements. Ambient and
 * entrance motion are gated on prefers-reduced-motion. Scroll reveals
 * use @supports (animation-timeline: view()) so unsupported browsers
 * still show content.
 * ===================================================================== */

/* --- keyframes (prefixed) --- */
@keyframes <slug>-rise { ... }
/* ...other keyframes used by this page... */

/* --- hover / focus (always on) --- */
<root> .some-card {
  transition: translate 0.35s cubic-bezier(0.22, 1, 0.36, 1),
              scale 0.35s cubic-bezier(0.22, 1, 0.36, 1),
              box-shadow 0.35s ease;
}
<root> .some-card:hover { translate: 0 -8px; scale: 1.025; ... }

/* --- entrance + ambient (motion-preference gated) --- */
@media (prefers-reduced-motion: no-preference) {
  <root> .hero-bg { animation: <slug>-bg-grow 0.9s ease both; }
  <root> .hero-title { animation: <slug>-rise 0.75s cubic-bezier(0.22, 1, 0.36, 1) 0.1s both; }
  /* ... */

  @supports (animation-timeline: view()) {
    <root> .grid-card {
      animation: <slug>-rise 0.8s cubic-bezier(0.22, 1, 0.36, 1) both;
      animation-timeline: view();
      animation-range: entry 0% entry 45%;
    }
  }
}
```

### 1.13 Verification (run for every route before committing)

```bash
# dev server expected at 127.0.0.1:5173
cat > _check.mjs <<'EOF'
import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
const errs = [];
p.on('pageerror', e => errs.push(e.message));
p.on('console', m => { if (m.type()==='error') errs.push(m.text()); });
await p.goto('http://127.0.0.1:5173<ROUTE>', { waitUntil: 'networkidle' });
await p.waitForTimeout(2500);                 // entrance animations complete
await p.screenshot({ path: '/tmp/<route>.png', fullPage: true });
console.log('ERR:', errs.length ? errs.join('|') : 'none');
await b.close();
EOF
node _check.mjs && rm -f _check.mjs
```

Pass criteria:
- `ERR: none`
- Screenshot shows every section laid out correctly (entrance animations
  have settled to their final visible state).

If any section is invisible/clipped at t=2.5s, you have a stuck
animation — likely `opacity: 0` with no `both` fill-mode, or a hidden
`@supports`-gated rule that's running outside the supports block.

### 1.14 Commit hygiene

- One commit per page (e.g. "Add about page animation layer"), or one
  commit per logical batch (e.g. "Animate all 8 remaining category
  pages"). Don't mix unrelated changes.
- Don't touch unrelated working-tree files when staging. Use
  `git add <specific paths>`, never `git add -A`.
- Don't edit `src/pages/home/HomePage.jsx`.

### 1.15 Out-of-scope (do not animate)

- The footer (deliberately understated).
- Loading skeletons / spinners (don't exist on this site).
- The investor `<table>` rows (would feel busy; leave alone).
- PDF download icons in dense lists (a parent row hover is enough).

---

## 2. Route Index (work order)

Do the simple pages first; investor subroutes last (they share chrome,
so one cohesive pass covers all 16 at once).

| # | Route | Page file | CSS file | Scope root | Done? |
| - | --- | --- | --- | --- | --- |
| 0 | `/` | (protected) | `src/pages/home/HomePage.css` | (page-wide) | DONE |
| 0 | `/chips` | `src/pages/category/CategoryPage.jsx` | `src/pages/category/CategoryPage.css` | `.category-main--chips` | DONE |
| 1 | `/about` | `src/pages/about/AboutPage.jsx` | `src/pages/about/AboutPage.css` | `.about-main` (see §3.1) | TODO |
| 2 | `/exports` | `src/pages/exports/ExportsPage.jsx` | `src/pages/exports/ExportsPage.mobile.css` (split — see §3.2) | `.exports-main` | TODO |
| 3 | `/career` | `src/pages/career/CareerPage.jsx` | (only `CareerPage.mobile.css` exists — needs `CareerPage.css` created OR colocate in mobile file; see §3.3) | `.career-main` | TODO |
| 4 | `/contact` | `src/pages/contact/ContactPage.jsx` | `src/pages/contact/ContactPage.css` | `.contact-main` | TODO |
| 5 | `/dealers` | `src/pages/dealers/DealersPage.jsx` | `src/pages/dealers/DealersPage.css` | `.dealers-main` | TODO |
| 6 | `/achievements` | `src/pages/achievements/AchievementsPage.jsx` | `src/pages/achievements/AchievementsPage.css` | `.achievements-main` | TODO |
| 7 | `/beverages` | `src/pages/category/beverages-content.jsx` | `src/pages/category/beverages.css` (per-category split exists) | `.category-main--beverages` | TODO |
| 8 | `/getmore` | `src/pages/category/getmore-content.jsx` | `src/pages/category/getmore.css` | `.category-main--getmore` | TODO |
| 9 | `/namkeen` | `src/pages/category/namkeen-content.jsx` | `src/pages/category/CategoryPage.css` (no per-cat split yet — add one) | `.category-main--namkeen` | TODO |
| 10 | `/chikki` | `src/pages/category/chikki-content.jsx` | `src/pages/category/chikki.css` | `.category-main--chikki` | TODO |
| 11 | `/khakhra` | `src/pages/category/khakhra-content.jsx` | `src/pages/category/khakhra.css` | `.category-main--khakhra` | TODO |
| 12 | `/bakery` | `src/pages/category/bakery-content.jsx` | `src/pages/category/bakery.css` | `.category-main--bakery` | TODO |
| 13 | `/fryums` | `src/pages/category/fryums-content.jsx` | `src/pages/category/fryums.css` | `.category-main--fryums` | TODO |
| 14 | `/farali` | `src/pages/category/farali-content.js` | `src/pages/category/CategoryPage.css` (no per-cat split yet) | `.category-main--farali` | TODO |
| 15 | `/investor` (and 15 sub-routes) | `src/pages/investor/InvestorLayout.jsx` + sub-pages | `InvestorPage.css` + per-tab CSS | `.investor-main`, `.investor-main--<key>` | TODO |

Note on category CSS: the per-category split files (e.g. `bakery.css`,
`fryums.css`) are imported by their `*-content.jsx` files. Animation
CSS for that category belongs in the per-category file when it exists,
and at the bottom of `CategoryPage.css` (scoped to `.category-main--X`)
when no per-category file exists yet. If a per-category file is
missing, you may create it — mirror the existing pattern.

---

## 3. Per-route detail

For each route, **read the JSX file first** to verify section names
still match this doc (the codebase evolves). The audit lists are
starting points, not exhaustive truth — confirm before animating.

---

### 3.1 `/about`

**Files**
- JSX: `src/pages/about/AboutPage.jsx`
- CSS: `src/pages/about/AboutPage.css` (mobile is `AboutPage.mobile.css`; leave alone)
- Scope root: the JSX wraps everything in a top-level `<main>`. Confirm
  whether there is an `.about-main` class — if not, scope each rule
  under the section's own class (e.g. `.about-hero`, `.about-pillars`,
  `.about-manufacturing`). All classes are already `about-*` prefixed
  so leakage risk is low.

**Audit checklist** (sections found at time of writing)
- `.about-hero` — copy on left, two stacked photo cards on right
  (`.about-hero-card-wrap`, `.about-hero-left-card`,
  `.about-hero-right-card`)
- `.about-journey` (id `journey`) — likely a timeline/copy section
- `.about-pillars` — heading + grid of 4 `.pillar-card` (each has
  `.pillar-icon` + icon image like `.pillar-icon-quality`,
  `-innovation`, `-community`, `-taste`) and an `<h3>`/`<p>`
- `.about-manufacturing` — `.manufacturing-copy` + multiple
  `.manufacturing-feature` rows
- Likely more sections below — read the whole file before deciding

**Entrance motions** (gated)
- `.about-hero-copy` (`<h1>`/`<p>`) — `rise-left` cascade
- `.about-hero-card-wrap.about-hero-left-wrap` — `rise-right` 0.2s delay
- `.about-hero-right-wrap` — `rise-right` 0.35s delay
- Hero photo cards likely have resting tilt — use `translate`/`scale` only

**Hover motions**
- `.pillar-card` — lift `translate: 0 -8px; scale: 1.025`, shadow up,
  inside `.pillar-icon` `scale: 1.12; rotate: -6deg`
- `.about-hero-card` photo cards — gentle straighten + lift
  (`scale: 1.03`)
- `.manufacturing-feature` — lift if it has card chrome; otherwise
  slide-in the icon

**Scroll reveals**
- `.about-journey` step markers — staggered `rise`
- `.pillar-card` grid — `rise` with stagger on `:nth-child`
- `.manufacturing-feature` rows — `rise-left` (since they read L→R)

**Quirks / traps**
- Pillar cards may have a resting tilt or shadow — verify in CSS before
  you set `transform` (use individual props per §1.3).
- Two hero photo cards often have rotation — same rule.

---

### 3.2 `/exports`

**Files**
- JSX: `src/pages/exports/ExportsPage.jsx`
- CSS: ONLY `ExportsPage.mobile.css` exists in the JSX import. This is
  unusual — verify whether desktop styles live in `public/styles.css`
  or are colocated in the mobile file. If desktop styles are in
  `public/styles.css`, **still put motion CSS in the page directory**:
  create `src/pages/exports/ExportsPage.css`, import it from
  `ExportsPage.jsx` above the mobile import, and put the motion block
  there.
- Scope root: `.exports-main`

**Audit checklist**
- `.export-hero` with `.export-hero-grid` (copy on left, media on right)
- `.export-stats-row` with multiple `.export-stat` and dividers (rows of
  numeric stats — great for `pop` reveal)
- `.export-hero-media` with `.export-hero-gradient` and
  `.export-presence-card`
- `.export-story` with `.export-story-grid`,
  `.export-contact-card`, `.export-story-media`
- `.export-inquiry` form with `.export-field-grid`

**Entrance motions**
- Hero copy / stats — `rise-left` cascade
- Hero media — `rise-right`, gradient does `bg-grow`
- Stats numbers — `pop` each, staggered 100ms apart (great place for a
  small countup feel without actually counting up — just the pop is
  enough)

**Hover motions**
- `.export-presence-card`, `.export-contact-card` — card lift
- Form inputs — accent focus ring (§1.9)
- "Get in touch" CTA — primary-button lift

**Scroll reveals**
- `.export-stats-row` — children pop with stagger
- `.export-story` photo — `rise-right`
- `.export-inquiry` form — `rise`

**Quirks**
- The page is likely tall — make sure scroll reveals are inside
  `@supports (animation-timeline: view())` so older browsers don't see
  permanently-hidden sections.

---

### 3.3 `/career`

**Files**
- JSX: `src/pages/career/CareerPage.jsx`
- CSS: ONLY `CareerPage.mobile.css` is imported. Same situation as
  Exports — create `src/pages/career/CareerPage.css`, import it before
  the mobile sheet, and put motion there. (If a desktop sheet appears
  during reading, reuse that instead.)
- Scope root: `.career-main`

**Audit checklist**
- `.career-hero` with `.career-hero-copy`, `.career-hero-actions`,
  `.career-hero-media` (with `.career-hero-tilt`, `.career-hero-photo`,
  `.career-hero-gradient`, `.career-family-badge`)
- `.career-values` with `.career-values-grid` of `.career-value-card`
  (each has `.career-value-icon` with inline `backgroundColor` style)
- `.career-application` with `.career-form-grid`
- `.career-ready` (likely a CTA strip)

**Entrance motions**
- Hero copy — `rise-left` cascade
- `.career-hero-tilt` and `.career-hero-photo` — `rise-right` (tilt
  element is a decorative skewed shape; use `translate`/`scale` only)
- `.career-family-badge` — `pop` delayed after photo
- Hero gradient — `bg-grow`

**Hover motions**
- `.career-value-card` — lift; inside, `.career-value-icon` pops
  (the `backgroundColor` is inline — that's fine, just animate other
  props)
- Form inputs — accent focus ring
- "Apply now" / "Join Family" CTAs — primary-button lift

**Scroll reveals**
- `.career-value-card` siblings — staggered `rise`
- `.career-application` heading + form — `rise`

**Quirks**
- The `.career-hero-tilt` element is decorative — animate its opacity
  + scale only, no rotate (it has a fixed skew).
- `.career-family-badge` is a circular badge — `pop` reads great.

---

### 3.4 `/contact`

**Files**
- JSX: `src/pages/contact/ContactPage.jsx`
- CSS: `src/pages/contact/ContactPage.css`
- Scope root: `.contact-main`

**Audit checklist**
- `.contact-hero` with `.contact-hero-gradient`, `.contact-hero-texture`,
  `.contact-hero-inner` (copy + `.contact-hero-card`)
- `.contact-cards` — row of `.contact-card.contact-card--<tone>` with
  `.contact-card-icon.contact-card-icon--<tone>` (toned card variants —
  phone, email, etc.)
- `.contact-form-band` with `.contact-form-panel` and
  `.contact-form-grid`
- `.contact-map-section` with `.contact-map-actions` and two
  `.contact-map-card` (one `--office`, one `--plant`)
- `.contact-partner` (id `distributor`)
- `.contact-social`

**Entrance motions**
- Hero gradient — `bg-grow`
- Hero copy — `rise-left` cascade
- `.contact-hero-card` — `rise-right` with `pop` finish
- `.contact-cards` row — pop each card, staggered 100ms

**Hover motions**
- `.contact-card` — lift; icon `scale: 1.12; rotate: -6deg`
- `.contact-map-card` — lift + photo zoom if it has an image
- Map action chips (`.contact-map-actions` button-likes) — apply the
  same "active vs hover" convention as nav (accent vs accent-light) IF
  any chip can be "active". Otherwise just lift on hover.
- Form inputs — accent focus ring
- Submit button — primary-button lift

**Scroll reveals**
- Cards in `.contact-cards` — staggered pop
- Map cards — `rise-left` / `rise-right` (asymmetric pair)
- Form panel — `rise`
- `.contact-partner` and `.contact-social` — `rise`

**Quirks**
- Tone-based cards (`--<tone>`) often have a tinted background — the
  hover lift + shadow should NOT change background; let the existing
  tone read through.

---

### 3.5 `/dealers`

**Files**
- JSX: `src/pages/dealers/DealersPage.jsx`
- CSS: `src/pages/dealers/DealersPage.css`
- Scope root: `.dealers-main`

**Audit checklist**
- `.dealers-apply` — form section with `.dealers-apply-hero`,
  `.dealers-apply-title`, `.dealers-fields`, `.dealers-upload` with
  `.dealers-upload-drop`, `.dealers-submit-row`
- `.dealers-footprint` — `.dealers-footprint-copy` +
  `.dealers-footprint-stat` numbers + `.dealers-footprint-map`
  (decorative SVG/image)
- Stand-alone `.dealers-join` headline
- `.dealers-why` — heading + `.dealers-card-grid` of `.dealers-card`
  with `.dealers-card-icon.dealers-card-icon--<tone>`

**Entrance motions**
- `.dealers-apply-hero` headline — `rise` cascade
- `.dealers-apply-title` — `rise` delayed
- `.dealers-footprint-stat` numbers — `pop` each, stagger

**Hover motions**
- `.dealers-upload-drop` — border color shift to `--color-accent-light`,
  subtle scale; this is the only "drop zone" UI on the site, so make
  the hover feel inviting
- `.dealers-card` — lift; icon pops
- `.dealers-footprint-map` — gentle floating loop if it's a decorative
  SVG (translate ±6px, very slow ~8s — but only IF the design feels
  weighty enough; otherwise skip)
- Submit button — primary-button lift

**Scroll reveals**
- `.dealers-card-grid` cards — staggered `rise`
- `.dealers-footprint` copy + map — paired `rise-left`/`rise-right`

**Quirks**
- The upload drop is a *target* — hover must feel different from a
  passive card; use border + bg color shift (not just translate).
- Form sits ABOVE the footprint section — give the footprint a clear
  reveal to reward scrolling past the form.

---

### 3.6 `/achievements`

**Files**
- JSX: `src/pages/achievements/AchievementsPage.jsx`
- CSS: `src/pages/achievements/AchievementsPage.css`
- Scope root: `.achievements-main`

**Audit checklist**
- `.achievements-hero` with `.achievements-hero-texture`
- `.achievements-stats` — `.achievements-stats-list` of
  `.achievements-stat` items
- `.achievements-featured` — heading + `.achievements-featured-card`
  with `.achievements-featured-media` (and `.achievements-featured-shadow`)
  + `.achievements-featured-copy` (with `.achievements-award-label`,
  `.achievements-presented`)
- `.achievements-awards` — heading + `.achievements-awards-grid` of
  `.achievements-award` with `.achievements-award-card` and
  `.achievements-award-crop.<className>`
- `.achievements-cta` — bottom CTA strip with
  `.achievements-cta-bg` and `.achievements-cta-copy`

**Entrance motions**
- Hero texture — `bg-grow`
- Hero `<h1>` — `rise` cascade
- `.achievements-stat` items — `pop`, staggered
- `.achievements-featured-card` — `rise` (it's wide and visually heavy)

**Hover motions**
- `.achievements-award` cards — lift; the cropped photo inside
  `.achievements-award-crop` should `scale: 1.05`
- `.achievements-featured-card` — subtle lift; the shadow expands.
- CTA button — primary-button lift

**Scroll reveals**
- `.achievements-award` grid — staggered `rise`
- `.achievements-cta-copy` — `rise`

**Quirks**
- The "featured" award card is large and a focal point — keep its
  hover restrained (small lift, no rotation) so it doesn't compete
  with the rest of the page.
- Awards grid has per-card image crops with bespoke classes — make
  sure your `:hover img { scale: 1.05; }` doesn't fight that crop's
  `object-position`.

---

### 3.7 — 3.14 Category pages (`/beverages`, `/getmore`, `/namkeen`, `/chikki`, `/khakhra`, `/bakery`, `/fryums`, `/farali`)

All eight share the `CategoryPage` template and the same family of
section types. Animate them as a *family* using one consistent
pattern. The chips page (DONE) is the reference implementation.

**Shared files**
- Template JSX: `src/pages/category/CategoryPage.jsx` (renders the page)
- Per-category content/JSX: `src/pages/category/<key>-content.jsx` /
  `farali-content.js` (declarative section list)
- Per-category CSS: `src/pages/category/<key>.css` where it exists
  (`bakery.css`, `beverages.css`, `chikki.css`, `fryums.css`,
  `getmore.css`, `khakhra.css`). For `namkeen` and `farali`, none
  exists yet — either:
  - (preferred) create `namkeen.css` / `farali.css`, import it from
    the `*-content.jsx`/`*-content.js` file (mirror the bakery
    pattern), and put the motion block there; or
  - put the block at the bottom of `CategoryPage.css`, scoped to
    `.category-main--namkeen` / `.category-main--farali`. (Chips
    currently lives there.)
- Scope root: `.category-main--<key>` for every page-specific rule.

**Audit checklist (per category)**

Read the `<key>-content.jsx` file's `sections` array. Each entry is
typed:

- `"productCard"` — square pack-photo card
- `"imageCard"` — wider photo-led card (chips uses these)
- `"promo"` — magenta-ish text+CTA strip with a giant ghost word
- `"feature"` — gradient card with copy on left, photo on right
- `"spotlight"` — a horizontal carousel band (namkeen has the Royal
  Crunch one)
- `"arrow"` — side carousel arrow button

Plus, every category has:
- A `HeroVisual` of mode `<key>` (or `beveragesWide`, `chipsWide`,
  `getmoreWide`) — the floating product packs on a backdrop
- An `<h1>` title, intro `<p>`, and a badge
- A `NewsletterPatch` strip at the bottom

**Entrance motions** (gated; same pattern as chips)
- Hero backdrop (`.<key>-hero-bg`) — `<key>-bg-grow`
- `<h1>` — `<key>-rise` 0.1s
- `<p>` — `<key>-rise` 0.24s
- Badge — `<key>-rise` 0.38s
- Each hero pack (`.<key>-hero-pack`, e.g. `.namkeen-hero-pack`) —
  `<key>-pack-in` (the `pop` style — scale 0.4 → 1.08 → 1, springy
  bezier), staggered with `animation-delay: 0.25s / 0.38s / 0.5s /
  0.62s / 0.74s` matching chips. Use BOTH `animation-fill-mode: both`
  AND remember the §1.4 trap — hover scale needs `!important`.

**Hover motions**

Apply per-section-type (chips does these; mirror them):

- `.category-main--<key> .category-product-card--image:hover` —
  `translate: 0 -8px; scale: 1.025` + stronger shadow; child
  `.category-product-cover` `scale: 1.07`.
- `.category-main--<key> .category-product-card--product:hover` —
  same lift; child `.category-product-img` `scale: 1.07` (note this
  is `object-fit: contain` not `cover`, so the pack image grows
  within the card).
- `.category-promo--<key>-compact:hover .category-promo-ghost` —
  `scale: 1.06; rotate: 6deg`.
- `.category-promo--<key>-compact a:hover` — `translate: 2px 0`.
- `.category-feature--<key>-wide:hover > img` — `translate: 0 -8px;
  scale: 1.04; rotate: -3deg` (composes over the feature image's
  resting transform).
- `.category-feature--<key>-wide a:hover` — `translate: 0 -2px;
  scale: 1.04`. Inside, `.category-feature-arrow` `translate: 4px 0`.
- `.category-newsletter--<key>-compact input:focus` — accent focus
  ring (§1.9).
- `.category-newsletter--<key>-compact button:hover` —
  primary-button lift (note that each category's newsletter button
  may have its own background color, e.g. khakhra/bakery override
  `background` — keep the existing color, only animate translate
  and shadow).
- **Hero packs** — apply the chips pattern (per §3.0 chips):
  re-enable `pointer-events: auto`, add a transition, and on hover
  `translate: 0 -14px; scale: 1.12 !important; z-index: 3; filter:
  drop-shadow(...)`.
- **Spotlight carousels** (namkeen only at time of writing) —
  `.category-spotlight-card:hover` should lift + scale the inner
  image; arrows should `scale: 1.12`.

**Scroll reveals**
- All `.category-product-card`, `.category-promo`, `.category-feature`,
  `.category-newsletter` — wrap in `@supports (animation-timeline:
  view())` with `<key>-rise`, `entry 0% entry 45%`. Add per-row
  stagger by tagging extra `:nth-of-type` ranges where the layout has
  rows of more than 2 cards.

**Quirks / traps**
- **Hero pack rotations** — most packs have `transform: rotate(...)`
  (e.g. `.khakhra-pack-7grain` has `-19deg`). Animations must use
  `translate`/`scale` only to preserve those.
- **Bakery has a curved white element** (`.bakery-hero-curve`) — it
  has a `transform: rotate(-2.3deg)` for the swooping look. Don't
  touch its transform; you can add an entrance opacity/scale via the
  individual `scale` prop if you want it to slide in.
- **Chikki hero is scaled** (`.category-hero-chikki { transform:
  scale(0.666667) }`). Don't add anything that touches `transform`
  on the hero box itself; only animate children.
- **Namkeen spotlight** uses a tilted green band (`-1.59deg
  skewX(-1.59deg)`). Same rule — children only, individual props.
- **Per-key newsletter colors** — bakery uses `#005676`, getmore uses
  `#543b00`. Hover shadows should be neutral (`rgba(78, 40, 31, ...)`)
  so they read on every variant.

**Execution shortcut**

Because the 8 pages share so much structure, the simplest way to
ship is:

1. Define a single keyframe set per page (`<key>-rise`,
   `<key>-pop`, `<key>-bg-grow`) — copies of the chips set with the
   prefix changed.
2. Define the hover/focus block (selectors all under
   `.category-main--<key>`) by templating off the chips block.
3. Define the entrance block (also templated).
4. Verify (§1.13) at each URL before moving to the next.

Do NOT add the rotating "ring" effect (the chips one was an
experiment that was *removed* — see git history for `chips-ring-spin`
being deleted). Keep packs static after landing.

---

### 3.15 `/investor` and its 15 sub-routes

Investor is a special case: every sub-page renders inside
`InvestorLayout` (`src/pages/investor/InvestorLayout.jsx`), which
wraps an `<Outlet />` in a `.investor-main` with body-class modifiers
(`investor-main--kmp`, `investor-main--shareholding`, etc.).

**Strategy:** animate the *shared chrome* once in `InvestorPage.css`,
then add per-tab refinements in each sub-page's own CSS only where it
helps. Don't write 16 redundant motion blocks.

**Shared files (touch once)**
- JSX: `src/pages/investor/InvestorLayout.jsx`,
  `src/pages/investor/components/InvestorHero.jsx`,
  `src/pages/investor/components/InvestorFilterNav.jsx`,
  `src/pages/investor/components/InvestorTransparency.jsx`,
  `src/pages/investor/components/InvestorYearTabs.jsx`
- CSS: `src/pages/investor/InvestorPage.css` (it `@import`s
  `InvestorYearTabs.css`), `InvestorFilterNav.css`
- Scope root: `.investor-main` for shared rules; `.investor-main--<key>`
  for per-tab tweaks.

**Audit checklist — shared chrome**
- `.investor-hero` with `.investor-hero-copy` (`<h1>` "Investor
  Relations" with `<em>` accent + `<p>`), and `.investor-hero-media`
  (`.investor-hero-photo`, `.investor-hero-media-texture`,
  `.investor-hero-gradient`, `.investor-hero-ticker` with label +
  value)
- `InvestorFilterNav` — the tab/year filter bar (acts like
  `ProductSubNav`)
- `InvestorYearTabs` — year tabs reused across multiple tabs
- `InvestorTransparency` — large promo card shown on some tabs

**Per-tab CSS files** (each has its own CSS file already)
- `BoardPage.css`, `ShareholdingPage.css`, `PoliciesPage.css`,
  `GovernancePage.css`, `AnnualPage.css`, `SecretarialPage.css`,
  `AnnouncementsPage.css`, `AgmPage.css`, `FinancialPage.css`,
  `DisputePage.css`, `MemorandumPage.css`, `UpdatesPage.css`,
  `ReconciliationPage.css`, `GrievancePage.css`

**Entrance motions (in `InvestorPage.css`, scoped under `.investor-main`)**
- `.investor-hero-gradient` — `investor-bg-grow`
- `.investor-hero-copy h1`, `.investor-hero-copy p` — `investor-rise`
  cascade (the `<em>` inside `<h1>` can pop separately to accent the
  word "Relations")
- `.investor-hero-photo` — `investor-rise-right`
- `.investor-hero-ticker` — `investor-pop` delayed (it's a small
  card-like badge — popping reads great)
- `.investor-hero-media-texture` — `investor-bg-grow` very subtle
- `.investor-transparency` (when shown) — `investor-rise` on scroll

**Hover motions**
- `.investor-hero-ticker` — gentle lift on hover
- `InvestorFilterNav` tabs — same `accent` vs `accent-light` rule as
  product subnav (active stays full accent; non-active hover goes to
  `--color-accent-light`). Treat them as a sibling component to
  `.product-subnav` — verify their existing selector names in
  `InvestorFilterNav.css` and add the `:not(.is-active):hover` rule
  there.
- `InvestorYearTabs` — likewise apply the
  `:not(.is-active):hover { color: var(--color-accent-light) }`
  convention (year tabs are usually text-only — use color + maybe
  underline change, not a fill).
- Any "download PDF" tile/row across the sub-tabs (Board,
  Shareholding, Annual, Memorandum, Policies, etc.) — light card lift
  on hover with the icon nudging right (`translate: 4px 0`). Look for
  selectors like `.investor-doc-card`, `.shareholding-doc-card`, etc.
- Pagination / filter chips — accent-light hover.

**Scroll reveals (wrap in `@supports`)**
- Document/file card grids on each sub-tab — staggered
  `investor-rise`.
- Tables — DO NOT animate rows (per §1.15). Reveal only the table's
  outer container, not each row.

**Per-tab tweaks (only add if needed)**

| Tab | Tweak idea | File |
| --- | --- | --- |
| Shareholding | `.investor-shareholding__promo-photo` — gentle straighten + lift | `ShareholdingPage.css` |
| Board | Director cards — lift + photo zoom | `BoardPage.css` |
| Governance | Committee tiles — staggered reveal | `GovernancePage.css` |
| Annual | Year report PDF cards — lift + arrow nudge | `AnnualPage.css` |
| Updates / Announcements | News tile grid — staggered reveal, hover lift | `UpdatesPage.css`, `AnnouncementsPage.css` |
| Policies | Policy cards — same | `PoliciesPage.css` |
| Financial | Numeric stat cards — `pop` on entrance | `FinancialPage.css` |
| KMP | Person cards — photo zoom on hover | (no per-key CSS — add inside `InvestorPage.css` or create a `KmpPage.css`) |
| Grievance / Dispute | Form fields — accent focus ring | `GrievancePage.css`, `DisputePage.css` |
| AGM, Secretarial, Reconciliation, Memorandum | Document tile grids — same pattern | their `*.css` files |

**Quirks / traps**
- `InvestorLayout` mounts the hero/transparency conditionally — many
  sub-tabs hide `InvestorTransparency`. Don't reference it in selectors
  the way you'd reference always-present elements; instead, scope its
  rules at the `.investor-transparency` selector and let the layout
  decide presence.
- The `InvestorPage.css` file already `@import`s
  `InvestorYearTabs.css`. Don't add a second `@import` for the motion
  layer — append in place.
- Some tabs have a tabbed sub-navigation (year tabs, document
  category tabs). They are ALL active/inactive toggles — apply the
  global hover convention (`--color-accent-light` for non-active
  hover).
- The page uses `useLocation` to compute `activeTab`. Don't animate
  on tab change — let React just swap the outlet. Entrance animations
  will replay naturally because the new content mounts fresh.

---

## 4. Suggested batch plan

Don't try to ship all 23 pages in one commit. Break it into batches:

1. **Batch A — simple pages** (one commit per page or one combined)
   - `/about`, `/exports`, `/career`, `/contact`, `/dealers`,
     `/achievements`
   - These are the most varied; doing them first builds muscle
     memory for the pattern.

2. **Batch B — category fleet** (one commit)
   - All 8 remaining categories, all using the same per-key block.
   - Diff will be large but each block is templated; mostly
     mechanical.

3. **Batch C — investor shared chrome** (one commit)
   - Just `InvestorPage.css`, `InvestorFilterNav.css`,
     `InvestorYearTabs.css`.
   - Most of the value lands here.

4. **Batch D — investor per-tab refinements** (one commit per tab,
   or combined if small)
   - Only animate what helps; many tabs may need nothing beyond
     what the shared chrome gives them.

Verify each batch in the browser at every relevant URL before staging
(§1.13). Run the headless playwright check; confirm `ERR: none`.

---

## 5. Acceptance criteria for "done"

Per page, all true:

- [ ] Animation CSS lives in the page's own stylesheet (not
  `public/styles.css`, except the shared hover tokens and the header
  nav rule).
- [ ] All keyframes are prefixed with the page slug.
- [ ] All rules are scoped under the page's root class.
- [ ] Resting `transform: rotate(...)` tilts survive — verified by
  hovering a tilted card in DevTools and confirming `getComputedStyle`
  reports the original transform.
- [ ] Entrance and ambient motion are inside `@media
  (prefers-reduced-motion: no-preference)`.
- [ ] Scroll reveals are inside `@supports (animation-timeline:
  view())` (content visible on unsupported browsers).
- [ ] Headless playwright run at t=2500ms reports `ERR: none` and
  the full-page screenshot shows every section laid out correctly.
- [ ] No edits to `src/pages/home/HomePage.jsx`.
- [ ] One focused commit (or one focused batch commit). No unrelated
  files staged.

---

## 6. Glossary of established keyframes

You can copy these verbatim for any new page (with the prefix
swapped):

```css
@keyframes <slug>-rise {
  from { opacity: 0; translate: 0 28px; }
  to   { opacity: 1; translate: 0 0; }
}
@keyframes <slug>-rise-left {
  from { opacity: 0; translate: -36px 0; }
  to   { opacity: 1; translate: 0 0; }
}
@keyframes <slug>-rise-right {
  from { opacity: 0; translate: 36px 0; }
  to   { opacity: 1; translate: 0 0; }
}
@keyframes <slug>-pop {
  0%   { opacity: 0; scale: 0.6; }
  70%  { opacity: 1; scale: 1.08; }
  100% { opacity: 1; scale: 1; }
}
@keyframes <slug>-bg-grow {
  from { opacity: 0; scale: 1.05; }
  to   { opacity: 1; scale: 1; }
}
@keyframes <slug>-pack-in {     /* for category hero packs */
  0%   { opacity: 0; scale: 0.4; }
  70%  { opacity: 1; scale: 1.08; }
  100% { opacity: 1; scale: 1; }
}
```

Use ambient `-float` / `-bob` only if the page actually needs it —
prefer restraint.

---

## 7. Reference: chips page anatomy (DONE — read for examples)

To see every concept in action, read these specific blocks of
`src/pages/category/CategoryPage.css`:

- "Chips page motion layer" comment header — fenced block at the
  bottom of the file
- `@keyframes chips-rise`, `chips-pack-in`, `chips-bg-grow`
- `.category-main--chips .chips-wide-hero-ring` — wrapper pattern
  (added in `CategoryPage.jsx` too)
- `.category-main--chips .chips-wide-hero-pack:hover` — note the
  `scale: 1.12 !important` for §1.4
- `@media (prefers-reduced-motion: no-preference)` block — note the
  per-pack `animation-delay` stagger
- `@supports (animation-timeline: view())` block — scroll reveals

And the home page:
- `src/pages/home/HomePage.css` — the whole motion layer (HomePage.jsx
  is protected; everything is CSS-only)
- `.hero-title span:nth-child(...)` — multi-line headline cascade
- `.hero-products` two-animation combo (`rise` + `float`) — note how
  they target different properties so they don't fight

---

## 8. Stop conditions

Stop and ask the user when:

- A page's structure has drifted significantly from this doc's
  audit checklist (the JSX has been restructured) — don't guess; ask
  whether the new structure should map onto the same idioms.
- A page needs an animation that has no precedent in this doc (e.g.
  drag-to-scroll, parallax, SVG path animation). These are out of
  scope unless explicitly requested.
- A scroll reveal causes content to be invisible on a *supported*
  browser (e.g. Chrome ≥ 115). That means the keyframe's
  `to`-state isn't the intended visible state — investigate before
  pushing.
