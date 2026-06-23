/* HBUFC squad — full FUT-style schema. NO photos; avatars are generated from posGroup.
   attrs: outfield = {PAC,SHO,PAS,DRI,DEF,PHY}; GK uses {DIV,HAN,KIC,REF,SPD,POS}. */
export const players = [
  { id: 1,  name: "Karan Rathore", number: 1,  position: "GK",  posGroup: "GK",  height_cm: 188, age: 24, foot: "R", ovr: 84, cardType: "gold", chem: [4, 5],     attrs: { DIV: 86, HAN: 82, KIC: 79, REF: 90, SPD: 60, POS: 85 } },
  { id: 2,  name: "Dev Saxena",    number: 2,  position: "RB",  posGroup: "DEF", height_cm: 178, age: 22, foot: "R", ovr: 80, cardType: "base", chem: [4, 7],     attrs: { PAC: 85, SHO: 58, PAS: 74, DRI: 76, DEF: 80, PHY: 78 } },
  { id: 4,  name: "Rohan Sharma",  number: 4,  position: "CB",  posGroup: "DEF", height_cm: 185, age: 26, foot: "R", ovr: 82, cardType: "base", chem: [1, 5, 2],  attrs: { PAC: 75, SHO: 52, PAS: 70, DRI: 64, DEF: 86, PHY: 85 } },
  { id: 5,  name: "Imran Khan",    number: 5,  position: "CB",  posGroup: "DEF", height_cm: 187, age: 28, foot: "L", ovr: 81, cardType: "base", chem: [1, 4, 3],  attrs: { PAC: 72, SHO: 48, PAS: 68, DRI: 60, DEF: 87, PHY: 86 } },
  { id: 3,  name: "Sahil Gupta",   number: 3,  position: "LB",  posGroup: "DEF", height_cm: 176, age: 21, foot: "L", ovr: 79, cardType: "base", chem: [5, 11],    attrs: { PAC: 86, SHO: 55, PAS: 75, DRI: 78, DEF: 77, PHY: 74 } },
  { id: 6,  name: "Aman Verma",    number: 6,  position: "CM",  posGroup: "MID", height_cm: 180, age: 25, foot: "R", ovr: 83, cardType: "base", chem: [8, 10],    attrs: { PAC: 78, SHO: 72, PAS: 86, DRI: 82, DEF: 80, PHY: 79 } },
  { id: 8,  name: "Vikram Singh",  number: 8,  position: "CM",  posGroup: "MID", height_cm: 179, age: 23, foot: "R", ovr: 85, cardType: "gold", chem: [6, 10, 9], attrs: { PAC: 82, SHO: 76, PAS: 90, DRI: 86, DEF: 74, PHY: 78 } },
  { id: 10, name: "Faiz Ahmed",    number: 10, position: "CAM", posGroup: "MID", height_cm: 174, age: 22, foot: "L", ovr: 86, cardType: "icon", chem: [8, 9, 7],  attrs: { PAC: 84, SHO: 83, PAS: 88, DRI: 90, DEF: 52, PHY: 70 } },
  { id: 7,  name: "Yuvraj Bisht",  number: 7,  position: "RW",  posGroup: "FWD", height_cm: 175, age: 20, foot: "L", ovr: 84, cardType: "gold", chem: [10, 9, 2], attrs: { PAC: 91, SHO: 80, PAS: 78, DRI: 88, DEF: 44, PHY: 68 } },
  { id: 9,  name: "Arjun Mehta",   number: 9,  position: "ST",  posGroup: "FWD", height_cm: 181, age: 23, foot: "R", ovr: 87, cardType: "icon", chem: [10, 8, 7], attrs: { PAC: 88, SHO: 91, PAS: 75, DRI: 84, DEF: 40, PHY: 82 } },
  { id: 11, name: "Nikhil Joshi",  number: 11, position: "LW",  posGroup: "FWD", height_cm: 173, age: 21, foot: "R", ovr: 83, cardType: "gold", chem: [10, 3],    attrs: { PAC: 90, SHO: 78, PAS: 76, DRI: 86, DEF: 46, PHY: 66 } },
];

export const byId = Object.fromEntries(players.map(p => [p.id, p]));
