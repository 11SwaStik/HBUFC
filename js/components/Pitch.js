/* Pitch — the centerpiece. Places the squad by formation coords, draws chemistry
   links, and emits selection. Selecting a player dims the rest and glows the chosen
   one. Selection persists across formation changes. */
import { $, $$, el } from "../lib/dom.js";
import { formations } from "../data/formations.js";
import { byId } from "../data/squad.js";

export function mountPitch(root, { formation = "4-3-3", onSelect } = {}) {
  let current = formation;
  let selectedId = null;

  // chemistry link layer (SVG, behind tokens)
  const linkSvg = el("svg.pitch__links", { viewBox: "0 0 100 100", preserveAspectRatio: "none" });
  linkSvg.setAttribute("aria-hidden", "true");
  root.appendChild(linkSvg);

  function place(key) {
    current = key;
    const spots = formations[key];
    const coord = Object.fromEntries(spots.map(s => [s.id, s]));

    $$(".pitch__player", root).forEach(n => n.remove());
    spots.forEach((s, i) => {
      const p = byId[s.id];
      const node = el("button.pitch__player", {
        dataset: { id: s.id, group: p.posGroup, pos: p.position },
        "aria-label": `${p.name}, ${p.position}`,
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
      node.addEventListener("mouseenter", () => { if (!selectedId) highlightChem(s.id); });
      node.addEventListener("mouseleave", () => { if (!selectedId) drawAllLinks(); });
      root.appendChild(node);
    });

    // restore selection visuals in the new shape
    if (selectedId != null) applySelection(selectedId);
    else drawAllLinks(coord);
  }

  function linkLine(a, b, strength, cls = "") {
    const ln = document.createElementNS("http://www.w3.org/2000/svg", "line");
    ln.setAttribute("x1", a.x); ln.setAttribute("y1", a.y);
    ln.setAttribute("x2", b.x); ln.setAttribute("y2", b.y);
    ln.setAttribute("class", `pitch__link ${cls}`);
    ln.style.opacity = strength;
    return ln;
  }

  function drawAllLinks(coord) {
    coord = coord || Object.fromEntries(formations[current].map(s => [s.id, s]));
    linkSvg.innerHTML = "";
    const seen = new Set();
    for (const s of formations[current]) {
      (byId[s.id].chem || []).forEach(cid => {
        const key = [s.id, cid].sort().join("-");
        if (seen.has(key) || !coord[cid]) return;
        seen.add(key);
        linkSvg.appendChild(linkLine(coord[s.id], coord[cid], 0.26));
      });
    }
  }

  function highlightChem(id) {
    const coord = Object.fromEntries(formations[current].map(s => [s.id, s]));
    linkSvg.innerHTML = "";
    (byId[id].chem || []).forEach(cid => {
      if (coord[cid]) linkSvg.appendChild(linkLine(coord[id], coord[cid], 0.95, "pitch__link--hot"));
    });
  }

  // visual-only: glow selected, fade the rest, mark linked teammates
  function applySelection(id) {
    const linked = new Set(byId[id]?.chem || []);
    root.classList.add("has-selection");
    $$(".pitch__player", root).forEach(n => {
      const nid = +n.dataset.id;
      n.classList.toggle("is-selected", nid === id);
      n.classList.toggle("is-linked", linked.has(nid));
    });
    highlightChem(id);
  }

  function select(id) {
    selectedId = id;
    applySelection(id);
    onSelect?.(id);
  }

  place(current);
  return {
    place,
    select,
    get selectedId() { return selectedId; },
  };
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
