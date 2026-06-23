/* PlayerModal — premium full-profile modal opened from a BrotherCard.
   Complete stats, biography, height, weight, preferred foot, favourite player,
   football quote. One modal element is reused; openModal(player) fills it. */
import { $, $$ } from "../lib/dom.js";
import { Avatar, themeLabel } from "./Avatar.js";
import { byId } from "../data/squad.js";
import { FULL_POS } from "../lib/positions.js";

let modal, lastFocused;

function ensureModal() {
  if (modal) return modal;
  modal = document.createElement("div");
  modal.className = "pmodal";
  modal.id = "playerModal";
  modal.setAttribute("aria-hidden", "true");
  modal.innerHTML = `
    <div class="pmodal__backdrop" data-close></div>
    <div class="pmodal__dialog" role="dialog" aria-modal="true" aria-label="Player profile">
      <button class="pmodal__close" data-close aria-label="Close profile">&times;</button>
      <div class="pmodal__content"></div>
    </div>`;
  document.body.appendChild(modal);

  modal.addEventListener("click", (e) => { if (e.target.dataset.close !== undefined) closeModal(); });
  document.addEventListener("keydown", (e) => {
    if (modal.classList.contains("is-open") && e.key === "Escape") closeModal();
  });
  return modal;
}

function statGrid(p) {
  const max = Math.max(...Object.values(p.attrs));
  return Object.entries(p.attrs).map(([k, v], i) => `
    <div class="pmodal-stat" style="--i:${i}">
      <div class="pmodal-stat__top"><span>${k}</span><b class="${v === max ? "is-top" : ""}">${v}</b></div>
      <div class="pmodal-stat__bar"><i style="--v:${v}%"></i></div>
    </div>`).join("");
}

export function openModal(idOrPlayer) {
  const p = typeof idOrPlayer === "object" ? idOrPlayer : byId[idOrPlayer];
  if (!p) return;
  ensureModal();
  const theme = themeLabel(p);

  modal.querySelector(".pmodal__content").innerHTML = `
    <div class="pmodal__hero" data-group="${p.posGroup}">
      <span class="pmodal__num">${String(p.number).padStart(2, "0")}</span>
      <div class="pmodal__avatar">${Avatar(p, `modal-${p.id}`, 220)}</div>
      <div class="pmodal__id">
        <span class="pmodal__archetype">${theme}</span>
        <h3 class="pmodal__name">${p.name}</h3>
        <span class="pmodal__pos">${FULL_POS[p.position] || p.position} · #${p.number}</span>
        <div class="pmodal__ovr"><b>${p.ovr}</b><span>Overall</span></div>
      </div>
    </div>

    <div class="pmodal__body">
      <div class="pmodal__col">
        <div class="pmodal__block">
          <h4 class="pmodal__h">Biography</h4>
          <p class="pmodal__bio">${p.bio}</p>
        </div>
        <div class="pmodal__block">
          <h4 class="pmodal__h">Vitals</h4>
          <div class="pmodal__vitals">
            <div><b>${(p.height_cm / 100).toFixed(2)}m</b><span>Height</span></div>
            <div><b>${p.weight_kg}kg</b><span>Weight</span></div>
            <div><b>${p.age}</b><span>Age</span></div>
            <div><b>${p.foot === "R" ? "Right" : "Left"}</b><span>Foot</span></div>
          </div>
        </div>
        <div class="pmodal__block">
          <h4 class="pmodal__h">Favourite Player</h4>
          <p class="pmodal__fav">${p.favPlayer}</p>
        </div>
      </div>

      <div class="pmodal__col">
        <div class="pmodal__block">
          <h4 class="pmodal__h">Attributes</h4>
          <div class="pmodal__stats">${statGrid(p)}</div>
        </div>
        <blockquote class="pmodal__quote">“${p.quote}”</blockquote>
      </div>
    </div>`;

  lastFocused = document.activeElement;
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  // animate stat bars after the open transition
  requestAnimationFrame(() => {
    setTimeout(() => $$(".pmodal-stat", modal).forEach(s => s.classList.add("is-live")), 220);
  });
  modal.querySelector(".pmodal__close")?.focus();
}

export function closeModal() {
  if (!modal) return;
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  lastFocused?.focus?.();
}
