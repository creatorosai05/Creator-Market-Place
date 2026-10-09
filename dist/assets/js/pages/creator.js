/* Creator profile */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const root = $("#profileRoot");
  const id = UI.qs("id");
  const creator = DB.byId.creator[id];

  if (!creator) {
    root.innerHTML = UI.empty({
      title: "Creator not found",
      body: "That profile does not exist in this marketplace catalogue.",
      icon: "x",
      cta: `<a class="btn btn-primary btn-sm" href="creators.html">Browse all creators</a>`
    });
    return;
  }

  document.title = `${creator.name} — ${creator.title} · CreatorMatch AI`;
  const q = AI.qualityScore(creator);
  const rev = AI.summariseReviews(creator);
  const gigs = DB.gigsOf(creator.id);
  const from = Math.min(...gigs.map((g) => DB.LOWEST(g)));
  const totalOrders = gigs.reduce((s, g) => s + g.orders, 0);
  const isSaved = Store.isSaved(creator.id);

  const ASPECT_LABEL = { speed: "Speed", quality: "Output quality", communication: "Communication", value: "Business results", revisions: "Revisions", strategy: "Strategic input" };

  const similar = DB.CREATORS
    .filter((c) => c.id !== creator.id && c.categories.some((x) => creator.categories.includes(x)))
    .map((c) => ({ c, overlap: c.categories.filter((x) => creator.categories.includes(x)).length + c.tools.filter((t) => creator.tools.includes(t)).length * 0.5 }))
    .sort((a, b) => b.overlap - a.overlap)
    .slice(0, 3)
    .map((x) => x.c);

  root.innerHTML = `
  <nav class="tiny mb-4" aria-label="Breadcrumb">
    <a href="creators.html" style="color:var(--muted)">Creators</a>
    <span style="color:var(--dim)"> / </span>
    <a href="creators.html?category=${creator.categories[0]}" style="color:var(--muted)">${UI.esc(DB.byId.category[creator.categories[0]].name)}</a>
    <span style="color:var(--dim)"> / </span>
    <span>${UI.esc(creator.name)}</span>
  </nav>

  <!-- Header -->
  <section class="card mb-5" style="padding:0;overflow:hidden">
    <div style="height:96px;background:${UI.tileBg(creator.hue)};position:relative">
      <div style="position:absolute;inset:0;background:linear-gradient(180deg,transparent,rgba(7,8,12,.55))"></div>
    </div>
    <div style="padding:0 var(--sp-5) var(--sp-5);margin-top:-42px">
      <div class="row-between" style="align-items:flex-end;gap:var(--sp-4)">
        <div class="row" style="gap:var(--sp-4);align-items:flex-end">
          <span class="avatar avatar-xl${creator.online ? " avatar-online" : ""}" style="background:${UI.avatarBg(creator.hue)};border:4px solid var(--ink-800);box-shadow:var(--shadow-lg)">${UI.esc(UI.initials(creator.name))}</span>
          <div style="padding-bottom:6px">
            <div class="row" style="gap:8px">
              <h1 style="font-size:clamp(1.4rem,3vw,1.95rem)">${UI.esc(creator.name)}</h1>
              ${creator.verified ? `<span class="badge badge-verified">${UI.icon("shield", 11, 2.2)} Verified</span>` : ""}
              ${creator.online ? `<span class="status status-open"><span class="dot"></span> Online</span>` : `<span class="status"><span class="dot dot-dim"></span> Away</span>`}
            </div>
            <p class="sub" style="font-size:.93rem">${UI.esc(creator.title)}</p>
            <div class="row mt-2" style="gap:var(--sp-4)">
              ${UI.stars(creator.rating, creator.reviews)}
              <span class="tiny">${UI.esc(creator.location)}</span>
              <span class="tiny mono">${UI.esc(creator.timezone)}</span>
              <span class="tiny">Member since ${new Date(creator.memberSince + "-01").toLocaleDateString("en-IN", { month: "short", year: "numeric" })}</span>
            </div>
          </div>
        </div>
        <div class="row" style="gap:8px;padding-bottom:6px">
          <button class="btn btn-icon" id="saveBtn" aria-pressed="${isSaved}" title="${isSaved ? "Remove from shortlist" : "Save to shortlist"}" style="${isSaved ? "color:var(--mint);border-color:rgba(0,229,195,.35)" : ""}">${UI.icon("bookmark", 15, isSaved ? 0 : 1.75)}</button>
          <button class="btn" id="contactBtn">Contact</button>
          <a class="btn btn-primary" href="#listings">View listings</a>
        </div>
      </div>

      <div class="grid g-4 mt-5" style="gap:var(--sp-3)">
        <div class="stat"><span class="k">Completed orders</span><span class="v">${UI.compact(creator.completedOrders)}</span><span class="d">${totalOrders.toLocaleString("en-IN")} through this marketplace</span></div>
        <div class="stat"><span class="k">On-time delivery</span><span class="v text-mint">${Math.round(creator.onTimeRate * 100)}%</span><span class="d">Across all completed work</span></div>
        <div class="stat"><span class="k">Repeat clients</span><span class="v">${Math.round(creator.repeatClientRate * 100)}%</span><span class="d">Buyers who ordered again</span></div>
        <div class="stat"><span class="k">Response time</span><span class="v">${creator.responseMins}<span style="font-size:.9rem"> min</span></span><span class="d">Typical first reply</span></div>
      </div>
    </div>
  </section>

  <div class="split">
    <div class="stack" style="gap:var(--sp-5)">
      <!-- About -->
      <section class="card" id="about">
        <h2 style="font-size:1.15rem">About</h2>
        <p class="sub mt-3">${UI.esc(creator.bio)}</p>
        <hr class="divider">
        <div class="grid g-2" style="gap:var(--sp-4)">
          <div>
            <span class="field-label">Categories</span>
            <div class="row" style="gap:5px">${creator.categories.map((c) => UI.chip(DB.byId.category[c].name, "violet")).join("")}</div>
          </div>
          <div>
            <span class="field-label">Industry niches</span>
            <div class="row" style="gap:5px">${creator.niches.map((n) => UI.chip(DB.NICHES.find((x) => x.id === n).name)).join("")}</div>
          </div>
          <div>
            <span class="field-label">AI toolchain</span>
            <div class="row" style="gap:5px">${creator.tools.map((t) => UI.chip(t, "mint")).join("")}</div>
          </div>
          <div>
            <span class="field-label">Languages</span>
            <div class="row" style="gap:5px">${creator.languages.map((l) => UI.chip(l)).join("")}</div>
          </div>
        </div>
      </section>

      <!-- Listings -->
      <section id="listings">
        <div class="row-between mb-4" style="align-items:flex-end">
          <div>
            <span class="eyebrow">Active listings</span>
            <h2 class="mt-2" style="font-size:1.25rem">${gigs.length} ways to work together</h2>
          </div>
          <span class="tiny">Starting from <strong class="mono" style="color:var(--text)">${UI.money(from)}</strong></span>
        </div>
        <div class="stack" style="gap:var(--sp-4)">
          ${gigs.map((g) => {
            const cat = DB.byId.category[g.category];
            return `<article class="card card-hover" style="padding:var(--sp-4)">
              <div class="row-between" style="align-items:flex-start;gap:var(--sp-4)">
                <div class="grow" style="min-width:0">
                  <div class="row" style="gap:6px;margin-bottom:8px">
                    ${UI.chip(cat.short, "violet")}
                    ${g.trending ? `<span class="badge badge-hot">Trending</span>` : ""}
                    <span class="tiny">${UI.compact(g.views)} views · ${g.queue} in queue</span>
                  </div>
                  <h3 style="font-size:1.04rem"><a href="gig.html?id=${g.id}">${UI.esc(g.title)}</a></h3>
                  <p class="sub mt-2 clamp-2" style="font-size:.86rem">${UI.esc(g.summary)}</p>
                  <div class="row mt-3" style="gap:var(--sp-4)">${UI.stars(g.rating, g.reviews)}<span class="tiny">${UI.compact(g.orders)} orders</span><span class="tiny">${UI.icon("clock", 11, 2)} ${g.packages.basic.deliveryDays}–${g.packages.premium.deliveryDays} days</span></div>
                </div>
                <div style="text-align:right;flex:none">
                  <div class="tiny">From</div>
                  <div class="num" style="font-size:1.3rem">${UI.money(DB.LOWEST(g))}</div>
                  <a class="btn btn-primary btn-sm mt-3" href="gig.html?id=${g.id}">View &amp; hire</a>
                </div>
              </div>
              <div class="row mt-3" style="gap:5px;padding-top:var(--sp-3);border-top:1px solid var(--line)">
                ${Object.values(g.packages).map((p) => `<span class="chip">${UI.esc(p.name)} · ${UI.compactMoney(p.price)}</span>`).join("")}
              </div>
            </article>`;
          }).join("")}
        </div>
      </section>

      <!-- Portfolio -->
      <section id="portfolioSection">
        <div class="row-between mb-4" style="align-items:flex-end">
          <div>
            <span class="eyebrow">Verified AI output</span>
            <h2 class="mt-2" style="font-size:1.25rem">Portfolio &amp; Commercial Rights</h2>
          </div>
          <span class="tiny">All shown work includes commercial clearance and workflow metadata</span>
        </div>
        <div class="grid g-3">
          ${(creator.portfolio || []).filter((p) => p.isPublished !== false).map((p, idx) => `
            <article class="card card-hover" style="padding:var(--sp-4);cursor:pointer" data-view-portfolio="${idx}">
              <figure class="tile mb-3" style="--tile-bg:${UI.tileBg(p.hue || 220)};height:120px">
                <span class="tile-glyph">${UI.esc(UI.initials(p.kind))}</span>
                <span class="tile-metric">${UI.esc(p.metric || "Commercial")}</span>
              </figure>
              <h3 style="font-size:.95rem">${UI.esc(p.title)}</h3>
              <div class="tiny mt-1 text-dim">${UI.esc(p.kind || "Deliverable")}</div>
              
              <div class="row mt-2" style="gap:4px">
                ${(p.tools || creator.tools.slice(0, 2)).map((t) => UI.chip(t, "mint")).join("")}
              </div>

              <div class="mt-3 pt-2" style="border-top:1px solid var(--line);display:flex;align-items:center;justify-content:space-between">
                <span class="chip chip-violet" style="font-size:.7rem">${UI.esc(p.commercialRights || "Commercial license included")}</span>
                <span class="tiny text-mint">${UI.icon("spark", 10, 2)} Details</span>
              </div>
            </article>
          `).join("")}
        </div>
      </section>

      <!-- Reviews -->
      <section id="reviews">
        <div class="row-between mb-4" style="align-items:flex-end">
          <div>
            <span class="eyebrow">Buyer feedback</span>
            <h2 class="mt-2" style="font-size:1.25rem">${creator.reviews} reviews</h2>
          </div>
          ${UI.stars(creator.rating, null)}
        </div>

        ${rev.aspects.length ? `<div class="card card-pad-sm mb-4">
          <div class="row" style="gap:8px;margin-bottom:12px">
            <span class="text-violet">${UI.icon("spark", 15, 2)}</span>
            <span class="tiny" style="font-weight:600;text-transform:uppercase;letter-spacing:.09em;color:var(--muted)">What buyers mention</span>
            <span class="chip chip-${rev.sentiment === "very-positive" ? "mint" : rev.sentiment === "mixed-positive" ? "amber" : "violet"}" style="margin-left:auto">${UI.esc(rev.sentiment.replace("-", " "))}</span>
          </div>
          <div class="stack" style="gap:9px">
            ${rev.aspects.map((a) => `<div>
              <div class="spread" style="gap:10px"><span style="font-size:.84rem;font-weight:550">${UI.esc(ASPECT_LABEL[a.name] || a.name)}</span><span class="tiny mono">${a.mentions} mention${a.mentions === 1 ? "" : "s"}</span></div>
              <div class="mt-1">${UI.bar(a.mentions, Math.max(...rev.aspects.map((x) => x.mentions)))}</div>
            </div>`).join("")}
          </div>
        </div>` : ""}

        <div class="stack" style="gap:var(--sp-3)">
          ${creator.reviewList.map((r) => `<article class="card card-flat card-pad-sm">
            <div class="row-between" style="gap:10px">
              <div class="row" style="gap:9px">
                <span class="avatar avatar-xs" style="background:${UI.avatarBg((r.author.charCodeAt(0) * 7) % 360)}">${UI.esc(UI.initials(r.author))}</span>
                <div>
                  <div style="font-size:.87rem;font-weight:600">${UI.esc(r.author)} <span class="tiny" style="font-weight:400">· ${UI.esc(r.company)}</span></div>
                  <div class="tiny">${UI.date(new Date(r.when).getTime())} · ${UI.esc(r.gig)}</div>
                </div>
              </div>
              <span class="stars">${UI.icon("star", 12, 0)}<span class="n">${r.rating}.0</span></span>
            </div>
            <p class="sub mt-3" style="font-size:.88rem">${UI.esc(r.text)}</p>
          </article>`).join("")}
        </div>
      </section>
    </div>

    <!-- Sidebar -->
    <aside class="stack" style="gap:var(--sp-4);position:sticky;top:82px">
      <div class="ai-panel card-pad-sm">
        <div class="row" style="gap:10px">
          ${UI.scoreRing(q.score, "score-ring-lg", "Quality score")}
          <div>
            <span class="eyebrow">Quality score</span>
            <div class="num mt-1" style="font-size:1.5rem">${q.grade}</div>
            <span class="chip chip-${q.band.color} mt-2">${UI.esc(q.band.label)}</span>
          </div>
        </div>
        <hr class="divider">
        <div class="stack" style="gap:11px">
          ${q.parts.map((p) => `<div>
            <div class="spread" style="gap:10px">
              <span style="font-size:.82rem;font-weight:550">${UI.esc(p.label)} <span class="tiny" style="font-weight:400">· ${p.weight}%</span></span>
              <span class="tiny mono">${UI.esc(p.detail)}</span>
            </div>
            <div class="mt-1">${UI.bar(p.value * 100)}</div>
          </div>`).join("")}
        </div>
      </div>

      <div class="card card-pad-sm">
        <h3 style="font-size:.95rem">Availability</h3>
        <div class="stack mt-3" style="gap:10px;font-size:.85rem">
          <div class="spread"><span class="text-muted">Standard delivery</span><strong class="mono">${creator.deliveryDays} days</strong></div>
          <div class="spread"><span class="text-muted">Current queue</span><strong class="mono">${Math.min(...gigs.map((g) => g.queue))} orders</strong></div>
          <div class="spread"><span class="text-muted">Price tier</span><strong class="mono">${["Budget", "Mid-range", "Premium"][creator.priceLevel - 1]}</strong></div>
          <div class="spread"><span class="text-muted">Repeat rate</span><strong class="mono">${Math.round(creator.repeatClientRate * 100)}%</strong></div>
          <div class="spread"><span class="text-muted">Escrow protected</span><strong class="text-mint">Yes</strong></div>
        </div>
        <a class="btn btn-primary btn-block mt-4" href="gig.html?id=${gigs[0].id}">Start with ${UI.esc(gigs[0].packages.basic.name)} tier</a>
        <button class="btn btn-ghost btn-block mt-2" id="matchBtn">Check fit for my brief</button>
      </div>

      ${similar.length ? `<div class="card card-pad-sm">
        <h3 style="font-size:.95rem">Similar creators</h3>
        <div class="stack mt-3" style="gap:11px">
          ${similar.map((c) => `<a href="creator.html?id=${c.id}" class="row" style="gap:10px;flex-wrap:nowrap">
            ${UI.avatar(c, "sm")}
            <div class="grow" style="min-width:0">
              <div class="truncate" style="font-size:.87rem;font-weight:600">${UI.esc(c.name)}</div>
              <div class="tiny truncate">${UI.esc(c.title)}</div>
            </div>
            <span class="tiny mono text-mint">${AI.qualityScore(c).score}</span>
          </a>`).join("")}
        </div>
      </div>` : ""}
    </aside>
  </div>`;

  /* ---------- Interactions ---------- */
  $("#saveBtn").addEventListener("click", () => {
    const now = Store.toggleSaved(creator.id);
    const b = $("#saveBtn");
    b.setAttribute("aria-pressed", String(now));
    b.style.color = now ? "var(--mint)" : "";
    b.style.borderColor = now ? "rgba(0,229,195,.35)" : "";
    b.innerHTML = UI.icon("bookmark", 15, now ? 0 : 1.75);
    UI.toast(now ? `${creator.name} added to your shortlist` : `${creator.name} removed from shortlist`, now ? "ok" : "info");
  });

  $("#contactBtn").addEventListener("click", () => {
    UI.modal({
      title: `Message ${creator.name}`,
      subtitle: `Typically replies within ${creator.responseMins} minutes`,
      body: `<label class="field"><span class="field-label">Your message</span>
        <textarea class="textarea" id="msgText" rows="5" autofocus placeholder="Hi ${UI.esc(creator.name.split(" ")[0])}, I have a project that needs…"></textarea></label>
        <p class="tiny mt-3">This demo stores the message locally. A production build would route it through the platform messaging service with the brief attached.</p>`,
      actions: [{ label: "Cancel" }, {
        label: "Send message", variant: "primary",
        onClick: () => {
          const t = $("#msgText").value.trim();
          if (!t) { UI.toast("Write a message first", "err"); return false; }
          UI.toast(`Message queued for ${creator.name}`, "ok");
        }
      }]
    });
  });

  $("#matchBtn").addEventListener("click", () => {
    const openBriefs = Store.openBriefs();
    UI.modal({
      title: "Check fit against a brief",
      subtitle: "The same seven-factor scoring used in brief matching",
      wide: true,
      body: openBriefs.length
        ? `<label class="field"><span class="field-label">Choose a brief</span>
            <select class="select" id="fitBrief">${openBriefs.map((b) => `<option value="${b.id}">${UI.esc(b.title)}</option>`).join("")}</select></label>
           <div class="mt-4" id="fitResult"></div>`
        : `<p class="sub">You have no open briefs yet. Post one first and the matching engine will rank this creator against it.</p>
           <a class="btn btn-primary mt-4" href="brief.html">Post a brief</a>`,
      actions: openBriefs.length ? [{ label: "Close" }] : [{ label: "Close" }],
      onClose: null
    });
    const run = () => {
      const b = Store.brief($("#fitBrief").value);
      if (!b) return;
      const m = AI.scoreCreatorForBrief({ ...b, searchKeywords: AI.tokens(`${b.title} ${b.description || ""}`) }, creator);
      $("#fitResult").innerHTML = `<div class="ai-panel card-pad-sm">
        <div class="row" style="gap:12px">
          ${UI.scoreRing(m.score, "score-ring-lg", "Match score")}
          <div>
            <span class="eyebrow">Match score</span>
            <p class="sub mt-2" style="font-size:.87rem">${UI.esc(m.verdict.text)}</p>
          </div>
        </div>
        <hr class="divider">
        ${UI.factorList(m.factors)}
      </div>`;
    };
    if (openBriefs.length) {
      $("#fitBrief").addEventListener("change", run);
      run();
    }
  });

  // Portfolio detail modal
  root.querySelectorAll("[data-view-portfolio]").forEach((card) => {
    card.addEventListener("click", () => {
      const p = (creator.portfolio || []).filter((x) => x.isPublished !== false)[+card.dataset.viewPortfolio];
      if (!p) return;
      UI.modal({
        title: p.title,
        subtitle: `${p.kind || "Deliverable"} · ${creator.name}`,
        body: `
          <div class="stack" style="gap:var(--sp-4)">
            ${p.mediaUrl ? `<div class="card card-flat" style="padding:0;overflow:hidden"><img src="${UI.esc(p.mediaUrl)}" alt="${UI.esc(p.title)}" style="width:100%;max-height:260px;object-fit:cover"></div>` : ""}
            <div class="grid g-2" style="gap:var(--sp-3)">
              <div class="stat"><span class="k">Format</span><span class="v" style="font-size:1.1rem">${UI.esc(p.kind || "Visual")}</span></div>
              <div class="stat"><span class="k">Scope / Metric</span><span class="v" style="font-size:1.1rem">${UI.esc(p.metric || "Commercial")}</span></div>
            </div>
            <div>
              <span class="field-label">AI Toolchain</span>
              <div class="row" style="gap:5px">${(p.tools || creator.tools).map((t) => UI.chip(t, "mint")).join("")}</div>
            </div>
            <div>
              <span class="field-label">Generation Workflow &amp; Strategy</span>
              <p class="sub" style="font-size:.87rem;line-height:1.6">${UI.esc(p.workflow || "Model fine-tuning, prompt design and precision human touch-up.")}</p>
            </div>
            <div class="card card-pad-sm" style="border-color:rgba(124,92,255,.2)">
              <span class="eyebrow" style="font-size:.65rem">Commercial Rights Clearance</span>
              <div class="mt-2" style="font-weight:600;font-size:.9rem">${UI.esc(p.commercialRights || "Full commercial license included")}</div>
              <p class="tiny mt-1" style="color:var(--muted)">Verified for multi-channel commercial distribution, ads, and digital publishing.</p>
            </div>
          </div>`,
        actions: [{ label: "Close" }]
      });
    });
  });
})();
