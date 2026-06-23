/* Values — each value as its own animated visual identity (not a plain card). */
import { values } from "../data/values.js";

export function renderValues(root) {
  if (!root) return;
  root.innerHTML = values.map((v, i) => `
    <article class="value reveal" style="--accent:${v.accent};--i:${i}" tabindex="0">
      <div class="value__glow" aria-hidden="true"></div>
      <div class="value__icon" aria-hidden="true">${v.icon}</div>
      <div class="value__ring" aria-hidden="true"></div>
      <h3 class="value__name">${v.key}</h3>
      <p class="value__blurb">${v.blurb}</p>
      <span class="value__index" aria-hidden="true">0${i + 1}</span>
    </article>`).join("");
}
