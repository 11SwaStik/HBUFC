# ECLIPSE FC — Product Specification

> Working brand: **ECLIPSE FC**. Placeholder only — name, crest, and palette are
> tokenized for a one-line swap later. Concept: an eclipse — darkness ringed by
> glowing light — which is exactly the dark-premium + neon aesthetic we're after.

---

## 1. Vision & Positioning

A dark, premium, motion-rich website for a modern football club that feels like it
belongs next to a Premier League club site, a Champions League broadcast package, and
an EA FC menu — not a generic sports template.

**Design north stars (and what we steal from each):**

| Reference | What we borrow |
|-----------|----------------|
| Premier League club sites | Information hierarchy, fixtures/results patterns, squad layouts |
| Champions League branding | Dark stage, starball-style radial motifs, ceremony/“big match” gravitas |
| Nike Football campaigns | Bold oversized type, high-contrast hero, energy and attitude |
| EA FC menus | Neon accents, glassmorphism panels, stat cards, hover states, motion |
| Modern sports apps | Mobile-first density, sticky nav, snappy transitions, live-data feel |

**Success criteria**
- Looks expensive and intentional within the first 2 seconds (hero impact).
- Runs at 60fps on a mid-range phone; animations never block reading.
- Zero real images required — placeholders feel designed, not "to be replaced".
- Fully responsive, mobile-first, accessible, and ready to migrate to React later.

**Non-goals (v1)**
- No backend, CMS, auth, or live API. Data is local JS (swappable for `fetch` later).
- No ticketing/e-commerce/payments.
- No real photography — gradients, SVG, and animated visuals stand in.

---

## 2. Target Users

| Persona | Goal on the site | Primary sections |
|---------|------------------|------------------|
| Fan / supporter | Next match, last result, squad, news feel | Landing, Fixtures, Results, Squad |
| New visitor | "Is this club legit / who are they?" | Landing, About, Statistics |
| Local player / recruit | How to join / contact | Squad, Contact |
| Sponsor / partner | Credibility, reach, professionalism | Landing, Statistics, About, Contact |
| Recruiter / you (portfolio) | Show craft & motion quality | All — overall polish |

---

## 3. Information Architecture

Single scrollable landing experience with anchored sections **plus** the ability to
split into routes later. Each section is self-contained so it can become a React route
1:1 during migration.

```
/ (Landing)
├── #home        Hero / landing
├── #about       About the club
├── #squad       Squad
├── #fixtures    Upcoming fixtures
├── #results     Recent results
├── #stats        Statistics
├── #gallery     Gallery (placeholder)
└── #contact     Contact
```

Sticky top navigation links to each anchor; active section is highlighted via scroll
position (scroll-spy). Mobile collapses to a glass slide-in menu.

---

## 4. Page / Section Specifications

Each section lists: **purpose · key content · components · motion**.

### 4.1 Landing / Hero (`#home`)
- **Purpose:** Instant "premium club" impact; orient the visitor; drive to fixtures/join.
- **Content:** Club crest mark, eyebrow ("Est. 1924 · Champions League nights"), oversized
  club name, one-line tagline, two CTAs ("Next Match", "Join the Club"), a scroll cue.
- **Components:** `Hero`, `Button` (primary/ghost), `Crest` (SVG), `ScrollCue`, animated
  background (`AuroraBackground` + floating particles), `MouseGlow`.
- **Motion:** Staggered entrance (eyebrow → title → subtitle → CTAs), parallax on
  background layers, mouse-follow glow, subtle floating orbs, gradient sweep on title.

### 4.2 About the Club (`#about`)
- **Purpose:** Identity, history, values, home ground.
- **Content:** Section heading, lead paragraph, 3–4 value/identity cards (Mission, Values,
  History, Home Ground), a vertical timeline of milestones (founded, promotions, titles).
- **Components:** `SectionHeader`, `GlassCard` ×N, `Timeline`.
- **Motion:** Scroll-reveal stagger on cards; timeline items reveal in sequence; animated
  gradient border on the lead/feature card.

### 4.3 Squad (`#squad`)
- **Purpose:** Show the players; feel like an EA FC squad screen.
- **Content:** Position filter (All / GK / DEF / MID / FWD), responsive grid of player
  cards. Each card: jersey number, initials/monogram avatar (gradient), name, position
  chip, mini stat line (PAC/SHO/PAS or appearances/goals).
- **Components:** `FilterBar`, `PlayerCard`, `Badge/Chip`, `StatPill`.
- **Motion:** Filter re-layout with fade/slide; hover lift + glow + gradient border;
  reveal stagger as the grid enters; "card shine" sweep on hover (FC-style).

### 4.4 Fixtures (`#fixtures`)
- **Purpose:** Upcoming matches, with a featured "Next Match" highlight.
- **Content:** Featured next-match panel (competition, date/time, venue, home/away crests,
  countdown), then a list of upcoming fixtures (date, competition tag, opponent, H/A).
- **Components:** `NextMatchHero`, `Countdown`, `FixtureRow`, `CompetitionTag`.
- **Motion:** Animated countdown digits; gradient border pulse on featured panel;
  row reveal stagger; hover highlight on rows.

### 4.5 Results (`#results`)
- **Purpose:** Recent form and scores.
- **Content:** Form guide (last 5: W/D/L pills), list of recent results (date, opponent,
  score, W/D/L indicator, competition).
