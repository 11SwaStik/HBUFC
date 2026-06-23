/* ====================================================================
   H.B.U FC — homepage interactions
   Edit the DATA block to update content. Everything else is wiring.
   ==================================================================== */

/* ===================== DATA (edit me) ===================== */
const slogans = [
  "Passion. Pride. Ajmer.",
  "Forged on the desert pitch since 2017.",
  "One club. One city. One crest.",
  "This is H.B.U FC.",
];

const stats = [
  { label: "Matches Played", value: 248, suffix: "" },
  { label: "Victories",      value: 161, suffix: "" },
  { label: "Goals Scored",   value: 542, suffix: "" },
  { label: "Win Rate",       value: 65,  suffix: "%" },
];

const players = [
  { name: "Arjun Mehta",   pos: "FWD", num: 9,  nat: "India", stats: { PAC: 88, SHO: 91, PAS: 79 } },
  { name: "Vikram Singh",  pos: "MID", num: 8,  nat: "India", stats: { PAC: 82, SHO: 76, PAS: 90 } },
  { name: "Rohan Sharma",  pos: "DEF", num: 4,  nat: "India", stats: { PAC: 75, SHO: 58, PAS: 81 } },
  { name: "Karan Rathore", pos: "GK",  num: 1,  nat: "India", stats: { DIV: 87, REF: 90, POS: 85 } },
];

const form = ["W", "W", "D", "W", "L"]; // last 5, oldest→newest

const results = [
  { date: "14 Jun", comp: "District League", opp: "Ajmer United",   sc: "3 - 1", out: "W" },
  { date: "07 Jun", comp: "State Cup",       opp: "Pushkar Rovers",  sc: "2 - 2", out: "D" },
  { date: "31 May", comp: "District League", opp: "Beawar Athletic", sc: "4 - 0", out: "W" },
  { date: "24 May", comp: "Friendly",        opp: "Jaipur City FC",  sc: "1 - 2", out: "L" },
  { date: "17 May", comp: "District League", opp: "Kishangarh SC",   sc: "2 - 0", out: "W" },
];

const trophies = [
  { name: "District League", count: 3, years: "2019 · 2022 · 2024" },
  { name: "State Cup",       count: 1, years: "2023" },
  { name: "Ajmer Shield",    count: 2, years: "2021 · 2025" },
  { name: "Fair Play Award", count: 4, years: "2018–2025" },
];

const timeline = [
  { year: "2017", title: "The first whistle", detail: "H.B.U FC founded by a group of friends on a dusty pitch in Ajmer." },
  { year: "2019", title: "First silverware",  detail: "Lifted the District League title in only our second full season." },
  { year: "2021", title: "Crest & colours",   detail: "Adopted the crimson-and-gold crest and our home ground." },
  { year: "2023", title: "State Cup glory",   detail: "Beat the odds to win the State Cup on a famous night." },
  { year: "2025", title: "A club reborn",     detail: "Launched the youth academy and crossed 240 members." },
];

/* SVG icon set (inline so no image files needed) */
const ICON = {
  trophy: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4h12v4a6 6 0 0 1-12 0V4Z"/><path d="M6 6H3v2a3 3 0 0 0 3 3M18 6h3v2a3 3 0 0 1-3 3M9 18h6M10 18v-3M14 18v-3M8 21h8"/></svg>`,
};

/* ===================== RENDER ===================== */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

function renderStats() {
  $("#statsGrid").innerHTML = stats.map((s, i) => `
    <div class="stat reveal" style="--d:${i * 0.08}s">
      <div class="stat__num" data-target="${s.value}" data-suffix="${s.suffix}">0${s.suffix}</div>
      <span class="stat__label">${s.label}</span>
    </div>`).join("");
}

function renderPlayers() {
  $("#playersGrid").innerHTML = players.map((p, i) => {
    const initials = p.name.split(" ").map(w => w[0]).join("").slice(0, 2);
    const statCells = Object.entries(p.stats)
      .map(([k, v]) => `<div class="player__stat"><b>${v}</b><span>${k}</span></div>`).join("");
    return `
      <article class="player grad-border reveal" style="--d:${i * 0.09}s">
        <div class="player__inner">
          <div class="player__shine"></div>
          <div class="player__top">
            <span class="player__num">${p.num}</span>
            <span class="player__pos">${p.pos}</span>
          </div>
          <div class="player__avatar">${initials}</div>
          <h3 class="player__name">${p.name}</h3>
          <p class="player__nat">${p.nat}</p>
          <div class="player__stats">${statCells}</div>
        </div>
      </article>`;
  }).join("");
}

function renderForm() {
  $("#formGuide").innerHTML = form.map((f, i) =>
    `<span class="form-pill form-pill--${f}" style="--d:${i * 0.1}s">${f}</span>`).join("");
}

function renderResults() {
  $("#resultsList").innerHTML = results.map((r, i) => `
    <div class="result reveal" style="--d:${i * 0.06}s">
      <span class="result__date">${r.date}</span>
      <span class="result__match"><span class="result__comp">${r.comp}</span><br/>H.B.U FC <b>vs</b> ${r.opp}</span>
      <span class="result__score">${r.sc}</span>
      <span class="result__out result__out--${r.out}" title="${r.out}"></span>
    </div>`).join("");
}

