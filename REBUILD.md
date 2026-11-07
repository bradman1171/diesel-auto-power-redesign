# Rebuild Specification — Diesel Auto Power Redesign Concept

This document lets an AI agent (or a developer) rebuild this site as closely as
possible to the original, even without reading the code. Read it together with
the source: the code is the ground truth, this file is the map.

---

## 1. What this is

A **front-end-only redesign concept** for Diesel Auto Power
(dieselautopower.com), a diesel performance parts retailer. It is a working
storefront prototype: browsable catalog, vehicle fitment, search, filters,
cart, and a demo checkout. **There is no backend, no accounts, no payments, no
live inventory.** The production target is Miva Merchant, which keeps commerce;
this concept proves the design and UX.

Hard rules that must survive any rebuild:

- All product data lives in `src/data/` (`catalog.json` + typed modules).
  Components never inline product data, so the catalog can be swapped for a
  Miva feed.
- Links to the live dieselautopower.com site always go through the `LiveLink`
  component (opens in a new tab with an external marker) so they are visually
  distinct from prototype navigation.
- Cart and vehicle selection are browser-only (localStorage). No auth, no
  server state.
- Any unverified product, price, fitment, or core deposit is flagged
  `illustrative` in the data and labeled in the UI.

## 2. Tech stack

- **TanStack Start v1** (React 19, SSR) with **TanStack Router** file-based
  routing in `src/routes/`. Do not substitute react-router or Next.js.
- **Vite 7**, **TypeScript**, **Tailwind CSS v4** (configured in
  `src/styles.css` via `@theme` tokens — no `tailwind.config.js`).
- **shadcn/ui** (new-york style) primitives in `src/components/ui/`, icons from
  **lucide-react**, toasts via **sonner**.
- State: React context + localStorage (`src/lib/cart.tsx`,
  `src/lib/vehicle.tsx`). TanStack Query is present for route data but the demo
  catalog is static.
- Tests: **vitest** (`src/test/`).

## 3. Design system

### Fonts (loaded via Google Fonts `<link>` in the root route head)

- Display/headings/buttons: **Barlow Condensed** (500–800, uppercase, tight
  leading ~0.92 on heroes)
- Body: **Barlow** (400–700)
- Mono (SKUs): **JetBrains Mono**

### Color tokens (oklch, defined in `src/styles.css`)

| Token | Value | Use |
| --- | --- | --- |
| `background` | oklch(0.975 0.003 260) | page background, near-white |
| `foreground` | oklch(0.18 0.008 260) | body text |
| `primary` | oklch(0.5 0.2 262) | DAP royal blue — CTAs, links, badges |
| `ink` | oklch(0.2 0.025 265) | dark industrial surfaces: header, hero, footer, DAP section |
| `ink-foreground` | oklch(0.97 0.002 260) | text on ink |
| `ink-muted` | oklch(0.74 0.02 262) | secondary text on ink |
| `ink-border` | oklch(0.34 0.03 265) | borders on ink |
| `steel` | oklch(0.31 0.03 265) | top utility bar, raised dark panels |
| `amber` | oklch(0.8 0.16 75) | "illustrative" labels |
| `success` | oklch(0.58 0.15 150) | "Fits your truck" |
| `sale` | oklch(0.57 0.21 27) | sale prices/badges — red is reserved for sale |
| `primary-soft` | oklch(0.94 0.03 262) | light blue accents on dark |
| `muted` / `muted-foreground` | oklch(0.945…) / oklch(0.47…) | light gray surfaces/secondary text |
| `border` / `input` / `ring` | oklch(0.88/0.86/0.55 …) | borders, inputs, focus ring |

Radius: `--radius: 0.375rem`. Shadows: `shadow-card` (resting),
`shadow-lift` (hover/modal). Gradients: `bg-hero-fade` (dark left-to-right
scrim over hero photo), `bg-fade-up` (bottom scrim on category tiles),
`bg-grid-ink` (48px grid pattern on dark sections).

### Custom utilities (in `src/styles.css`)

- `eyebrow` — small uppercase Barlow Condensed section label in primary blue
- `btn` + `btn-primary`, `btn-ink`, `btn-outline`, `btn-ghost-ink` — uppercase
  condensed buttons, min-height 2.75rem, pressed state translates down 1px
- `field` — standard text input
- `animate-rise` — 700ms fade-up entrance, used with staggered
  `[animation-delay:*]` on hero elements

### Voice & copy

Headline style is short, punchy, uppercase: hero is **"Don't pay to play."**
Story section: **"Born from a breakdown."** Tone: knowledgeable diesel-shop
directness, no marketing fluff.

## 4. Business facts (verified — keep exact)

- Phone: **801-927-4600** (call) · Text: **385-220-2090**
- Free standard shipping on qualifying orders **$149+**, lower 48 only,
  freight excluded (`FREE_SHIP_THRESHOLD = 149`)
