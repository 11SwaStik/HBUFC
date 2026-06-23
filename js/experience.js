/* ====================================================================
   H.B.U FC — FOOTBALL EXPERIENCE LAYER (logic)
   Match Center · live simulation · 4-3-3 pitch · FUT cards · dashboard
   Self-contained ES module. Imported after main.js wiring.
   ==================================================================== */

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* ===================== DATA ===================== */

// Full squad with FUT-style ratings (OVR + 6 attributes)
const SQUAD = [
  { num: 1,  name: "Karan Rathore", pos: "GK",  ovr: 84, nat: "🇮🇳", a: { DIV: 86, HAN: 82, KIC: 79, REF: 90, SPD: 60, POS: 85 } },
  { num: 2,  name: "Dev Saxena",    pos: "RB",  ovr: 80, nat: "🇮🇳", a: { PAC: 85, SHO: 58, PAS: 74, DRI: 76, DEF: 80, PHY: 78 } },
  { num: 4,  name: "Rohan Sharma",  pos: "CB",  ovr: 82, nat: "🇮🇳", a: { PAC: 75, SHO: 52, PAS: 70, DRI: 64, DEF: 86, PHY: 85 } },
  { num: 5,  name: "Imran Khan",    pos: "CB",  ovr: 81, nat: "🇮🇳", a: { PAC: 72, SHO: 48, PAS: 68, DRI: 60, DEF: 87, PHY: 86 } },
  { num: 3,  name: "Sahil Gupta",   pos: "LB",  ovr: 79, nat: "🇮🇳", a: { PAC: 86, SHO: 55, PAS: 75, DRI: 78, DEF: 77, PHY: 74 } },
  { num: 6,  name: "Aman Verma",    pos: "CM",  ovr: 83, nat: "🇮🇳", a: { PAC: 78, SHO: 72, PAS: 86, DRI: 82, DEF: 80, PHY: 79 } },
  { num: 8,  name: "Vikram Singh",  pos: "CM",  ovr: 85, nat: "🇮🇳", a: { PAC: 82, SHO: 76, PAS: 90, DRI: 86, DEF: 74, PHY: 78 } },
  { num: 10, name: "Faiz Ahmed",    pos: "CAM", ovr: 86, nat: "🇮🇳", a: { PAC: 84, SHO: 83, PAS: 88, DRI: 90, DEF: 52, PHY: 70 } },
  { num: 7,  name: "Yuvraj Bisht",  pos: "RW",  ovr: 84, nat: "🇮🇳", a: { PAC: 91, SHO: 80, PAS: 78, DRI: 88, DEF: 44, PHY: 68 } },
  { num: 9,  name: "Arjun Mehta",   pos: "ST",  ovr: 87, nat: "🇮🇳", a: { PAC: 88, SHO: 91, PAS: 75, DRI: 84, DEF: 40, PHY: 82 } },
  { num: 11, name: "Nikhil Joshi",  pos: "LW",  ovr: 83, nat: "🇮🇳", a: { PAC: 90, SHO: 78, PAS: 76, DRI: 86, DEF: 46, PHY: 66 } },
];

