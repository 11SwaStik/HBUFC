/* PlayerCard — FUT-style collectible card. Pure render → HTML string.
   Stat bars + avatar ring fill in via CSS when the card gets .is-in. */
import { Avatar } from "./Avatar.js";
import { initials } from "../lib/dom.js";

export function PlayerCard(p, i = 0) {
  const attrs = Object.entries(p.attrs);
  const max = Math.max(...attrs.map(([, v]) => v));
  const bars = attrs.map(([k, v]) => `
    <div class="pc-attr">
      <span class="pc-attr__k">${k}</span>
      <span class="pc-attr__v ${v === max ? "is-top" : ""}">${v}</span>
      <span class="pc-attr__bar"><i style="--v:${v}%"></i></span>
    </div>`).join("");

  // OVR ring circumference for the animated stat ring around the avatar
  const R = 54, C = (2 * Math.PI * R).toFixed(1);

  return `
  <article class="pcard pcard--${p.cardType} pcard--${p.posGroup}" data-id="${p.id}" style="--i:${i}" tabindex="0" aria-label="${p.name}, ${p.position}, overall ${p.ovr}">
    <div class="pcard__foil"></div>
    <div class="pcard__shine"></div>
    <div class="pcard__inner">
      <header class="pcard__head">
        <div class="pcard__rating">
          <span class="pcard__ovr" data-count="${p.ovr}">${p.ovr}</span>
          <span class="pcard__pos">${p.position}</span>
          <span class="pcard__foot">${p.foot}</span>
        </div>
        <div class="pcard__avatar">
          <svg class="pcard__ring" viewBox="0 0 120 120" aria-hidden="true">
            <circle class="pcard__ring-track" cx="60" cy="60" r="${R}"/>
            <circle class="pcard__ring-fill" cx="60" cy="60" r="${R}"
                    stroke-dasharray="${C}" stroke-dashoffset="${C}" data-c="${C}" data-ovr="${p.ovr}"/>
          </svg>
          ${Avatar(p.posGroup, p.id)}
          <span class="pcard__num">${p.number}</span>
        </div>
      </header>

      <div class="pcard__name">${p.name}</div>

      <div class="pcard__attrs">${bars}</div>

      <footer class="pcard__meta">
        <span>${p.height_cm / 100}m</span>
        <span>${p.age}y</span>
        <span>${p.foot === "R" ? "Right" : "Left"}</span>
      </footer>
    </div>
  </article>`;
}
