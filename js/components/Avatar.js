/* Avatar — animated SVG silhouette (NO photos).
   Position group drives the gradient hue. Returns an SVG string. */

const GRAD = {
  GK:  ["#22d3ee", "#0ea5b7"],   // cyan
  DEF: ["#7c5cff", "#4f46e5"],   // violet/blue
  MID: ["#00f5a0", "#0ea66e"],   // mint/green
  FWD: ["#ff3d58", "#ff9d3d"],   // crimson/gold
};

/** uid keeps gradient/clip ids unique per card so multiple avatars don't collide. */
export function Avatar(posGroup, uid) {
  const [c1, c2] = GRAD[posGroup] || GRAD.MID;
  const gid = `av-${uid}`;
  return `
  <svg class="avatar" viewBox="0 0 120 120" aria-hidden="true">
    <defs>
      <linearGradient id="${gid}-g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/>
      </linearGradient>
      <radialGradient id="${gid}-glow" cx="50%" cy="38%" r="60%">
        <stop offset="0" stop-color="${c1}" stop-opacity=".55"/>
        <stop offset="1" stop-color="${c1}" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <circle cx="60" cy="56" r="52" fill="url(#${gid}-glow)"/>
    <!-- silhouette bust: head + shoulders -->
    <g class="avatar__sil">
      <path fill="url(#${gid}-g)"
        d="M60 30c8.3 0 15 6.7 15 15s-6.7 15-15 15-15-6.7-15-15 6.7-15 15-15z"/>
      <path fill="url(#${gid}-g)"
        d="M26 108c0-18.8 15.2-34 34-34s34 15.2 34 34c0 2.2-1.8 4-4 4H30c-2.2 0-4-1.8-4-4z"/>
    </g>
    <!-- animated traced outline on top -->
    <g class="avatar__outline" stroke="${c1}" stroke-width="2" fill="none" stroke-linejoin="round">
      <path d="M60 30c8.3 0 15 6.7 15 15s-6.7 15-15 15-15-6.7-15-15 6.7-15 15-15z"/>
      <path d="M26 108c0-18.8 15.2-34 34-34s34 15.2 34 34"/>
    </g>
  </svg>`;
}

export const avatarGrad = (posGroup) => GRAD[posGroup] || GRAD.MID;