// Formation coordinates (% of pitch: x left→right, y top=attack→bottom=own goal)
const FORMATIONS = {
  "4-3-3": [
    { num: 1,  x: 50, y: 90 },
    { num: 2,  x: 84, y: 72 }, { num: 4, x: 62, y: 76 }, { num: 5, x: 38, y: 76 }, { num: 3, x: 16, y: 72 },
    { num: 6,  x: 30, y: 52 }, { num: 8, x: 50, y: 56 }, { num: 10, x: 70, y: 52 },
    { num: 7,  x: 82, y: 26 }, { num: 9, x: 50, y: 18 }, { num: 11, x: 18, y: 26 },
  ],
  "4-2-3-1": [
    { num: 1,  x: 50, y: 90 },
    { num: 2,  x: 84, y: 72 }, { num: 4, x: 62, y: 76 }, { num: 5, x: 38, y: 76 }, { num: 3, x: 16, y: 72 },
    { num: 6,  x: 38, y: 58 }, { num: 8, x: 62, y: 58 },
    { num: 7,  x: 82, y: 38 }, { num: 10, x: 50, y: 34 }, { num: 11, x: 18, y: 38 },
    { num: 9,  x: 50, y: 14 },
  ],
  "3-5-2": [
    { num: 1,  x: 50, y: 90 },
    { num: 4,  x: 70, y: 76 }, { num: 5, x: 50, y: 78 }, { num: 3, x: 30, y: 76 },
    { num: 2,  x: 88, y: 52 }, { num: 6, x: 64, y: 56 }, { num: 8, x: 50, y: 58 }, { num: 10, x: 36, y: 56 }, { num: 11, x: 12, y: 52 },
    { num: 9,  x: 60, y: 20 }, { num: 7, x: 40, y: 20 },
  ],
};

// Scripted match events (minute-driven live sim vs Ajmer United)
const MATCH = {
  home: { name: "H.B.U FC", short: "HBU", form: ["W", "W", "D", "W", "L"] },
  away: { name: "Ajmer United", short: "AJU", form: ["L", "W", "D", "L", "D"] },
  comp: "State Cup · Semi-Final",
  events: [
    { min: 1,  type: "whistle", side: null,   text: "Kick-off at the Eclipse Arena." },
    { min: 12, type: "chance",  side: "home", text: "<b>Mehta</b> drags a shot just wide." },
    { min: 23, type: "goal",    side: "home", text: "GOAL! <b>Arjun Mehta</b> fires HBU ahead!" },
    { min: 34, type: "yellow",  side: "away", text: "Booking for the Ajmer United captain." },
    { min: 41, type: "goal",    side: "away", text: "GOAL! Ajmer United level it before the break." },
    { min: 45, type: "whistle", side: null,   text: "Half-time." },
    { min: 58, type: "chance",  side: "home", text: "<b>Bisht</b> stings the keeper's palms." },
    { min: 67, type: "goal",    side: "home", text: "GOAL! <b>Faiz Ahmed</b> curls in a stunner!" },
    { min: 79, type: "yellow",  side: "home", text: "Sharma into the book for a tactical foul." },
    { min: 88, type: "goal",    side: "home", text: "GOAL! <b>Mehta</b> seals it on the break!" },
    { min: 90, type: "whistle", side: null,   text: "Full-time. HBU march on!" },
  ],
};

const EVENT_ICON = {
  goal:    `<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 3.2 2.4 1.7-.9 2.8h-3l-.9-2.8L12 5.2ZM5.9 9.9l2.3.2 1 2.8-2 1.7-2.2-1.4.9-3.3Zm12.2 0 .9 3.3-2.2 1.4-2-1.7 1-2.8 2.3-.2ZM9 18l-1-2.4 2-1.7h4l2 1.7L15 18H9Z"/></svg>`,
  yellow:  `<svg viewBox="0 0 24 24" fill="currentColor" width="14" height="18"><rect x="5" y="2" width="14" height="20" rx="2"/></svg>`,
  chance:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/><circle cx="12" cy="12" r="4"/></svg>`,
  whistle: `<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M3 10a6 6 0 0 0 6 6h2l5 3v-5a6 6 0 0 0-1-9H7a4 4 0 0 0-4 4Zm6 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"/></svg>`,
};

