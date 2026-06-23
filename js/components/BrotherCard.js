/* BrotherCard — a carousel card for the Brotherhood section.
   Initial: avatar, name, position, number, archetype title.
   On hover (CSS): expansion + glow + quick attribute preview (3 key stats).
   On click (JS): opens the premium PlayerProfileModal.
   Real-Madrid-squad-page feel: discovering members, not browsing a database. */
import { Avatar, themeLabel } from "./Avatar.js";
import { FULL_POS } from "../lib/positions.js";

/* The three "headline" attributes to preview per position group. */
const PREVIEW_KEYS = {
  GK:  ["REF", "DIV", "HAN"],
  DEF: ["DEF", "PHY", "PAC"],
  MID: ["PAS", "DRI", "PHY"],
  FWD: ["SHO", "PAC", "DRI"],
};

export function BrotherCard(p, i = 0) {
  const theme = themeLabel(p);
  const keys = PREVIEW_KEYS[p.posGroup] || PREVIEW_KEYS.MID;
  const preview = keys.map(k => `
    <div class="bro-card__stat">
      <span class="bro-card__stat-v">${p.attrs[k] ?? "—"}</span>
      <span class="bro-card__stat-k">${k}</span>
    </div>`).join("");

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
    </div>

    <!-- quick attribute preview — revealed on hover -->
    <div class="bro-card__preview" aria-hidden="true">
      ${preview}
    </div>
    <span class="bro-card__cue">View profile →</span>
  </article>`;
}
