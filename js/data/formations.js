/* Formation coordinates as % of the pitch — PLACEMENT ONLY.
   x: 0 (left) → 100 (right).  y: 0 (opponent goal / attack) → 100 (own goal).
   Keyed by player id (= jersey number) so the same squad can take any shape.

   Display position is NOT stored here — each player owns their per-formation
   role via `formationRoles` in squad.js, so the tooltip reads the player's
   current role in the active formation. Formations only decide WHERE a marker
   sits; the player decides WHAT they are called there.

   Default squad: 1 GK · 2 RB · 3 LB · 4 CB · 5 CB · 6 CMF · 7 DMF
                  · 8 CMF · 9 RWF · 10 CF · 11 LWF */
export const formations = {
  "4-3-3": [
    { id: 1,  x: 50, y: 90 },
    { id: 2,  x: 84, y: 70 }, { id: 4, x: 62, y: 75 }, { id: 5, x: 38, y: 75 }, { id: 3, x: 16, y: 70 },
    { id: 7,  x: 50, y: 58 }, { id: 6, x: 30, y: 47 }, { id: 8, x: 70, y: 47 },
    { id: 9,  x: 82, y: 22 }, { id: 10, x: 50, y: 16 }, { id: 11, x: 18, y: 22 },
  ],
  "4-2-3-1": [
    { id: 1,  x: 50, y: 90 },
    { id: 2,  x: 84, y: 70 }, { id: 4, x: 62, y: 75 }, { id: 5, x: 38, y: 75 }, { id: 3, x: 16, y: 70 },
    { id: 7,  x: 38, y: 58 }, { id: 6, x: 62, y: 58 },
    { id: 9,  x: 82, y: 36 }, { id: 8, x: 50, y: 32 }, { id: 11, x: 18, y: 36 },
    { id: 10, x: 50, y: 14 },
  ],
  "3-5-2": [
    { id: 1,  x: 50, y: 90 },
    { id: 4,  x: 68, y: 76 }, { id: 5, x: 50, y: 78 }, { id: 3, x: 32, y: 76 },
    { id: 2,  x: 88, y: 50 }, { id: 6, x: 64, y: 55 }, { id: 7, x: 50, y: 58 }, { id: 8, x: 36, y: 55 }, { id: 11, x: 12, y: 50 },
    { id: 10, x: 58, y: 18 }, { id: 9, x: 42, y: 18 },
  ],
};
