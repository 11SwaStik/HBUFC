/* ====================================================================
   HBUFC — orchestrator (vertical slice: Hero + Squad Showcase)
   Boot order: render content → init motion → wire interactions.
   ==================================================================== */
import { $, $$ } from "./lib/dom.js";
import { club } from "./data/club.js";
import { players, byId } from "./data/squad.js";
import { PlayerCard } from "./components/PlayerCard.js";
import { mountPitch, chemistryScore } from "./components/Pitch.js";
import { renderValues } from "./components/Values.js";
import { renderJourney } from "./components/Journey.js";
import { renderImpact } from "./components/Impact.js";
import { initMotion } from "./motion/index.js";
import { setupCardTilt } from "./motion/cardTilt.js";

/* ---------- render ---------- */
function renderSquad() {
  const grid = $("#squadGrid");
  if (grid) grid.innerHTML = players.map((p, i) => PlayerCard(p, i)).join("");
}

function renderPitch() {
  const pitch = $("#pitch");
  if (!pitch) return;

  const api = mountPitch(pitch, {
    formation: "4-3-3",
    onSelect: (id) => highlightCard(id),
  });

  // formation switch
  $$(".form-switch__btn").forEach(btn => {
    btn.addEventListener("click", () => {
      $$(".form-switch__btn").forEach(b => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      const key = btn.dataset.formation;
      api.place(key);
      updateChem(key);
    });
  });

  updateChem("4-3-3");
  api.select(9); // default highlight the striker
}

function updateChem(key) {
  const el = $("#chemScore");
  if (el) el.textContent = chemistryScore(key);
}

// when a pitch dot is selected, pulse the matching card + scroll it into view on mobile
function highlightCard(id) {
  $$(".pcard").forEach(c => c.classList.toggle("is-active", +c.dataset.id === id));
  const card = $(`.pcard[data-id="${id}"]`);
  if (card && window.innerWidth < 920) card.scrollIntoView({ behavior: "smooth", block: "center" });
}

/* ---------- hero bits ---------- */
function typeSlogan() {
  const el = $("#typed");
  if (!el) return;
  let si = 0, ci = 0, del = false;
  const tick = () => {
    const w = club.slogans[si];
    el.textContent = w.slice(0, ci);
    if (!del && ci < w.length) { ci++; setTimeout(tick, 55); }
    else if (!del && ci === w.length) { del = true; setTimeout(tick, 1900); }
    else if (del && ci > 0) { ci--; setTimeout(tick, 26); }
    else { del = false; si = (si + 1) % club.slogans.length; setTimeout(tick, 320); }
  };
  tick();
}

function spawnParticles(n = 28) {
  const box = $("#particles");
  if (!box) return;
  const colors = ["var(--crimson)", "var(--gold)", "var(--neon-mint)", "var(--volt)"];
  box.innerHTML = Array.from({ length: n }, (_, i) => {
    const left = (i * 97 + 13) % 100, size = 3 + (i % 4) * 1.5;
    const dur = 9 + (i % 7) * 1.6, delay = -((i * 1.3) % dur);
    return `<span class="particle" style="left:${left}%;width:${size}px;height:${size}px;
      background:${colors[i % colors.length]};animation-duration:${dur}s;animation-delay:${delay}s"></span>`;
  }).join("");
}

/* nav: mobile toggle + active glow + shrink */
function setupNav() {
  const toggle = $("#navToggle"), links = $("#navLinks"), header = $("#header");
  const setOpen = (s) => { links.classList.toggle("is-open", s); toggle.setAttribute("aria-expanded", String(s)); };
  toggle?.addEventListener("click", () => setOpen(!links.classList.contains("is-open")));
  $$(".nav__link", links).forEach(a => a.addEventListener("click", () => setOpen(false)));
  document.addEventListener("keydown", e => { if (e.key === "Escape") setOpen(false); });

  const navLinks = $$(".nav__link[href^='#']");
  const secs = navLinks.map(l => $(l.getAttribute("href"))).filter(Boolean);
  const onScroll = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 30);
    let cur = secs[0]?.id;
    for (const s of secs) if (s.getBoundingClientRect().top <= 130) cur = s.id;
    navLinks.forEach(l => l.classList.toggle("is-active", l.getAttribute("href") === `#${cur}`));
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

function mouseLight() {
  const glow = $("#mouseGlow");
  if (!glow) return;
  window.addEventListener("pointermove", e => {
    glow.style.setProperty("--mx", `${e.clientX}px`);
    glow.style.setProperty("--my", `${e.clientY}px`);
  }, { passive: true });
}

/* ---------- boot ---------- */
document.addEventListener("DOMContentLoaded", () => {
  renderSquad();
  renderPitch();
  renderValues($("#valuesGrid"));
  renderJourney($("#journeyList"));
  renderImpact($("#impactGrid"));

  typeSlogan();
  spawnParticles();
  setupNav();
  mouseLight();

  initMotion();          // GSAP/Lenis/SplitType (or graceful fallback)
  setupCardTilt();       // card 3D tilt

  const yr = $("#year");
  if (yr) yr.textContent = new Date().getFullYear();
});
