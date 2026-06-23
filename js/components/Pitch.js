/* Pitch — the centerpiece. Places the squad by formation coords and powers two
   DISTINCT features:
     • Chemistry  — thin cyan links shown ONLY for the hovered/selected player.
     • Passing    — a football that travels player→player along curves, leaving a
                    short trail; receiver briefly glows. No chemistry graphics.
   Pure DOM + SVG + CSS + one rAF loop (passing only). No libraries, no canvas. */
import { $, $$, el } from "../lib/dom.js";
import { formations } from "../data/formations.js";
import { byId, roleFor } from "../data/squad.js";
import { FULL_POS } from "../lib/positions.js";

const SVGNS = "http://www.w3.org/2000/svg";

export function mountPitch(root, { formation = "4-3-3", onSelect } = {}) {
  let current = formation;
  let selectedId = null;
  let chemMode = false;
  let passMode = false;

  // chemistry link layer (SVG). viewBox 0..100 maps to % positions.
  const linkSvg = document.createElementNS(SVGNS, "svg");
  linkSvg.setAttribute("class", "pitch__links");
  linkSvg.setAttribute("viewBox", "0 0 100 100");
  linkSvg.setAttribute("preserveAspectRatio", "none");
  linkSvg.setAttribute("aria-hidden", "true");
  root.appendChild(linkSvg);

  // passing layers: trail (behind) + ball (front)
  const trailLayer = el("div.pitch__trail", { "aria-hidden": "true" });
  root.appendChild(trailLayer);
  const ball = el("div.pitch__ball", { "aria-hidden": "true" });
  ball.innerHTML = `<svg viewBox="0 0 24 24" width="100%" height="100%"><use href="#hbu-ball"/></svg>`;
  defineBallSymbol(root);
  root.appendChild(ball);

  // minimal tooltip for the selected player
  const tip = el("div.pitch__tip", { "aria-hidden": "true" });
  root.appendChild(tip);

  const coordMap = (key = current) => Object.fromEntries(formations[key].map(s => [s.id, s]));

  /* unique undirected chemistry pairs present in the current formation */
  function chemPairs(key = current) {
    const coord = coordMap(key);
    const seen = new Set(), pairs = [];
    for (const s of formations[key]) {
      (byId[s.id].chem || []).forEach(cid => {
        const k = [s.id, cid].sort().join("-");
        if (seen.has(k) || !coord[cid]) return;
        seen.add(k); pairs.push([s.id, cid]);
      });
    }
    return pairs;
  }

  /* ---------- render players + (hidden) links ---------- */
  function place(key) {
    current = key;
    $$(".pitch__player", root).forEach(n => n.remove());
    formations[key].forEach((s, i) => {
      const p = byId[s.id];
      const node = el("button.pitch__player", {
        dataset: { id: s.id, group: p.posGroup, archetype: p.archetype },
        "aria-label": `${p.name}, ${roleFor(p, key)}`,
        html: `
          <span class="pp-token">
            <span class="pp-glow"></span>
            <span class="pp-dot">${p.number}</span>
          </span>
          <span class="pp-name">${p.name.split(" ")[0]}</span>`,
      });
      node.style.left = `${s.x}%`;
      node.style.top = `${s.y}%`;
      node.style.transitionDelay = `${i * 0.03}s`;
      node.addEventListener("click", (e) => { e.stopPropagation(); onClickPlayer(s.id); });
      node.addEventListener("mouseenter", () => onEnter(s.id));
      node.addEventListener("mouseleave", () => onLeave());
      root.appendChild(node);
    });

    drawLinks();                       // links exist but are hidden until activated
    if (selectedId != null) applySelection(selectedId);
    if (passMode) restartPassing();
  }

  /* build the link DOM (all hidden by default; revealed per-player via .is-active) */
  function drawLinks() {
    const coord = coordMap();
    linkSvg.innerHTML = "";
    chemPairs().forEach(([a, b]) => {
      const A = coord[a], B = coord[b];
      const len = Math.hypot(B.x - A.x, B.y - A.y);
      const g = document.createElementNS(SVGNS, "g");
      g.setAttribute("class", "chem-link");
      g.dataset.a = a; g.dataset.b = b;
      const line = lineEl(A, B, "chem-link__line");
      const flow = lineEl(A, B, "chem-link__flow");
      flow.style.setProperty("--len", len.toFixed(2));
      g.append(line, flow);
      linkSvg.appendChild(g);
    });
  }

  function lineEl(A, B, cls) {
    const ln = document.createElementNS(SVGNS, "line");
    ln.setAttribute("x1", A.x); ln.setAttribute("y1", A.y);
    ln.setAttribute("x2", B.x); ln.setAttribute("y2", B.y);
    ln.setAttribute("class", cls);
    return ln;
  }

  /* show ONLY this player's links; hide all others */
  function activateLinks(id) {
    $$(".chem-link", linkSvg).forEach(g => {
      g.classList.toggle("is-active", +g.dataset.a === id || +g.dataset.b === id);
    });
  }
  function clearLinks() {
    $$(".chem-link", linkSvg).forEach(g => g.classList.remove("is-active"));
  }

  /* mark teammates connected to id (and dim the rest) */
  function markLinked(id) {
    const linked = new Set(byId[id]?.chem || []);
    $$(".pitch__player", root).forEach(n => {
      const nid = +n.dataset.id;
      n.classList.toggle("is-linked", linked.has(nid));
      n.classList.toggle("is-dim", chemMode && nid !== id && !linked.has(nid));
    });
  }
  function clearMarks() {
    $$(".pitch__player", root).forEach(n => n.classList.remove("is-linked", "is-dim"));
  }

  /* ---------- hover (chemistry preview, only in chem mode, only when nothing selected) ---------- */
  function onEnter(id) {
    if (passMode || !chemMode || selectedId != null) return;
    root.classList.add("chem-hover");
    activateLinks(id);
    markLinked(id);
  }
  function onLeave() {
    if (passMode || selectedId != null) return;
    root.classList.remove("chem-hover");
    clearLinks();
    clearMarks();
  }

  /* ---------- click = select / toggle-off ---------- */
  function onClickPlayer(id) {
    if (passMode) return;
    if (selectedId === id) { deselect(); return; }   // click again to clear
    selectedId = id;
    applySelection(id);
    onSelect?.(id);
  }

  function applySelection(id) {
    root.classList.remove("chem-hover");
    root.classList.add("has-selection");
    $$(".pitch__player", root).forEach(n => n.classList.toggle("is-selected", +n.dataset.id === id));
    markLinked(id);
    if (chemMode) activateLinks(id); else clearLinks();
    showTip(id);
  }

  function deselect() {
    selectedId = null;
    root.classList.remove("has-selection", "show-tip", "chem-hover");
    $$(".pitch__player", root).forEach(n => n.classList.remove("is-selected"));
    clearMarks();
    clearLinks();
  }

  /* ---------- tooltip (smart flip so it never covers a nearby label) ---------- */
  function showTip(id) {
    const p = byId[id];
    const spot = formations[current].find(s => s.id === id);
    if (!p || !spot) return;
    const role = roleFor(p, current);
    tip.innerHTML = `
      <span class="pitch__tip-name">${p.name}</span>
      <span class="pitch__tip-pos">${FULL_POS[role] || role}</span>
      <span class="pitch__tip-num">#${p.number}</span>`;
    tip.style.left = `${spot.x}%`;
    tip.style.top = `${spot.y}%`;
    tip.dataset.group = p.posGroup;

    // Decide above vs below: default above, but flip below if it'd cover a
    // nearby player label or run off the top edge.
    const others = formations[current].filter(s => s.id !== id);
    const coversAbove = spot.y < 26 ||                         // near top edge
      others.some(s => Math.abs(s.x - spot.x) < 17 && s.y < spot.y && spot.y - s.y < 22);
    tip.classList.toggle("is-below", coversAbove);
    root.classList.add("show-tip");
  }

  /* ---------- Chemistry Mode ---------- */
  function setChemMode(on) {
    chemMode = on;
    root.classList.toggle("chem-mode", on);
    if (!on) {                       // leaving chem mode clears everything chem-related
      setPassMode(false);
      deselect();
    }
    return chemMode;
  }

  /* ====================================================================
     PASSING MODE — JS-driven ball that passes between players on curves.
     ==================================================================== */
  let passRAF = null, pass = null, trail = [], lastTrail = 0, lastT = 0;
  const TRAIL_LIFE = 520, TRAIL_GAP = 38, TRAIL_POOL = 16;

  function presentPlayers() {
    return formations[current].map(s => ({ id: s.id, x: s.x, y: s.y }));
  }

  function buildTrailPool() {
    trailLayer.innerHTML = "";
    trail = [];
    for (let i = 0; i < TRAIL_POOL; i++) {
      const d = el("span.pitch__trail-dot");
      trailLayer.appendChild(d);
      trail.push({ el: d, born: -1e9 });
    }
  }

  function pickNext(fromId, prevId) {
    const present = new Set(formations[current].map(s => s.id));
    // prefer a tactical pass to a chemistry-connected teammate that's present
    let pool = (byId[fromId]?.chem || []).filter(cid => present.has(cid) && cid !== prevId);
    if (!pool.length) pool = [...present].filter(cid => cid !== fromId && cid !== prevId);
    if (!pool.length) pool = [...present].filter(cid => cid !== fromId);
    // deterministic-ish variety without Math.random in a way that feels organic
    return pool[(passSeed++ * 7) % pool.length];
  }
  let passSeed = 3;

  function newPass(fromId, prevId) {
    const coord = coordMap();
    const toId = pickNext(fromId, prevId);
    const A = coord[fromId], B = coord[toId];
    const dist = Math.hypot(B.x - A.x, B.y - A.y);
    // perpendicular control point → gentle curve; side alternates for variety
    const mx = (A.x + B.x) / 2, my = (A.y + B.y) / 2;
    const nx = -(B.y - A.y), ny = (B.x - A.x);
    const nlen = Math.hypot(nx, ny) || 1;
    const side = (passSeed % 2) ? 1 : -1;
    const bow = Math.min(18, dist * 0.22) * side;
    const cx = mx + (nx / nlen) * bow, cy = my + (ny / nlen) * bow;
    return {
      fromId, toId, A, B, C: { x: cx, y: cy },
      start: lastT, dur: 760 + dist * 9, dwell: 280, phase: "travel",
    };
  }

  const easeInOut = t => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  const bezier = (A, C, B, t) => {
    const u = 1 - t;
    return {
      x: u * u * A.x + 2 * u * t * C.x + t * t * B.x,
      y: u * u * A.y + 2 * u * t * C.y + t * t * B.y,
    };
  };

  function setBall(xPct, yPct) {
    ball.style.left = `${xPct}%`;
    ball.style.top = `${yPct}%`;
  }

  function spawnTrail(xPct, yPct, now) {
    // reuse the oldest dot
    let oldest = trail[0];
    for (const d of trail) if (d.born < oldest.born) oldest = d;
    oldest.born = now;
    oldest.el.style.left = `${xPct}%`;
    oldest.el.style.top = `${yPct}%`;
    oldest.el.style.opacity = "0.5";
  }

  function fadeTrail(now) {
    for (const d of trail) {
      const age = now - d.born;
      d.el.style.opacity = age > TRAIL_LIFE ? "0" : String(0.5 * (1 - age / TRAIL_LIFE));
    }
  }

  function passTick(now) {
    if (!passMode) return;
    lastT = now;
    if (!pass) { passRAF = requestAnimationFrame(passTick); return; }

    if (pass.phase === "travel") {
      const t = Math.min((now - pass.start) / pass.dur, 1);
      const e = easeInOut(t);
      const pos = bezier(pass.A, pass.C, pass.B, e);
      setBall(pos.x, pos.y);
      if (now - lastTrail > TRAIL_GAP) { spawnTrail(pos.x, pos.y, now); lastTrail = now; }
      if (t >= 1) {
        glowReceiver(pass.toId);
        pass.phase = "dwell"; pass.dwellStart = now;
      }
    } else { // dwell briefly at the receiver, then pass on
      if (now - pass.dwellStart >= pass.dwell) {
        pass = newPass(pass.toId, pass.fromId);
      }
    }

    fadeTrail(now);
    passRAF = requestAnimationFrame(passTick);
  }

  function glowReceiver(id) {
    const node = $(`.pitch__player[data-id="${id}"]`, root);
    if (!node) return;
    node.classList.add("is-receiving");
    setTimeout(() => node.classList.remove("is-receiving"), 600);
  }

  function restartPassing() {
    stopPassingLoop();
    buildTrailPool();
    const players = presentPlayers();
    if (players.length < 2) return;
    const startId = (formations[current].find(s => byId[s.id].posGroup !== "GK") || players[0]).id;
    const coord = coordMap();
    setBall(coord[startId].x, coord[startId].y);
    lastT = performance.now();
    pass = newPass(startId, null);
    pass.start = lastT;
    passRAF = requestAnimationFrame(passTick);
  }

  function stopPassingLoop() {
    if (passRAF) cancelAnimationFrame(passRAF);
    passRAF = null; pass = null;
    trailLayer.innerHTML = ""; trail = [];
  }

  function setPassMode(on) {
    passMode = on && chemMode;          // passing is a sub-mode of chemistry
    root.classList.toggle("pass-mode", passMode);
    if (passMode) {
      // isolate: clear every chemistry/selection visual
      root.classList.remove("chem-hover");
      clearLinks(); clearMarks();
      $$(".pitch__player", root).forEach(n => n.classList.remove("is-receiving"));
      restartPassing();
    } else {
      stopPassingLoop();
      // restore chem visuals if a player is still selected
      if (selectedId != null) applySelection(selectedId);
    }
    return passMode;
  }

  /* ---------- pause the rAF loop when the pitch scrolls off-screen (perf) ---------- */
  if ("IntersectionObserver" in window) {
    new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!passMode) return;
        if (e.isIntersecting && !passRAF) { lastT = performance.now(); passRAF = requestAnimationFrame(passTick); }
        else if (!e.isIntersecting && passRAF) { cancelAnimationFrame(passRAF); passRAF = null; }
      });
    }, { threshold: 0.1 }).observe(root);
  }
  // clicking empty pitch space deselects
  root.addEventListener("click", () => { if (!passMode) deselect(); });

  place(current);
  return {
    place, select: onClickPlayer, setChemMode, setPassMode,
    get chemMode() { return chemMode; },
    get passMode() { return passMode; },
    get selectedId() { return selectedId; },
  };
}

