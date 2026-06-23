# ECLIPSE FC — Design Blueprint

> The system behind the spec: folder structure, design tokens, color, type,
> components, animation strategy, CSS architecture, breakpoints, and the
> React/Vercel migration plan. Code is written **after** this is approved.

---

## 1. Complete Folder Structure

Flat, static, zero-build — GitHub Pages serves it as-is. Organized so each concern
maps cleanly to a future React module.

```
eclipse-fc/
├── index.html                  # Single entry; all sections (anchored)
├── README.md                   # Setup, customization, deploy
├── .nojekyll                   # Tell GitHub Pages to skip Jekyll processing
├── docs/
│   ├── PRODUCT_SPEC.md
│   └── DESIGN_BLUEPRINT.md     # (this file)
├── assets/
│   ├── favicon.svg             # Crest mark as favicon
│   └── og-image.svg            # Social share placeholder
├── css/
│   ├── main.css                # Single import hub (@import order matters)
│   ├── base/
│   │   ├── reset.css           # Modern reset
│   │   ├── tokens.css          # :root design tokens (color, space, type, motion)
│   │   ├── typography.css      # Type scale, font setup
│   │   └── utilities.css       # .container, .visually-hidden, helpers
│   ├── layout/
│   │   ├── header.css          # Sticky glass nav
│   │   ├── footer.css
│   │   └── grid.css            # Section/grid scaffolding
│   ├── components/
│   │   ├── buttons.css
│   │   ├── cards.css           # GlassCard, gradient borders
│   │   ├── player-card.css
│   │   ├── fixture.css         # fixtures + results rows
│   │   ├── stats.css           # counters, bars, donut
│   │   ├── gallery.css
│   │   ├── forms.css
│   │   ├── badges.css          # chips, tags, pills
│   │   └── timeline.css
│   ├── sections/
│   │   ├── hero.css
│   │   ├── about.css
│   │   ├── squad.css
│   │   ├── fixtures.css
│   │   ├── results.css
│   │   ├── stats.css
│   │   ├── gallery.css
│   │   └── contact.css
│   └── effects/
│       ├── background.css      # aurora, floating orbs, grid lines
│       ├── animations.css      # @keyframes library
│       └── reveal.css          # scroll-reveal states
└── js/
    ├── main.js                 # Bootstraps everything on DOMContentLoaded
    ├── data/
    │   ├── squad.js            # export const squad = [...]
    │   ├── fixtures.js
    │   ├── results.js
    │   ├── stats.js
    │   └── club.js             # name, crest text, milestones, gallery, contact
    ├── components/
    │   ├── renderSquad.js
    │   ├── renderFixtures.js
    │   ├── renderResults.js
    │   ├── renderStats.js
    │   └── renderGallery.js
    └── lib/
        ├── nav.js              # sticky shrink, scroll-spy, mobile menu
        ├── reveal.js           # IntersectionObserver scroll reveals
        ├── counters.js         # animated counters
        ├── countdown.js        # next-match countdown
        ├── mouseGlow.js        # mouse-follow glow
        ├── parallax.js         # background parallax
        ├── scrollProgress.js   # top progress bar + back-to-top
        └── form.js             # contact form validation
```

> JS uses native ES modules (`<script type="module">`) — no bundler needed, and the
> module boundaries become React component/hook boundaries 1:1 later.

---

## 2. Design System Overview

Three layers, each defined as CSS custom properties in `tokens.css`:

1. **Primitives** — raw values (`--color-neon-500: #00f5a0`, `--space-4: 1rem`).
2. **Semantic tokens** — intent-based aliases (`--accent`, `--surface`, `--text-muted`).
3. **Component tokens** — per-component knobs (`--card-blur`, `--btn-radius`).

Theming = swap semantic tokens. Rebrand = swap a handful of primitives. Everything
downstream updates automatically.

---

## 3. Color Palette

Dark, premium, neon. Black base with deep blue-violet gradients and electric accents.