- Founded **2008**, after founder Jacob's 2007 breakdown stranded far from home
- 600+ manufacturing partners; Cummins is the specialty
- Core returns: full credit within **30 days**, half credit after
- Three Diamond Advantage turbos carry a verified **$250** core charge; all
  other core amounts are illustrative and labeled as such
- Live-site clearance list: `https://www.dieselautopower.com/Clerance-List`
  (sic — the live URL really is misspelled)
- Price-match form: `https://www.dieselautopower.com/price-match-form.html`

## 5. Data model (`src/data/`)

### `vehicles.ts` — platforms and engine generations

4 platforms: **Cummins** (Dodge/Ram), **Duramax** (Chevy/GMC), **Powerstroke**
(Ford), **Light Duty** (EcoDiesel/3.0L/2.8L). 23 engine generations with
`id`, `label`, `short`, `yearFrom`, `yearTo`, and `liveUrl` pointing at the
matching live DAP category — e.g. `c12a` = 1989–1993 5.9L 12V, `l5pb` =
2020–2026 L5P, `f67b` = 2017–2026 6.7L Powerstroke. Helpers: `yearsFor`,
`enginesFor`, `platformById`, `engineById`.

### `products.ts` + `catalog.json` — the catalog

68 products sampled from the live site (Nov 2026). Each `Product`:
`slug, sku, name, brand, price, compareAt?, category, platform?, fitment
{ label, universal?, engines?, yearFrom?, yearTo? }, image, liveImages[],
features[], description, core? { amount, illustrative }, sourceUrl, isDap,
isNew, featured, popularity, addedOrder`.

7 categories: `engine-parts`, `turbochargers`, `fuel-injectors`,
`fuel-systems`, `exhaust`, `performance`, `transmission` (Drivetrain &
Cooling) — each with a name, blurb, and representative image.

Key logic to reproduce exactly:

- `fitStatus(p, engineId, year)` → `fits | universal | no-match | none`;
  universal parts always fit; year must fall inside `yearFrom..yearTo`.
- `searchProducts(q)` matches name, SKU, or brand (case-insensitive substring).
- `recommendationsFor(p)` scores candidates: +100 shared engine, +30 same
  category, +20 complementary category (see `COMPLEMENTS` map), +10 same
  brand, +2 universal; never recommends a different-platform vehicle-specific
  part; threshold 20; tie-break by popularity.
- `sortProducts` keys: `featured` (featured flag then popularity), `best`
  (popularity), `price-asc`, `price-desc`, `newest` (isNew then addedOrder).
- `formatPrice` — USD via `toLocaleString`.

### `services.ts`

Injector testing (common rail from $45, HEUI for 7.3L/6.0L, mechanical for
12V/24V) and S300/S400 turbo rebuilds.

## 6. State (`src/lib/`)

- **Cart** (`cart.tsx`): localStorage key `dap-demo-cart`. Lines keyed by
  `slug` or `slug::deposit|send-first` for core items. `computeTotals` sums
  merchandise + core deposits (deposit option only); shipping is always 0
  (illustrative). Qty clamped 1–99.
- **Vehicle** (`vehicle.tsx`): localStorage key `dap-demo-vehicle`;
  `{ platform, year, engine }`. "My Garage" selection persists while shopping.

## 7. Pages (routes in `src/routes/`)

Every content route sets its own `head()` with unique title, description,
`og:title`, `og:description`, `og:type`, `twitter:card`.

### `/` (index.tsx) — Home

1. **Hero**: full-bleed truck photo (`hero-truck.jpg`, object-position 72%
   center) on `bg-ink` with `bg-hero-fade` scrim. Eyebrow "Diesel performance
   & OEM replacement", H1 "Don't pay to play.", subcopy about 600+
   manufacturers, three CTA buttons (Shop Cummins primary, Duramax/Powerstroke
   ghost). Staggered `animate-rise` entrances.
2. **Shop by vehicle** card overlapping the hero (`-mt-14`, `shadow-lift`)
   containing the `VehicleSelector` (platform → year → engine dropdowns).
3. **Shop by generation**: platform tab switcher; grid of engine-generation
   cards showing `short`, `label`, live part count, arrow; links to
   `/shop/all?engine=<id>`.
4. **Shop by system**: 6 category tiles (4:3 → 16:10 aspect) with image,
   bottom scrim, name, blurb, "Shop now".
5. **Featured products** on `bg-muted`: 8 featured `ProductCard`s.
6. **DAP products** on `bg-ink`: intro copy + 4 DAP-owned product cards + CTA
   to `/shop/all?collection=dap`.
7. **On sale now**: products with `compareAt`, links to sale collection and
   the live clearance list.
8. **Brands we carry**: 18-brand grid linking to `/shop/all?brand=<name>`.
9. **Two promo cards**: "Talk to a diesel specialist" (primary bg, call/text
   buttons) and "Injector testing" (outline card → /services).
