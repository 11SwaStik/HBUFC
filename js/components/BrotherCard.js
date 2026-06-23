/* BrotherCard — a carousel card for the Brotherhood section (individual identity).
   Shows ONLY: archetype, name, position, jersey number.
   On hover/focus (CSS): card expands + glows and a "View Profile" button appears.
   On click (JS): opens the premium PlayerProfileModal with full stats.
   No ratings or statistics on the card itself — discovering members, not a database. */
import { Avatar, themeLabel } from "./Avatar.js";
import { FULL_POS } from "../lib/positions.js";

export function BrotherCard(p, i = 0) {
  const theme = themeLabel(p);
  return `
  <article class="bro-card" data-id="${p.id}" data-group="${p.posGroup}" data-pos="${p.position}"
           style="--i:${i}" tabindex="0" role="button" aria-label="Open ${p.name}'s profile">
    <div class="bro-card__glow" aria-hidden="true"></div>
    <span class="bro-card__num" aria-hidden="true">${String(p.number).padStart(2, "0")}</span>

    <div class="bro-card__avatar">${Avatar(p, `bro-${p.id}`, 168)}</div>

    <div class="bro-card__body">
      <span class="bro-card__archetype">${theme}</span>
      <h3 class="bro-card__name">${p.name}</h3>
      <span class="bro-card__pos">${FULL_POS[p.position] || p.position}</span>
      <span class="bro-card__btn">View Profile →</span>
    </div>
  </article>`;
}
