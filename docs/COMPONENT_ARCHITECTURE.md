# HBUFC — Component Architecture (v2)

> Companion to BLUEPRINT_V2.md. Defines the file structure, component catalog,
> data layer, motion modules, init/orchestration, and the React migration map.
> Names are chosen to become React components/hooks 1:1 later.

---

## 1. Folder Structure

Static, zero-build, GitHub-Pages ready. Concern-separated for a clean React port.

```
football-club-website/
├── index.html                      # single page; all story sections
├── .nojekyll
├── README.md
├── docs/
│   ├── BLUEPRINT_V2.md
│   └── COMPONENT_ARCHITECTURE.md    # (this file)
├── assets/
│   ├── crest.svg                    # HBUFC crest mark
│   └── og-image.svg
├── css/
│   ├── main.css                     # @import hub (order matters)
│   ├── base/        reset · tokens · typography · utilities
│   ├── layout/      header(nav) · footer · grid · section
│   ├── components/  buttons · glass-card · player-card · stat-ring ·
│   │                pitch · chemistry · timeline · trophy · match-center ·
│   │                dashboard(charts) · value-chip · squad-builder · modal
│   ├── sections/    hero · why · mission · values · squad · journey ·
│   │                dashboard · cta
│   └── effects/     background · particles · animations(keyframes) · reveal
└── js/
    ├── main.js                      # bootstraps everything (orchestrator)
    ├── data/
    │   ├── club.js                  # name, slogan, story, mission, values, contact
    │   ├── squad.js                 # players[] (full FUT schema)
    │   ├── formations.js            # 4-3-3 / 4-2-3-1 / 3-5-2 coords
    │   ├── chemistry.js             # links / chem rules
    │   ├── matches.js               # match-center fixtures + scripted sim events
    │   ├── trophies.js
    │   ├── timeline.js              # 2017→now milestones
    │   └── stats.js                 # dashboard datasets
    ├── components/                  # pure render functions: (data) -> DOM/string
    │   ├── PlayerCard.js
    │   ├── StatRing.js
    │   ├── Avatar.js                # position-based SVG silhouette
    │   ├── Pitch.js
    │   ├── Chemistry.js
    │   ├── MatchCenter.js
    │   ├── SquadBuilder.js
    │   ├── Dashboard.js             # donut · bars · radar · counters
    │   ├── Timeline.js
    │   ├── Trophies.js
    │   ├── ValueChip.js
    │   └── Modal.js                 # enlarged card / detail
    ├── motion/                      # animation modules (the GSAP/Lenis layer)
    │   ├── lenis.js                 # smooth scroll + GSAP ticker sync
    │   ├── reveal.js                # ScrollTrigger batch reveals
    │   ├── heroIntro.js             # SplitType + GSAP hero timeline
    │   ├── pinStory.js              # pinned "Why HBUFC" scrub
    │   ├── horizontalTimeline.js
    │   ├── counters.js
    │   ├── cardTilt.js
    │   ├── particles.js
    │   ├── mouseLight.js
    │   └── navGlow.js               # magnetic + active-glow nav
    └── lib/
        ├── dom.js                   # $, $$, el() helpers
        ├── motionGuard.js           # prefers-reduced-motion + CDN-available check
        └── store.js                 # tiny shared state (selected player, formation, squad-builder)
```

> `components/` = *what to render*. `motion/` = *how it moves*. `data/` = *content*.
> Keeping motion separate means reduced-motion / CDN-failure just skips `motion/`
> and the site is still fully rendered & usable.

---

## 2. Component Catalog

Each entry: **responsibility · inputs · key DOM/CSS hooks · micro-interactions**.

### Global chrome
| Component | Responsibility | Inputs | Micro-interactions |
|-----------|----------------|--------|--------------------|
| `Header/Nav` | Sticky glass nav, scroll-spy, mobile menu | section list | Active-link glow, magnetic hover, shrink on scroll |
| `Footer` | Crest, links, social, "Football for All" | club | Link hover glow |
| `Background` | Aurora + grid + orbs behind all | — | Slow drift, mouse light |
| `Modal` | Enlarged player card / detail overlay | player | Fade+scale in, focus trap, Esc/click-out close |

### Story sections
| Component | Responsibility | Inputs |
|-----------|----------------|--------|
| `Hero` | "Football for All", crest, particles, CTAs | club.slogan |
| `WhyHBUFC` | Pinned scroll story vs favoritism | club.story |
| `Mission` | 4 mission pillars + reach counters | club.mission, stats |
| `Values` | 5 value chips (Discipline…Respect) | club.values |
| `SquadShowcase` | Cards grid + pitch + chemistry + filters | squad, formations, chemistry |
| `Journey` | Horizontal milestone timeline | timeline |
| `DashboardSection` | Charts + counters | stats |
| `CTA` | Join the movement | club.contact |

### Product components
| Component | Responsibility | Inputs | Micro-interactions |
|-----------|----------------|--------|--------------------|
| `Avatar` | Position-based SVG silhouette + gradient | posGroup | Outline trace on hover |
| `StatRing` | SVG ring(s) filling to a value | value, max | Draw-in on reveal; outer ring slow-spin |
| `PlayerCard` | FUT collectible card (uses Avatar+StatRing) | player | 3D tilt, foil shine, skill-bar fill, glow, meta-slide; click→Modal |
| `Pitch` | 4-3-3 board, place players by coords | formation, squad | Players glide on formation change; dot hover tooltip; click→select |
| `Chemistry` | SVG links between linked players + score | chemistry, formation | Link draw + pulse; chem counter |
| `SquadBuilder` | Bench → formation assignment | squad, formation | Drag-drop (pointer) / tap-assign (touch); live OVR+chem recompute (FLIP) |
| `MatchCenter` | Broadcast scoreboard + live sim | matches | Minute ticker, score bump, momentum bar, feed events |
| `Dashboard` | Donut/bars/radar/counters | stats | Charts draw-in on view |
| `Timeline` | 2017→now horizontal scrub | timeline | Items reveal as they scroll into frame |
| `Trophies` | Glass shelf of SVG trophies | trophies | Hover tilt + gold glow |
| `ValueChip` | One value w/ animated icon | value | Icon micro-animation on hover/in-view |