### Primitives
| Token | Hex | Use |
|-------|-----|-----|
| `--black-900` | `#05060a` | Page background base |
| `--black-800` | `#0a0c14` | Section background |
| `--ink-700` | `#10131f` | Raised surfaces |
| `--ink-600` | `#161a2b` | Borders / lines (low contrast) |
| `--neon-500` | `#00f5a0` | **Primary accent** (electric mint-green) |
| `--neon-400` | `#3dffb8` | Accent hover / glow highlight |
| `--volt-500` | `#7c5cff` | **Secondary accent** (electric violet) |
| `--volt-400` | `#9d86ff` | Violet highlight |
| `--cyan-500` | `#22d3ee` | Tertiary accent / data viz |
| `--magenta-500` | `#ff3d81` | Alert / loss / hot accent |
| `--gold-500` | `#ffd76a` | Trophy / honors / "big match" |
| `--white` | `#f5f7fb` | Primary text |
| `--gray-300` | `#aab2c5` | Secondary text |
| `--gray-500` | `#6b7388` | Muted text / captions |

### Semantic tokens
| Token | Maps to | Meaning |
|-------|---------|---------|
| `--bg` | `--black-900` | App background |
| `--surface` | `rgba(255,255,255,0.04)` | Glass card fill |
| `--surface-strong` | `rgba(255,255,255,0.07)` | Hover/raised glass |
| `--border-glass` | `rgba(255,255,255,0.12)` | Glass edge |
| `--accent` | `--neon-500` | Primary brand accent |
| `--accent-2` | `--volt-500` | Secondary accent |
| `--text` | `--white` | Body text |
| `--text-muted` | `--gray-300` | Secondary text |
| `--win` | `--neon-500` / `--draw` `--gold-500` / `--loss` `--magenta-500` | Result states |

### Signature gradients
```
--grad-hero:    radial-gradient(at 20% 20%, #141a3a 0%, transparent 50%),
                radial-gradient(at 80% 0%, #2a1a4a 0%, transparent 45%),
                linear-gradient(180deg, #05060a, #0a0c14);
--grad-accent:  linear-gradient(135deg, #00f5a0, #22d3ee 50%, #7c5cff);
--grad-border:  linear-gradient(135deg, #00f5a0, #7c5cff, #22d3ee);  /* animated */
--grad-text:    linear-gradient(90deg, #f5f7fb, #00f5a0, #9d86ff, #f5f7fb);
```

**Glow recipe:** neon elements use layered `box-shadow`
(`0 0 20px rgba(0,245,160,.35), 0 0 60px rgba(0,245,160,.15)`) + a soft outer blur.

---

## 4. Typography System

Display + body pairing, loaded from a CDN (self-host later for perf/offline).

| Role | Family | Notes |
|------|--------|-------|
| Display / headings | **"Clash Display"** or **"Space Grotesk"** | Wide, confident, sporty |
| Body / UI | **"Inter"** | Highly legible at all sizes |
| Numeric / stats | **"Inter" tabular-nums** (or "Space Mono") | Aligned scoreboard digits |

> Fallback stack everywhere: `system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`.

### Type scale (fluid, `clamp()` — mobile → desktop)
| Token | clamp | Use |
|-------|-------|-----|
| `--fs-display` | `clamp(2.75rem, 8vw, 6rem)` | Hero club name |
| `--fs-h1` | `clamp(2rem, 5vw, 3.25rem)` | Section titles |
| `--fs-h2` | `clamp(1.5rem, 3.5vw, 2.25rem)` | Sub-section |
| `--fs-h3` | `clamp(1.15rem, 2.5vw, 1.5rem)` | Card titles |
| `--fs-lead` | `clamp(1rem, 2vw, 1.25rem)` | Lead paragraphs |
| `--fs-body` | `1rem` | Body |
| `--fs-sm` | `0.875rem` | Captions, chips |
| `--fs-xs` | `0.75rem` | Eyebrows, tags |

**Rules:** display uppercase with tight tracking (`-0.02em`); eyebrows uppercase with
wide tracking (`0.2em`); line-height 1.05 for display, 1.6 for body; numerals use
`font-variant-numeric: tabular-nums` in stats/scores.

---

## 5. Reusable Components (catalog)

