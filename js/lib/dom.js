/* Tiny DOM helpers shared across components. */
export const $  = (s, r = document) => r.querySelector(s);
export const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/** el("div.card", {dataset:{id:1}}, [child, "text"]) */
export function el(spec, attrs = {}, children = []) {
  const [tag, ...classes] = spec.split(".");
  const node = document.createElement(tag || "div");
  if (classes.length) node.className = classes.join(" ");
  for (const [k, v] of Object.entries(attrs)) {
    if (k === "dataset") Object.assign(node.dataset, v);
    else if (k === "html") node.innerHTML = v;
    else if (k in node) node[k] = v;
    else node.setAttribute(k, v);
  }
  for (const c of [].concat(children)) {
    if (c == null) continue;
    node.append(c.nodeType ? c : document.createTextNode(c));
  }
  return node;
}

export const initials = (name) =>
  name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
