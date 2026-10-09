/* Gig detail + hire flow */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const root = $("#gigRoot");
  const gig = DB.byId.gig[UI.qs("id")];

  if (!gig) {
    root.innerHTML = UI.empty({
      title: "Listing not found",
      body: "This listing is not part of the current catalogue.",
      icon: "x",
      cta: `<a class="btn btn-primary btn-sm" href="creators.html">Browse creators</a>`
    });
    return;
  }

  const creator = DB.byId.creator[gig.creatorId];
  const cat = DB.byId.category[gig.category];
  document.title = `${gig.title} · ${creator.name} — CreatorMatch AI`;

  let selectedPkg = "standard";
  const selectedAddons = new Set();

  const subtotal = () => gig.packages[selectedPkg].price + [...selectedAddons].map((i) => gig.addons[i].price).reduce((a, b) => a + b, 0);
  const fee = () => Math.round(subtotal() * 0.08);
  const total = () => subtotal() + fee();
  const delivery = () => Math.max(gig.packages[selectedPkg].deliveryDays, ...[...selectedAddons].map((i) => gig.addons[i].deliveryDays || 0));

  const similar = DB.GIGS.filter((g) => g.id !== gig.id && (g.category === gig.category || g.creatorId === gig.creatorId)).slice(0, 3);

  function render() {
    const p = gig.packages[selectedPkg];
    root.innerHTML = `
    <nav class="tiny mb-4" aria-label="Breadcrumb">
      <a href="creators.html" style="color:var(--muted)">Creators</a><span style="color:var(--dim)"> / </span>
      <a href="creator.html?id=${creator.id}" style="color:var(--muted)">${UI.esc(creator.name)}</a><span style="color:var(--dim)"> / </span>
      <span>${UI.esc(cat.short)}</span>
    </nav>

    <div class="split">
      <div class="stack" style="gap:var(--sp-5)">
        <header>
          <div class="row mb-3" style="gap:6px">
            ${UI.chip(cat.name, "violet")}
            ${gig.trending ? `<span class="badge badge-hot">${UI.icon("trend", 10, 2.4)} Trending</span>` : ""}
            <span class="tiny mono">${UI.compact(gig.views)} views</span>
            <span class="tiny mono">${UI.compact(gig.orders)} orders</span>
          </div>
          <h1 style="font-size:clamp(1.5rem,3.2vw,2.15rem)">${UI.esc(gig.title)}</h1>
          <div class="row mt-4" style="gap:var(--sp-4)">
            ${UI.stars(gig.rating, gig.reviews)}
            <span class="tiny">${gig.queue} orders in queue</span>
            <span class="tiny">${UI.icon("clock", 11, 2)} ${p.deliveryDays}-day delivery</span>
            <span class="tiny">${p.revisions} revision${p.revisions === 1 ? "" : "s"}</span>
          </div>
        </header>

        <!-- Creator strip -->
        <a class="card card-flat card-pad-sm card-hover" href="creator.html?id=${creator.id}" style="display:flex;gap:var(--sp-3);align-items:center">
          ${UI.avatar(creator, "sm")}
          <div class="grow" style="min-width:0">
            <div class="row" style="gap:6px">
              <strong style="font-size:.92rem">${UI.esc(creator.name)}</strong>
              ${creator.verified ? `<span class="badge badge-verified">${UI.icon("shield", 9, 2.4)}</span>` : ""}
              ${creator.online ? `<span class="status status-open" style="padding:2px 8px;font-size:.68rem"><span class="dot"></span> Online</span>` : ""}
            </div>
            <div class="tiny truncate">${UI.esc(creator.title)} · ${UI.esc(creator.location.split(",")[0])} · replies in ~${creator.responseMins} min</div>
          </div>
          <span class="text-mint">${UI.icon("arrow", 16, 2.2)}</span>
        </a>

        <!-- Packages -->
        <section aria-labelledby="pkgHeading">
          <h2 id="pkgHeading" style="font-size:1.2rem">Choose a package</h2>
          <div class="tabs mt-3" role="tablist" aria-label="Package tiers">
            ${Object.entries(gig.packages).map(([key, pkg]) => `
              <button class="tab" role="tab" data-pkg="${key}" aria-selected="${key === selectedPkg}" style="flex:1;text-align:left;line-height:1.35">
                <span style="display:block;font-size:.86rem;font-weight:650">${UI.esc(pkg.name)}</span>
                <span style="display:block;font-size:.76rem;opacity:.72" class="mono">${UI.money(pkg.price)}</span>
              </button>`).join("")}
          </div>

          <div class="card mt-4" style="border-color:rgba(124,92,255,.28)">
            <div class="row-between" style="align-items:flex-start;gap:var(--sp-4)">
              <div>
                <h3 style="font-size:1.05rem">${UI.esc(p.name)} <span class="tiny" style="font-weight:400">· ${UI.esc(p.units)}</span></h3>
                <div class="row mt-2" style="gap:var(--sp-4)">
                  <span class="tiny">${UI.icon("clock", 11, 2)} ${p.deliveryDays} day${p.deliveryDays === 1 ? "" : "s"}</span>
                  <span class="tiny">${UI.icon("edit", 11, 2)} ${p.revisions} revision${p.revisions === 1 ? "" : "s"}</span>
                  <span class="tiny">${UI.icon("shield", 11, 2)} Escrow protected</span>
                </div>
              </div>
              <div class="num" style="font-size:1.85rem">${UI.money(p.price)}</div>
            </div>
            <hr class="divider">
            <ul class="stack" style="gap:9px;list-style:none;padding:0">
              ${p.includes.map((i) => `<li class="row" style="gap:9px;flex-wrap:nowrap;font-size:.89rem">
                <span class="text-mint" style="flex:none">${UI.icon("check", 14, 2.6)}</span>${UI.esc(i)}
              </li>`).join("")}
            </ul>
          </div>
        </section>

        <!-- Add-ons -->
        ${gig.addons.length ? `<section>
          <h2 style="font-size:1.2rem">Add-ons</h2>
          <p class="sub mt-2" style="font-size:.88rem">Optional extras. Selection updates the total instantly.</p>
          <div class="stack mt-3" style="gap:9px">
            ${gig.addons.map((a, i) => `<label class="check card card-flat card-pad-sm" style="align-items:center">
              <input type="checkbox" data-addon="${i}" ${selectedAddons.has(i) ? "checked" : ""}>
              <span class="grow">${UI.esc(a.name)}${a.deliveryDays ? ` <span class="tiny">· +${a.deliveryDays}d</span>` : ""}</span>
              <strong class="mono" style="font-size:.88rem">+${UI.money(a.price)}</strong>
            </label>`).join("")}
          </div>
        </section>` : ""}

        <!-- What you get -->
        <section class="card">
          <h2 style="font-size:1.1rem">What you receive</h2>
          <ul class="stack mt-3" style="gap:9px;list-style:none;padding:0">
            ${gig.deliverables.map((d) => `<li class="row" style="gap:9px;flex-wrap:nowrap;font-size:.89rem">
              <span class="text-violet" style="flex:none">${UI.icon("doc", 14, 2)}</span>${UI.esc(d)}
            </li>`).join("")}
          </ul>
          <hr class="divider">
          <h3 style="font-size:.98rem">About this listing</h3>
          <p class="sub mt-2" style="font-size:.9rem">${UI.esc(gig.summary)}</p>
          <div class="row mt-4" style="gap:5px">${gig.tags.map((t) => `<a class="chip chip-btn" href="creators.html?q=${encodeURIComponent(t)}">${UI.esc(t)}</a>`).join("")}</div>
        </section>

        <!-- AI fit -->
        <section class="ai-panel" id="fit">
          <div class="row-between" style="align-items:flex-start">
            <div>
              <span class="eyebrow">${UI.icon("spark", 11, 2.4)} AI fit check</span>
              <h2 class="mt-2" style="font-size:1.2rem">Is this the right listing for your project?</h2>
            </div>
            <span class="badge badge-ai">Explainable</span>
          </div>
          <p class="sub mt-2" style="font-size:.89rem">Pick one of your open briefs and the engine will score ${UI.esc(creator.name.split(" ")[0])} against it with the same seven factors used everywhere else.</p>
          <div class="row mt-4" style="gap:8px">
            <select class="select" id="fitSelect" style="max-width:340px" aria-label="Select a brief">
              <option value="">Choose a brief…</option>
              ${Store.openBriefs().map((b) => `<option value="${b.id}">${UI.esc(b.title)}</option>`).join("")}
            </select>
            <a class="btn btn-ghost btn-sm" href="brief.html">Create a new brief</a>
          </div>
          <div class="mt-4" id="fitOut"></div>
        </section>

        <!-- Reviews -->
        <section>
          <h2 style="font-size:1.2rem">Buyer reviews</h2>
          <div class="stack mt-3" style="gap:var(--sp-3)">
            ${creator.reviewList.map((r) => `<article class="card card-flat card-pad-sm">
              <div class="row-between" style="gap:10px">
                <div class="row" style="gap:9px">
                  <span class="avatar avatar-xs" style="background:${UI.avatarBg((r.author.charCodeAt(0) * 7) % 360)}">${UI.esc(UI.initials(r.author))}</span>
                  <div><div style="font-size:.86rem;font-weight:600">${UI.esc(r.author)} <span class="tiny" style="font-weight:400">· ${UI.esc(r.company)}</span></div>
                  <div class="tiny">${UI.date(new Date(r.when).getTime())}</div></div>
                </div>
                <span class="stars">${UI.icon("star", 12, 0)}<span class="n">${r.rating}.0</span></span>
              </div>
              <p class="sub mt-3" style="font-size:.87rem">${UI.esc(r.text)}</p>
            </article>`).join("")}
          </div>
        </section>

        ${similar.length ? `<section>
          <h2 style="font-size:1.2rem">Related listings</h2>
          <div class="grid g-3 mt-3">${similar.map((g) => UI.gigCard(g)).join("")}</div>
        </section>` : ""}
      </div>

      <!-- Sticky buy box -->
      <aside class="stack" style="gap:var(--sp-4);position:sticky;top:82px">
        <div class="card">
          <div class="row-between">
            <div>
              <div class="tiny">${UI.esc(p.name)} package</div>
              <div class="num" style="font-size:2rem">${UI.money(total())}</div>
            </div>
            <span class="chip chip-mint">${UI.icon("clock", 11, 2)} ${delivery()} day${delivery() === 1 ? "" : "s"}</span>
          </div>

          <div class="stack mt-4" style="gap:7px;font-size:.85rem">
            <div class="spread"><span class="text-muted">Package</span><span class="mono">${UI.money(gig.packages[selectedPkg].price)}</span></div>
            ${[...selectedAddons].map((i) => `<div class="spread"><span class="text-muted">${UI.esc(gig.addons[i].name)}</span><span class="mono">+${UI.money(gig.addons[i].price)}</span></div>`).join("")}
            <div class="spread" style="padding-top:7px;border-top:1px solid var(--line)"><span class="text-muted">Platform fee (8%)</span><span class="mono">${UI.money(fee())}</span></div>
            <div class="spread" style="font-weight:650"><span>Total</span><span class="mono" style="font-size:1.02rem">${UI.money(total())}</span></div>
          </div>

          <button class="btn btn-primary btn-block btn-lg mt-4" id="hireBtn">Continue to hire</button>
          <button class="btn btn-ghost btn-block mt-2" id="saveBtn2" aria-pressed="${Store.isSaved(creator.id)}">
            ${UI.icon("bookmark", 14, Store.isSaved(creator.id) ? 0 : 1.75)} ${Store.isSaved(creator.id) ? "Saved" : "Save creator"}
          </button>

          <div class="stack mt-4" style="gap:8px;padding-top:var(--sp-4);border-top:1px solid var(--line)">
            ${[["shield", "Payment held in escrow until you approve"], ["edit", `${p.revisions} revision${p.revisions === 1 ? "" : "s"} included`], ["clock", `${creator.responseMins} min typical response`], ["check", "Full usage rights on delivery"]].map(([ic, txt]) => `<div class="row" style="gap:8px;flex-wrap:nowrap"><span class="text-mint" style="flex:none">${UI.icon(ic, 13, 2.2)}</span><span class="tiny" style="line-height:1.45">${UI.esc(txt)}</span></div>`).join("")}
          </div>
        </div>

        <div class="ai-panel card-pad-sm">
          <span class="eyebrow" style="font-size:.64rem">${UI.icon("spark", 10, 2.2)} Market position</span>
          <div class="mt-3" id="marketPos"></div>
        </div>
      </aside>
    </div>`;

    wire();
    renderMarketPosition();
  }

  function renderMarketPosition() {
    const peers = DB.GIGS.filter((g) => g.category === gig.category);
    const std = peers.map((g) => g.packages.standard.price).sort((a, b) => a - b);
    const median = std[Math.floor(std.length / 2)];
    const mine = gig.packages.standard.price;
    const delta = Math.round(((mine - median) / median) * 100);
    const ratingRank = peers.slice().sort((a, b) => b.rating - a.rating).findIndex((g) => g.id === gig.id) + 1;
    const valueRank = peers.slice().sort((a, b) => (a.packages.standard.price / a.rating) - (b.packages.standard.price / b.rating)).findIndex((g) => g.id === gig.id) + 1;

    $("#marketPos").innerHTML = `
      <div class="stack" style="gap:9px;font-size:.83rem">
        <div class="spread"><span class="text-muted">Category median</span><strong class="mono">${UI.money(median)}</strong></div>
        <div class="spread"><span class="text-muted">This listing</span><strong class="mono ${delta > 0 ? "text-amber" : "text-mint"}">${UI.money(mine)} (${delta > 0 ? "+" : ""}${delta}%)</strong></div>
        <div class="spread"><span class="text-muted">Rating rank</span><strong class="mono">#${ratingRank} of ${peers.length}</strong></div>
        <div class="spread"><span class="text-muted">Value rank</span><strong class="mono">#${valueRank} of ${peers.length}</strong></div>
      </div>
      <p class="tiny mt-3" style="line-height:1.55">${delta > 12
        ? `Priced above the ${UI.esc(cat.short)} median, which is consistent with a ${gig.rating.toFixed(1)}★ rating and ${UI.compact(gig.orders)} completed orders.`
        : delta < -12
        ? `Priced below the ${UI.esc(cat.short)} median despite a ${gig.rating.toFixed(1)}★ rating — strong value for this category.`
        : `Priced close to the ${UI.esc(cat.short)} median. Judge on portfolio fit rather than price.`}</p>`;
  }

  function wire() {
    $$("[data-pkg]", root).forEach((btn) => btn.addEventListener("click", () => { selectedPkg = btn.dataset.pkg; render(); }));
    $$("[data-addon]", root).forEach((cb) => cb.addEventListener("change", () => {
      const i = +cb.dataset.addon;
      if (cb.checked) selectedAddons.add(i); else selectedAddons.delete(i);
      render();
    }));

    $("#saveBtn2").addEventListener("click", () => {
      const now = Store.toggleSaved(creator.id);
      $("#saveBtn2").setAttribute("aria-pressed", String(now));
      $("#saveBtn2").innerHTML = `${UI.icon("bookmark", 14, now ? 0 : 1.75)} ${now ? "Saved" : "Save creator"}`;
      UI.toast(now ? `${creator.name} saved to shortlist` : `${creator.name} removed from shortlist`, now ? "ok" : "info");
    });

    $("#hireBtn").addEventListener("click", openCheckout);

    const sel = $("#fitSelect");
    sel.addEventListener("change", () => {
      const b = Store.brief(sel.value);
      if (!b) { $("#fitOut").innerHTML = ""; return; }
      const m = AI.scoreCreatorForBrief({ ...b, searchKeywords: AI.tokens(`${b.title} ${b.description || ""}`) }, creator);
      $("#fitOut").innerHTML = `<div class="row" style="gap:12px;align-items:flex-start">
        ${UI.scoreRing(m.score, "score-ring-lg", "Match score")}
        <div class="grow" style="min-width:0">
          <div class="row" style="gap:6px"><span class="chip chip-${m.score >= 70 ? "mint" : m.score >= 52 ? "amber" : "rose"}">${m.score >= 70 ? "Strong fit" : m.score >= 52 ? "Partial fit" : "Weak fit"}</span></div>
          <p class="sub mt-2" style="font-size:.86rem">${UI.esc(m.verdict.text)}</p>
          <details class="mt-2"><summary class="tiny" style="cursor:pointer;color:var(--muted)">Show all seven factors</summary><div class="mt-3">${UI.factorList(m.factors)}</div></details>
        </div>
      </div>`;
    });
  }

  /* ---------- Checkout ---------- */
  function openCheckout() {
    const p = gig.packages[selectedPkg];
    const brand = Store.getBrand();
    UI.modal({
      title: "Confirm your order",
      subtitle: `${p.name} package · ${creator.name}`,
      wide: true,
      body: `
        <div class="card card-flat card-pad-sm mb-4">
          <div class="stack" style="gap:7px;font-size:.86rem">
            <div class="spread"><span class="text-muted">${UI.esc(p.name)} — ${UI.esc(p.units)}</span><span class="mono">${UI.money(p.price)}</span></div>
            ${[...selectedAddons].map((i) => `<div class="spread"><span class="text-muted">${UI.esc(gig.addons[i].name)}</span><span class="mono">+${UI.money(gig.addons[i].price)}</span></div>`).join("")}
            <div class="spread"><span class="text-muted">Platform fee (8%)</span><span class="mono">${UI.money(fee())}</span></div>
            <div class="spread" style="padding-top:7px;border-top:1px solid var(--line);font-weight:650"><span>Total held in escrow</span><span class="mono">${UI.money(total())}</span></div>
          </div>
        </div>
        <div class="form-grid">
          <label class="field"><span class="field-label">Your brand</span><input class="input" id="coBrand" value="${UI.esc(brand.name || "")}" maxlength="60" required></label>
          <label class="field"><span class="field-label">Required by</span>
            <select class="select" id="coDue">
              <option value="${p.deliveryDays}" selected>Standard — ${p.deliveryDays} days</option>
              <option value="${Math.max(1, Math.ceil(p.deliveryDays / 2))}">Rush — ${Math.max(1, Math.ceil(p.deliveryDays / 2))} days</option>
              <option value="${p.deliveryDays + 5}">Relaxed — ${p.deliveryDays + 5} days</option>
            </select>
          </label>
          <label class="field span-2"><span class="field-label">Project brief for the creator</span>
            <textarea class="textarea" id="coBrief" rows="4" placeholder="What are you selling, who is it for, and what does success look like? Paste any brand guidelines or reference links."></textarea>
            <span class="field-hint">Stored with the order so the creator sees full context.</span>
          </label>
        </div>
        <div class="row mt-4" style="gap:8px">
          <span class="chip chip-mint">${UI.icon("shield", 11, 2.2)} Escrow</span>
          <span class="tiny">Payment is simulated. Nothing is charged and no data leaves this browser.</span>
        </div>`,
      actions: [
        { label: "Cancel" },
        {
          label: `Pay & Place Order · ${UI.money(total())}`, variant: "primary",
          onClick: () => {
            const brandName = $("#coBrand").value.trim();
            const briefText = $("#coBrief").value.trim();
            if (!brandName) { UI.toast("Enter your brand name", "err"); return false; }
            if (!briefText) { UI.toast("Add a brief so the creator knows what to build", "err"); return false; }
            const order = Store.placeOrder({
              gigId: gig.id, packageKey: selectedPkg,
              addons: [...selectedAddons].map((i) => gig.addons[i]),
              brief: briefText, brand: brandName, dueDays: +$("#coDue").value
            });
            Store.setBrand({ name: brandName });

            if (typeof window.Razorpay === "function") {
              const options = {
                key: "rzp_test_TlxOIWifYqxJeK",
                amount: Math.round(order.total * 100),
                currency: "INR",
                name: "CreatorOS AI Marketplace",
                description: `Escrow Fund for Order ${order.id} (${gig.title})`,
                handler: function (response) {
                  UI.toast(`Payment verified! ID: ${response.razorpay_payment_id}`, "ok");
                  setTimeout(() => confirmSuccess(order), 220);
                },
                prefill: {
                  name: brandName,
                  email: "brand@growthos.market",
                },
                theme: {
                  color: "#00f0ff"
                }
              };
              const rzp = new window.Razorpay(options);
              rzp.open();
            } else {
              UI.toast(`Order placed with ${creator.name}`, "ok");
              setTimeout(() => confirmSuccess(order), 220);
            }
          }
        }
      ]
    });
  }

  function confirmSuccess(order) {
    UI.modal({
      title: "Order confirmed",
      subtitle: `${UI.money(order.total)} held in escrow`,
      body: `<div class="stack" style="gap:var(--sp-3)">
        <div class="row" style="gap:10px">
          ${UI.avatar(creator, "sm")}
          <div><div style="font-weight:600;font-size:.9rem">${UI.esc(creator.name)}</div>
          <div class="tiny">${UI.esc(gig.packages[order.packageKey].name)} · due ${UI.date(order.dueAt)}</div></div>
        </div>
        <div class="card card-flat card-pad-sm">
          <span class="eyebrow" style="font-size:.62rem">What happens next</span>
          <ol class="mt-3" style="padding-left:18px;font-size:.85rem;color:var(--muted);line-height:1.8">
            <li>Creator accepts within ${Math.ceil(creator.responseMins / 60) || 1} hour${creator.responseMins > 90 ? "s" : ""}</li>
            <li>First delivery lands by ${UI.date(order.dueAt)}</li>
            <li>You review and request revisions if needed</li>
            <li>Escrow releases only when you approve</li>
          </ol>
        </div>
        <p class="tiny">Order reference <span class="mono text-mint">${UI.esc(order.id)}</span></p>
      </div>`,
      actions: [
        { label: "Keep browsing", onClick: () => { location.href = "creators.html"; } },
        { label: "Go to my orders", variant: "primary", onClick: () => { location.href = "dashboard.html#order-" + order.id; } }
      ]
    });
  }

  render();
})();
