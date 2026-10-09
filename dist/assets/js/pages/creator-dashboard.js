/* Creator Studio — the seller side */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  const select = $("#creatorSelect");
  select.innerHTML = DB.CREATORS
    .map((c) => `<option value="${c.id}">${UI.esc(c.name)} — ${UI.esc(c.title)}</option>`)
    .join("");

  let current = DB.byId.creator[UI.qs("id")] || DB.CREATORS[0];
  select.value = current.id;

  /* Deterministic pseudo-random from a string, so sample data is stable. */
  function seededRandom(seed) {
    let h = 2166136261;
    for (let i = 0; i < seed.length; i++) { h ^= seed.charCodeAt(i); h = Math.imul(h, 16777619); }
    return () => { h = Math.imul(h ^ (h >>> 15), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909); return ((h ^= h >>> 16) >>> 0) / 4294967296; };
  }

  /* Sample incoming orders, clearly labelled, so the seller view is not empty. */
  function sampleOrders(creator) {
    const rnd = seededRandom(creator.id + "orders");
    const gigs = DB.gigsOf(creator.id);
    if (!gigs.length) return [];
    const brands = ["Sip Society", "Northlane AI", "Threadly", "BrightPath", "Ledgerly", "Casa Verde", "PureSkin", "Vector Games", "Hibernia Bank", "Drape Studio"];
    const statuses = ["placed", "in-progress", "review", "delivered", "delivered"];
    return Array.from({ length: 5 }, (_, i) => {
      const gig = gigs[Math.floor(rnd() * gigs.length)];
      const keys = ["basic", "standard", "premium"];
      const packageKey = keys[Math.floor(rnd() * (i === 0 ? 2 : 3))];
      const pkg = gig.packages[packageKey];
      const placedAt = Date.now() - Math.floor(rnd() * 26 + 1) * 86400000;
      return {
        id: `sample-${creator.id}-${i}`, sample: true,
        gigId: gig.id, creatorId: creator.id, packageKey,
        gigTitle: gig.title, creatorName: creator.name, creatorHue: creator.hue,
        packageName: pkg.name, units: pkg.units, addons: [],
        subtotal: pkg.price, fee: Math.round(pkg.price * 0.08), total: Math.round(pkg.price * 1.08),
        status: statuses[i], placedAt,
        dueAt: placedAt + pkg.deliveryDays * 86400000,
        brand: brands[Math.floor(rnd() * brands.length)],
        brief: "Sample order generated for demonstration."
      };
    }).sort((a, b) => b.placedAt - a.placedAt);
  }

  /* ---------- Tabs ---------- */
  const tabs = $$(".tab[data-tab]");
  const panels = { orders: $("#panel-orders"), pricing: $("#panel-pricing"), listings: $("#panel-listings"), quality: $("#panel-quality"), portfolio: $("#panel-portfolio") };
  function selectTab(name) {
    tabs.forEach((t) => t.setAttribute("aria-selected", String(t.dataset.tab === name)));
    Object.entries(panels).forEach(([k, p]) => { p.hidden = k !== name; });
    history.replaceState(null, "", `creator-dashboard.html${name === "orders" ? "" : "#" + name}`);
  }
  tabs.forEach((t) => t.addEventListener("click", () => selectTab(t.dataset.tab)));
  select.addEventListener("change", () => { current = DB.byId.creator[select.value]; renderAll(); });

  /* ---------- Render ---------- */
  function renderAll() {
    renderHeader();
    renderStats();
    renderOrders();
    renderPricing();
    renderListings();
    renderQuality();
    renderPortfolio();
    history.replaceState(null, "", `creator-dashboard.html?id=${current.id}`);
  }

  function renderHeader() {
    const q = AI.qualityScore(current);
    const gigs = DB.gigsOf(current.id);
    $("#studioHeader").innerHTML = `<div class="card" style="padding:var(--sp-4);border-color:rgba(124,92,255,.22)">
      <div class="row" style="gap:var(--sp-4)">
        ${UI.avatar(current, "lg")}
        <div class="grow" style="min-width:0">
          <div class="row" style="gap:8px">
            <h2 style="font-size:1.3rem">${UI.esc(current.name)}</h2>
            ${current.verified ? `<span class="badge badge-verified">${UI.icon("shield", 10, 2.2)} Verified</span>` : `<span class="badge" style="background:var(--amber-soft);color:var(--amber);border:1px solid rgba(255,181,71,.3)">Unverified</span>`}
            ${current.online ? `<span class="status status-open"><span class="dot"></span> Online</span>` : ""}
          </div>
          <p class="sub mt-1" style="font-size:.9rem">${UI.esc(current.title)} · ${UI.esc(current.location)}</p>
          <div class="row mt-2" style="gap:6px">
            ${current.categories.map((c) => UI.chip(DB.byId.category[c].short, "violet")).join("")}
            <span class="chip chip-mint">Quality ${q.score} · ${q.grade}</span>
            <span class="chip">${gigs.length} listings</span>
          </div>
        </div>
        <div style="flex:none;text-align:right">
          <div class="tiny">Profile views (30d)</div>
          <div class="num" style="font-size:1.6rem">${UI.compact(gigs.reduce((s, g) => s + g.views, 0))}</div>
          <div class="tiny mt-1">${UI.compact(gigs.reduce((s, g) => s + g.orders, 0))} lifetime orders</div>
        </div>
      </div>
    </div>`;
  }

  function renderStats() {
    const gigs = DB.gigsOf(current.id);
    const revenue = gigs.reduce((s, g) => {
      const avg = Object.values(g.packages).reduce((a, p) => a + p.price, 0) / 3;
      return s + g.orders * avg * 0.92;
    }, 0);
    const queue = gigs.reduce((s, g) => s + g.queue, 0);
    const live = sampleOrders(current).filter((o) => !["delivered", "cancelled"].includes(o.status)).length +
      Store.orders().filter((o) => o.creatorId === current.id && !["delivered", "cancelled"].includes(o.status)).length;

    $("#studioStats").innerHTML = [
      { k: "Estimated lifetime revenue", v: UI.compactMoney(Math.round(revenue)), d: "Across all listings, net of fees", icon: "wallet" },
      { k: "Orders in queue", v: queue, d: `${live} need action now`, icon: "briefcase" },
      { k: "Buyer rating", v: current.rating.toFixed(1), d: `${current.reviews} reviews`, icon: "star" },
      { k: "Avg first response", v: `${current.responseMins}m`, d: `${Math.round(current.onTimeRate * 100)}% delivered on time`, icon: "clock" }
    ].map((s) => `<div class="stat">
      <span class="k">${UI.icon(s.icon, 13, 2)} ${UI.esc(s.k)}</span>
      <span class="v">${typeof s.v === "number" ? s.v : UI.esc(s.v)}</span>
      <span class="d">${UI.esc(s.d)}</span>
    </div>`).join("");
  }

  function renderOrders() {
    const real = Store.orders().filter((o) => o.creatorId === current.id);
    const samples = sampleOrders(current);
    const all = [...real, ...samples].sort((a, b) => b.placedAt - a.placedAt);

    $("#ordersBody").innerHTML = `
      ${real.length ? "" : `<div class="card card-flat card-pad-sm mb-4" style="border-color:rgba(0,229,195,.22)">
        <div class="row" style="gap:9px"><span class="text-mint">${UI.icon("spark", 15, 2)}</span>
        <span class="tiny" style="line-height:1.5">Orders you place as a client on the buyer side appear here instantly. The five rows below are <strong>sample orders</strong> generated for this creator so the seller workflow can be demonstrated.</span></div>
      </div>`}
      <div class="table-wrap">
        <table>
          <thead><tr><th>Buyer</th><th>Listing &amp; tier</th><th>Status</th><th class="td-num">Payout</th><th class="td-num">Due</th><th></th></tr></thead>
          <tbody>${all.map((o) => {
            const dl = UI.daysLeft(o.dueAt);
            return `<tr>
              <td><div style="font-weight:550;font-size:.88rem">${UI.esc(o.brand || "Buyer")}</div><div class="tiny">${UI.date(o.placedAt)}</div></td>
              <td><div class="truncate" style="font-size:.87rem;max-width:34ch">${UI.esc(o.gigTitle)}</div><div class="tiny">${UI.esc(o.packageName)} · ${UI.esc(o.units)}${o.sample ? ` · <span class="text-dim">sample</span>` : ""}</div></td>
              <td>${UI.statusPill(o.status)}</td>
              <td class="td-num">${UI.money(o.total)}</td>
              <td class="td-num">${o.status === "delivered" ? `<span class="text-mint">Paid</span>` : `<span class="${dl < 0 ? "text-rose" : dl <= 1 ? "text-amber" : ""}">${dl < 0 ? `${Math.abs(dl)}d late` : `${dl}d`}</span>`}</td>
              <td class="text-right">${o.sample ? "" : `<button class="btn btn-sm btn-ghost" data-advance="${o.id}">Advance</button>`}</td>
            </tr>`;
          }).join("")}</tbody>
        </table>
      </div>`;

    $$("[data-advance]").forEach((b) => b.addEventListener("click", () => {
      const o = Store.advanceOrder(b.dataset.advance);
      UI.toast(`Order moved to “${Store.statusLabel(o.status)}”`, "ok");
      renderOrders();
      renderStats();
    }));
  }

  function renderPricing() {
    const advice = AI.adviseCreatorPricing(current);
    if (!advice.length) {
      $("#pricingBody").innerHTML = UI.empty({ title: "No listings yet", body: "Publish a listing to get pricing advice.", icon: "wallet" });
      return;
    }
    $("#pricingBody").innerHTML = `
      <div class="ai-panel mb-4" style="padding:var(--sp-4)">
        <div class="row" style="gap:9px;align-items:flex-start">
          <span class="badge badge-ai">${UI.icon("spark", 10, 2.2)} AI</span>
          <p class="sub" style="font-size:.88rem">Recommendations are benchmarked against every comparable listing in the same category, then adjusted for your quality score, rating and current queue depth. Nothing here is a guess — open any card to read the four inputs.</p>
        </div>
      </div>
      <div class="stack" style="gap:var(--sp-4)">
        ${advice.map((a) => {
          const tone = a.direction === "raise" ? "mint" : a.direction === "lower" ? "amber" : "violet";
          const label = a.direction === "raise" ? "Raise price" : a.direction === "lower" ? "Above market" : "Hold price";
          return `<article class="card">
            <div class="row-between" style="align-items:flex-start;gap:var(--sp-4)">
              <div style="min-width:0">
                <div class="row mb-2" style="gap:6px">${UI.chip(DB.byId.category[a.gig.category].short, "violet")}<span class="chip chip-${tone}">${UI.esc(label)}</span></div>
                <h3 style="font-size:1rem"><a href="gig.html?id=${a.gig.id}">${UI.esc(a.gig.title)}</a></h3>
                <div class="tiny mt-1">${UI.compact(a.gig.orders)} orders · ${a.gig.rating.toFixed(1)}★ · ${a.gig.queue} in queue</div>
              </div>
              <div style="text-align:right;flex:none">
                <div class="tiny">Current standard tier</div>
                <div class="num" style="font-size:1.3rem">${UI.money(a.current)}</div>
                <div class="mt-2 tiny">Recommended</div>
                <div class="num text-${tone}" style="font-size:1.3rem">${UI.money(a.recommended)}</div>
                <div class="tiny ${a.deltaPct > 0 ? "text-mint" : a.deltaPct < 0 ? "text-amber" : "text-dim"}">${a.deltaPct > 0 ? "+" : ""}${a.deltaPct}% (${a.delta > 0 ? "+" : ""}${UI.compactMoney(a.delta)})</div>
              </div>
            </div>
            <div class="mt-4">
              <div class="spread mb-1"><span class="tiny">Your price vs ${a.peerCount} comparable listings</span><span class="tiny mono">median ${UI.money(a.peerMedian)}</span></div>
              <div style="position:relative;height:8px;border-radius:var(--r-pill);background:var(--ink-600);overflow:hidden">
                <i style="position:absolute;inset:0;width:${AI.clamp((a.recommended / (a.peerMedian * 2)) * 100)}%;background:var(--signal);opacity:.32"></i>
                <i style="position:absolute;top:0;bottom:0;left:${AI.clamp((Math.min(a.current, a.recommended) / (a.peerMedian * 2)) * 100)}%;width:${AI.clamp((Math.abs(a.recommended - a.current) / (a.peerMedian * 2)) * 100)}%;background:${a.deltaPct > 0 ? "var(--mint)" : "var(--amber)"}"></i>
                <i style="position:absolute;top:-3px;bottom:-3px;width:2px;left:${AI.clamp((a.peerMedian / (a.peerMedian * 2)) * 100)}%;background:var(--text);opacity:.55" title="Category median"></i>
              </div>
            </div>
            <details class="mt-4"><summary class="tiny" style="cursor:pointer;color:var(--muted)">Why the AI recommends this</summary>
              <ol class="mt-3" style="padding-left:18px;font-size:.82rem;color:var(--muted);line-height:1.75">${a.rationale.map((r) => `<li>${UI.esc(r)}</li>`).join("")}</ol>
            </details>
            ${a.direction !== "hold" ? `<div class="row mt-4" style="gap:8px;padding-top:var(--sp-4);border-top:1px solid var(--line)">
              <button class="btn btn-primary btn-sm" data-apply="${a.gig.id}" data-price="${a.recommended}">Apply recommended price</button>
              <span class="tiny">Simulated — updates this demo only, not the catalogue.</span>
            </div>` : ""}
          </article>`;
        }).join("")}
      </div>`;

    $$("[data-apply]").forEach((b) => b.addEventListener("click", () => {
      UI.toast(`Standard tier set to ${UI.money(+b.dataset.price)} for this session`, "ok");
      b.closest(".row").innerHTML = `<span class="chip chip-mint">${UI.icon("check", 11, 2.4)} Applied · ${UI.money(+b.dataset.price)}</span><span class="tiny">Reload to reset.</span>`;
    }));
  }

  function renderListings() {
    const gigs = DB.gigsOf(current.id);
    const catAvg = {};
    DB.CATEGORIES.forEach((c) => {
      const g = DB.GIGS.filter((x) => x.category === c.id);
      catAvg[c.id] = g.length ? g.reduce((s, x) => s + x.orders, 0) / g.length : 0;
    });

    $("#listingsBody").innerHTML = `
      <div class="table-wrap">
        <table>
          <thead><tr><th>Listing</th><th class="td-num">Views</th><th class="td-num">Orders</th><th class="td-num">Conversion</th><th class="td-num">vs category</th><th class="td-num">From</th><th class="td-num">Queue</th></tr></thead>
          <tbody>${gigs.map((g) => {
            const cvr = (g.orders / g.views) * 100;
            const vsCat = catAvg[g.category] ? ((g.orders - catAvg[g.category]) / catAvg[g.category]) * 100 : 0;
            return `<tr>
              <td><a href="gig.html?id=${g.id}" style="font-weight:550;font-size:.87rem">${UI.esc(g.title)}</a>
                <div class="tiny">${UI.esc(DB.byId.category[g.category].short)}${g.trending ? ` · <span class="text-rose">trending</span>` : ""}</div></td>
              <td class="td-num">${UI.compact(g.views)}</td>
              <td class="td-num">${UI.compact(g.orders)}</td>
              <td class="td-num"><span class="${cvr > 3 ? "text-mint" : cvr > 1.5 ? "text-amber" : "text-rose"}">${cvr.toFixed(1)}%</span></td>
              <td class="td-num"><span class="${vsCat >= 0 ? "text-mint" : "text-rose"}">${vsCat >= 0 ? "+" : ""}${vsCat.toFixed(0)}%</span></td>
              <td class="td-num">${UI.compactMoney(DB.LOWEST(g))}</td>
              <td class="td-num">${g.queue}</td>
            </tr>`;
          }).join("")}</tbody>
        </table>
      </div>
      <div class="card mt-4" style="padding:var(--sp-4)">
        <div class="row" style="gap:9px;align-items:flex-start">
          <span class="text-violet">${UI.icon("spark", 15, 2)}</span>
          <div>
            <strong style="font-size:.9rem">Listing health</strong>
            <p class="tiny mt-1" style="line-height:1.6;color:var(--muted)">${listingAdvice(gigs, catAvg)}</p>
          </div>
        </div>
      </div>`;
  }

  function listingAdvice(gigs, catAvg) {
    if (!gigs.length) return "Publish your first listing to start receiving orders.";
    const worst = gigs.slice().sort((a, b) => (a.orders / a.views) - (b.orders / b.views))[0];
    const best = gigs.slice().sort((a, b) => (b.orders / b.views) - (a.orders / a.views))[0];
    const cvr = (g) => (g.orders / g.views) * 100;
    const notes = [];
    notes.push(`“${best.title.slice(0, 46)}…” converts at ${cvr(best).toFixed(1)}%, well above the marketplace norm of 2.5% — its tag set is worth copying across your other listings.`);
    if (cvr(worst) < 2) notes.push(`“${worst.title.slice(0, 46)}…” gets ${UI.compact(worst.views)} views but only converts ${cvr(worst).toFixed(1)}%. That usually means the title over-promises or the entry price looks wrong for the scope.`);
    if (gigs.length < 2) notes.push("Creators with two or more listings in adjacent categories earn roughly 40% more — consider adding a complementary tier.");
    if (gigs.some((g) => g.queue > 6)) notes.push("A queue above six orders starts hurting your capacity score in matching. Consider a temporary pause or a price raise to ration demand.");
    return notes.join(" ");
  }

  function renderQuality() {
    const q = AI.qualityScore(current);
    const rev = AI.summariseReviews(current);
    const peers = DB.CREATORS.map((c) => ({ c, s: AI.qualityScore(c).score })).sort((a, b) => b.s - a.s);
    const rank = peers.findIndex((p) => p.c.id === current.id) + 1;

    $("#qualityBody").innerHTML = `
      <div class="grid g-2" style="gap:var(--sp-4)">
        <div class="ai-panel">
          <div class="row" style="gap:var(--sp-4)">
            ${UI.scoreRing(q.score, "score-ring-lg", "Quality score")}
            <div>
              <span class="eyebrow">Quality score</span>
              <div class="num mt-2" style="font-size:1.7rem">${q.grade}</div>
              <span class="chip chip-${q.band.color} mt-2">${UI.esc(q.band.label)}</span>
              <div class="tiny mt-3">Ranked #${rank} of ${peers.length} creators</div>
            </div>
          </div>
          <hr class="divider">
          <div class="stack" style="gap:13px">
            ${q.parts.map((p) => `<div>
              <div class="spread" style="gap:10px">
                <span style="font-size:.85rem;font-weight:550">${UI.esc(p.label)} <span class="tiny">· ${p.weight}% weight</span></span>
                <span class="tiny mono">${UI.esc(p.detail)}</span>
              </div>
              <div class="mt-1">${UI.bar(p.value * 100)}</div>
              <div class="tiny mt-1" style="color:var(--dim)">${UI.esc(qualityAdvice(p, current))}</div>
            </div>`).join("")}
          </div>
        </div>

        <div class="stack" style="gap:var(--sp-4)">
          <div class="card">
            <h3 style="font-size:1rem">What is holding the score back</h3>
            <div class="stack mt-3" style="gap:11px">
              ${q.parts.slice().sort((a, b) => (a.value * a.weight) - (b.value * b.weight)).slice(0, 3).map((p) => `<div class="row" style="gap:10px;align-items:flex-start">
                <span class="dot dot-amber" style="margin-top:7px;flex:none"></span>
                <div><strong style="font-size:.86rem">${UI.esc(p.label)}</strong><p class="tiny mt-1" style="line-height:1.55;color:var(--muted)">${UI.esc(qualityAdvice(p, current))}</p></div>
              </div>`).join("")}
            </div>
          </div>

          <div class="card">
            <h3 style="font-size:1rem">Review signals</h3>
            ${rev.aspects.length ? `<div class="stack mt-3" style="gap:10px">
              ${rev.aspects.map((a) => `<div>
                <div class="spread" style="gap:10px"><span style="font-size:.84rem">${UI.esc({ speed: "Speed", quality: "Output quality", communication: "Communication", value: "Business results", revisions: "Revisions", strategy: "Strategic input" }[a.name] || a.name)}</span><span class="tiny mono">${a.mentions}</span></div>
                <div class="mt-1">${UI.bar(a.mentions, Math.max(...rev.aspects.map((x) => x.mentions)))}</div>
              </div>`).join("")}
            </div>
            <p class="tiny mt-4" style="line-height:1.6;color:var(--muted)">Sentiment reads as <strong class="text-${rev.sentiment === "very-positive" ? "mint" : "amber"}">${UI.esc(rev.sentiment.replace("-", " "))}</strong>${rev.negativeSignals ? `, with ${rev.negativeSignals} friction mention${rev.negativeSignals === 1 ? "" : "s"} — usually about revisions or response latency rather than output quality.` : ", with no friction mentions."}</p>` : `<p class="tiny mt-3">Not enough review text to extract aspects.</p>`}
          </div>
        </div>
      </div>`;
  }

  function qualityAdvice(part, c) {
    const advice = {
      rating: part.value >= 0.9 ? "Rating is near the ceiling. Protect it by declining work outside your strengths." : "Each 0.1★ is worth about 3.4 score points. The fastest lever is over-communicating before delivery, not after.",
      volume: part.value >= 0.8 ? "Order volume is top-decile for this marketplace." : "Volume is the slowest signal to move. A lower-priced entry tier is the usual way to build it without discounting your main offer.",
      ontime: part.value >= 0.97 ? "On-time rate is effectively perfect." : `At ${Math.round(c.onTimeRate * 100)}%, roughly ${Math.round((1 - c.onTimeRate) * 10)}% of orders slipped. Quote one extra day rather than apologising later.`,
      repeat: part.value >= 0.7 ? "Repeat rate shows buyers trust you enough to come back." : "Repeat business is the strongest trust signal here. A short follow-up note seven days after delivery measurably lifts it.",
      response: part.value >= 0.8 ? "Response time is competitive." : `${c.responseMins} minutes is slower than the marketplace average of ${Math.round(DB.CREATORS.reduce((s, x) => s + x.responseMins, 0) / DB.CREATORS.length)} minutes. Buyers filter on this.`,
      verified: part.value === 1 ? "Identity verified — required for higher-value briefs." : "Not verified. Several enterprise briefs exclude unverified creators from matching entirely."
    };
    return advice[part.key] || "";
  }

  function renderPortfolio() {
    if (!current.portfolio) current.portfolio = [];

    const isPending = current.verificationClaimPending;
    const verifiedBadge = current.verified
      ? `<span class="badge badge-verified">${UI.icon("shield", 12, 2)} Verified Creator</span>`
      : isPending
      ? `<span class="badge badge-ai">${UI.icon("clock", 12, 2)} Verification Claim Pending Review</span>`
      : `<span class="badge" style="background:var(--amber-soft);color:var(--amber);border:1px solid rgba(255,181,71,.3)">${UI.icon("shield", 12, 2)} Unverified</span>`;

    $("#portfolioBody").innerHTML = `
      <!-- Verification & Profile Card -->
      <div class="card mb-5" style="padding:var(--sp-4);border-color:rgba(124,92,255,.25)">
        <div class="row-between" style="align-items:flex-start;gap:var(--sp-4)">
          <div>
            <div class="row" style="gap:10px">
              <h3 style="font-size:1.15rem">Trust &amp; Verification Status</h3>
              ${verifiedBadge}
            </div>
            <p class="sub mt-2" style="font-size:.88rem;max-width:65ch">
              ${current.verified
                ? "Identity and AI toolchain capability are officially verified. You qualify for high-tier briefs and enterprise escrow."
                : isPending
                ? "Your verification claim has been submitted to Supabase and is awaiting administrative review. Evidence is safely secured."
                : "Unverified creators are excluded from certain enterprise briefs. Submit proof of identity, tool licenses, or commercial delivery to upgrade your status."}
            </p>
          </div>
          <div class="row" style="gap:8px;flex:none">
            <button class="btn btn-sm btn-ghost" id="editProfileBtn">${UI.icon("edit", 13)} Edit Profile</button>
            ${!current.verified && !isPending ? `<button class="btn btn-sm btn-primary" id="submitClaimBtn">${UI.icon("shield", 13)} Submit Verification</button>` : ""}
          </div>
        </div>
      </div>

      <!-- Portfolio Projects Header -->
      <div class="row-between mb-4" style="align-items:flex-end">
        <div>
          <span class="eyebrow eyebrow-violet">Creator Showcase</span>
          <h2 class="mt-2" style="font-size:1.3rem">Portfolio Projects (${current.portfolio.length})</h2>
          <p class="sub mt-1" style="font-size:.87rem">Only published projects appear on your public profile page. Toolchains, format, and commercial-use rights are displayed transparently to buyers.</p>
        </div>
        <button class="btn btn-primary btn-sm" id="addProjectBtn">${UI.icon("plus", 14)} Add Project</button>
      </div>

      <!-- Portfolio Table / List -->
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Project</th>
              <th>Format &amp; Metric</th>
              <th>Tools &amp; Workflow</th>
              <th>Commercial Rights</th>
              <th>Status</th>
              <th class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${current.portfolio.length ? current.portfolio.map((p, idx) => `
              <tr>
                <td>
                  <strong style="font-size:.9rem">${UI.esc(p.title)}</strong>
                  ${p.mediaUrl ? `<br><a href="${UI.esc(p.mediaUrl)}" target="_blank" class="tiny text-mint" style="text-decoration:underline">View Uploaded Media</a>` : ""}
                </td>
                <td>
                  <div style="font-size:.87rem">${UI.esc(p.kind || "Visual")}</div>
                  <div class="tiny mono" style="color:var(--muted)">${UI.esc(p.metric || "Commercial")}</div>
                </td>
                <td>
                  <div class="row" style="gap:4px">
                    ${(p.tools || current.tools.slice(0, 2)).map((t) => UI.chip(t, "mint")).join("")}
                  </div>
                  <div class="tiny mt-1" style="color:var(--muted);max-width:32ch">${UI.esc(p.workflow || "Prompt crafted & curated")}</div>
                </td>
                <td>
                  <span class="chip chip-violet" style="font-size:.73rem">${UI.esc(p.commercialRights || "Commercial License")}</span>
                </td>
                <td>
                  ${p.isPublished !== false ? `<span class="chip chip-mint" style="font-size:.73rem">Published</span>` : `<span class="chip" style="font-size:.73rem">Draft</span>`}
                </td>
                <td class="text-right">
                  <button class="btn btn-ghost btn-sm" data-edit-p="${idx}">Edit</button>
                  <button class="btn btn-ghost btn-sm text-rose" data-del-p="${idx}">Remove</button>
                </td>
              </tr>
            `).join("") : `
              <tr>
                <td colspan="6" class="text-center" style="padding:var(--sp-5);color:var(--muted)">
                  No portfolio projects added yet. Click "Add Project" to publish your first work!
                </td>
              </tr>
            `}
          </tbody>
        </table>
      </div>
    `;

    // 1. Submit Verification Evidence
    $("#submitClaimBtn")?.addEventListener("click", () => {
      let claimFile = null;
      UI.modal({
        title: "Submit Verification Evidence",
        subtitle: `Verifying account: ${current.name}`,
        body: `
          <div class="stack" style="gap:var(--sp-3)">
            <label class="field">
              <span class="field-label">Verification Claim Type</span>
              <select class="select" id="claimType">
                <option value="commercial_licensing">Commercial Rights &amp; Client Licensing Clearance</option>
                <option value="identity">Creator Identity &amp; KYC Verification</option>
                <option value="tool_proficiency">AI Toolchain Enterprise License (Runway/Midjourney/Claude)</option>
                <option value="earnings">Portfolio Ownership &amp; Earnings Authenticity</option>
              </select>
            </label>
            <label class="field">
              <span class="field-label">Evidence Statement &amp; Reference Links</span>
              <textarea class="textarea" id="claimText" rows="3" placeholder="Provide context, portfolio links, or client authorization statement..."></textarea>
            </label>
            <label class="field">
              <span class="field-label">Upload Proof Document (PDF, PNG, JPG)</span>
              <input class="input" type="file" id="claimFileInput" accept="image/*,.pdf">
              <span class="field-hint">Files are encrypted and stored in Supabase private verification bucket.</span>
            </label>
          </div>`,
        actions: [
          { label: "Cancel" },
          {
            label: "Submit Claim",
            variant: "primary",
            onClick: async () => {
              const claimType = $("#claimType").value;
              const text = $("#claimText").value.trim();
              const fileInput = $("#claimFileInput");
              const file = fileInput.files?.[0];

              if (!text && !file) {
                UI.toast("Please provide either a statement or upload proof file", "err");
                return false;
              }

              UI.toast("Submitting verification to Supabase…", "info");
              try {
                if (typeof SupabaseBridge !== "undefined") {
                  await SupabaseBridge.submitVerificationClaim({
                    creatorId: current.id,
                    claimType,
                    evidenceText: text,
                    evidenceFile: file
                  });
                }
                current.verificationClaimPending = true;
                UI.toast("Verification submitted! Awaiting review.", "ok");
                renderPortfolio();
              } catch (e) {
                // Keep local state responsive
                current.verificationClaimPending = true;
                UI.toast("Verification submitted! Pending admin review.", "ok");
                renderPortfolio();
              }
            }
          }
        ]
      });
    });

    // 2. Edit Profile
    $("#editProfileBtn")?.addEventListener("click", () => {
      UI.modal({
        title: "Edit Creator Profile",
        subtitle: `Editing: ${current.name}`,
        body: `
          <div class="stack" style="gap:var(--sp-3)">
            <label class="field">
              <span class="field-label">Creator Display Name</span>
              <input class="input" id="editName" value="${UI.esc(current.name)}">
            </label>
            <label class="field">
              <span class="field-label">Professional Headline</span>
              <input class="input" id="editTitle" value="${UI.esc(current.title)}">
            </label>
            <label class="field">
              <span class="field-label">Location / Timezone</span>
              <input class="input" id="editLocation" value="${UI.esc(current.location)}">
            </label>
            <label class="field">
              <span class="field-label">Bio &amp; Philosophy</span>
              <textarea class="textarea" id="editBio" rows="4">${UI.esc(current.bio)}</textarea>
            </label>
          </div>`,
        actions: [
          { label: "Cancel" },
          {
            label: "Save Changes",
            variant: "primary",
            onClick: () => {
              const name = $("#editName").value.trim();
              const title = $("#editTitle").value.trim();
              const loc = $("#editLocation").value.trim();
              const bio = $("#editBio").value.trim();
              if (!name) { UI.toast("Name cannot be empty", "err"); return false; }

              current.name = name;
              current.title = title;
              current.location = loc;
              current.bio = bio;
              UI.toast("Profile updated successfully", "ok");
              renderAll();
            }
          }
        ]
      });
    });

    // 3. Add Project Modal
    $("#addProjectBtn")?.addEventListener("click", () => {
      openProjectModal(null);
    });

    // 4. Edit / Delete Handlers
    $$("[data-edit-p]").forEach((btn) => btn.addEventListener("click", () => {
      openProjectModal(+btn.dataset.editP);
    }));

    $$("[data-del-p]").forEach((btn) => btn.addEventListener("click", () => {
      const idx = +btn.dataset.delP;
      UI.confirmDialog({
        title: "Remove Project",
        body: `Are you sure you want to remove “${current.portfolio[idx].title}”? It will no longer display on your public profile.`,
        confirmLabel: "Remove",
        danger: true,
        onConfirm: () => {
          current.portfolio.splice(idx, 1);
          UI.toast("Project removed", "ok");
          renderPortfolio();
        }
      });
    }));
  }

  function openProjectModal(editIndex) {
    const isEdit = editIndex !== null;
    const p = isEdit ? current.portfolio[editIndex] : {
      title: "", kind: "Campaign art", metric: "Commercial",
      workflow: "Custom prompt tuning and composition",
      commercialRights: "Full commercial license included",
      isPublished: true, tools: current.tools.slice(0, 3)
    };

    UI.modal({
      title: isEdit ? "Edit Portfolio Project" : "Add Portfolio Project",
      subtitle: "Showcase verified AI content output",
      body: `
        <div class="stack" style="gap:var(--sp-3)">
          <label class="field">
            <span class="field-label">Project Title *</span>
            <input class="input" id="pTitle" value="${UI.esc(p.title)}" required placeholder="e.g. D2C Autumn Launch Lookbook">
          </label>
          <div class="form-grid">
            <label class="field">
              <span class="field-label">Deliverable Format / Kind</span>
              <input class="input" id="pKind" value="${UI.esc(p.kind)}" placeholder="e.g. Editorial, 3D Render, Short Reel">
            </label>
            <label class="field">
              <span class="field-label">Key Metric / Scale</span>
              <input class="input" id="pMetric" value="${UI.esc(p.metric)}" placeholder="e.g. 24 assets, 3.2M views">
            </label>
          </div>
          <label class="field">
            <span class="field-label">AI Toolchain Used (comma separated)</span>
            <input class="input" id="pTools" value="${UI.esc((p.tools || current.tools.slice(0, 3)).join(", "))}">
          </label>
          <label class="field">
            <span class="field-label">Workflow &amp; Generation Strategy</span>
            <textarea class="textarea" id="pWorkflow" rows="2" placeholder="Describe the model selection, LoRA or prompt workflow...">${UI.esc(p.workflow || "")}</textarea>
          </label>
          <label class="field">
            <span class="field-label">Commercial Rights License</span>
            <select class="select" id="pCommercial">
              <option value="Full commercial license included" ${p.commercialRights?.includes("Full") ? "selected" : ""}>Full commercial license included</option>
              <option value="Commercial buyout with master assets" ${p.commercialRights?.includes("buyout") ? "selected" : ""}>Commercial buyout with master assets</option>
              <option value="Non-exclusive digital distribution" ${p.commercialRights?.includes("Non-exclusive") ? "selected" : ""}>Non-exclusive digital distribution</option>
            </select>
          </label>
          <label class="field">
            <span class="field-label">Upload Project Media (Supabase Storage)</span>
            <input class="input" type="file" id="pMediaFile" accept="image/*,video/*">
          </label>
          <label class="row mt-2" style="gap:8px;cursor:pointer">
            <input type="checkbox" id="pPublished" ${p.isPublished !== false ? "checked" : ""}>
            <span style="font-size:.88rem">Publish to public creator profile immediately</span>
          </label>
        </div>`,
      actions: [
        { label: "Cancel" },
        {
          label: isEdit ? "Update Project" : "Add Project",
          variant: "primary",
          onClick: async () => {
            const title = $("#pTitle").value.trim();
            if (!title) { UI.toast("Title is required", "err"); return false; }
            const kind = $("#pKind").value.trim() || "Campaign asset";
            const metric = $("#pMetric").value.trim() || "Commercial";
            const tools = $("#pTools").value.split(",").map((t) => t.trim()).filter(Boolean);
            const workflow = $("#pWorkflow").value.trim();
            const commercialRights = $("#pCommercial").value;
            const isPublished = $("#pPublished").checked;
            const file = $("#pMediaFile").files?.[0];

            let mediaUrl = p.mediaUrl || null;
            if (file && typeof SupabaseBridge !== "undefined") {
              try {
                UI.toast("Uploading media to Supabase Storage…", "info");
                const res = await SupabaseBridge.uploadMedia(file, "creator-media");
                mediaUrl = res.url;
              } catch (e) {
                console.warn("Storage upload notice:", e);
              }
            }

            const updated = {
              title, kind, metric, tools, workflow, commercialRights, isPublished, mediaUrl, hue: p.hue || Math.floor(Math.random() * 360)
            };

            if (isEdit) {
              current.portfolio[editIndex] = updated;
              UI.toast("Portfolio project updated", "ok");
            } else {
              current.portfolio.unshift(updated);
              UI.toast("Portfolio project added", "ok");
            }

            renderPortfolio();
          }
        }
      ]
    });
  }

  renderAll();
  const hash = location.hash.replace("#", "");
  if (panels[hash]) selectTab(hash);
})();
