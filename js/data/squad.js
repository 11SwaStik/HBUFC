/* HBUFC starting XI — identity-first (NO FIFA-style ratings or attributes).
   Optional fields (height_cm, weight_kg, motto, favClub, favPlayer, philosophy)
   are shown only when present; the modal shows tasteful placeholders otherwise.
   `chem` drives the formation chemistry links only. id === jersey number. */
export const players = [
  // ── Goalkeeper ──
  { id: 1,  name: "Anish",    number: 1,  position: "GK",  posGroup: "GK",  archetype: "The Wall",
    age: 23, nickname: "The Keeper of Calm", trait: "Penalty-stopping reflexes", chem: [4, 5] },

  // ── Defenders ──
  { id: 3,  name: "Raghav",   number: 3,  position: "LB",  posGroup: "DEF", archetype: "The Guardian",
    age: 21, nickname: "The Overlap", trait: "Never-ending stamina", chem: [5, 11] },
  { id: 4,  name: "Manindra", number: 4,  position: "CB",  posGroup: "DEF", archetype: "The Guardian",
    age: 23, nickname: "The Reader", trait: "Reads the game two passes ahead", chem: [1, 5, 2] },
  { id: 5,  name: "Swastik",  number: 5,  position: "CB",  posGroup: "DEF", archetype: "The Guardian",
    age: 22, height_cm: 183, weight_kg: 74, motto: "Destroyer of the opponents.",
    nickname: "The Destroyer", trait: "Dominant in the air", chem: [1, 4, 3] },
  { id: 2,  name: "Lokendra", number: 2,  position: "RB",  posGroup: "DEF", archetype: "The Guardian",
    age: 24, nickname: "The Sentinel", trait: "Iron one-on-one defending", chem: [4, 9] },

  // ── Midfielders ──
  { id: 7,  name: "Nidhitva", number: 7,  position: "DMF", posGroup: "MID", archetype: "The Engine",
    age: 23, nickname: "The Anchor", trait: "Breaks up every attack", chem: [8, 6] },
  { id: 8,  name: "Priyank",  number: 8,  position: "CMF", posGroup: "MID", archetype: "The Engine",
    age: 22, nickname: "The Metronome", trait: "Pinpoint passing range", chem: [7, 6, 10] },
  { id: 6,  name: "Tanmay",   number: 6,  position: "CMF", posGroup: "MID", archetype: "The Engine",
    age: 25, nickname: "The Conductor", trait: "Controls the tempo", chem: [7, 8, 11] },

  // ── Forwards ──
  { id: 11, name: "Nitinesh", number: 11, position: "LWF", posGroup: "FWD", archetype: "The Lightning",
    age: 25, nickname: "The Left Spark", trait: "Blistering acceleration", chem: [3, 10, 6] },
  { id: 9,  name: "Krishna",  number: 9,  position: "RWF", posGroup: "FWD", archetype: "The Lightning",
    age: 23, nickname: "The Flyer", trait: "Mesmerising dribbling", chem: [2, 10, 8] },
  { id: 10, name: "Manav",    number: 10, position: "CF",  posGroup: "FWD", archetype: "The Finisher",
    age: 24, nickname: "The Closer", trait: "Clinical in the box", chem: [9, 11, 8] },
];

export const byId = Object.fromEntries(players.map(p => [p.id, p]));