10. **Our story** on `bg-ink bg-grid-ink`: "Born from a breakdown." + 2007/2008
    story + 4 value cards (Cummins specialists, 600+ partners, Price match,
    Free shipping $149+).

### `/shop/$category` (shop.$category.tsx)

`$category` is a category id or `all`. Search params: `q`, `platform`,
`engine`, `brand`, `collection` (`dap|sale|new`), `sort`, `view`
(`grid|list`). Left filter rail (categories, brands, platform/engine fitment),
toolbar with result count, sort select, grid/list toggle. Vehicle fitment
filter applies to browsing but **not to search results** (`q` bypasses the
vehicle filter — this was a deliberate fix). Product grid of `ProductCard`s.

### `/product/$slug` (product.$slug.tsx)

Gallery (live image with representative-image fallback), brand/SKU eyebrow,
name, fitment label + "Fits your truck" indicator, price with compare-at
strike-through, feature bullets, description, qty stepper, add-to-cart. Core
products show a required choice: **pay refundable deposit** vs **send core
first** (deposit amount labeled illustrative when flagged). "Also consider"
recommendations via `recommendationsFor`. Link to the live listing via
`LiveLink`.

### `/cart` (cart.tsx)

Line items with image, name, core option, qty stepper, remove; order summary
(merchandise, core deposits, shipping $0 illustrative, total); free-shipping
progress toward $149; CTA to `/checkout`.

### `/checkout` (checkout.tsx)

Demo checkout: contact/shipping form, order summary, **collects no payment**.
Clearly marked as a concept; real checkout stays on Miva.

### `/brands`, `/services`, `/customer-service`, `/about`

Brand directory; injector testing & turbo rebuild services; policies
(shipping, core returns 30-day full/half-after, price match, contact);
company story (2007 breakdown → founded 2008, Cummins specialty, 600+
partners).

### `/implementation-notes`

Miva implementation notes split into four buckets: visual adaptation (theme
work), Miva configuration (no custom code), custom integration (new
development), and items needing validation in the existing Miva setup.

### 404 / error

Root route defines a styled 404 ("Page not found", Go home) and an error
boundary ("This page didn't load", Try again / Go home). `/index` and
`/index.html` redirect to `/` in `beforeLoad`.

## 8. Shared components (`src/components/site/`)

- **SiteHeader** — sticky, `bg-ink`. Top utility bar (`bg-steel`): free
  shipping message + Price Match / text / call links. Main row: mobile drawer
  (Sheet + Accordion of platforms/generations/categories/help), `Logo`,
  search (name/SKU/brand), account & wishlist buttons (toast: "stays on
  Miva"), cart with count badge. Desktop mega-menu per platform: generations,
  categories, and a "Not sure what fits?" call card.
- **VehicleBar** — slim bar under the header showing the selected truck (or a
  prompt to pick one); clears/edits the garage selection.
- **ProductCard** — grid & list variants. Image with Sale/New/DAP badges and
  core-exchange tag; brand · SKU line; 2-line name; fitment label; "Fits your
  truck" (success) or "Universal part"; price (compare-at struck, sale red);
  quick-add button, or "Choose core" link for core items.
- **ProductImage** — tries `liveImages`, falls back to the representative
  studio image on error.
- **VehicleSelector** — platform → year → engine cascading selects; saves to
  the garage.
- **LiveLink** (`ExternalLink.tsx`) — external link, new tab, external marker.
- **Logo** — DAP wordmark (white version asset `dap-logo-white.png`).
- **ConceptBadge** — floating "Website Redesign Concept" badge on every page.
- **SiteFooter** — dark footer with nav, contact, policies.
- **CartSummary** — totals block shared by cart and checkout.

## 9. Imagery

`src/assets/` holds generated representative studio photos (`p-turbo.jpg`,
`p-injector.jpg`, `p-studs.jpg`, `p-pump.jpg`, `p-exhaust.jpg`, `p-engine.jpg`,
`p-tuner.jpg`, `p-trans.jpg`), the hero (`hero-truck.jpg`), and the logo.
Products reference live dieselautopower.com image URLs first and fall back to
these. A rebuild may regenerate equivalents; keep the dark, industrial,
studio-on-dark look.

## 10. Tests (`src/test/`)

- `cart-totals.test.ts` — totals, core deposit math, qty clamping
- `catalog-rules.test.ts` — catalog integrity (unique slugs, valid categories,
  illustrative flags surfaced)
- `app-routing.test.tsx` — routes render, `/index` redirects to `/`

Run with `bunx vitest run`. A faithful rebuild keeps these green.

## 11. Explicit non-goals

No backend, database, auth, real payments, real shipping rates, or live
inventory. Accounts and wishlists intentionally stay on Miva (the UI says so
via toast). Do not "complete" these in a rebuild — they are scoped out by
design.
