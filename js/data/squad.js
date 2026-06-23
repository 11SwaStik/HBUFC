/* HBUFC starting XI — identity-first (NO FIFA-style ratings or attributes).

   Each player stores:
     • preferredPosition — their natural / default role
     • formationRoles    — their DISPLAY position per formation
   The tooltip reads formationRoles[activeFormation] so a player's label updates
   with the active shape, falling back to preferredPosition if unmapped.
   `formations.js` only stores placement (x/y); roles live here on the player.

   Optional fields (height_cm, weight_kg, motto, favClub, favPlayer, philosophy)
   show only when present. `chem` drives the formation chemistry links. id === jersey number. */
export const players = [
  // ── Goalkeeper ──
  { id: 1,  name: "Anish",    number: 1,  preferredPosition: "GK",  posGroup: "GK",  archetype: "The Wall",
    formationRoles: { "4-3-3": "GK", "4-2-3-1": "GK", "3-5-2": "GK" },
    age: 23, nickname: "The Keeper of Calm", trait: "Penalty-stopping reflexes", chem: [4, 5] },

  // ── Defenders ──
  { id: 3,  name: "Raghav",   number: 3,  preferredPosition: "LB",  posGroup: "DEF", archetype: "The Guardian",
    formationRoles: { "4-3-3": "LB", "4-2-3-1": "LB", "3-5-2": "CB" },
    age: 21, nickname: "The Overlap", trait: "Never-ending stamina", chem: [5, 11] },
  { id: 4,  name: "Manindra", number: 4,  preferredPosition: "CB",  posGroup: "DEF", archetype: "The Guardian",
    formationRoles: { "4-3-3": "CB", "4-2-3-1": "CB", "3-5-2": "CB" },
    age: 23, nickname: "The Reader", trait: "Reads the game two passes ahead", chem: [1, 5, 2] },
  { id: 5,  name: "Swastik",  number: 5,  preferredPosition: "CB",  posGroup: "DEF", archetype: "The Guardian",
    formationRoles: { "4-3-3": "CB", "4-2-3-1": "CB", "3-5-2": "CB" },
    age: 22, height_cm: 183, weight_kg: 74, motto: "Destroyer of the opponents.",
    nickname: "The Destroyer", trait: "Dominant in the air", chem: [1, 4, 3] },
  { id: 2,  name: "Lokendra", number: 2,  preferredPosition: "RB",  posGroup: "DEF", archetype: "The Guardian",
    formationRoles: { "4-3-3": "RB", "4-2-3-1": "RB", "3-5-2": "RWB" },
    age: 24, nickname: "The Sentinel", trait: "Iron one-on-one defending", chem: [4, 9] },

  // ── Midfielders ──
  { id: 7,  name: "Nidhitva", number: 7,  preferredPosition: "DMF", posGroup: "MID", archetype: "The Engine",
    formationRoles: { "4-3-3": "DMF", "4-2-3-1": "DMF", "3-5-2": "DMF" },
    age: 23, nickname: "The Anchor", trait: "Breaks up every attack", chem: [8, 6] },
  { id: 8,  name: "Priyank",  number: 8,  preferredPosition: "CMF", posGroup: "MID", archetype: "The Engine",
    formationRoles: { "4-3-3": "CMF", "4-2-3-1": "CAM", "3-5-2": "CMF" },
    age: 22, nickname: "The Metronome", trait: "Pinpoint passing range", chem: [7, 6, 10] },
  { id: 6,  name: "Tanmay",   number: 6,  preferredPosition: "CMF", posGroup: "MID", archetype: "The Engine",
    formationRoles: { "4-3-3": "CMF", "4-2-3-1": "DMF", "3-5-2": "CMF" },
    age: 25, nickname: "The Conductor", trait: "Controls the tempo", chem: [7, 8, 11] },

  // ── Forwards ──
  { id: 11, name: "Nitinesh", number: 11, preferredPosition: "LWF", posGroup: "FWD", archetype: "The Lightning",
    formationRoles: { "4-3-3": "LWF", "4-2-3-1": "LW", "3-5-2": "LWB" },
    age: 25, nickname: "The Left Spark", trait: "Blistering acceleration", chem: [3, 10, 6] },
  { id: 9,  name: "Krishna",  number: 9,  preferredPosition: "RWF", posGroup: "FWD", archetype: "The Lightning",
    formationRoles: { "4-3-3": "RWF", "4-2-3-1": "RW", "3-5-2": "ST" },
    age: 23, nickname: "The Flyer", trait: "Mesmerising dribbling", chem: [2, 10, 8] },
  { id: 10, name: "Manav",    number: 10, preferredPosition: "CF",  posGroup: "FWD", archetype: "The Finisher",
    formationRoles: { "4-3-3": "CF", "4-2-3-1": "ST", "3-5-2": "ST" },
    age: 24, nickname: "The Closer", trait: "Clinical in the box", chem: [9, 11, 8] },
];

export const byId = Object.fromEntries(players.map(p => [p.id, p]));

/** Resolve a player's display position for a formation (falls back to preferred). */
export function roleFor(player, formationKey) {
  return player?.formationRoles?.[formationKey] || player?.preferredPosition || "";
}
