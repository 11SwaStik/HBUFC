/* Pitch — the centerpiece. Places the squad by formation coords, draws chemistry
   links, emits selection, and powers an interactive Chemistry / Passing mode.
   Pure DOM + SVG + CSS (no libraries, no canvas). Animations run on CSS/compositor
   for 60fps. */
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

  // chemistry link layer (SVG, behind tokens). viewBox 0..100 maps to % positions.
  const linkSvg = document.createElementNS(SVGNS, "svg");
  linkSvg.setAttribute("class", "pitch__links");
  linkSvg.setAttribute("viewBox", "0 0 100 100");
  linkSvg.setAttribute("preserveAspectRatio", "none");
  linkSvg.setAttribute("aria-hidden", "true");
  root.appendChild(linkSvg);

  // moving ball layer (HTML element animated via CSS offset-path, sits above links).
  // offset-path uses px in the element's box, so we recompute on resize.
  const ball = el("div.pitch__ball", { "aria-hidden": "true" });
  ball.innerHTML = `<svg viewBox="0 0 24 24" width="100%" height="100%"><use href="#hbu-ball"/></svg>`;
  defineBallSymbol(root);
  root.appendChild(ball);

  // keep the passing path in sync with the responsive pitch size
  const ro = ("ResizeObserver" in window)
    ? new ResizeObserver(() => { if (passMode) startPassing(); })
    : null;
  ro?.observe(root);

  // minimal tooltip for the selected player (name · position · number only)
  const tip = el("div.pitch__tip", { "aria-hidden": "true" });
  root.appendChild(tip);

  function coordMap(key = current) {
    return Object.fromEntries(formations[key].map(s => [s.id, s]));
  }

  /* ---- unique undirected chemistry pairs present in the current formation ---- */
  function chemPairs(key = current) {
    const coord = coordMap(key);
    const seen = new Set(), pairs = [];
    for (const s of formations[key]) {
      (byId[s.id].chem || []).forEach(cid => {
        const k = [s.id, cid].sort().join("-");
        if (seen.has(k) || !coord[cid]) return;
        seen.add(k);
        pairs.push([s.id, cid]);
      });
    }
    return pairs;
  }

  function place(key) {
    current = key;
    const coord = coordMap(key);

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
      node.addEventListener("click", () => select(s.id));
      node.addEventListener("mouseenter", () => onEnter(s.id));
      node.addEventListener("mouseleave", () => onLeave());
      root.appendChild(node);
    });

    drawLinks();
    if (selectedId != null) applySelection(selectedId, false);
    if (passMode) startPassing();
  }

  /* ---- link drawing ----------------------------------------------------------
     Each pair becomes a <line> base + a glowing <line> + a traveling particle
     <circle> that animates along the segment (CSS keyframes on the circle's
     translate via the segment's geometry, expressed with CSS custom props). */
  function drawLinks() {
    const coord = coordMap();
    linkSvg.innerHTML = "";
    chemPairs().forEach(([a, b], i) => {
      const A = coord[a], B = coord[b];
      const g = document.createElementNS(SVGNS, "g");
      g.setAttribute("class", "chem-link");
      g.dataset.a = a; g.dataset.b = b;

      const len = Math.hypot(B.x - A.x, B.y - A.y);
      const base = lineEl(A, B, "chem-link__base");
      const glow = lineEl(A, B, "chem-link__glow");

      // Moving light = a short bright dash that travels the segment via
      // animated stroke-dashoffset. No distortion (it follows the line exactly),
      // pure CSS, runs on the compositor. dash pattern uses the true length.
      const flow = lineEl(A, B, "chem-link__flow");
      flow.style.setProperty("--len", len.toFixed(2));
      flow.style.animationDelay = `${(i % 6) * -0.45}s`;

      g.append(base, glow, flow);
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

  /* ---- hover behaviour: in chem mode, isolate a player's direct links ---- */
  function onEnter(id) {
    if (chemMode) {
      const linked = new Set(byId[id]?.chem || []);
      root.classList.add("chem-hover");
      $$(".chem-link", linkSvg).forEach(g => {
        const on = +g.dataset.a === id || +g.dataset.b === id;
        g.classList.toggle("is-active", on);
      });
      $$(".pitch__player", root).forEach(n => {
        const nid = +n.dataset.id;
        n.classList.toggle("is-dim", nid !== id && !linked.has(nid));
        n.classList.toggle("is-near", linked.has(nid));
      });
    } else if (!selectedId) {
      highlightChem(id);
    }
  }

  function onLeave() {
    if (chemMode) {
      root.classList.remove("chem-hover");
      $$(".chem-link", linkSvg).forEach(g => g.classList.remove("is-active"));
      $$(".pitch__player", root).forEach(n => n.classList.remove("is-dim", "is-near"));
    } else if (!selectedId) {
      drawLinks();
    }
  }

  // legacy single-player highlight (used when NOT in chem mode, e.g. selection)
  function highlightChem(id) {
    const coord = coordMap();
    $$(".chem-link", linkSvg).forEach(g => {
      const on = +g.dataset.a === id || +g.dataset.b === id;
      g.classList.toggle("is-active", on);
    });
  }

  /* ---- selection (unchanged behaviour) ---- */
  function applySelection(id, fire = true) {
    const linked = new Set(byId[id]?.chem || []);
    root.classList.add("has-selection");
    $$(".pitch__player", root).forEach(n => {
      const nid = +n.dataset.id;
      n.classList.toggle("is-selected", nid === id);
      n.classList.toggle("is-linked", linked.has(nid));
    });
    if (!chemMode) highlightChem(id);
    showTip(id);
  }

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
    tip.classList.toggle("is-below", spot.y < 22);
    tip.dataset.group = p.posGroup;
    root.classList.add("show-tip");
  }

  function select(id) {
    selectedId = id;
    applySelection(id);
    onSelect?.(id);
  }

  /* ---- Chemistry Mode toggle ---- */
  function setChemMode(on) {
    chemMode = on;
    root.classList.toggle("chem-mode", on);
    if (!on) { setPassMode(false); onLeave(); }
    return chemMode;
  }

  /* ---- Passing Mode: a ball loops through the team along the links ----
     Build one continuous polyline path through the present players (a simple
     tour), set it as the ball's offset-path, and let CSS animate offset-distance.
     Pure compositor animation — no rAF, no canvas. */
  function buildTourPath() {
    const coord = coordMap();
    const rect = root.getBoundingClientRect();
    const w = rect.width || 1, h = rect.height || 1;
    // a gentle tour through every present player, in formation order, looped
    const pts = formations[current].map(s => coord[s.id]).filter(Boolean);
    if (pts.length < 2) return "";
    const all = [...pts, pts[0]]; // close the loop for a seamless cycle
    // offset-path path() is in px relative to the element's box → convert % → px
    return "M " + all.map(p => `${(p.x / 100 * w).toFixed(1)} ${(p.y / 100 * h).toFixed(1)}`).join(" L ");
  }

  function startPassing() {
    const d = buildTourPath();
    if (!d) return;
    ball.style.offsetPath = `path('${d}')`;
    ball.style.webkitOffsetPath = `path('${d}')`;
    root.classList.add("pass-on");
  }

  function setPassMode(on) {
    passMode = on && chemMode;       // passing only makes sense with chemistry on
    if (passMode) startPassing();
    else root.classList.remove("pass-on");
    return passMode;
  }

  place(current);
  return {
    place,
    select,
    setChemMode,
    setPassMode,
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
