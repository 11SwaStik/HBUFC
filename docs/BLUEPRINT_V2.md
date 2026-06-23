# HBUFC — Design Blueprint (v2: "Football for All")

> Supersedes the earlier ECLIPSE FC docs. This is the authoritative design
> direction for HBUFC as a **football movement**, not a club brochure.
> Code is written only after this + COMPONENT_ARCHITECTURE.md are approved.

---

## 1. Positioning — "This is a movement"

HBUFC isn't a team page; it's the digital home of a grassroots football movement
born in Ajmer in 2017 to fight favoritism and give *every* footballer a chance.
The site must carry that emotional weight **and** feel like a premium football
video-game product.

**Two feelings, held at once:**
- **Movement / heart** — the *why*: inclusivity, brotherhood, "Football for All".
  Carried by the narrative sections (Why HBUFC Exists, Mission, Values).
- **Product / craft** — the *wow*: EA FC menus, FUT cards, FM tactics boards, UCL
  broadcast polish. Carried by the interactive sections (Squad, Pitch, Dashboard).

**North-star test:** a visitor should scroll once and think *"this feels like a
football video game menu — and it stands for something."*

---

## 2. Brand & Tone

| Attribute | Direction |
|-----------|-----------|
| Voice | Bold, inclusive, confident. Short declarative lines. ("No connections needed. Just football.") |
| Mood | Dark arena at night, floodlights, neon HUD overlays. |
| Motifs | Eclipse/ring crest, pitch geometry, hex/chevron (Adidas-launch energy), starball radial (UCL), card holograms (FUT). |
| Don't | Stocky "sports template" rows, clip-art balls, light backgrounds, generic hero-image-with-text-overlay. |

---

## 3. Visual System

### 3.1 Color (dark premium + neon)
Tokenized in `tokens.css`. Black base, crimson+gold core (HBUFC), neon HUD accents.

| Token | Value | Role |
|-------|-------|------|
| `--bg-900` | `#04050a` | App background (near-black) |
| `--bg-800` | `#080a12` | Section base |
| `--surface` | `rgba(255,255,255,.04)` | Glass fill |
| `--surface-2` | `rgba(255,255,255,.07)` | Raised glass |
| `--border-glass` | `rgba(255,255,255,.12)` | Glass edge |
| `--crimson` | `#ff3d58` | **Primary** brand |
| `--gold` | `#ffd76a` | **Secondary** brand / honours |
| `--neon-mint` | `#00f5a0` | HUD accent / "win" / OK |
| `--neon-cyan` | `#22d3ee` | Data-viz / chemistry links |
| `--volt` | `#7c5cff` | Tertiary accent / gradients |
| `--text` | `#f5f7fb` / `--text-muted` `#aab2c5` / `--text-dim` `#6b7388` | Text ramp |

**Signature gradients & FX**
- `--grad-brand`: `linear-gradient(135deg,#ff3d58,#ff6b3d 55%,#ffd76a)`
- `--grad-hud`: `linear-gradient(135deg,#00f5a0,#22d3ee,#7c5cff)` (data-viz, chemistry)
- `--grad-card-gold`: FUT gold-card foil; `--grad-card-icon`: special/icon variant
- Glow recipe: layered `box-shadow` + `drop-shadow`, color-matched to element accent.
- Position-based avatar gradients (GK/DEF/MID/FWD each get a hue) — see card spec.

### 3.2 Typography
- **Display:** "Clash Display" or "Space Grotesk" (wide, sporty) — headings, scores, OVR.
- **Body/UI:** "Inter" — copy, labels, stats; `tabular-nums` for all numbers.
- Fluid `clamp()` scale: display `clamp(3rem,11vw,8rem)` → caption `.72rem`.
- Eyebrows: uppercase, `.25em` tracking. Display: tight `-.02em`, line-height ~0.95.
- **SplitType** drives per-character/word reveals on the big headings.

### 3.3 Layout & space
- Container `min(100% - 2.5rem, 1240px)`.
- Section rhythm: generous vertical padding `clamp(72px,11vw,160px)`.
- Mobile-first; breakpoints 480 / 768 / 1024 / 1280 / 1536.
- Grids use `auto-fit/minmax` so most reflow without explicit queries.

---

## 4. Homepage Story Flow (narrative spine)

Order is deliberate — it tells the movement's story, then shows the product.