Each is a self-contained CSS component + (where dynamic) a JS render function. Names
are the future React component names.

| Component | Description | Variants / props |
|-----------|-------------|------------------|
| `Button` | Pill button with glow | `primary`, `ghost`, `icon` |
| `GlassCard` | Frosted panel, optional animated gradient border | `static`, `bordered`, `interactive` |
| `SectionHeader` | Eyebrow + title + lead, centered/left | alignment |
| `Crest` | SVG club mark (eclipse ring monogram) | size |
| `Badge / Chip` | Position, competition, status tags | color by type |
| `StatPill` | Small label+value pill | — |
| `PlayerCard` | Number, monogram avatar, name, position, stats, shine | position color |
| `FixtureRow` | Date, competition, opponent, H/A | — |
| `NextMatchHero` | Featured match + countdown + crests | — |
| `Countdown` | DD:HH:MM:SS animated digits | target date |
| `ResultRow` | Date, opponent, score, outcome dot | W/D/L color |
| `FormGuide` | Last-5 W/D/L pills | — |
| `StatCounter` | Animated number + label | target, suffix |
| `ProgressBar` | Labeled CSS bar | value % |
| `DonutChart` | SVG ring chart (W/D/L split) | segments |
| `Leaderboard` | Ranked top-scorer list | — |
| `Timeline` | Vertical milestone list | — |
| `GalleryTile` | Gradient + SVG + shimmer + caption | gradient, tag |
| `Form fields` | Input/Textarea/Select with focus glow | states |
| `Nav / MobileMenu` | Sticky glass nav + slide-in | — |
| `Footer` | Crest, links, social, newsletter | — |
| `BackgroundFX` | Aurora + orbs + grid + mouse glow | — |

---

## 6. Animation Strategy

**Principles**
- Animate only `transform` and `opacity` (GPU-friendly); avoid animating layout props.
- Motion has meaning: entrances guide the eye, hovers confirm interactivity.
- Everything respects `@media (prefers-reduced-motion: reduce)` — non-essential motion off.
- Use `will-change` sparingly and only during active animation.

**Techniques & where**
| Effect | Mechanism | Where |
|--------|-----------|-------|
| Scroll reveal (fade/slide/scale) | IntersectionObserver toggles `.is-visible`; CSS transitions | All sections, staggered via `--i` index delay |
| Animated counters | `requestAnimationFrame` lerp, triggered by observer | Statistics |
| Hover lift + glow | CSS `transform: translateY` + `box-shadow` + gradient border | All cards |
| Animated gradient border | `@property --angle` + `conic-gradient` rotation (fallback: static) | Feature cards, next match |
| Floating orbs | CSS `@keyframes float` on absolutely-positioned blurred blobs | Background |
| Aurora background | Slow-moving multi-radial gradients via keyframed `background-position` | Body backdrop |
| Mouse-follow glow | JS updates `--mx/--my` CSS vars; radial-gradient follows cursor | Global overlay |
| Parallax | JS translates background layers by scroll offset (rAF-throttled) | Hero, gallery |
| Card shine sweep | Pseudo-element gradient swept on hover | Player/gallery cards |
| Countdown ticks | `setInterval` 1s + digit flip transition | Next match |
| Section entrance | Reveal + slight `scale(0.98)→1` and `translateY(24px)→0` | Section wrappers |
| Donut/bar draw-in | `stroke-dashoffset` / `width` transition on reveal | Statistics |
| Scroll progress bar | rAF scroll listener scales a fixed top bar | Global |

**Timing tokens** (in `tokens.css`)
```
--ease-out: cubic-bezier(.16,1,.3,1);     /* snappy entrances */
--ease-inout: cubic-bezier(.65,.05,.36,1);
--dur-fast: 160ms;  --dur: 320ms;  --dur-slow: 600ms;  --dur-reveal: 800ms;
```

---

## 7. CSS Architecture

- **Methodology:** ITCSS-style import order (low → high specificity) + BEM-ish naming
  (`.player-card`, `.player-card__name`, `.player-card--gk`). Utilities are single-purpose.