/* Inject a reusable football SVG symbol once (used by the passing ball). */
function defineBallSymbol(root) {
  if (document.getElementById("hbu-ball")) return;
  const svg = document.createElementNS(SVGNS, "svg");
  svg.setAttribute("width", "0"); svg.setAttribute("height", "0");
  svg.style.position = "absolute";
  svg.innerHTML = `
    <symbol id="hbu-ball" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="11" fill="#fff" stroke="#0a0c14" stroke-width="1"/>
      <path fill="#0a0c14" d="M12 6.2l3.2 2.3-1.2 3.7h-4L8.8 8.5 12 6.2zm-6.4 4l2.6.2 1.2 3.6-2.1 1.8-2.4-1.6.7-4zm12.8 0l.7 4-2.4 1.6-2.1-1.8 1.2-3.6 2.6-.2zM9 17.6l-1-2.5 2.1-1.8h3.8l2.1 1.8-1 2.5H9z"/>
    </symbol>`;
  root.appendChild(svg);
}

/** Total chemistry: count of satisfied links (both players present in formation). */
export function chemistryScore(formationKey) {
  const present = new Set(formations[formationKey].map(s => s.id));
  let links = 0;
  const seen = new Set();
  for (const id of present) {
    (byId[id].chem || []).forEach(cid => {
      const key = [id, cid].sort().join("-");
      if (!seen.has(key) && present.has(cid)) { seen.add(key); links++; }
    });
  }
  return links;
}
