/* Impact — big beautiful counters. data-count is animated by motion/index.js. */
import { impact } from "../data/impact.js";

export function renderImpact(root) {
  if (!root) return;
  root.innerHTML = impact.map((s, i) => `
    <article class="impact reveal" style="--i:${i}">
      <div class="impact__num">
        <span data-count="${s.value}">0</span><span class="impact__suffix">${s.suffix}</span>
      </div>
      <h3 class="impact__label">${s.label}</h3>
      <p class="impact__sub">${s.sub}</p>
    </article>`).join("");
}
