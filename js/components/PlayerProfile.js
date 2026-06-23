/* PlayerProfile — the 30% panel. Renders a selected player's profile with a
   default view (avatar, name, number, position, OVR, foot) and an expandable
   view (height, weight, age, bio, skill ratings, motto).
   OVR count-up + skill-bar fills are triggered via .is-live class by the caller. */
import { Avatar, themeLabel } from "./Avatar.js";
import { FULL_POS } from "../lib/positions.js";

export function PlayerProfile(p) {
  const theme = themeLabel(p);
  const attrs = Object.entries(p.attrs);
  const max = Math.max(...attrs.map(([, v]) => v));
  const bars = attrs.map(([k, v]) => `
    <div class="prof-skill">
      <span class="prof-skill__k">${k}</span>
      <span class="prof-skill__bar"><i style="--v:${v}%"></i></span>
      <span class="prof-skill__v ${v === max ? "is-top" : ""}" data-count="${v}">0</span>
    </div>`).join("");

  return `
  <div class="prof" data-id="${p.id}" data-group="${p.posGroup}">
    <div class="prof__theme">${theme}</div>

    <div class="prof__avatar">
      ${Avatar(p, p.id, 150)}
      <span class="prof__num">${p.number}</span>
    </div>

    <h3 class="prof__name">${p.name}</h3>
    <div class="prof__pos">${FULL_POS[p.position] || p.position}</div>

    <div class="prof__headline">
      <div class="prof__ovr">
        <span class="prof__ovr-num" data-count="${p.ovr}">0</span>
        <span class="prof__ovr-label">Overall</span>
      </div>
      <div class="prof__foot">
        <span class="prof__foot-ic">${p.foot === "R" ? "R" : "L"}</span>
        <span class="prof__foot-label">${p.foot === "R" ? "Right" : "Left"} foot</span>
      </div>
    </div>

    <button class="prof__toggle" type="button" aria-expanded="false">
      <span class="prof__toggle-more">View full profile</span>
      <span class="prof__toggle-less">Hide details</span>
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg>
    </button>

    <div class="prof__expand">
      <div class="prof__bio-meta">
        <div class="prof__meta">
          <div><b>${(p.height_cm / 100).toFixed(2)}m</b><span>Height</span></div>
          <div><b>${p.weight_kg}kg</b><span>Weight</span></div>
          <div><b>${p.age}</b><span>Age</span></div>
        </div>
        <p class="prof__bio">${p.bio}</p>
      </div>

      <div class="prof__skills">
        <div class="prof__skills-title">Skill Ratings</div>
        ${bars}
      </div>

      <blockquote class="prof__motto">“${p.motto}”</blockquote>
    </div>
  </div>`;
}
