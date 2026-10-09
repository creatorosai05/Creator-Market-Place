/* Discover / home page */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  const QUICK = [
    "8 Instagram reels for a D2C skincare launch in Hindi and English",
    "Full brand identity with bilingual Arabic-English logo for a restaurant group",
    "30 performance ad creatives for Meta, need under ₹20k",
    "Convert 60 K-12 science lessons into 3-minute micro-modules",
    "AI governance policy and training for a 340-person bank marketing team",
    "Original soundtrack with stems for an indie game, clean commercial rights"
  ];

  const STEPS = [
    { icon: "edit", title: "Describe the work", body: "Two or three sentences in plain language. No forms to fill in before you know what you want." },
    { icon: "spark", title: "AI structures it", body: "The generator extracts category, quantity, deliverables, toolchain, timeline and complexity, then prices it against live listings." },
    { icon: "target", title: "Explainable matching", body: "Seven weighted factors — category, keywords, tools, budget, reputation, capacity, language — each with a written reason." },
    { icon: "shield", title: "Escrow-protected hire", body: "Payment is held until you approve delivery. Risk flags surface before you award, not after." }
  ];

  function renderCategories() {
    const host = $("#categoryGrid");
    host.innerHTML = DB.CATEGORIES.map((cat) => {
      const gigs = DB.GIGS.filter((g) => g.category === cat.id);
      const creators = DB.CREATORS.filter((c) => c.categories.includes(cat.id));
      const from = gigs.length ? Math.min(...gigs.map((g) => DB.LOWEST(g))) : cat.benchmark;
      return `<a class="card card-hover card-pad-sm" href="creators.html?category=${cat.id}" style="display:flex;flex-direction:column;gap:10px;height:100%">
        <div class="spread" style="align-items:flex-start">
          <span class="brand-mark" style="background:${UI.tileBg(gigs[0] ? DB.byId.creator[gigs[0].creatorId].hue : 250)};box-shadow:none;color:#fff">${UI.icon("layers", 15, 2)}</span>
          <span class="tiny mono">${gigs.length} listings</span>
        </div>
        <h3 style="font-size:.98rem">${UI.esc(cat.name)}</h3>
        <p class="tiny clamp-2" style="line-height:1.5;color:var(--muted)">${UI.esc(cat.blurb)}</p>
        <div class="spread mt-1" style="margin-top:auto;padding-top:10px;border-top:1px solid var(--line)">
          <span class="tiny">from <strong class="mono" style="color:var(--text)">${UI.compactMoney(from)}</strong></span>
          <span class="tiny">${creators.length} creators</span>
        </div>
      </a>`;
    }).join("");

    $("#searchCategory").innerHTML = `<option value="">All categories</option>` +
      DB.CATEGORIES.map((c) => `<option value="${c.id}">${UI.esc(c.name)}</option>`).join("");
  }

  function renderTrending() {
    const gigs = DB.GIGS.filter((g) => g.trending).sort((a, b) => b.orders - a.orders).slice(0, 6);
    $("#trendingGrid").innerHTML = gigs.map((g) => UI.gigCard(g)).join("");
  }

  function renderCreators() {
    const top = DB.CREATORS
      .map((c) => ({ c, q: AI.qualityScore(c).score }))
      .sort((a, b) => b.q - a.q)
      .slice(0, 6)
      .map((x) => x.c);
    $("#creatorGrid").innerHTML = top.map((c) => UI.creatorCard(c)).join("");
    UI.bindSaveButtons($("#creatorGrid"));
  }

  function renderBriefs() {
    const open = Store.openBriefs().slice(0, 3);
    $("#briefGrid").innerHTML = open.length
      ? open.map((b) => UI.briefCard(b)).join("")
      : UI.empty({ title: "No open briefs", body: "Be the first to post what you need built.", cta: `<a class="btn btn-primary btn-sm" href="brief.html">Post a brief</a>` });
  }

  function renderHow() {
    $("#howGrid").innerHTML = STEPS.map((s, i) => `<div>
      <div class="row" style="gap:9px;margin-bottom:10px">
        <span class="brand-mark" style="width:26px;height:26px;font-size:.74rem;border-radius:8px">${i + 1}</span>
        <span class="text-mint">${UI.icon(s.icon, 16, 1.9)}</span>
      </div>
      <h4 style="font-size:.98rem">${UI.esc(s.title)}</h4>
      <p class="tiny mt-2" style="line-height:1.6;color:var(--muted)">${UI.esc(s.body)}</p>
    </div>`).join("");
  }

  function renderQuick() {
    $("#quickSearches").innerHTML = `<span class="tiny" style="margin-right:2px">Try:</span>` +
      QUICK.slice(0, 3).map((q, i) => `<button type="button" class="chip chip-btn" data-quick="${i}">${UI.esc(q.length > 42 ? q.slice(0, 42) + "…" : q)}</button>`).join("");
    $$("[data-quick]").forEach((b) => b.addEventListener("click", () => {
      $("#searchInput").value = QUICK[+b.dataset.quick];
      runSearch();
    }));
  }

  function runSearch() {
    const q = $("#searchInput").value.trim();
    const cat = $("#searchCategory").value;
    if (!q && !cat) return;

    let pool = DB.CREATORS;
    if (cat) pool = pool.filter((c) => c.categories.includes(cat));

    const ranked = q ? AI.searchCreators(q, pool) : pool.map((c) => ({ creator: c, relevance: AI.qualityScore(c).score }));

    const section = $("#resultsSection");
    section.hidden = false;
    const label = [q ? `"${q}"` : null, cat ? DB.byId.category[cat].name : null].filter(Boolean).join(" in ");
    $("#resultsTitle").textContent = ranked.length
      ? `${ranked.length} creator${ranked.length === 1 ? "" : "s"} for ${label}`
      : `No creators for ${label}`;

    $("#searchResults").innerHTML = ranked.length
      ? ranked.map((r) => UI.creatorCard(r.creator)).join("")
      : UI.empty({
        title: "No exact match",
        body: "Try a broader term, or post a brief and let the matching engine find the closest fit across all 18 creators.",
        cta: `<a class="btn btn-primary btn-sm" href="brief.html">Post a brief instead</a>`
      });
    UI.bindSaveButtons($("#searchResults"));
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  $("#searchForm").addEventListener("submit", (e) => { e.preventDefault(); runSearch(); });
  $("#clearSearch").addEventListener("click", () => {
    $("#searchInput").value = "";
    $("#searchCategory").value = "";
    $("#resultsSection").hidden = true;
    $("#searchInput").focus();
  });
  $("#searchInput").addEventListener("input", () => {
    if (!$("#searchInput").value.trim()) $("#resultsSection").hidden = true;
  });

  renderCategories();
  renderTrending();
  renderCreators();
  renderBriefs();
  renderHow();
  renderQuick();
})();
