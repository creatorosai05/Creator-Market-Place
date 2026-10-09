/* Post a brief — AI generator, pricing, risk check, explainable matching */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  const EXAMPLES = [
    "We are a D2C skincare brand launching three products next month. We need 12 Instagram reels in Hindi and English with strong hooks, plus a landing page rewrite. Previous campaigns plateaued at 1.8x ROAS.",
    "Our 400k-subscriber tech channel lost half its average view duration. Need someone who reads retention analytics, not just cuts footage. Eight videos to start with a format rebuild we can keep using.",
    "Marketing team of 340 at a retail bank is using AI tools with no standards at all. We need a governance framework, disclosure policy and tiered training. Regulated environment, so audit trails matter.",
    "Expanding our restaurant group to three locations. Current identity does not work in Arabic. Need a real bilingual logotype, a full brand book and packaging direction for our retail line.",
    "Indie puzzle game launching in Q1. Need 14 original music tracks with stems we can layer in-engine, plus UI sound effects. Clean commercial rights are non-negotiable.",
    "36 garments photographed as flat lays. We want an on-model lookbook without a shoot. Fabric texture and colour accuracy are critical because returns spike when product looks different online."
  ];

  let analysis = null;
  let activeBrief = null;

  /* ---------- Populate selects ---------- */
  $("#bCategory").innerHTML = DB.CATEGORIES.map((c) => `<option value="${c.id}">${UI.esc(c.name)}</option>`).join("");
  $("#bLanguage").innerHTML = DB.LANGUAGES.map((l) => `<option value="${l}">${UI.esc(l)}</option>`).join("");
  $("#examples").innerHTML = `<span class="tiny">Examples:</span>` +
    EXAMPLES.map((e, i) => `<button type="button" class="chip chip-btn" data-ex="${i}" title="${UI.esc(e)}">${UI.esc(e.slice(0, 38))}…</button>`).join("");
  $$("#examples [data-ex]").forEach((b) => b.addEventListener("click", () => {
    $("#rawBrief").value = EXAMPLES[+b.dataset.ex];
    countWords();
    analyse();
  }));

  $("#riskIcon").innerHTML = `<span class="text-violet">${UI.icon("shield", 16, 2)}</span>`;

  const raw = $("#rawBrief");
  raw.addEventListener("input", countWords);
  function countWords() {
    $("#wordCount").textContent = raw.value.trim() ? raw.value.trim().split(/\s+/).length : 0;
  }

  /* ---------- Analysis ---------- */
  function analyse() {
    const text = raw.value.trim();
    if (text.length < 25) {
      UI.toast("Give the AI at least a sentence or two to work with", "err");
      raw.focus();
      return;
    }
    const btn = $("#analyseBtn");
    btn.disabled = true;
    btn.innerHTML = `<span class="spinner"></span> Analysing…`;

    /* Short delay so the user can see work happening; analysis itself is instant. */
    setTimeout(() => {
      analysis = AI.generateBrief(text);
      fillStructured(analysis);
      fillPrice(analysis);
      fillRisk(analysis);
      $("#structuredPanel").hidden = false;
      $("#structuredPanel").scrollIntoView({ behavior: "smooth", block: "start" });
      btn.disabled = false;
      btn.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 3v5M12 16v5M3 12h5M16 12h5M6.5 6.5l3 3M14.5 14.5l3 3M17.5 6.5l-3 3M9.5 14.5l-3 3"/></svg> Re-analyse`;
      UI.toast(`Category detected: ${analysis.categoryName} (${analysis.categoryConfidence}% confidence)`, "ok");
    }, 420);
  }

  function fillStructured(a) {
    $("#bTitle").value = a.title;
    $("#bCategory").value = a.category;
    $("#bLanguage").value = a.language;
    $("#bQuantity").value = a.quantity;
    $("#bDeadline").value = a.deadlineDays;
    $("#bBudgetMin").value = a.budgetMin;
    $("#bBudgetMax").value = a.budgetMax;
    $("#bBrand").value = Store.getBrand().name || "";
    $("#bDescription").value = a.summary + "\n\n" + raw.value.trim();

    $("#confidenceChip").innerHTML = `${UI.icon("spark", 10, 2.2)} ${a.confidence}% confidence`;
    $("#confidenceChip").className = `chip ${a.confidence >= 70 ? "chip-mint" : a.confidence >= 45 ? "chip-amber" : "chip-rose"}`;
    $("#catChip").textContent = `${a.categoryName} · ${a.categoryConfidence}% certain`;

    $("#bDeliverables").innerHTML = a.deliverables.map((d) => UI.chip(d, "violet")).join("") || `<span class="tiny">None detected</span>`;

    const signals = [
      a.complexity !== "medium" ? `${a.complexity} complexity` : null,
      a.cadence !== "one-off" ? `${a.cadence} cadence` : null,
      a.multilingual ? "multilingual" : null,
      ...a.platforms.slice(0, 3),
      ...a.tone.map((t) => `${t} tone`),
      ...a.niches.map((n) => DB.NICHES.find((x) => x.id === n)?.name),
      a.deadlineSource !== "default" ? `deadline: ${a.deadlineSource}` : null
    ].filter(Boolean);
    $("#bSignals").innerHTML = signals.length
      ? signals.map((s) => UI.chip(s, "mint")).join("")
      : `<span class="tiny">No extra signals detected — add quantity, platform or deadline for a sharper brief.</span>`;
  }

  function fillPrice(a) {
    const p = a.priceBreakdown;
    $("#priceSuggested").textContent = UI.money(p.suggested);
    $("#priceRange").textContent = `Typical range ${UI.money(p.min)} – ${UI.money(p.max)} · ${UI.money(p.perUnit)} per ${a.quantityUnit}`;
    $("#priceRationale").innerHTML = p.rationale.map((r) => `<li>${UI.esc(r)}</li>`).join("");

    const max = p.max || 1;
    $("#priceBars").innerHTML = `
      <div class="stack" style="gap:9px">
        ${[["Floor", p.min], ["Suggested", p.suggested], ["Ceiling", p.max]].map(([label, v]) => `
          <div>
            <div class="spread" style="gap:10px"><span class="tiny">${label}</span><span class="tiny mono">${UI.compactMoney(v)}</span></div>
            <div class="mt-1">${UI.bar(v, max, label === "Suggested" ? "var(--signal)" : "")}</div>
          </div>`).join("")}
      </div>
      <div class="spread mt-4" style="padding-top:var(--sp-3);border-top:1px solid var(--line)">
        <span class="tiny">Calibrated on ${p.marketSamples} live listings</span>
        <span class="tiny mono">${p.multipliers.rush > 1 ? `<span class="text-amber">rush +${Math.round((p.multipliers.rush - 1) * 100)}%</span>` : ""}</span>
      </div>`;
  }

  function fillRisk(a) {
    const r = a.risks;
    const tone = r.level === "elevated" ? "rose" : r.level === "moderate" ? "amber" : r.level === "low" ? "sky" : "mint";
    $("#riskBody").innerHTML = `
      <div class="row" style="gap:8px;margin-bottom:10px">
        <span class="chip chip-${tone}">${UI.icon("shield", 11, 2.2)} ${UI.esc(r.level)} risk</span>
        <span class="tiny mono">score ${r.score}/100</span>
      </div>
      <p class="tiny" style="line-height:1.55;color:var(--muted)">${UI.esc(r.summary)}</p>
      ${r.flags.length ? `<div class="stack mt-3" style="gap:9px">${r.flags.map((f) => `
        <details class="card card-flat" style="padding:10px;border-color:rgba(255,255,255,.07)">
          <summary style="cursor:pointer;font-size:.82rem;font-weight:600;list-style:none;display:flex;gap:8px;align-items:center">
            <span class="dot ${f.level === "high" ? "" : f.level === "medium" ? "dot-amber" : "dot-dim"}" style="${f.level === "high" ? "background:var(--rose);box-shadow:0 0 0 3px rgba(255,92,122,.16)" : f.level === "medium" ? "background:var(--amber);box-shadow:0 0 0 3px rgba(255,181,71,.16)" : ""}"></span>
            ${UI.esc(f.title)}
          </summary>
          <p class="tiny mt-2" style="line-height:1.55;color:var(--muted)">${UI.esc(f.body)}</p>
          <p class="tiny mt-2 text-mint">Recommended: ${UI.esc(f.action)}</p>
        </details>`).join("")}</div>` : ""}`;
  }

  /* ---------- Post & match ---------- */
  function collectForm() {
    const min = +$("#bBudgetMin").value || 0;
    const max = Math.max(+$("#bBudgetMax").value || 0, min);
    return {
      title: $("#bTitle").value.trim() || "Untitled brief",
      category: $("#bCategory").value,
      language: $("#bLanguage").value,
      quantity: Math.max(1, +$("#bQuantity").value || 1),
      deadlineDays: Math.max(1, +$("#bDeadline").value || 14),
      budgetMin: min,
      budgetMax: max,
      brand: $("#bBrand").value.trim() || Store.getBrand().name || "Your Brand",
      brandType: "Brand",
      commercialUse: true,
      commercialLicense: $("#bCommercialLicense")?.value || "Full Commercial License (Organic, Ads & Digital)",
      commercialStrict: $("#bCommercialStrict")?.checked || false,
      description: $("#bDescription").value.trim() || raw.value.trim(),
      deliverables: analysis?.deliverables || [],
      tools: analysis?.tools || [],
      niches: analysis?.niches || [],
      complexity: analysis?.complexity || "medium",
      summary: analysis?.summary || "",
      searchKeywords: AI.tokens(`${$("#bTitle").value} ${$("#bDescription").value}`)
    };
  }

  function postBrief() {
    const data = collectForm();
    if (!data.title || data.title === "Untitled brief") {
      UI.toast("Please specify a descriptive brief title", "err");
      $("#bTitle").focus();
      return;
    }
    if (data.budgetMax < data.budgetMin) {
      UI.toast("Budget ceiling cannot be below the floor", "err");
      return;
    }
    const brief = Store.createBrief(data);
    if (data.brand) Store.setBrand({ name: data.brand });
    activeBrief = brief;
    UI.toast("Brief posted and synced to Supabase! Matching against all 18 creators…", "ok");
    renderMatches(brief);
    history.replaceState(null, "", `brief.html?id=${brief.id}#matches`);
  }

  function renderMatches(brief) {
    const minScore = +$("#matchMin").value;
    const matches = AI.matchCreators({ ...brief, searchKeywords: brief.searchKeywords?.length ? brief.searchKeywords : AI.tokens(`${brief.title} ${brief.description}`) }, { limit: 18 });
    const shown = matches.filter((m) => m.score >= minScore);

    $("#matchesSection").hidden = false;
    $("#matchesHeading").textContent = `${shown.length} match${shown.length === 1 ? "" : "es"} above ${minScore}`;

    $("#matches").innerHTML = shown.length ? shown.map((m, i) => matchCard(m, i, brief)).join("") : UI.empty({
      title: `Nothing scored above ${minScore}`,
      body: "Lower the threshold, widen the budget, or extend the deadline. Capacity and budget are usually the two binding factors.",
      icon: "target",
      cta: `<button class="btn btn-primary btn-sm" id="lowerThreshold">Show all matches</button>`
    });

    $("#lowerThreshold")?.addEventListener("click", () => { $("#matchMin").value = "0"; renderMatches(brief); });

    $$("[data-toggle-factors]").forEach((btn) => btn.addEventListener("click", () => {
      const panel = $(`#factors-${btn.dataset.toggleFactors}`);
      const open = !panel.hidden;
      panel.hidden = open;
      btn.setAttribute("aria-expanded", String(!open));
      btn.textContent = open ? "Show scoring breakdown" : "Hide scoring breakdown";
    }));

    $$("[data-invite]").forEach((btn) => btn.addEventListener("click", () => {
      const c = DB.byId.creator[btn.dataset.invite];
      UI.modal({
        title: `Invite ${c.name}`,
        subtitle: brief.title,
        body: `<label class="field"><span class="field-label">Add a note</span>
          <textarea class="textarea" id="inviteNote" rows="4" autofocus>Hi ${UI.esc(c.name.split(" ")[0])}, your work looks like a strong fit for this. Are you available to start within ${brief.deadlineDays} days?</textarea></label>`,
        actions: [{ label: "Cancel" }, {
          label: "Send invite", variant: "primary",
          onClick: () => {
            if (!$("#inviteNote").value.trim()) { UI.toast("Add a note first", "err"); return false; }
            Store.addProposal({ briefId: brief.id, creatorId: c.id, note: $("#inviteNote").value.trim(), direction: "invite" });
            Store.updateBrief(brief.id, { applicants: (brief.applicants || 0) + 1 });
            brief.applicants = (brief.applicants || 0) + 1;
            UI.toast(`Invite sent to ${c.name}`, "ok");
          }
        }]
      });
    }));

    UI.bindSaveButtons($("#matches"));
    $("#matchesSection").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function matchCard(m, i, brief) {
    const c = m.creator;
    const q = AI.qualityScore(c);
    const gig = m.suggestedGig;
    const pkg = gig ? gig.packages[m.suggestedPackage || "standard"] : null;
    const tone = m.verdict.tone;
    const chipClass = tone === "strong" ? "chip-mint" : tone === "good" ? "chip-violet" : tone === "partial" ? "chip-amber" : "chip-rose";

    return `<article class="card card-hover fade-in" style="animation-delay:${i * 45}ms">
      <div class="row-between" style="align-items:flex-start;gap:var(--sp-4)">
        <div class="row" style="gap:var(--sp-3);align-items:flex-start;min-width:0">
          <a href="creator.html?id=${c.id}">${UI.avatar(c, "md")}</a>
          <div style="min-width:0">
            <div class="row" style="gap:6px">
              <a href="creator.html?id=${c.id}" style="font-family:var(--font-display);font-weight:600;font-size:1.02rem">${UI.esc(c.name)}</a>
              ${c.verified ? `<span class="badge badge-verified">${UI.icon("shield", 10, 2.2)}</span>` : ""}
              ${i === 0 ? `<span class="badge badge-ai">Top match</span>` : ""}
            </div>
            <div class="tiny truncate">${UI.esc(c.title)} · ${UI.esc(c.location)}</div>
            <div class="row mt-1" style="gap:8px">${UI.stars(c.rating, c.reviews)}<span class="tiny">${UI.compact(c.completedOrders)} orders</span><span class="chip" style="padding:1px 8px;font-size:.7rem">Quality ${q.score} · ${q.grade}</span></div>
          </div>
        </div>
        <div style="text-align:center;flex:none">
          ${UI.scoreRing(m.score, "score-ring-lg", "Match score")}
          <span class="chip ${chipClass} mt-2" style="display:inline-flex">${UI.esc(tone === "strong" ? "Strong fit" : tone === "good" ? "Good fit" : tone === "partial" ? "Partial" : "Weak")}</span>
        </div>
      </div>

      <p class="sub mt-4" style="font-size:.88rem">${UI.esc(m.verdict.text)}</p>

      <div class="row mt-3" style="gap:5px">
        ${c.categories.map((x) => UI.chip(DB.byId.category[x].short, "violet")).join("")}
        ${c.tools.slice(0, 3).map((t) => UI.chip(t, "mint")).join("")}
        ${c.languages.slice(0, 2).map((l) => UI.chip(l)).join("")}
      </div>

      ${gig && pkg ? `<div class="card card-flat card-pad-sm mt-4" style="border-color:rgba(124,92,255,.2)">
        <div class="row-between" style="gap:var(--sp-3)">
          <div style="min-width:0">
            <span class="eyebrow" style="font-size:.6rem">${UI.icon("spark", 9, 2.4)} Recommended listing</span>
            <div class="mt-2" style="font-size:.88rem;font-weight:600"><a href="gig.html?id=${gig.id}">${UI.esc(gig.title)}</a></div>
            <div class="tiny mt-1">${UI.esc(pkg.name)} · ${UI.esc(pkg.units)} · ${pkg.deliveryDays} days · ${pkg.revisions} revisions</div>
          </div>
          <div style="text-align:right;flex:none">
            <div class="num" style="font-size:1.15rem">${UI.money(pkg.price)}</div>
            <div class="tiny">${pkg.price <= brief.budgetMax ? `<span class="text-mint">within budget</span>` : `<span class="text-amber">${UI.compactMoney(pkg.price - brief.budgetMax)} over</span>`}</div>
          </div>
        </div>
      </div>` : ""}

      <button class="btn btn-ghost btn-sm mt-4" data-toggle-factors="${c.id}" aria-expanded="false" aria-controls="factors-${c.id}">Show scoring breakdown</button>
      <div id="factors-${c.id}" class="mt-3" hidden>${UI.factorList(m.factors)}</div>

      <div class="row mt-4" style="gap:8px;padding-top:var(--sp-4);border-top:1px solid var(--line)">
        ${gig ? `<a class="btn btn-primary btn-sm" href="gig.html?id=${gig.id}">Hire for this brief</a>` : ""}
        <button class="btn btn-sm" data-invite="${c.id}">Send invite</button>
        <a class="btn btn-ghost btn-sm" href="creator.html?id=${c.id}">View profile</a>
        <button class="btn btn-ghost btn-icon btn-sm" data-save="${c.id}" aria-pressed="${Store.isSaved(c.id)}" aria-label="Save to shortlist" title="Save to shortlist" style="margin-left:auto;${Store.isSaved(c.id) ? "color:var(--mint);border-color:rgba(0,229,195,.35)" : ""}">${UI.icon("bookmark", 14, Store.isSaved(c.id) ? 0 : 1.75)}</button>
      </div>
    </article>`;
  }

  /* ---------- Existing brief view ---------- */
  function renderBriefView(brief) {
    $("#composerView").hidden = true;
    $("#briefView").hidden = false;
    const cat = DB.byId.category[brief.category] || { name: brief.category, short: brief.category };
    const risk = AI.assessRisk(`${brief.title} ${brief.description || ""}`);
    const normBrief = { ...brief, searchKeywords: brief.searchKeywords?.length ? brief.searchKeywords : AI.tokens(`${brief.title} ${brief.description}`) };

    $("#briefView").innerHTML = `
      <nav class="tiny mb-4" aria-label="Breadcrumb">
        <a href="dashboard.html" style="color:var(--muted)">My orders</a><span style="color:var(--dim)"> / </span><span>Brief</span>
      </nav>
      <div class="split">
        <div class="stack" style="gap:var(--sp-5)">
          <section class="card">
            <div class="row-between" style="align-items:flex-start;gap:var(--sp-4)">
              <div style="min-width:0">
                <div class="row mb-2" style="gap:6px">${UI.statusPill(brief.status)}${UI.chip(cat.name, "violet")}${brief.seeded ? UI.chip("Sample brief") : UI.chip("Your brief", "mint")}${UI.chip(brief.commercialLicense || "Commercial license included", "mint")}</div>
                <h1 style="font-size:clamp(1.4rem,3vw,1.95rem)">${UI.esc(brief.title)}</h1>
                <div class="tiny mt-2">${UI.esc(brief.brand)} · ${UI.esc(brief.brandType || "Brand")} · posted ${UI.esc(brief.postedAt)}</div>
              </div>
              <div class="row" style="gap:8px;flex:none">
                ${brief.seeded ? "" : `<button class="btn btn-ghost btn-sm" id="editBriefBtn">Edit</button>`}
                <a class="btn btn-primary btn-sm" href="brief.html">New brief</a>
              </div>
            </div>
            <p class="sub mt-4">${UI.esc(brief.description || brief.summary || "")}</p>
            ${brief.deliverables?.length ? `<div class="mt-4"><span class="field-label">Deliverables</span><div class="row" style="gap:5px">${brief.deliverables.map((d) => UI.chip(d, "violet")).join("")}</div></div>` : ""}
            <div class="grid g-4 mt-5" style="gap:var(--sp-3)">
              <div class="stat"><span class="k">Budget</span><span class="v" style="font-size:1.15rem">${UI.compactMoney(brief.budgetMin)}–${UI.compactMoney(brief.budgetMax)}</span></div>
              <div class="stat"><span class="k">Timeline</span><span class="v" style="font-size:1.15rem">${brief.deadlineDays} days</span></div>
              <div class="stat"><span class="k">Quantity</span><span class="v" style="font-size:1.15rem">${brief.quantity || 1}</span></div>
              <div class="stat"><span class="k">Applicants</span><span class="v" style="font-size:1.15rem">${brief.applicants ?? 0}</span></div>
            </div>
            ${brief.tools?.length ? `<div class="row mt-4" style="gap:5px">${brief.tools.map((t) => UI.chip(t, "mint")).join("")}</div>` : ""}
          </section>

          <section id="matches">
            <div class="row-between mb-4" style="align-items:flex-end">
              <div>
                <span class="eyebrow eyebrow-violet">${UI.icon("spark", 11, 2.4)} AI matching</span>
                <h2 class="mt-2" style="font-size:1.3rem">Ranked creators for this brief</h2>
                <p class="sub mt-2" style="max-width:58ch">Seven weighted factors, each with a written reason. Open any card to audit the maths.</p>
              </div>
              <select class="select" id="matchMin" aria-label="Minimum match score" style="max-width:180px">
                <option value="0">All matches</option><option value="55">55+ only</option><option value="70" selected>70+ only</option><option value="85">85+ only</option>
              </select>
            </div>
            <div class="stack" id="matches" style="gap:var(--sp-4)"></div>
          </section>
        </div>
        <aside class="stack" style="gap:var(--sp-4);position:sticky;top:82px">
          <div class="card card-pad-sm">
            <div class="row" style="gap:8px"><span class="text-${risk.level === "elevated" ? "rose" : risk.level === "moderate" ? "amber" : "mint"}">${UI.icon("shield", 16, 2)}</span><h3 style="font-size:.95rem">Trust &amp; risk check</h3></div>
            <div class="mt-3">${riskSummary(risk)}</div>
          </div>
          <div class="ai-panel card-pad-sm">
            <span class="eyebrow" style="font-size:.64rem">Budget sanity</span>
            <div id="viewPrice" class="mt-3"></div>
          </div>
        </aside>
      </div>`;

    const price = AI.estimatePrice({ category: brief.category, quantity: brief.quantity || 1, complexity: brief.complexity || "medium", deadlineDays: brief.deadlineDays, quantityUnit: cat.unit });
    $("#viewPrice").innerHTML = `
      <div class="num" style="font-size:1.6rem">${UI.money(price.suggested)}</div>
      <div class="tiny mt-1">Market estimate · ${UI.money(price.min)} – ${UI.money(price.max)}</div>
      <div class="mt-3 stack" style="gap:8px;font-size:.83rem">
        <div class="spread"><span class="text-muted">Your ceiling</span><strong class="mono ${brief.budgetMax >= price.suggested ? "text-mint" : "text-amber"}">${UI.compactMoney(brief.budgetMax)}</strong></div>
        <div class="spread"><span class="text-muted">Headroom</span><strong class="mono">${brief.budgetMax >= price.suggested ? `<span class="text-mint">+${UI.compactMoney(brief.budgetMax - price.suggested)}</span>` : `<span class="text-rose">-${UI.compactMoney(price.suggested - brief.budgetMax)}</span>`}</strong></div>
      </div>
      <p class="tiny mt-3" style="line-height:1.55">${brief.budgetMax >= price.suggested
        ? "Budget is at or above the market estimate, so top-tier creators are reachable."
        : "Budget sits below the market estimate. Expect partial fits, or reduce scope to attract stronger matches."}</p>`;

    $("#editBriefBtn")?.addEventListener("click", () => editBrief(brief));
    $("#matchMin").addEventListener("change", () => renderMatchesFor(normBrief));
    renderMatchesFor(normBrief);
  }

  function riskSummary(risk) {
    return `<div class="row" style="gap:8px;margin-bottom:10px">
        <span class="chip chip-${risk.level === "elevated" ? "rose" : risk.level === "moderate" ? "amber" : risk.level === "low" ? "sky" : "mint"}">${UI.esc(risk.level)} risk</span>
        <span class="tiny mono">score ${risk.score}/100</span>
      </div>
      <p class="tiny" style="line-height:1.55;color:var(--muted)">${UI.esc(risk.summary)}</p>
      ${risk.flags.length ? `<div class="stack mt-3" style="gap:8px">${risk.flags.map((f) => `
        <div class="card card-flat" style="padding:10px;border-color:rgba(255,255,255,.07)">
          <div class="row" style="gap:7px"><span class="dot ${f.level === "high" ? "" : "dot-amber"}" style="${f.level === "high" ? "background:var(--rose);box-shadow:0 0 0 3px rgba(255,92,122,.16)" : ""}"></span><strong style="font-size:.82rem">${UI.esc(f.title)}</strong></div>
          <p class="tiny mt-2" style="line-height:1.5;color:var(--muted)">${UI.esc(f.body)}</p>
          <p class="tiny mt-2 text-mint">${UI.esc(f.action)}</p>
        </div>`).join("")}</div>` : ""}`;
  }

  function renderMatchesFor(brief) {
    const minScore = +$("#matchMin").value;
    const matches = AI.matchCreators(brief, { limit: 18 }).filter((m) => m.score >= minScore);
    const host = $("#matches");
    host.innerHTML = matches.length ? matches.map((m, i) => matchCard(m, i, brief)).join("") : UI.empty({
      title: `Nothing scored above ${minScore}`,
      body: "Lower the threshold to see the trade-offs, or widen the budget and timeline.",
      icon: "target",
      cta: `<button class="btn btn-primary btn-sm" id="lowerThreshold">Show all matches</button>`
    });
    $("#lowerThreshold")?.addEventListener("click", () => { $("#matchMin").value = "0"; renderMatchesFor(brief); });
    wireMatchActions(brief);
    UI.bindSaveButtons(host);
  }

  function wireMatchActions(brief) {
    $$("[data-toggle-factors]").forEach((btn) => btn.addEventListener("click", () => {
      const panel = $(`#factors-${btn.dataset.toggleFactors}`);
      const open = !panel.hidden;
      panel.hidden = open;
      btn.setAttribute("aria-expanded", String(!open));
      btn.textContent = open ? "Show scoring breakdown" : "Hide scoring breakdown";
    }));
    $$("[data-invite]").forEach((btn) => btn.addEventListener("click", () => {
      const c = DB.byId.creator[btn.dataset.invite];
      UI.modal({
        title: `Invite ${c.name}`, subtitle: brief.title,
        body: `<label class="field"><span class="field-label">Add a note</span><textarea class="textarea" id="inviteNote" rows="4" autofocus>Hi ${UI.esc(c.name.split(" ")[0])}, your work looks like a strong fit for this. Are you available to start within ${brief.deadlineDays} days?</textarea></label>`,
        actions: [{ label: "Cancel" }, {
          label: "Send invite", variant: "primary",
          onClick: () => {
            if (!$("#inviteNote").value.trim()) { UI.toast("Add a note first", "err"); return false; }
            Store.addProposal({ briefId: brief.id, creatorId: c.id, note: $("#inviteNote").value.trim(), direction: "invite" });
            Store.updateBrief(brief.id, { applicants: (brief.applicants || 0) + 1 });
            UI.toast(`Invite sent to ${c.name}`, "ok");
          }
        }]
      });
    }));
  }

  function editBrief(brief) {
    $("#composerView").hidden = false;
    $("#briefView").hidden = true;
    $("#rawBrief").value = brief.description || "";
    countWords();
    analysis = AI.generateBrief(brief.description || brief.title);
    fillStructured(analysis);
    fillPrice(analysis);
    fillRisk(analysis);
    $("#bTitle").value = brief.title;
    $("#bCategory").value = brief.category;
    $("#bLanguage").value = brief.language || "English";
    $("#bQuantity").value = brief.quantity || 1;
    $("#bDeadline").value = brief.deadlineDays;
    $("#bBudgetMin").value = brief.budgetMin;
    $("#bBudgetMax").value = brief.budgetMax;
    $("#bBrand").value = brief.brand || "";
    $("#structuredPanel").hidden = false;
    $("#postBtn").textContent = "Update brief & re-match";
    editing = brief.id;
  }

  let editing = null;

  /* ---------- Wire ---------- */
  $("#analyseBtn").addEventListener("click", analyse);
  $("#reAnalyse").addEventListener("click", () => { raw.scrollIntoView({ behavior: "smooth", block: "center" }); raw.focus(); });
  $("#resetBtn").addEventListener("click", () => {
    raw.value = "";
    countWords();
    $("#structuredPanel").hidden = true;
    $("#matchesSection").hidden = true;
    $("#priceSuggested").textContent = "—";
    $("#priceRange").textContent = "Run an analysis to price your brief";
    $("#priceBars").innerHTML = "";
    $("#priceRationale").innerHTML = "";
    $("#riskBody").innerHTML = `<p class="tiny">Analysed once you run the AI.</p>`;
    analysis = null;
    editing = null;
  });
  $("#postBtn").addEventListener("click", () => {
    if (editing) {
      const data = collectForm();
      Store.updateBrief(editing, data);
      const updated = Store.brief(editing);
      UI.toast("Brief updated. Re-matching…", "ok");
      editing = null;
      renderBriefView(updated);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      postBrief();
    }
  });
  $("#matchMin")?.addEventListener("change", () => { if (activeBrief) renderMatches(activeBrief); });

  /* Live re-pricing when the user edits the structured fields */
  ["#bCategory", "#bQuantity", "#bDeadline", "#bBudgetMin", "#bBudgetMax"].forEach((sel) => {
    $(sel).addEventListener("change", () => {
      if (!analysis) return;
      const d = collectForm();
      analysis.priceBreakdown = AI.estimatePrice({ category: d.category, quantity: d.quantity, complexity: analysis.complexity, deadlineDays: d.deadlineDays, quantityUnit: analysis.quantityUnit });
      analysis.quantityUnit = analysis.quantityUnit;
      fillPrice({ ...analysis, quantityUnit: analysis.quantityUnit });
      analysis.risks = AI.assessRisk(`${d.title} ${d.description}`);
      fillRisk(analysis);
    });
  });

  /* ---------- Route ---------- */
  const existingId = UI.qs("id");
  if (existingId) {
    const b = Store.brief(existingId);
    if (b) renderBriefView(b);
    else {
      $("#composerView").innerHTML = UI.empty({
        title: "Brief not found", body: "It may have been cleared from this device's local storage.", icon: "x",
        cta: `<a class="btn btn-primary btn-sm" href="brief.html">Create a new brief</a>`
      });
    }
  } else {
    countWords();
  }
})();
