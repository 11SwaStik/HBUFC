/* Anime-inspired football avatars — pure SVG, NO photos.
   Two layers of identity:
     1. ARCHETYPE  → body shape, chest emblem, accessory, expression, palette
        The Wall (GK) · The Guardian (DEF) · The Engine (MID)
        The Lightning (Winger) · The Finisher (ST)
     2. INDIVIDUAL → hair style, hair colour, skin tone, all derived
        deterministically from the player's number so every face differs.
*/

/* Themes keyed by archetype label (the source of truth in squad data). */
const THEME = {
  "The Wall":      { label: "The Wall",      c1: "#22d3ee", c2: "#0e7490", aura: "#5eead4" },
  "The Guardian":  { label: "The Guardian",  c1: "#9d86ff", c2: "#4f46e5", aura: "#c4b5fd" },
  "The Engine":    { label: "The Engine",    c1: "#3dffb8", c2: "#0ea66e", aura: "#6ee7b7" },
  "The Lightning": { label: "The Lightning", c1: "#ffe49a", c2: "#f59e0b", aura: "#fde68a" },
  "The Finisher":  { label: "The Finisher",  c1: "#ff6b7e", c2: "#e22945", aura: "#fda4af" },
};
const GROUP_FALLBACK = { GK: "The Wall", DEF: "The Guardian", MID: "The Engine", FWD: "The Finisher" };

export function themeFor(p) {
  return THEME[p.archetype] || THEME[GROUP_FALLBACK[p.posGroup]] || THEME["The Engine"];
}
export function themeLabel(p) { return themeFor(p).label; }
export const avatarTheme = themeFor;

/* ---------- individual variation palettes (picked by jersey number) ---------- */
const SKIN = ["#f1d9c4", "#ecc9a6", "#dcab82", "#c68a5e", "#a86b45"];
const HAIR = ["#15151c", "#23190f", "#352311", "#0e0e13", "#4a3119", "#5b3a1d"];
const pick = (arr, n) => arr[((n % arr.length) + arr.length) % arr.length];

/* ---------- per-archetype theme backdrop ---------- */
function backdrop(label, id) {
  switch (label) {
    case "The Guardian":
      return `<path class="av-motif" d="M60 20 L94 33 V63 C94 90 79 105 60 113 C41 105 26 90 26 63 V33 Z"
                fill="none" stroke="url(#${id}-g)" stroke-width="2" opacity=".4"/>`;
    case "The Engine":
      return `<circle class="av-spin" cx="60" cy="60" r="46" fill="none" stroke="url(#${id}-g)"
                stroke-width="1.5" stroke-dasharray="7 9" opacity=".5"/>`;
    case "The Lightning":
      return `<g class="av-streak" stroke="url(#${id}-g)" stroke-width="3" stroke-linecap="round" opacity=".5">
                <path d="M10 42 H38"/><path d="M4 58 H32"/><path d="M10 74 H38"/></g>`;
    case "The Finisher":
      return `<path class="av-flame" d="M60 16 C71 33 86 40 86 61 a26 26 0 0 1-52 0 c0-13 9-19 13-28 c2 9 9 11 13 7 c-2-11-2-19 0-30z"
                fill="url(#${id}-glow)" opacity=".55"/>`;
    default: // The Wall
      return `<rect class="av-motif" x="20" y="38" width="80" height="78" rx="16"
                fill="none" stroke="url(#${id}-g)" stroke-width="2" opacity=".35"/>`;
  }
}

/* ---------- per-archetype torso / shoulders ---------- */
function torsoPath(label) {
  switch (label) {
    case "The Wall":      return "M16 124 C16 94 38 80 60 80 C82 80 104 94 104 124 Z";  // broadest (keeper)
    case "The Guardian":  return "M20 124 C20 95 39 82 60 82 C81 82 100 95 100 124 Z";  // broad + armoured
    case "The Lightning": return "M28 124 C28 99 43 86 60 86 C77 86 92 99 92 124 Z";    // lean, aero
    case "The Finisher":  return "M22 124 C22 96 40 83 60 83 C80 83 98 96 98 124 Z";    // confident
    default:              return "M24 124 C24 97 41 84 60 84 C79 84 96 97 96 124 Z";    // engine (athletic)
  }
}

