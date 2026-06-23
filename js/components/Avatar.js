/* Anime-inspired football avatars — pure SVG, NO photos.
   Each position group is a "character class" with its own theme, palette,
   silhouette accents and glow. Returns an <svg> string.

     GK  → The Wall      (cyan)    broad shoulders, keeper gloves stance
     DEF → The Guardian  (violet)  shield motif behind shoulders
     MID → The Engine    (mint)    gear/aura rings
     RW/LW → The Lightning (gold)  speed streaks
     ST  → The Finisher  (crimson) flame aura
*/

/* Themes keyed by archetype label (the source of truth in squad data). */
const THEME = {
  "The Wall":      { label: "The Wall",      c1: "#22d3ee", c2: "#0e7490", aura: "#22d3ee" },
  "The Guardian":  { label: "The Guardian",  c1: "#9d86ff", c2: "#4f46e5", aura: "#7c5cff" },
  "The Engine":    { label: "The Engine",    c1: "#3dffb8", c2: "#0ea66e", aura: "#00f5a0" },
  "The Lightning": { label: "The Lightning", c1: "#ffe49a", c2: "#f59e0b", aura: "#ffd76a" },
  "The Finisher":  { label: "The Finisher",  c1: "#ff6b7e", c2: "#e22945", aura: "#ff3d58" },
};

/* Fallback by position group if a player has no explicit archetype. */
const GROUP_FALLBACK = { GK: "The Wall", DEF: "The Guardian", MID: "The Engine", FWD: "The Finisher" };

export function themeFor(p) {
  return THEME[p.archetype] || THEME[GROUP_FALLBACK[p.posGroup]] || THEME["The Engine"];
}

export function themeLabel(p) { return themeFor(p).label; }

/* Per-theme decorative backdrop behind the character bust. */
function backdrop(key, uid) {
  switch (key) {
    case "The Guardian": // shield
      return `<path class="av-motif" d="M60 22 L92 34 V62 C92 88 78 102 60 110 C42 102 28 88 28 62 V34 Z"
                fill="none" stroke="url(#${uid}-g)" stroke-width="2" opacity=".4"/>`;
    case "The Engine": // gear rings
      return `<circle class="av-spin" cx="60" cy="60" r="44" fill="none" stroke="url(#${uid}-g)"
                stroke-width="1.5" stroke-dasharray="6 8" opacity=".5"/>`;
    case "The Lightning": // speed streaks
      return `<g class="av-streak" stroke="url(#${uid}-g)" stroke-width="3" stroke-linecap="round" opacity=".55">
                <path d="M14 40 H40"/><path d="M8 56 H34"/><path d="M14 72 H40"/></g>`;
    case "The Finisher": // flame aura
      return `<path class="av-flame" d="M60 18 C70 34 84 40 84 60 a24 24 0 0 1-48 0 c0-12 8-18 12-26 c2 8 8 10 12 6 c-2-10-2-18 0-28z"
                fill="url(#${uid}-glow)" opacity=".5"/>`;
    default: // The Wall — solid back panel
      return `<rect class="av-motif" x="22" y="40" width="76" height="72" rx="14"
                fill="none" stroke="url(#${uid}-g)" stroke-width="2" opacity=".35"/>`;
  }
}

/** uid keeps gradient ids unique per avatar instance. */
export function Avatar(p, uid = p.id, size = 96) {
  const t = themeFor(p);
  const id = `av-${uid}`;
  return `
  <svg class="avatar avatar--${(t.label).replace(/\s+/g, "")}" viewBox="0 0 120 130" width="${size}" height="${size * 130 / 120}" role="img" aria-label="${p.name} avatar, ${t.label}">
    <defs>
      <linearGradient id="${id}-g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${t.c1}"/><stop offset="1" stop-color="${t.c2}"/>
      </linearGradient>
      <radialGradient id="${id}-glow" cx="50%" cy="40%" r="60%">
        <stop offset="0" stop-color="${t.aura}" stop-opacity=".6"/>
        <stop offset="1" stop-color="${t.aura}" stop-opacity="0"/>
      </radialGradient>
    </defs>

    <!-- ambient glow + theme backdrop -->
    <ellipse cx="60" cy="58" rx="50" ry="52" fill="url(#${id}-glow)"/>
    ${backdrop(t.label, id)}

    <!-- character bust: hair, head, neck, shoulders (anime styling) -->
    <g class="av-char">
      <!-- shoulders / jersey -->
      <path d="M24 120 C24 96 40 84 60 84 C80 84 96 96 96 120 Z" fill="url(#${id}-g)"/>
      <!-- collar V -->
      <path d="M52 86 L60 98 L68 86" fill="none" stroke="rgba(0,0,0,.35)" stroke-width="2.5"/>
      <!-- neck -->
      <rect x="53" y="74" width="14" height="16" rx="6" fill="url(#${id}-g)"/>
      <!-- head -->
      <path d="M44 52 C44 38 52 30 60 30 C68 30 76 38 76 52 C76 66 69 76 60 76 C51 76 44 66 44 52 Z" fill="#f1d9c4"/>
      <!-- spiky anime hair -->
      <path d="M42 52 C40 34 50 24 60 24 C71 24 81 34 79 53 C76 46 73 44 70 45 C71 39 67 35 64 35 C66 40 62 41 60 38 C58 42 54 41 55 35 C50 37 49 43 50 47 C47 44 44 46 42 52 Z" fill="url(#${id}-g)"/>
      <!-- glowing eyes -->
      <g class="av-eyes" fill="${t.aura}">
        <ellipse cx="53" cy="55" rx="3.2" ry="4.4"/>
        <ellipse cx="67" cy="55" rx="3.2" ry="4.4"/>
      </g>
      <!-- determined mouth -->
      <path d="M55 66 Q60 69 65 66" fill="none" stroke="rgba(80,40,30,.7)" stroke-width="2" stroke-linecap="round"/>
    </g>

    <!-- traced outline that animates on reveal -->
    <path class="av-outline" d="M24 120 C24 96 40 84 60 84 C80 84 96 96 96 120"
          fill="none" stroke="${t.c1}" stroke-width="2"/>
  </svg>`;
}

export const avatarTheme = themeFor;
