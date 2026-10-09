/* Client workspace — orders, briefs, shortlist */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  const brand = Store.getBrand();
  $("#brandTitle").textContent = brand.name && brand.name !== "Your Brand" ? `${brand.name} workspace` : "Your workspace";

  /* ---------- Tabs ---------- */
  const tabs = $$(".tab[data-tab]");
  const panels = { orders: $("#panel-orders"), briefs: $("#panel-briefs"), saved: $("#panel-saved") };
  function selectTab(name) {
    tabs.forEach((t) => t.setAttribute("aria-selected", String(t.dataset.tab === name)));
    Object.entries(panels).forEach(([k, p]) => { p.hidden = k !== name; });
    history.replaceState(null, "", `dashboard.html${name === "orders" ? "" : "#" + name}`);
  }
  tabs.forEach((t) => t.addEventListener("click", () => selectTab(t.dataset.tab)));

  /* ---------- Stats ---------- */
  function renderStats() {
    const active = Store.activeOrders();
    const inEscrow = active.reduce((s, o) => s + o.total, 0);
    $("#stats").innerHTML = [
      { k: "Active orders", v: active.length, d: `${UI.money(inEscrow)} held in escrow`, icon: "briefcase" },
      { k: "Lifetime spend", v: UI.compactMoney(Store.spend()), d: `${Store.deliveredOrders().length} completed`, icon: "wallet" },
      { k: "Open briefs", v: Store.briefs().filter((b) => !b.seeded).length, d: `${Store.briefs().filter((b) => b.seeded).length} sample briefs loaded`, icon: "doc" },
      { k: "Shortlist", v: Store.saved().length, d: "Creators you saved", icon: "bookmark" }
    ].map((s) => `<div class="stat">
      <span class="k">${UI.icon(s.icon, 13, 2)} ${UI.esc(s.k)}</span>
      <span class="v">${typeof s.v === "number" ? s.v : UI.esc(s.v)}</span>
      <span class="d">${UI.esc(s.d)}</span>
    </div>`).join("");
  }

  /* ---------- Orders ---------- */
  function renderOrders() {
    const orders = Store.orders();
    const host = $("#ordersBody");
    if (!orders.length) {
      host.innerHTML = UI.empty({
        title: "No orders yet", icon: "briefcase",
        body: "Hire a creator from any listing and the order appears here with escrow status, timeline and delivery countdown.",
        cta: `<div class="row" style="gap:8px;justify-content:center"><a class="btn btn-primary btn-sm" href="creators.html">Browse creators</a><a class="btn btn-ghost btn-sm" href="brief.html">Post a brief</a></div>`
      });
      return;
    }

    host.innerHTML = `
      <div class="table-wrap mb-5">
        <table>
          <thead><tr><th>Order</th><th>Status</th><th class="td-num">Total</th><th class="td-num">Delivery</th><th></th></tr></thead>
          <tbody>${orders.map((o) => UI.orderRow(o)).join("")}</tbody>
        </table>
      </div>
      <div class="stack" style="gap:var(--sp-4)">
        ${orders.map((o) => orderDetail(o)).join("")}
      </div>`;

    $$("[data-advance]").forEach((b) => b.addEventListener("click", () => {
      const current = Store.order(b.dataset.advance);
      if (current && current.status === "review") {
        UI.confirmDialog({
          title: "Release Escrow Payment?",
          confirmLabel: `Release ${UI.money(current.total)}`,
          body: `Confirm that you are satisfied with the creator's delivery. Escrow funds will be settled with ${UI.esc(current.creatorName)} via Razorpay.`,
          onConfirm: () => {
            const o = Store.advanceOrder(current.id);
            UI.toast("Delivery approved — escrow released via Razorpay!", "ok");
            refresh();
          }
        });
        return;
      }
      const o = Store.advanceOrder(b.dataset.advance);
      UI.toast(o.status === "delivered" ? "Delivery approved — escrow released" : `Moved to “${Store.statusLabel(o.status)}”`, "ok");
      refresh();
    }));
    $$("[data-cancel]").forEach((b) => b.addEventListener("click", () => {
      const o = Store.order(b.dataset.cancel);
      UI.confirmDialog({
        title: "Cancel this order?", danger: true, confirmLabel: "Cancel order",
        body: `Escrow of ${UI.money(o.total)} will be released and the creator notified. This cannot be undone.`,
        onConfirm: () => { Store.cancelOrder(o.id); UI.toast("Order cancelled, escrow released", "info"); refresh(); }
      });
    }));
  }

  const NEXT_LABEL = { placed: "Mark as in production", "in-progress": "Mark as delivered for review", review: "Approve & release escrow" };

  function orderDetail(o) {
    const gig = DB.byId.gig[o.gigId];
    const creator = DB.byId.creator[o.creatorId];
    const dl = UI.daysLeft(o.dueAt);
    const progress = { placed: 20, "in-progress": 55, review: 82, delivered: 100, cancelled: 0 }[o.status] ?? 0;

    return `<article class="card" id="order-${o.id}">
      <div class="row-between" style="align-items:flex-start;gap:var(--sp-4)">
        <div class="row" style="gap:var(--sp-3);min-width:0">
          ${creator ? UI.avatar(creator, "sm") : ""}
          <div style="min-width:0">
            <h3 style="font-size:1.02rem"><a href="gig.html?id=${o.gigId}">${UI.esc(o.gigTitle)}</a></h3>
            <div class="tiny truncate">${UI.esc(o.creatorName)} · ${UI.esc(o.packageName)} · ordered ${UI.dateTime(o.placedAt)}</div>
          </div>
        </div>
        <div style="text-align:right;flex:none">
          ${UI.statusPill(o.status)}
          <div class="num mt-2" style="font-size:1.2rem">${UI.money(o.total)}</div>
          <div class="tiny">${o.status === "delivered" ? "Escrow released" : o.status === "cancelled" ? "Refunded" : "In escrow"}</div>
        </div>
      </div>

      <div class="mt-4">${UI.bar(progress)}</div>
      <div class="row mt-2" style="gap:6px">
        ${["placed", "in-progress", "review", "delivered"].map((s) => `<span class="tiny" style="${o.status === s ? "color:var(--mint);font-weight:600" : "color:var(--dim)"}">${UI.esc(Store.statusLabel(s))}</span>`).join(`<span style="color:var(--dim)">→</span>`)}
      </div>

      <div class="grid g-2 mt-4" style="gap:var(--sp-4)">
        <div class="card card-flat card-pad-sm">
          <span class="field-label">Order breakdown</span>
          <div class="stack" style="gap:6px;font-size:.84rem">
            <div class="spread"><span class="text-muted">${UI.esc(o.packageName)} — ${UI.esc(o.units)}</span><span class="mono">${UI.money(o.subtotal - o.addons.reduce((s, a) => s + a.price, 0))}</span></div>
            ${o.addons.map((a) => `<div class="spread"><span class="text-muted">${UI.esc(a.name)}</span><span class="mono">+${UI.money(a.price)}</span></div>`).join("")}
            <div class="spread"><span class="text-muted">Platform fee</span><span class="mono">${UI.money(o.fee)}</span></div>
            <div class="spread" style="padding-top:6px;border-top:1px solid var(--line);font-weight:650"><span>Total</span><span class="mono">${UI.money(o.total)}</span></div>
          </div>
          ${o.brief ? `<div class="mt-4" style="padding-top:var(--sp-3);border-top:1px solid var(--line)">
            <span class="field-label">Brief sent to creator</span>
            <p class="tiny" style="line-height:1.6;color:var(--muted)">${UI.esc(o.brief)}</p>
          </div>` : ""}
        </div>

        <div class="card card-flat card-pad-sm">
          <div class="spread mb-3">
            <span class="field-label" style="margin:0">Timeline</span>
            ${o.status !== "delivered" && o.status !== "cancelled" ? `<span class="chip ${dl < 0 ? "chip-rose" : dl <= 1 ? "chip-amber" : "chip-mint"}">${dl < 0 ? `${Math.abs(dl)}d overdue` : `${dl}d left`}</span>` : ""}
          </div>
          <ol class="stack" style="gap:11px;list-style:none;padding:0;margin:0">
            ${o.timeline.slice().reverse().map((t, i, arr) => `<li style="display:grid;grid-template-columns:14px 1fr;gap:10px">
              <span style="display:flex;flex-direction:column;align-items:center;gap:4px">
                <span class="dot ${i === 0 ? "" : "dot-dim"}" style="${i === 0 ? "" : "box-shadow:none;background:var(--dim)"}"></span>
                ${i < arr.length - 1 ? `<span style="width:1px;flex:1;background:var(--line)"></span>` : ""}
              </span>
              <span style="padding-bottom:2px">
                <strong style="font-size:.84rem;display:block">${UI.esc(t.event)}</strong>
                <span class="tiny" style="display:block;line-height:1.5">${UI.esc(t.note)}</span>
                <span class="tiny mono" style="color:var(--dim)">${UI.dateTime(t.at)}</span>
              </span>
            </li>`).join("")}
          </ol>
        </div>
      </div>

      ${o.status !== "delivered" && o.status !== "cancelled" ? `<div class="row mt-4" style="gap:8px;padding-top:var(--sp-4);border-top:1px solid var(--line)">
        <button class="btn btn-primary btn-sm" data-advance="${o.id}">${UI.esc(NEXT_LABEL[o.status] || "Advance")}</button>
        <a class="btn btn-sm" href="creator.html?id=${o.creatorId}">Message ${UI.esc(o.creatorName.split(" ")[0])}</a>
        <button class="btn btn-ghost btn-sm" data-cancel="${o.id}" style="margin-left:auto;color:var(--rose);border-color:rgba(255,92,122,.3)">Cancel order</button>
      </div>` : o.status === "delivered" ? `<div class="row mt-4" style="gap:8px;padding-top:var(--sp-4);border-top:1px solid var(--line)">
        <span class="text-mint tiny">${UI.icon("check", 12, 2.6)} Completed ${UI.dateTime(o.completedAt)}</span>
        <button class="btn btn-sm" style="margin-left:auto" data-reorder="${o.gigId}">Reorder</button>
      </div>` : ""}
    </article>`;
  }

  /* ---------- Briefs ---------- */
  function renderBriefs() {
    const mine = Store.briefs().filter((b) => !b.seeded);
    const seeded = Store.briefs().filter((b) => b.seeded);
    const host = $("#briefsBody");

    if (!mine.length && !seeded.length) {
      host.innerHTML = UI.empty({ title: "No briefs", body: "Post a brief and the AI will rank every creator against it.", icon: "doc", cta: `<a class="btn btn-primary btn-sm" href="brief.html">Post a brief</a>` });
      return;
    }

    host.innerHTML = `
      <div class="row-between mb-4">
        <div><span class="eyebrow">Your briefs</span><h2 class="mt-2" style="font-size:1.2rem">${mine.length} posted</h2></div>
        <a class="btn btn-primary btn-sm" href="brief.html">Post a brief</a>
      </div>
      ${mine.length ? `<div class="grid g-3 mb-5" id="mineBriefs">${mine.map((b) => UI.briefCard(b)).join("")}</div>` : UI.empty({ title: "You have not posted a brief yet", body: "Describe the work in plain language and let the matching engine do the rest.", icon: "doc", cta: `<a class="btn btn-primary btn-sm" href="brief.html">Post your first brief</a>` })}

      ${seeded.length ? `<hr class="divider">
      <div class="row-between mb-4 mt-5">
        <div>
          <span class="eyebrow eyebrow-violet">Marketplace</span>
          <h2 class="mt-2" style="font-size:1.2rem">Open Marketplace Briefs</h2>
          <p class="tiny mt-2">Verified content production briefs posted across the CreatorOS network.</p>
        </div>
      </div>
      <div class="grid g-3">${seeded.map((b) => UI.briefCard(b)).join("")}</div>` : ""}`;

    $$("[data-delete-brief]").forEach((b) => b.addEventListener("click", () => {
      Store.deleteBrief(b.dataset.deleteBrief);
      UI.toast("Brief deleted", "info");
      refresh();
    }));
  }

  /* ---------- Shortlist ---------- */
  function renderSaved() {
    const ids = Store.saved();
    const host = $("#savedBody");
    if (!ids.length) {
      host.innerHTML = UI.empty({
        title: "Your shortlist is empty", icon: "bookmark",
        body: "Tap the bookmark on any creator card to build a shortlist you can compare later.",
        cta: `<a class="btn btn-primary btn-sm" href="creators.html">Browse creators</a>`
      });
      return;
    }
    const creators = ids.map((id) => DB.byId.creator[id]).filter(Boolean);
    host.innerHTML = `
      <div class="row-between mb-4">
        <div><span class="eyebrow">Shortlist</span><h2 class="mt-2" style="font-size:1.2rem">${creators.length} saved creator${creators.length === 1 ? "" : "s"}</h2></div>
        <a class="btn btn-ghost btn-sm" href="creators.html?saved=1">Open in browser</a>
      </div>
      <div class="grid g-3">${creators.map((c) => UI.creatorCard(c)).join("")}</div>
      <div class="card mt-5">
        <h3 style="font-size:1rem">Side-by-side comparison</h3>
        <div class="table-wrap mt-3">
          <table>
            <thead><tr><th>Creator</th><th class="td-num">Rating</th><th class="td-num">Quality</th><th class="td-num">From</th><th class="td-num">Delivery</th><th class="td-num">Orders</th><th class="td-num">Repeat</th></tr></thead>
            <tbody>${creators.map((c) => {
              const q = AI.qualityScore(c);
              const from = Math.min(...DB.gigsOf(c.id).map((g) => DB.LOWEST(g)));
              return `<tr>
                <td><a href="creator.html?id=${c.id}" style="font-weight:550">${UI.esc(c.name)}</a><div class="tiny">${UI.esc(c.title)}</div></td>
                <td class="td-num">${c.rating.toFixed(1)}</td>
                <td class="td-num"><span class="text-${q.band.color}">${q.score}</span> <span class="tiny">${q.grade}</span></td>
                <td class="td-num">${UI.compactMoney(from)}</td>
                <td class="td-num">${c.deliveryDays}d</td>
                <td class="td-num">${UI.compact(c.completedOrders)}</td>
                <td class="td-num">${Math.round(c.repeatClientRate * 100)}%</td>
              </tr>`;
            }).join("")}</tbody>
          </table>
        </div>
      </div>`;
    UI.bindSaveButtons(host);
  }

  /* ---------- Brand editor ---------- */
  $("#editBrand")?.addEventListener("click", () => {
    const b = Store.getBrand();
    UI.modal({
      title: "Your brand profile", subtitle: "Shown to creators when you place an order",
      body: `<div class="stack" style="gap:var(--sp-4)">
        <label class="field"><span class="field-label">Brand name</span><input class="input" id="ebName" value="${UI.esc(b.name || "")}" maxlength="60" autofocus></label>
        <label class="field"><span class="field-label">Company (optional)</span><input class="input" id="ebCompany" value="${UI.esc(b.company || "")}" maxlength="80"></label>
      </div>`,
      actions: [{ label: "Cancel" }, {
        label: "Save", variant: "primary",
        onClick: () => {
          const name = $("#ebName").value.trim();
          if (!name) { UI.toast("Brand name cannot be empty", "err"); return false; }
          Store.setBrand({ name, company: $("#ebCompany").value.trim() });
          $("#brandTitle").textContent = `${name} workspace`;
          UI.toast("Brand profile saved", "ok");
        }
      }]
    });
  });

  /* ---------- Refresh ---------- */
  function refresh() {
    renderStats();
    renderOrders();
    renderBriefs();
    renderSaved();
    $$("[data-reorder]").forEach((b) => b.addEventListener("click", () => { location.href = `gig.html?id=${b.dataset.reorder}`; }));
  }

  refresh();
  const hash = location.hash.replace("#", "");
  if (hash === "briefs") selectTab("briefs");
  else if (hash === "saved") selectTab("saved");
  if (hash.startsWith("order-")) $(`#${hash}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
})();