/* ---------- per-archetype accessory (gloves / pads / band / bolts / armband) ---------- */
function accessory(label, id) {
  switch (label) {
    case "The Wall": // raised goalkeeper gloves
      return `<g class="av-gloves" fill="url(#${id}-g)" stroke="rgba(0,0,0,.25)" stroke-width="1">
                <rect x="6"  y="98" width="18" height="24" rx="7"/>
                <rect x="96" y="98" width="18" height="24" rx="7"/>
                <path d="M11 104v12M19 104v12M101 104v12M109 104v12" stroke="rgba(0,0,0,.2)" stroke-width="1.4"/>
              </g>`;
    case "The Guardian": // angular shoulder armour
      return `<g fill="url(#${id}-g)" opacity=".95">
                <path d="M20 110 L34 86 L46 92 L40 114 Z"/>
                <path d="M100 110 L86 86 L74 92 L80 114 Z"/>
              </g>`;
    case "The Engine": // headband
      return `<path d="M43 47 Q60 41 77 47 L77 53 Q60 47 43 53 Z" fill="url(#${id}-g)"/>`;
    case "The Lightning": // trailing speed bolts beside the head
      return `<g class="av-streak" stroke="url(#${id}-g)" stroke-width="2.5" stroke-linecap="round" opacity=".8">
                <path d="M30 60 l-9 4 6 1 -7 4"/><path d="M90 60 l9 4 -6 1 7 4"/>
              </g>`;
    case "The Finisher": // captain armband
      return `<rect x="92" y="92" width="11" height="16" rx="3" fill="url(#${id}-g)"/>
              <path d="M95 96 h5 M95 100 h5 M95 104 h5" stroke="rgba(0,0,0,.3)" stroke-width="1"/>`;
    default: return "";
  }
}

/* ---------- per-archetype chest emblem (the role's sigil on the jersey) ---------- */
function emblem(label) {
  const c = "rgba(255,255,255,.85)";
  switch (label) {
    case "The Wall": // shield + cross
      return `<g fill="none" stroke="${c}" stroke-width="2" stroke-linejoin="round">
                <path d="M60 96 l9 3 v7 c0 6-4 9-9 11 c-5-2-9-5-9-11 v-7 Z"/>
                <path d="M60 101 v8 M56 105 h8" stroke-width="1.6"/></g>`;
    case "The Guardian": // shield
      return `<path d="M60 95 l10 4 v8 c0 7-5 10-10 12 c-5-2-10-5-10-12 v-8 Z"
                fill="none" stroke="${c}" stroke-width="2" stroke-linejoin="round"/>`;
    case "The Engine": // gear
      return `<g fill="none" stroke="${c}" stroke-width="1.8">
                <circle cx="60" cy="106" r="6"/><circle cx="60" cy="106" r="2"/>
                <path d="M60 97v3M60 112v3M51 106h3M66 106h3M54 100l2 2M64 110l2 2M66 100l-2 2M56 110l-2 2"/></g>`;
    case "The Lightning": // bolt
      return `<path d="M63 96 l-9 13 h5 l-3 10 11 -15 h-5 Z" fill="${c}"/>`;
    case "The Finisher": // crosshair / target
      return `<g fill="none" stroke="${c}" stroke-width="2">
                <circle cx="60" cy="106" r="7"/><path d="M60 96v5M60 111v5M50 106h5M65 106h5"/></g>`;
    default: return "";
  }
}

/* ---------- per-archetype expression (brows + mouth) ---------- */
function face(label) {
  switch (label) {
    case "The Wall": // focused, level brows
      return `<path d="M50 49 h7 M63 49 h7" stroke="rgba(40,25,20,.7)" stroke-width="2" stroke-linecap="round"/>
              <path d="M55 66 h10" stroke="rgba(80,40,30,.7)" stroke-width="2" stroke-linecap="round"/>`;
    case "The Guardian": // stern, furrowed brows
      return `<path d="M50 47 l7 3 M70 47 l-7 3" stroke="rgba(40,25,20,.75)" stroke-width="2" stroke-linecap="round"/>
              <path d="M55 67 q5 -2 10 0" stroke="rgba(80,40,30,.7)" stroke-width="2" fill="none" stroke-linecap="round"/>`;
    case "The Lightning": // smirk, one brow raised
      return `<path d="M50 50 h7 M63 47 h7" stroke="rgba(40,25,20,.7)" stroke-width="2" stroke-linecap="round"/>
              <path d="M55 66 q6 4 11 -1" stroke="rgba(80,40,30,.7)" stroke-width="2" fill="none" stroke-linecap="round"/>`;
    case "The Finisher": // confident calm
      return `<path d="M50 49 h7 M63 49 h7" stroke="rgba(40,25,20,.7)" stroke-width="2" stroke-linecap="round"/>
              <path d="M55 66 q5 3 10 0" stroke="rgba(80,40,30,.7)" stroke-width="2" fill="none" stroke-linecap="round"/>`;
    default: // The Engine — determined slight smile
      return `<path d="M50 49 h7 M63 49 h7" stroke="rgba(40,25,20,.7)" stroke-width="2" stroke-linecap="round"/>
              <path d="M55 66 q5 2 10 0" stroke="rgba(80,40,30,.7)" stroke-width="2" fill="none" stroke-linecap="round"/>`;
  }
}

