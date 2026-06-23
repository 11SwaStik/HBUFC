/* Motion orchestration. All GSAP/Lenis/SplitType usage is isolated here so the
   site renders & works fully even when motion is off (reduced-motion or CDN fail). */
import { motionOK, hasLenis, hasSplit } from "../lib/motionGuard.js";
import { $, $$ } from "../lib/dom.js";

export function initMotion() {
  if (!motionOK) {
    // Fallback: reveal everything immediately, no smooth scroll.
    $$(".reveal").forEach(n => n.classList.add("is-in"));
    $$(".pcard").forEach(n => n.classList.add("is-in"));
    return;
  }
  const gsap = window.gsap;
  setupLenis(gsap);
  heroIntro(gsap);
  reveals(gsap);
  counters(gsap);
  cardInView(gsap);
}

/* ---- Lenis smooth scroll, synced to GSAP ticker (single rAF loop) ---- */
function setupLenis(gsap) {
  if (!hasLenis) return;
  const lenis = new window.Lenis({ duration: 1.1, smoothWheel: true });
  lenis.on("scroll", () => window.ScrollTrigger?.update());
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  window.__lenis = lenis;

  // anchor links → lenis smooth scroll
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (target) { e.preventDefault(); lenis.scrollTo(target, { offset: -70 }); }
    });
  });
}

/* ---- Hero intro: SplitType chars → GSAP stagger ---- */
function heroIntro(gsap) {
  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
  const title = $(".hero__title");

  if (hasSplit && title) {
    const split = new window.SplitType(title, { types: "chars" });
    gsap.set(split.chars, { yPercent: 120, opacity: 0, rotateZ: 8 });
    tl.to(split.chars, { yPercent: 0, opacity: 1, rotateZ: 0, stagger: 0.04, duration: 0.9 }, 0.2);
  } else if (title) {
    tl.from(title, { y: 40, opacity: 0, duration: 0.9 }, 0.2);
  }

  tl.from(".hero__eyebrow", { y: 20, opacity: 0, duration: 0.6 }, 0.1)
    .from(".hero__crest", { scale: 0.6, opacity: 0, duration: 1 }, 0)
    .from(".hero__slogan", { y: 20, opacity: 0, duration: 0.6 }, 0.7)
    .from(".hero__actions > *", { y: 20, opacity: 0, stagger: 0.12, duration: 0.5 }, 0.85)
    .from(".scroll-cue", { opacity: 0, duration: 0.6 }, 1.2);
}

/* ---- Scroll reveals via ScrollTrigger batch ---- */
function reveals(gsap) {
  const ST = window.ScrollTrigger;
  ST.batch(".reveal", {
    start: "top 86%",
    onEnter: (els) => gsap.to(els, {
      y: 0, opacity: 1, duration: 0.8, stagger: 0.08, ease: "power3.out",
      onStart: () => els.forEach(e => e.classList.add("is-in")),
    }),
  });
  gsap.set(".reveal", { y: 36, opacity: 0 });
}

/* ---- Animated counters ---- */
function counters(gsap) {
  $$("[data-count]").forEach(el => {
    const target = +el.dataset.count;
    const obj = { v: 0 };
    window.ScrollTrigger.create({
      trigger: el, start: "top 90%", once: true,
      onEnter: () => gsap.to(obj, {
        v: target, duration: 1.4, ease: "power2.out",
        onUpdate: () => { el.textContent = Math.round(obj.v); },
      }),
    });
  });
}

/* ---- Player cards: add .is-in when scrolled into view (drives bar/ring fill) ---- */
function cardInView(gsap) {
  window.ScrollTrigger.batch(".pcard", {
    start: "top 90%",
    onEnter: (els) => els.forEach((e, i) => setTimeout(() => e.classList.add("is-in"), i * 70)),
  });
}