/* ===================== MATCH CENTER + LIVE SIM ===================== */
function setupMatchCenter() {
  const root = $("#matchCenter");
  if (!root) return;

  const scoreH = $("#mcScoreH"), scoreA = $("#mcScoreA");
  const clock = $("#mcClock"), status = $("#mcStatus");
  const feed = $("#mcFeed");
  const momH = $("#mcMomH"), momA = $("#mcMomA");
  const playBtn = $("#mcPlay"), resetBtn = $("#mcReset");
  const possH = $("#mcPossH"), shots = $("#mcShots"), xg = $("#mcXg");

  let timer = null, minute = 0, h = 0, a = 0, evIdx = 0, running = false;
  let stShots = 0, stXg = 0;

  const reset = () => {
    clearInterval(timer); timer = null; running = false;
    minute = 0; h = 0; a = 0; evIdx = 0; stShots = 0; stXg = 0;
    scoreH.textContent = "0"; scoreA.textContent = "0";
    clock.textContent = "0'"; status.innerHTML = '<span class="mc-status--ft">FT — Tap play to relive it</span>';
    status.className = "mc-status";
    feed.innerHTML = "";
    momH.style.width = "50%";
    possH.textContent = "50%"; shots.textContent = "0"; xg.textContent = "0.0";
    playBtn.disabled = false; playBtn.innerHTML = `${playIcon()} Simulate Match`;
  };

  const addEvent = (ev) => {
    const el = document.createElement("div");
    el.className = `mc-event mc-event--${ev.type}`;
    el.innerHTML = `
      <span class="mc-event__min">${ev.min}'</span>
      <span class="mc-event__icon">${EVENT_ICON[ev.type] || ""}</span>
      <span class="mc-event__text">${ev.text}</span>`;
    feed.prepend(el);
  };

  const bump = (el) => { el.classList.add("bump"); setTimeout(() => el.classList.remove("bump"), 600); };

  const tick = () => {
    minute++;
    clock.textContent = `${minute}'`;

    // drift momentum + live stats for a "live" feel
    const drift = Math.sin(minute / 7) * 18;
    momH.style.width = `${Math.max(28, Math.min(72, 52 + drift))}%`;
    possH.textContent = `${Math.round(Math.max(40, Math.min(62, 53 + drift / 3)))}%`;

    // fire any events at this minute
    while (evIdx < MATCH.events.length && MATCH.events[evIdx].min === minute) {
      const ev = MATCH.events[evIdx++];
      addEvent(ev);
      if (ev.type === "chance") { stShots++; stXg += 0.18; }
      if (ev.type === "goal") {
        stShots++; stXg += 0.62;
        if (ev.side === "home") { h++; scoreH.textContent = h; bump(scoreH); }
        else { a++; scoreA.textContent = a; bump(scoreA); }
      }
      shots.textContent = stShots;
      xg.textContent = stXg.toFixed(1);
    }

    if (minute >= 90) {
      clearInterval(timer); timer = null; running = false;
      status.innerHTML = '<span class="mc-status--ft">● Full-Time</span>';
      playBtn.disabled = false; playBtn.innerHTML = `${playIcon()} Replay`;
    }
  };

  const play = () => {
    if (running) return;
    if (minute >= 90) reset();
    running = true;
    status.innerHTML = '<span class="live-dot"></span><span class="mc-status--live">LIVE</span>';
    status.className = "mc-status mc-status--live";
    playBtn.disabled = true; playBtn.innerHTML = `${playIcon()} Simulating…`;
    timer = setInterval(tick, 130); // ~12s for a full match
  };

  playBtn.addEventListener("click", play);
  resetBtn.addEventListener("click", reset);

  // auto-kickoff when scrolled into view (once)
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { play(); io.disconnect(); } });
  }, { threshold: 0.4 });
  io.observe(root);

  reset();
}

function playIcon() {
  return `<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M7 5v14l12-7z"/></svg>`;
}