| # | Section | Role | Signature moment |
|---|---------|------|------------------|
| 1 | **Hero** | "Football for All" | Cinematic title reveal (SplitType), floating particles, animated crest, parallax floodlight. |
| 2 | **Why HBUFC Exists** | The fight vs favoritism | Scroll-pinned story; "closed doors → open pitch" visual; text reveals line-by-line. |
| 3 | **Our Mission** | 4 mission pillars | Cards that assemble on scroll; counters for reach. |
| 4 | **Club Values** | Discipline · Brotherhood · Growth · Inclusivity · Respect | Interactive value chips with icon micro-animations. |
| 5 | **Squad Showcase** | FUT collectible cards + 4-3-3 pitch + chemistry | The product centerpiece (see §6). |
| 6 | **Club Journey Timeline** | 2017 → today | Horizontal scroll-driven timeline (FM-season feel). |
| 7 | **Statistics Dashboard** | Animated data | Donut / bars / radar / counters draw in on view. |
| 8 | **Call To Action** | Join the movement | Glass panel, gradient border, "Trials open" pulse. |

Supporting (woven in, not separate nav noise): **Match Center**, **Trophy Cabinet**,
**Squad Builder** — see Component Architecture for placement.

---

## 5. Animation Strategy (motion-heavy, but disciplined)

### 5.1 Stack (loaded via CDN; GitHub-Pages friendly, no build step)
| Library | Job | Notes |
|---------|-----|-------|
| **GSAP + ScrollTrigger** | Scroll-driven reveals, pinning, timelines, parallax | Core motion engine. |
| **Lenis** | Smooth inertia scrolling | Synced to GSAP's ticker (single rAF loop). |
| **SplitType** | Split headings into chars/words/lines | Feeds GSAP stagger reveals. |
| (native) | IntersectionObserver fallbacks, counters | Used where GSAP is overkill. |

> Trade-off noted: this adds ~3 CDN deps vs the hand-rolled v1. Worth it for the
> requested cinematic feel. All gated behind `prefers-reduced-motion` and a JS
> capability check so the site still renders fully if a CDN fails.

### 5.2 Technique map
| Effect | Mechanism | Where |
|--------|-----------|-------|
| Hero title reveal | SplitType chars → GSAP stagger (y/rotate/opacity) | Hero |
| Smooth scroll | Lenis + GSAP ticker | Global |
| Pinned story | ScrollTrigger `pin` + scrubbed timeline | Why HBUFC Exists |
| Scroll reveals | ScrollTrigger batch, `y:40→0`, stagger by `--i` | All sections |
| Horizontal timeline | ScrollTrigger horizontal scrub | Journey |
| Animated counters | GSAP tween on a proxy object | Mission, Dashboard |
| Chart draw-in | GSAP on `stroke-dashoffset` / scaleY | Dashboard |
| FUT card hover | CSS 3D tilt (pointer) + foil shine sweep + stat-ring fill | Squad cards |
| Stat rings | SVG `stroke-dashoffset` animated on reveal/hover | Cards |
| Chemistry links | SVG lines drawn between linked players, pulse | Pitch |
| Floating particles | Canvas or CSS; rAF; pause off-screen | Hero, CTA |
| Mouse light | radial-gradient following pointer via CSS vars | Global overlay |
| Page/section transitions | GSAP timelines on anchor nav; fade+slide | Global |
| Dynamic nav glow | Active link glow + magnetic hover | Header |

### 5.3 Performance & a11y rules
- Animate only `transform`/`opacity`/`stroke-dashoffset`; never layout props.
- Single rAF loop (Lenis↔GSAP); kill ScrollTriggers on resize/route change.
- Particles: cap count, `prefers-reduced-motion` → static; pause when tab hidden.
- Every non-essential animation disabled under `prefers-reduced-motion: reduce`.
- Lazy-init heavy sections (pitch/dashboard) when near viewport.

---

## 6. Player Card System (FUT collectible — NO photos)

The heart of the "product" feel. Pure SVG + CSS; no images.

### 6.1 Animated avatar (instead of a photo)
- **Stylized silhouette** built from SVG paths (head + shoulders bust), filled with a
  **position-based gradient**:
  - GK → cyan/teal, DEF → violet/blue, MID → mint/green, FWD → crimson/gold.
- **Dynamic outline**: animated `stroke-dashoffset` traces the silhouette on hover.
- **Animated stat ring(s)**: concentric SVG rings around the avatar fill to the
  player's OVR / key stat; subtle continuous rotation on the outer ring.
- **Glow**: color-matched drop-shadow that intensifies on hover.
- Optional **jersey-number watermark** behind the silhouette.

