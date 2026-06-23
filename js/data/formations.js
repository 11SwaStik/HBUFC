/* Formation coordinates as % of the pitch.
   x: 0 (left) → 100 (right).  y: 0 (opponent goal / attack) → 100 (own goal).
   Keyed by player id so the pitch can place the same squad in any shape. */
export const formations = {
  "4-3-3": [
    { id: 1,  x: 50, y: 90 },
    { id: 2,  x: 84, y: 70 }, { id: 4, x: 62, y: 75 }, { id: 5, x: 38, y: 75 }, { id: 3, x: 16, y: 70 },
    { id: 6,  x: 30, y: 52 }, { id: 8, x: 50, y: 55 }, { id: 10, x: 70, y: 52 },
    { id: 7,  x: 82, y: 25 }, { id: 9, x: 50, y: 16 }, { id: 11, x: 18, y: 25 },
  ],
  "4-2-3-1": [
    { id: 1,  x: 50, y: 90 },
    { id: 2,  x: 84, y: 70 }, { id: 4, x: 62, y: 75 }, { id: 5, x: 38, y: 75 }, { id: 3, x: 16, y: 70 },
    { id: 6,  x: 38, y: 58 }, { id: 8, x: 62, y: 58 },
    { id: 7,  x: 82, y: 36 }, { id: 10, x: 50, y: 32 }, { id: 11, x: 18, y: 36 },
    { id: 9,  x: 50, y: 14 },
  ],
  "3-5-2": [
    { id: 1,  x: 50, y: 90 },
    { id: 4,  x: 70, y: 76 }, { id: 5, x: 50, y: 78 }, { id: 3, x: 30, y: 76 },
    { id: 2,  x: 88, y: 50 }, { id: 6, x: 64, y: 55 }, { id: 8, x: 50, y: 57 }, { id: 10, x: 36, y: 55 }, { id: 11, x: 12, y: 50 },
    { id: 9,  x: 60, y: 18 }, { id: 7, x: 40, y: 18 },
  ],
};
