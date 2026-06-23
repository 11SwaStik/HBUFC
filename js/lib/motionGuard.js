/* Decide whether to run heavy motion.
   False when the user prefers reduced motion OR the CDN libs failed to load. */
export const prefersReduced =
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

export const hasGSAP  = typeof window.gsap !== "undefined";
export const hasLenis = typeof window.Lenis !== "undefined";
export const hasSplit = typeof window.SplitType !== "undefined";

/** Master switch: run cinematic motion only if safe + available. */
export const motionOK = !prefersReduced && hasGSAP;

if (window.gsap && window.ScrollTrigger) {
  window.gsap.registerPlugin(window.ScrollTrigger);
}