/* ===================== 4-3-3 PITCH + FUT CARD ===================== */
function setupTactics() {
  const pitch = $("#pitch");
  if (!pitch) return;
  const byNum = Object.fromEntries(SQUAD.map(p => [p.num, p]));
  let current = "4-3-3";

  const renderFormation = (key) => {
    current = key;
    const spots = FORMATIONS[key];
    pitch.querySelectorAll(".pitch__player").forEach(n => n.remove());
    spots.forEach((s, i) => {
      const p = byNum[s.num];
      const node = document.createElement("button");
      node.className = "pitch__player";
      node.style.left = `${s.x}%`;
      node.style.top = `${s.y}%`;
      node.style.transitionDelay = `${i * 0.03}s`;
      node.dataset.num = s.num;
      node.setAttribute("aria-label", `${p.name}, ${p.pos}`);
      node.innerHTML = `<span class="pp-dot">${s.num}</span><span class="pp-name">${p.name.split(" ")[0]}</span>`;
      node.addEventListener("click", () => selectPlayer(s.num, node));
      pitch.appendChild(node);
    });
  };

  const selectPlayer = (num, node) => {
    $$(".pitch__player", pitch).forEach(n => n.classList.toggle("is-selected", n === node));
    renderFutCard(byNum[num]);
  };

  // formation switcher
  $$(".formation-switch__btn").forEach(btn => {
    btn.addEventListener("click", () => {
      $$(".formation-switch__btn").forEach(b => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      renderFormation(btn.dataset.formation);
    });
  });

  renderFormation("4-3-3");
  renderFutCard(byNum[9]);   // default: striker
  // mark the striker as selected once rendered
  requestAnimationFrame(() => {
    const def = $('.pitch__player[data-num="9"]', pitch);
    if (def) def.classList.add("is-selected");
  });
}

function renderFutCard(p) {
  const card = $("#futCard");
  if (!card) return;
  const entries = Object.entries(p.a);
  const max = Math.max(...entries.map(([, v]) => v));
  const statsHtml = entries.map(([k, v]) =>
    `<div class="fut-card__stat"><span>${k}</span><b class="${v === max ? "hi" : ""}">${v}</b></div>`).join("");
  const initials = p.name.split(" ").map(w => w[0]).join("").slice(0, 2);

  card.classList.remove("flip");
  void card.offsetWidth;           // restart animation
  card.classList.add("flip");
  card.innerHTML = `
    <div class="fut-card__inner">
      <div class="fut-card__shine"></div>
      <div class="fut-card__head">
        <div class="fut-card__rating">
          <span class="fut-card__ovr">${p.ovr}</span>
          <span class="fut-card__pos">${p.pos}</span>
          <span class="fut-card__flag">${p.nat}</span>
        </div>
        <div class="fut-card__avatar"><div class="fut-card__monogram">${initials}</div></div>
      </div>
      <div class="fut-card__name">${p.name}</div>
      <div class="fut-card__stats">${statsHtml}</div>
    </div>`;
}

// subtle 3D tilt on the FUT card (EA-style)
function setupCardTilt() {
  const wrap = $("#futCard");
  if (!wrap) return;
  wrap.addEventListener("pointermove", (e) => {
    const r = wrap.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    wrap.style.transform = `perspective(900px) rotateY(${px * 14}deg) rotateX(${-py * 14}deg)`;
  });
  wrap.addEventListener("pointerleave", () => { wrap.style.transform = ""; });
}

/* ===================== STATS DASHBOARD ===================== */
const DASH = {
  outcomes: { W: 161, D: 52, L: 35 },                       // donut
  goalsByMonth: [{ m: "Aug", v: 9 }, { m: "Sep", v: 14 }, { m: "Oct", v: 11 },
                 { m: "Nov", v: 17 }, { m: "Dec", v: 8 }, { m: "Jan", v: 15 }], // bars
  teamRadar: { ATT: 88, MID: 85, DEF: 82, PAC: 86, PHY: 80, SET: 74 },          // radar
};

function setupDashboard() {
  const root = $("#dashboard");
  if (!root) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { drawDonut(); drawBars(); drawRadar(); io.disconnect(); } });
  }, { threshold: 0.3 });
  io.observe(root);
}