/* ---------- individual hair styles (picked per player) ---------- */
const HAIR_STYLES = [
  // 0 spiky
  "M42 53 C41 33 51 23 60 23 C70 23 80 33 78 53 C75 45 72 43 69 44 C70 38 66 34 63 35 C65 41 61 42 60 38 C58 43 54 42 56 35 C51 36 50 43 51 47 C48 44 45 46 42 53 Z",
  // 1 swept side fringe
  "M43 53 C42 32 55 22 67 25 C77 27 81 39 77 53 C73 47 66 45 60 46 C53 47 47 49 45 54 C44 54 43 54 43 53 Z",
  // 2 short crop
  "M44 51 C44 34 52 28 60 28 C68 28 76 34 76 51 C72 45 66 43 60 43 C54 43 48 45 44 51 Z",
  // 3 curly / textured top
  "M41 53 a6 6 0 0 1 1 -12 a7 7 0 0 1 7 -9 a8 8 0 0 1 11 -2 a8 8 0 0 1 11 2 a7 7 0 0 1 7 9 a6 6 0 0 1 1 12 c-5 -6 -11 -8 -19 -8 c-8 0 -14 2 -19 8 Z",
  // 4 quiff / undercut
  "M46 52 C44 36 53 24 63 26 C73 28 76 36 73 46 C70 41 65 40 60 41 C55 41 50 44 49 52 C48 52 47 52 46 52 Z",
  // 5 middle-part curtains
  "M43 52 C42 33 52 24 60 24 C68 24 78 33 77 52 C74 46 68 45 61 47 C61 41 60 38 60 35 C60 38 59 41 59 47 C52 45 46 46 43 52 Z",
];

/* ---------- main ---------- */
export function Avatar(p, uid = p.id, size = 96) {
  const t = themeFor(p);
  const id = `av-${uid}`;
  const n = p.number ?? p.id ?? 0;
  const skin = pick(SKIN, n);
  const hairColor = pick(HAIR, n * 2 + 1);
  const hair = pick(HAIR_STYLES, n * 3 + (p.posGroup === "GK" ? 0 : 1));
  const ratio = 132 / 120;

  return `
  <svg class="avatar avatar--${t.label.replace(/\s+/g, "")}" viewBox="0 0 120 132"
       width="${size}" height="${(size * ratio).toFixed(0)}" role="img"
       aria-label="${p.name} — ${t.label} avatar">
    <defs>
      <linearGradient id="${id}-g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${t.c1}"/><stop offset="1" stop-color="${t.c2}"/>
      </linearGradient>
      <radialGradient id="${id}-glow" cx="50%" cy="42%" r="60%">
        <stop offset="0" stop-color="${t.aura}" stop-opacity=".55"/>
        <stop offset="1" stop-color="${t.aura}" stop-opacity="0"/>
      </radialGradient>
    </defs>

    <!-- ambient glow + archetype backdrop -->
    <ellipse cx="60" cy="60" rx="52" ry="54" fill="url(#${id}-glow)"/>
    ${backdrop(t.label, id)}

    <!-- accessory layer that sits behind the body (gloves/pads/bolts) -->
    ${accessory(t.label, id)}

    <g class="av-char">
      <!-- torso / jersey (archetype-shaped) -->
      <path d="${torsoPath(t.label)}" fill="url(#${id}-g)"/>
      <!-- collar -->
      <path d="M52 84 L60 96 L68 84" fill="none" stroke="rgba(0,0,0,.32)" stroke-width="2.5"/>
      <!-- chest emblem (role sigil) -->
      ${emblem(t.label)}
      <!-- neck -->
      <rect x="53" y="72" width="14" height="16" rx="6" fill="${skin}"/>
      <!-- head -->
      <path d="M44 52 C44 38 52 30 60 30 C68 30 76 38 76 52 C76 66 69 76 60 76 C51 76 44 66 44 52 Z" fill="${skin}"/>
      <!-- ears -->
      <circle cx="44" cy="55" r="3.4" fill="${skin}"/><circle cx="76" cy="55" r="3.4" fill="${skin}"/>
      <!-- hair (individual) -->
      <path d="${hair}" fill="${hairColor}"/>
      <!-- glowing eyes (archetype aura) -->
      <g class="av-eyes" fill="${t.aura}">
        <ellipse cx="53" cy="56" rx="3.1" ry="4.2"/><ellipse cx="67" cy="56" rx="3.1" ry="4.2"/>
      </g>
      <!-- expression -->
      ${face(t.label)}
    </g>

    <!-- traced outline that animates in on reveal -->
    <path class="av-outline" d="${torsoPath(t.label)}" fill="none" stroke="${t.c1}" stroke-width="2"/>
  </svg>`;
}
