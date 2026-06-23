/* 3D tilt + dynamic light on FUT cards (EA-style). Pointer only; skipped on touch
   and under reduced motion. */
import { $$, } from "../lib/dom.js";
import { prefersReduced } from "../lib/motionGuard.js";

export function setupCardTilt(scope = document) {
  if (prefersReduced || !window.matchMedia("(hover: hover)").matches) return;
  $$(".pcard", scope).forEach(card => {
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      card.style.setProperty("--rx", `${-py * 12}deg`);
      card.style.setProperty("--ry", `${px * 14}deg`);
      card.style.setProperty("--mx", `${(px + 0.5) * 100}%`);
      card.style.setProperty("--my", `${(py + 0.5) * 100}%`);
    });
    card.addEventListener("pointerleave", () => {
      card.style.setProperty("--rx", "0deg");
      card.style.setProperty("--ry", "0deg");
    });
  });
}