- **Single source of truth:** `tokens.css` holds all custom properties; nothing hardcodes
  a hex/space value elsewhere.
- **Import order in `main.css`:**
  ```
  base/reset → base/tokens → base/typography → base/utilities
  → layout/* → components/* → sections/* → effects/*
  ```
- **Scope:** components are class-scoped and context-free; sections compose components.
- **No CSS framework** — hand-rolled tokens keep the bundle tiny and the look bespoke.
- **Fallbacks:** `@supports (backdrop-filter: blur(1px))` for glass; solid color otherwise.
- **Naming for migration:** class names mirror component names so CSS Modules adoption
  in React is mechanical.

---

## 8. Responsive Breakpoints (mobile-first)

Min-width media queries; base styles target the smallest screen.

| Token | Min-width | Target | Key layout shifts |
|-------|-----------|--------|-------------------|
| `--bp-xs` | 0 | Small phones (320–479) | Single column, stacked nav→burger |
| `--bp-sm` | 480px | Large phones | Larger type, 2-col stat grid |
| `--bp-md` | 768px | Tablets | 2-col cards, inline nav appears |
| `--bp-lg` | 1024px | Laptops | 3–4 col squad grid, side-by-side contact |
| `--bp-xl` | 1280px | Desktops | Max content width, richer spacing |
| `--bp-2xl` | 1536px | Large desktops | Wider gutters, larger hero |

- Layout uses CSS Grid `auto-fit/minmax` so most grids reflow without explicit queries.
- Touch targets ≥ 44px; hover effects gated behind `@media (hover: hover)`.
- Container: `width: min(100% - 2rem, 1200px); margin-inline: auto;`

---

## 9. Future Scalability Plan — React / Vercel Migration

The v1 structure is deliberately a "pre-React" shape so migration is mechanical, not a rewrite.

**Target stack:** React + Vite + TypeScript, React Router, deployed on Vercel.

**Mapping**
| v1 (static) | v2 (React) |
|-------------|------------|
| `index.html` sections | Route components (`/`, `/squad`, `/fixtures`, …) or one page w/ sections |
| `css/components/*.css` | CSS Modules per component (`PlayerCard.module.css`) |
| `css/base/tokens.css` | Same tokens, imported globally (or CSS-in-JS theme) |
| `js/data/*.js` | `src/data/*.ts` (typed) → later swapped for API calls / SWR |
| `js/components/render*.js` | React components that `.map()` over typed data |
| `js/lib/*.js` (observers, counters) | Custom hooks (`useReveal`, `useCounter`, `useCountdown`, `useMouseGlow`) |
| Manual DOM updates | Declarative JSX + state |

**Migration steps**
1. `npm create vite@latest eclipse-fc -- --template react-ts`.
2. Port `tokens.css`/`typography.css`/reset into `src/styles/` (global imports).
3. Convert each `render*.js` into a component; move data to typed `src/data/*.ts`.
4. Convert `lib/*` effects into hooks; wrap reveal/observer logic in `useEffect`.
5. Introduce React Router for true routes + `framer-motion` for page transitions
   (replacing hand-rolled reveal where it adds value; keep CSS for the rest).
6. Add data layer: replace static arrays with `fetch`/SWR against an API or headless CMS.
7. Deploy to Vercel (`vercel` CLI or Git integration); add preview deployments per PR.

**Why it's low-risk:** the design tokens, component boundaries, data shapes, and naming
are already React-idiomatic. No visual or structural decision in v1 blocks v2.

**Optional intermediate step:** Astro — keep the static HTML/CSS almost verbatim as
`.astro` components, island-hydrate only the interactive bits. Lowest-effort path if a
full React SPA isn't needed.

---

## 10. Open Decisions (confirm before build)

1. **Brand:** keep placeholder **ECLIPSE FC**, or use your real club name now?
2. **Accent color:** mint-green primary + violet secondary (proposed) — or a specific
   club color you want to lead with?
3. **Fonts:** Space Grotesk + Inter (free, reliable on Pages) vs Clash Display (premium look).
4. **Layout model:** single long scroll page (faster v1) vs multi-page from the start.
```