function renderTrophies() {
  $("#trophiesGrid").innerHTML = trophies.map((t, i) => `
    <article class="trophy reveal" style="--d:${i * 0.08}s">
      <div class="trophy__icon">${ICON.trophy}</div>
      <div class="trophy__count">×${t.count}</div>
      <h3 class="trophy__name">${t.name}</h3>
      <p class="trophy__years">${t.years}</p>
    </article>`).join("");
}

function renderTimeline() {
  $("#timelineList").innerHTML = timeline.map(t => `
    <li class="tl-item">
      <span class="tl-item__dot"></span>
      <div class="tl-item__card">
        <div class="tl-item__year">${t.year}</div>
        <div class="tl-item__title">${t.title}</div>
        <p class="tl-item__detail">${t.detail}</p>
      </div>
    </li>`).join("");
}

/* ===================== EFFECTS ===================== */

// Typing effect slogan
function typeSlogan() {
  const el = $("#typed");
  if (!el) return;
  let si = 0, ci = 0, deleting = false;
  const tick = () => {
    const word = slogans[si];
    el.textContent = word.slice(0, ci);
    if (!deleting && ci < word.length) { ci++; setTimeout(tick, 55); }
    else if (!deleting && ci === word.length) { deleting = true; setTimeout(tick, 1800); }
    else if (deleting && ci > 0) { ci--; setTimeout(tick, 28); }
    else { deleting = false; si = (si + 1) % slogans.length; setTimeout(tick, 350); }
  };
  tick();
}

// Floating particles in hero
function spawnParticles(n = 26) {
  const box = $("#particles");
  if (!box) return;
  const colors = ["var(--crimson-500)", "var(--gold-500)", "var(--volt-500)"];
  let html = "";
  for (let i = 0; i < n; i++) {
    const left = (i * 97 + 13) % 100;            // deterministic spread
    const size = 3 + (i % 4) * 1.6;
    const dur = 9 + (i % 7) * 1.7;
    const delay = -((i * 1.3) % dur);
    const color = colors[i % colors.length];
    html += `<span class="particle" style="left:${left}%;width:${size}px;height:${size}px;
      background:${color};animation-duration:${dur}s;animation-delay:${delay}s"></span>`;
  }
  box.innerHTML = html;
}

// Scroll-reveal via IntersectionObserver
function setupReveal() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
  $$(".reveal, .tl-item").forEach(el => io.observe(el));
}

// Animated counters
function setupCounters() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = +el.dataset.target;
      const suffix = el.dataset.suffix || "";
      const start = performance.now(), dur = 1500;
      const step = (now) => {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.floor(eased * target) + suffix;
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = target + suffix;
      };
      requestAnimationFrame(step);
      io.unobserve(el);
    });
  }, { threshold: 0.6 });
  $$(".stat__num").forEach(el => io.observe(el));
}

// Header shrink + scroll-spy + scroll progress + back-to-top
function setupScroll() {
  const header = $("#header");
  const progress = $("#scrollProgress");
  const toTop = $("#toTop");
  const links = $$(".nav__link[href^='#']");
  const sections = links.map(l => $(l.getAttribute("href"))).filter(Boolean);

  const onScroll = () => {
    const y = window.scrollY;
    const h = document.documentElement.scrollHeight - window.innerHeight;
    header.classList.toggle("is-scrolled", y > 30);
    toTop.classList.toggle("is-visible", y > 600);
    progress.style.transform = `scaleX(${h > 0 ? y / h : 0})`;

    // scroll-spy
    let current = sections[0]?.id;
    for (const sec of sections) {
      if (sec.getBoundingClientRect().top <= 120) current = sec.id;
    }
    links.forEach(l => l.classList.toggle("is-active", l.getAttribute("href") === `#${current}`));
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

// Mobile nav
function setupNav() {
  const toggle = $("#navToggle");
  const links = $("#navLinks");
  const open = (state) => {
    links.classList.toggle("is-open", state);
    toggle.setAttribute("aria-expanded", String(state));
  };
  toggle.addEventListener("click", () => open(!links.classList.contains("is-open")));
  $$(".nav__link", links).forEach(a => a.addEventListener("click", () => open(false)));
  document.addEventListener("keydown", e => { if (e.key === "Escape") open(false); });
}

// Mouse-follow glow + crest parallax
function setupMouseGlow() {
  const glow = $("#mouseGlow");
  const crest = $("#heroCrest");
  window.addEventListener("pointermove", (e) => {
    glow.style.setProperty("--mx", `${e.clientX}px`);
    glow.style.setProperty("--my", `${e.clientY}px`);
    if (crest) {
      const cx = (e.clientX / window.innerWidth - 0.5) * 16;
      const cy = (e.clientY / window.innerHeight - 0.5) * 16;
      crest.style.transform = `translate(${cx}px,${cy}px)`;
    }
  }, { passive: true });
}

// Hero parallax on scroll
function setupParallax() {
  const pitch = $(".hero__pitch");
  let ticking = false;
  window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      if (pitch) pitch.style.transform = `translateY(${y * 0.25}px)`;
      ticking = false;
    });
  }, { passive: true });
}

/* ===================== INIT ===================== */
document.addEventListener("DOMContentLoaded", () => {
  renderStats();
  renderPlayers();
  renderForm();
  renderResults();
  renderTrophies();
  renderTimeline();

  typeSlogan();
  spawnParticles();
  setupReveal();
  setupCounters();
  setupScroll();
  setupNav();
  setupMouseGlow();
  setupParallax();

  const yr = $("#year");
  if (yr) yr.textContent = new Date().getFullYear();
});