function drawDonut() {
  const svg = $("#donutSvg");
  if (!svg) return;
  const { W, D, L } = DASH.outcomes;
  const total = W + D + L;
  const r = 50, C = 2 * Math.PI * r;
  const segs = [
    { v: W, color: "var(--win)" },
    { v: D, color: "var(--gold-500)" },
    { v: L, color: "var(--crimson-500)" },
  ];
  let offset = 0;
  const ring = segs.map(s => {
    const frac = s.v / total;
    const dash = frac * C;
    const circle = `<circle class="donut__seg" cx="65" cy="65" r="${r}" stroke="${s.color}"
      stroke-dasharray="${dash} ${C}" stroke-dashoffset="${-offset}"
      style="stroke-dashoffset:${-offset}"></circle>`;
    offset += dash;
    return circle;
  }).join("");
  // animate by starting collapsed then expanding via dasharray
  svg.innerHTML = `<circle class="donut__track" cx="65" cy="65" r="${r}"></circle>` + ring;
  const winPct = Math.round((W / total) * 100);
  const num = $("#donutNum");
  if (num) animateNum(num, winPct, "%");
}

function drawBars() {
  const box = $("#bars");
  if (!box) return;
  const max = Math.max(...DASH.goalsByMonth.map(d => d.v));
  box.innerHTML = DASH.goalsByMonth.map((d, i) => `
    <div class="bar">
      <span class="bar__val">${d.v}</span>
      <div class="bar__fill" data-h="${(d.v / max) * 100}" style="transition-delay:${i * 0.08}s"></div>
      <span class="bar__label">${d.m}</span>
    </div>`).join("");
  requestAnimationFrame(() => {
    $$(".bar__fill", box).forEach(f => { f.style.height = `${f.dataset.h}%`; });
  });
}

function drawRadar() {
  const svg = $("#radarSvg");
  if (!svg) return;
  const keys = Object.keys(DASH.teamRadar);
  const vals = Object.values(DASH.teamRadar);
  const cx = 115, cy = 115, R = 88, n = keys.length;
  const pt = (i, radius) => {
    const ang = (Math.PI * 2 * i) / n - Math.PI / 2;
    return [cx + Math.cos(ang) * radius, cy + Math.sin(ang) * radius];
  };
  // grid rings
  let grid = "";
  [0.25, 0.5, 0.75, 1].forEach(f => {
    const poly = keys.map((_, i) => pt(i, R * f).join(",")).join(" ");
    grid += `<polygon class="radar__grid" points="${poly}"></polygon>`;
  });
  // axes + labels
  let axes = "";
  keys.forEach((k, i) => {
    const [x, y] = pt(i, R);
    const [lx, ly] = pt(i, R + 14);
    axes += `<line class="radar__grid" x1="${cx}" y1="${cy}" x2="${x}" y2="${y}"></line>`;
    axes += `<text class="radar__axis-label" x="${lx}" y="${ly}" text-anchor="middle" dominant-baseline="middle">${k}</text>`;
  });
  // data shape — animate from center
  const zero = keys.map((_, i) => pt(i, 0).join(",")).join(" ");
  const full = keys.map((_, i) => pt(i, R * (vals[i] / 100)).join(",")).join(" ");
  const dots = keys.map((_, i) => { const [x, y] = pt(i, R * (vals[i] / 100)); return `<circle class="radar__dot" cx="${x}" cy="${y}" r="3"></circle>`; }).join("");

  svg.innerHTML = `${grid}${axes}<polygon class="radar__shape" points="${zero}"></polygon>${dots}`;
  const shape = svg.querySelector(".radar__shape");
  requestAnimationFrame(() => { shape.setAttribute("points", full); });
}

function animateNum(el, target, suffix = "") {
  const start = performance.now(), dur = 1400;
  const step = (now) => {
    const p = Math.min((now - start) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(eased * target) + suffix;
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/* ===================== INIT ===================== */
document.addEventListener("DOMContentLoaded", () => {
  setupMatchCenter();
  setupTactics();
  setupCardTilt();
  setupDashboard();
});
