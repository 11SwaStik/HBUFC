/* Journey — vertical cinematic timeline, items reveal as they scroll into frame. */
import { journey } from "../data/journey.js";

export function renderJourney(root) {
  if (!root) return;
  root.innerHTML = journey.map((m, i) => `
    <li class="jrny__item reveal" style="--i:${i}">
      <div class="jrny__marker" aria-hidden="true"><span></span></div>
      <div class="jrny__content">
        <span class="jrny__year">${m.year}</span>
        <h3 class="jrny__title">${m.title}</h3>
        <p class="jrny__detail">${m.detail}</p>
      </div>
    </li>`).join("");
}
