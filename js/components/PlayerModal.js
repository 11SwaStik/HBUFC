/* PlayerModal — premium identity profile opened from a BrotherCard.
   Shows: avatar, name, number, position, age, archetype, height/weight (if any),
   motto (if any), and tasteful "Coming Soon" placeholders for favourite club,
   favourite player and football philosophy.
   NO FIFA-style ratings or attribute numbers — storytelling over stats. */
import { $ } from "../lib/dom.js";
import { Avatar, themeLabel } from "./Avatar.js";
import { byId } from "../data/squad.js";
import { FULL_POS } from "../lib/positions.js";

let modal, lastFocused;
const SOON = `<span class="pmodal__soon">Coming Soon</span>`;

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

/* a vitals chip — only rendered when the value exists */
const chip = (value, label) => value == null || value === ""
  ? "" : `<div><b>${value}</b><span>${label}</span></div>`;

export function openModal(idOrPlayer) {
  const p = typeof idOrPlayer === "object" ? idOrPlayer : byId[idOrPlayer];
  if (!p) return;
  ensureModal();
  const theme = themeLabel(p);

  const vitals = [
    chip(p.age, "Age"),
    chip(p.height_cm ? `${p.height_cm} cm` : null, "Height"),
    chip(p.weight_kg ? `${p.weight_kg} kg` : null, "Weight"),
    chip(`#${p.number}`, "Number"),
  ].join("");

  const mottoBlock = p.motto
    ? `<blockquote class="pmodal__quote">“${p.motto}”</blockquote>`
    : `<blockquote class="pmodal__quote pmodal__quote--soon">Player motto ${SOON}</blockquote>`;

  modal.querySelector(".pmodal__content").innerHTML = `
    <div class="pmodal__hero" data-archetype="${p.archetype}">
      <span class="pmodal__num">${String(p.number).padStart(2, "0")}</span>
      <div class="pmodal__avatar">${Avatar(p, `modal-${p.id}`, 220)}</div>
      <div class="pmodal__id">
        <span class="pmodal__archetype">${theme}</span>
        <h3 class="pmodal__name">${p.name}</h3>
        <span class="pmodal__pos">${FULL_POS[p.position] || p.position} · #${p.number}</span>
      </div>
    </div>

    <div class="pmodal__body">
      <div class="pmodal__col">
        <div class="pmodal__block">
          <h4 class="pmodal__h">Profile</h4>
          <div class="pmodal__vitals">${vitals}</div>
        </div>
        ${mottoBlock}
      </div>

      <div class="pmodal__col">
        <div class="pmodal__block">
          <h4 class="pmodal__h">Off the pitch</h4>
          <dl class="pmodal__facts">
            <div><dt>Favourite Club</dt><dd>${p.favClub || SOON}</dd></div>
            <div><dt>Favourite Player</dt><dd>${p.favPlayer || SOON}</dd></div>
            <div><dt>Football Philosophy</dt><dd>${p.philosophy || SOON}</dd></div>
          </dl>
        </div>
      </div>
    </div>`;

  lastFocused = document.activeElement;
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  modal.querySelector(".pmodal__close")?.focus();
}

export function closeModal() {
  if (!modal) return;
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  lastFocused?.focus?.();
}