---

## 3. Data Layer (content contracts)

All content lives in `js/data/*` as exported consts. Shapes are API-ready so a
future `fetch()`/CMS swap is drop-in.

```js
// club.js
club = { name:"HBUFC", founded:2017, city:"Ajmer", slogan:"Football for All",
         story:[ "para1...", "para2..." ],
         mission:[ {title, detail, metric?} ],
         values:[ {key:"Discipline", icon, blurb} , ... ],
         contact:{ email, phone, socials:[] } }

// squad.js  -> Player schema (see BLUEPRINT_V2 §6.3)
players = [ { id, name, number, position, posGroup, height_cm, age, foot,
              ovr, attrs:{PAC,SHO,PAS,DRI,DEF,PHY}, chem:[ids], cardType } ]

// formations.js
formations = { "4-3-3":[{num,x,y}...], "4-2-3-1":[...], "3-5-2":[...] }  // x,y = % of pitch

// chemistry.js
chemistry = { links:[ [idA,idB,strength] ... ], rules?:{} }

// matches.js
matches = { next:{...}, sim:{ home, away, comp, events:[{min,type,side,text}] } }

// trophies.js / timeline.js / stats.js  -> arrays of typed records
```

---

## 4. Motion Modules & Orchestration

`main.js` is the only entry; it runs a deterministic boot sequence:

```
1. lib/motionGuard → detect reduced-motion + whether GSAP/Lenis loaded
2. render content   → components/* fill the DOM from data/*
3. if motion OK:
     motion/lenis      (smooth scroll + ticker)
     motion/heroIntro  (SplitType + GSAP)
     motion/reveal     (ScrollTrigger batch)
     motion/pinStory, horizontalTimeline, counters,
            cardTilt, particles, mouseLight, navGlow
   else:
     attach light IntersectionObserver reveals + instant states
4. wire interactions → store.js mediates selected player / formation / builder
```

**Single rAF loop:** Lenis drives `requestAnimationFrame`; GSAP's ticker is hooked
to Lenis so scroll + tween share one loop (no jank). ScrollTriggers are refreshed on
resize and killed before any re-init.

**State (`store.js`):** minimal pub/sub holding `{ selectedPlayerId, formation,
builderSquad }`. Pitch, PlayerCard modal, Chemistry, and SquadBuilder subscribe so a
change in one updates the others (e.g. selecting on the pitch opens the right card).

---

## 5. Section ↔ Component ↔ Motion Map

| Section (DOM id) | Components used | Motion module(s) |
|------------------|-----------------|------------------|
| `#home` Hero | Hero, Background | heroIntro, particles, mouseLight, navGlow |
| `#why` Why HBUFC | WhyHBUFC | pinStory, reveal (SplitType lines) |
| `#mission` Mission | Mission, (counters) | reveal, counters |
| `#values` Values | ValueChip ×5 | reveal |
| `#squad` Squad Showcase | PlayerCard, Avatar, StatRing, Pitch, Chemistry, (Modal), SquadBuilder | reveal, cardTilt, (FLIP on filter), chemistry draw |
| `#journey` Timeline | Timeline | horizontalTimeline |
| `#dashboard` Stats | Dashboard | reveal, counters, chart draw-in |
| `#cta` CTA | CTA | reveal |
| (in squad or own) Match Center | MatchCenter | counters/ticker |
| (in squad or about) Trophies | Trophies | reveal |

> Match Center, Trophy Cabinet, and Squad Builder are **supporting** features placed
> within/near the Squad section (or as their own band) rather than adding nav noise —
> final placement confirmed at build time.

---

## 6. React / Vercel Migration Map

| v1 static | v2 React |
|-----------|----------|
| `components/*.js` render fns | React components (`PlayerCard.tsx`, …) |
| `data/*.js` consts | `src/data/*.ts` typed → later SWR/`fetch` |
| `motion/*.js` | hooks/providers: `useLenis`, `useReveal`, `useHeroIntro`, `useCardTilt`; or `@gsap/react` `useGSAP` |
| `lib/store.js` | React context / Zustand |
| `css/components/*.css` | CSS Modules per component |
| `css/base/tokens.css` | global token import (unchanged) |
| `index.html` sections | route or single-page sections; `framer-motion` for page transitions |

Deploy: Vite build → Vercel (Git integration, preview deploys per PR). Nothing in v1
blocks v2 — tokens, data shapes, component & motion boundaries are already idiomatic.

---

## 7. Build Phasing (recommended)

- **Phase A — Skeleton & system:** tokens, typography, base/layout, nav, footer,
  background, Hero (static) — lock the look.
- **Phase B — Motion core:** Lenis + GSAP + SplitType wiring, hero intro, reveals.
- **Phase C — Story sections:** Why / Mission / Values (narrative spine).
- **Phase D — Product centerpiece:** Avatar → StatRing → PlayerCard → grid+filters;
  then Pitch + formation switch; then Chemistry.
- **Phase E — Data viz & extras:** Dashboard charts, Journey timeline, Trophies,
  Match Center.
- **Phase F — Squad Builder:** drag/drop + live chem (most complex; can be its own pass).
- **Phase G — Polish:** reduced-motion pass, responsive QA, performance, a11y.

Each phase is independently viewable in the browser.
```
