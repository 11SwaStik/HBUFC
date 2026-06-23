// ====================================================================
// Riverside FC — site interactions
// Edit the data arrays below to update your squad and fixtures.
// ====================================================================

// ---- Data: edit these to match your club ----
const squad = [
  { name: "Tom Reyes",    pos: "Goalkeeper", num: 1 },
  { name: "Alex Carter",  pos: "Midfielder", num: 8 },
  { name: "Jordan Vale",  pos: "Defender",   num: 4 },
  { name: "Sam Okoro",    pos: "Forward",    num: 9 },
  { name: "Liam Frost",   pos: "Defender",   num: 5 },
  { name: "Noah Singh",   pos: "Midfielder", num: 6 },
  { name: "Ethan Cole",   pos: "Forward",    num: 11 },
  { name: "Mason Reed",   pos: "Goalkeeper", num: 13 },
];

const fixtures = [
  { date: "28 Jun 2026", home: "Riverside FC", away: "Hill Town United", type: "upcoming" },
  { date: "5 Jul 2026",  home: "Eastside Rovers", away: "Riverside FC", type: "upcoming" },
  { date: "12 Jul 2026", home: "Riverside FC", away: "Lakeside Athletic", type: "upcoming" },
  { date: "21 Jun 2026", home: "Riverside FC", away: "Park Rangers", type: "result", score: "3 - 1" },
  { date: "14 Jun 2026", home: "City Wanderers", away: "Riverside FC", type: "result", score: "0 - 2" },
];

// ---- Render squad ----
function renderSquad() {
  const grid = document.getElementById("squadGrid");
  if (!grid) return;
  grid.innerHTML = squad.map(p => `
    <div class="player">
      <div class="player-photo">${p.num}</div>
      <div class="player-body">
        <div class="player-name">${p.name}</div>
        <div class="player-pos">${p.pos}</div>
        <span class="player-num">#${p.num}</span>
      </div>
    </div>
  `).join("");
}

// ---- Render fixtures ----
function renderFixtures() {
  const list = document.getElementById("fixturesList");
  if (!list) return;
  list.innerHTML = fixtures.map(f => {
    const isResult = f.type === "result";
    const tagClass = isResult ? "tag-result" : "tag-upcoming";
    const tagText = isResult ? "Result" : "Upcoming";
    const right = isResult
      ? `<span class="fixture-score">${f.score}</span>`
      : `<span class="fixture-tag ${tagClass}">${tagText}</span>`;
    return `
      <div class="fixture">
        <span class="fixture-date">${f.date}</span>
        <span class="fixture-teams">${f.home} <span style="color:var(--muted)">vs</span> ${f.away}</span>
        ${right}
      </div>
    `;
  }).join("");
}

// ---- Mobile nav toggle ----
function setupNav() {
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");
  if (!toggle || !links) return;

  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  // Close the menu after clicking a link (mobile)
  links.querySelectorAll("a").forEach(a =>
    a.addEventListener("click", () => {
      links.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    })
  );
}

// ---- Animated stat counters ----
function setupCounters() {
  const nums = document.querySelectorAll(".stat-num");
  if (!nums.length) return;

  const animate = (el) => {
    const target = Number(el.dataset.target) || 0;
    const duration = 1200;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      el.textContent = Math.floor(progress * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    };
    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animate(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  nums.forEach(n => observer.observe(n));
}

// ---- Contact form (client-side only) ----
function setupForm() {
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");
  if (!form || !status) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const name = (data.get("name") || "").toString().trim();
    const email = (data.get("email") || "").toString().trim();
    const message = (data.get("message") || "").toString().trim();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!name || !emailOk || !message) {
      status.textContent = "Please fill in all fields with a valid email.";
      status.className = "form-status err";
      return;
    }

    // No backend on GitHub Pages — this just confirms locally.
    status.textContent = `Thanks, ${name}! Your message has been received.`;
    status.className = "form-status ok";
    form.reset();
  });
}

// ---- Footer year ----
function setYear() {
  const el = document.getElementById("year");
  if (el) el.textContent = new Date().getFullYear();
}

// ---- Init ----
document.addEventListener("DOMContentLoaded", () => {
  renderSquad();
  renderFixtures();
  setupNav();
  setupCounters();
  setupForm();
  setYear();
});