### 6.2 Card anatomy (FUT layout)
```
┌─────────────────────────┐
│ OVR        �â—‰ avatar     │  ← rating block (OVR + POS + foot/flag) | animated avatar
│ POS        (stat ring)   │
│ FOOT                     │
├─────────────────────────┤
│        PLAYER NAME       │  ← display font, foil underline
├─────────────────────────┤
│ PAC 88   DRI 84          │  ← 6 attributes in 2 cols (skill bars fill on reveal)
│ SHO 91   DEF 40          │
│ PAS 75   PHY 82          │
├─────────────────────────┤
│ #9 · 1.81m · 23y · R    │  ← meta strip: number, height, age, preferred foot
└─────────────────────────┘
```

### 6.3 Data schema (per player)
```js
Player = {
  id, name, number, position,            // "GK"|"RB"|"CB"|"LB"|"CM"|"CAM"|"RW"|"ST"|"LW"...
  posGroup: "GK"|"DEF"|"MID"|"FWD",       // drives avatar gradient
  height_cm, age, foot: "R"|"L",
  ovr,                                    // overall rating
  attrs: { PAC, SHO, PAS, DRI, DEF, PHY },// 6 FUT attributes (GK variant: DIV/HAN/KIC/REF/SPD/POS)
  chem: [ids],                            // linked teammates for chemistry viz
  cardType: "base"|"gold"|"icon"          // foil variant
}
```

### 6.4 Card interactions / micro-interactions
- Hover: 3D tilt toward cursor, foil shine sweep, stat bars + ring animate, glow up,
  meta strip slides in.
- Click/tap: opens enlarged card (modal) — full skill bars + radar.
- Position filter chips re-layout the grid (GSAP FLIP).
- Keyboard focusable; reduced-motion → no tilt, instant bar fill.

---

## 7. Interactive Features (behavior spec)

| Feature | Behavior |
|---------|----------|
| **Formation View (4-3-3)** | SVG/CSS pitch; players placed by formation coords; switch shapes (4-3-3 / 4-2-3-1 / 3-5-2) → players glide (GSAP) to new spots. |
| **Interactive pitch** | Hover a dot → mini stats tooltip; click → load that player's FUT card. |
| **Hover-to-reveal stats** | On card & on pitch dot. |
| **Team Chemistry** | SVG links drawn between `chem`-linked players on the pitch; link color = strength; pulse animation; total chemistry score counter. |
| **Match Center** | Broadcast scoreboard + live-feed simulation (minute ticker, score bumps, momentum bar, xG/shots). |
| **Squad Builder** | Drag a player from a bench list into a formation slot (or tap-to-assign on touch); recomputes chemistry + average OVR live. |
| **Stats Dashboard** | Donut (W/D/L), bars (goals/month), radar (team profile), animated counters. |
| **Timeline** | Horizontal scroll-scrubbed 2017→now milestones. |
| **Trophy Cabinet** | Glass shelf; SVG trophies; hover tilt + gold glow; counts. |
| **Dynamic Hero** | Title reveal, particles, parallax floodlight, mouse light, rotating slogan. |

---

## 8. Responsive & Accessibility

- Mobile-first; touch equivalents for every hover (tap-to-reveal, drag→tap-assign).
- Touch targets ≥ 44px; hover FX gated behind `@media (hover:hover)`.
- Semantic landmarks, focus-visible rings, aria labels on interactive SVG.
- Contrast AA for text on dark; never rely on color alone (W/D/L also use icon/letter).
- `prefers-reduced-motion` path verified for every section.

---

## 9. Tech & Deployment

- **Static**, no build step → deploys to GitHub Pages as-is (`.nojekyll`).
- ES modules (`type="module"`); libs via CDN with `defer`.
- Single source of truth: `tokens.css` for all design values; `js/data/*` for content.
- **Migration-ready**: components/data shaped for a later React+Vite→Vercel port,
  where GSAP/Lenis become hooks/providers (see COMPONENT_ARCHITECTURE §6).

---

## 10. Open Decisions (confirm before build)

1. **Library stack** — OK to add GSAP + Lenis + ScrollTrigger + SplitType via CDN?
   (Alternative: keep the lighter hand-rolled motion from v1 — less cinematic.)
2. **Scope of first build** — full homepage story flow in one pass, or hero + squad
   first as a vertical slice to lock the feel?
3. **Squad Builder depth** — full drag-and-drop builder now, or phase 2 after the
   core homepage is approved? (It's the most complex single feature.)
4. **Fonts** — Space Grotesk + Inter (free, reliable) vs Clash Display (premium look,
   needs hosting/CDN).
5. **Reuse** — keep & restyle the Match Center / pitch / dashboard I started, or
   rebuild them fresh on the GSAP stack?
```