- **Components:** `FormGuide`, `ResultRow`, `ScorePill`, `OutcomeDot`.
- **Motion:** Form pills pop in sequentially; rows reveal on scroll; win rows get a subtle
  accent glow.

### 4.6 Statistics (`#stats`)
- **Purpose:** Season at a glance; sponsor/credibility signal.
- **Content:** Animated counters (matches, wins, goals, clean sheets, possession %),
  a few "bar" visualizations built in pure CSS/SVG (e.g. goals by month, win/draw/loss
  split as a donut or stacked bar), top-scorer mini leaderboard.
- **Components:** `StatCounter`, `ProgressBar`, `DonutChart` (SVG), `Leaderboard`.
- **Motion:** Counters animate when scrolled into view (IntersectionObserver); bars/donut
  draw in via stroke-dashoffset / width transition.

### 4.7 Gallery (placeholder) (`#gallery`)
- **Purpose:** Reserve a polished space for future photography/video.
- **Content:** Masonry/grid of gradient-filled tiles with SVG football motifs and labels
  ("Matchday", "Behind the scenes", "Fans", "The Ground"); a "Media coming soon" ribbon.
- **Components:** `GalleryTile` (gradient + SVG + shimmer), `Ribbon`.
- **Motion:** Shimmer/skeleton loading effect on tiles; hover zoom + caption reveal;
  reveal stagger.

### 4.8 Contact (`#contact`)
- **Purpose:** Let fans/recruits/sponsors get in touch.
- **Content:** Club info (ground, email, phone, social), a contact form (name, email,
  subject/topic, message) with client-side validation, success state. Map placeholder
  (styled gradient block with pin SVG).
- **Components:** `ContactInfo`, `Form` (`Input`, `Textarea`, `Select`, `Button`),
  `FormStatus`, `MapPlaceholder`, `SocialLinks`.
- **Motion:** Field focus glow; submit success toast/inline confirm; reveal on scroll.

### 4.9 Global chrome
- **Header/Nav:** Sticky, glass, blurred; logo+wordmark left, links right, scroll-spy
  active state, mobile hamburger → glass slide-in. Shrinks slightly on scroll.
- **Footer:** Crest, quick links, social, newsletter input (UI only), legal line, year.
- **Persistent:** Mouse-follow glow, aurora/particle background behind everything,
  scroll progress bar at top, "back to top" control.

---

## 5. Functional Requirements

| ID | Requirement |
|----|-------------|
| F1 | Scroll-spy nav highlights the section currently in view. |
| F2 | Mobile menu toggles via hamburger; closes on link click / outside click / Esc. |
| F3 | Stat counters animate once, only when scrolled into view. |
| F4 | Squad filter shows/hides players by position with animated re-layout. |
| F5 | Next-match countdown ticks down to a target datetime (config in data file). |
| F6 | Contact form validates name/email/message client-side; shows success/error inline. |
| F7 | Scroll-reveal animations fire as elements enter the viewport (once). |
| F8 | All interactive elements have keyboard focus states and hover states. |
| F9 | Squad, fixtures, results, stats render from local JS data arrays (swappable later). |
| F10 | Scroll progress bar reflects page scroll; back-to-top appears after threshold. |

---

## 6. Non-Functional Requirements

- **Performance:** First meaningful paint fast; animations GPU-friendly (`transform`/
  `opacity` only); no layout thrash; lazy/observer-driven reveals. Target ~60fps.
- **Accessibility:** Semantic landmarks, alt/aria labels, visible focus, color contrast
  AA on text, `prefers-reduced-motion` disables non-essential motion.
- **Responsive:** Mobile-first; breakpoints at 480 / 768 / 1024 / 1280 / 1536.
- **Browser support:** Modern evergreen (Chrome, Safari, Firefox, Edge). Graceful
  degradation of `backdrop-filter` (solid fallback).
- **Maintainability:** Tokenized design system, BEM-ish class naming, modular JS.
- **SEO/meta:** Title, description, Open Graph tags, theme-color.

---

## 7. Data Model (local, v1 → API-ready)

Shapes chosen so a future `fetch()` can drop in unchanged.

```js
Player  = { id, name, position: 'GK'|'DEF'|'MID'|'FWD', number, nationality,
            stats: { pace, shooting, passing }, apps, goals }
Fixture = { id, competition, opponent, home: bool, date: ISOString, venue }
Result  = { id, competition, opponent, home: bool, date, scored, conceded }
Stat    = { key, label, value, suffix? }   // for animated counters
Milestone = { year, title, detail }        // about timeline
GalleryItem = { id, title, tag, gradient }  // placeholder tiles
```

---

## 8. Acceptance Criteria (v1 "done")

- [ ] All 8 sections present, populated from data files, visually distinct & cohesive.
- [ ] Dark premium theme with glassmorphism, neon accents, gradient backgrounds.
- [ ] Every required animation present and smooth; respects reduced-motion.
- [ ] Fully responsive from 320px → 1536px+, mobile menu works.
- [ ] No real images; placeholders look intentional.
- [ ] Lighthouse: Performance ≥ 90, Accessibility ≥ 90 on desktop.
- [ ] Deploys to GitHub Pages as static files with no build step.

---

## 9. Roadmap

- **v1 (this build):** Static HTML/CSS/JS, GitHub Pages.
- **v1.1:** Real assets, content pass, favicon/OG image, analytics.
- **v2:** Migrate to React + Vite, deploy on Vercel (see Design Blueprint §9).
- **v3:** Live data (fixtures/results API or headless CMS), i18n, news/blog.
```
