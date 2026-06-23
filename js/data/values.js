/* Five club values, each with its own animated visual identity (SVG icon + hue). */
export const values = [
  {
    key: "Discipline",
    blurb: "Showing up when no one is watching. The quiet work behind every win.",
    accent: "var(--neon-cyan)",
    icon: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="32" cy="32" r="22"/><path d="M32 18v14l9 6"/></svg>`,
  },
  {
    key: "Brotherhood",
    blurb: "Eleven players, one heartbeat. We rise together or not at all.",
    accent: "var(--crimson)",
    icon: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="24" cy="24" r="8"/><circle cx="42" cy="26" r="7"/><path d="M12 50c0-8 6-13 12-13s12 5 12 13M34 50c0-6 4-11 9-11s9 4 9 10"/></svg>`,
  },
  {
    key: "Respect",
    blurb: "For the game, the opponent, the referee, and the player you were yesterday.",
    accent: "var(--gold)",
    icon: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M32 54s-20-11-20-26a11 11 0 0 1 20-6 11 11 0 0 1 20 6c0 15-20 26-20 26z"/></svg>`,
  },
  {
    key: "Growth",
    blurb: "Every session a little better. Progress over perfection, always.",
    accent: "var(--neon-mint)",
    icon: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 46l14-14 9 9 21-21"/><path d="M44 20h10v10"/></svg>`,
  },
  {
    key: "Inclusivity",
    blurb: "No connections needed. If you love the game, there's a place for you.",
    accent: "var(--volt)",
    icon: `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="32" cy="32" r="22"/><path d="M10 32h44M32 10c6 6 9 14 9 22s-3 16-9 22c-6-6-9-14-9-22s3-16 9-22z"/></svg>`,
  },
];
