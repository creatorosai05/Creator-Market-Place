/* ============================================================
   CreatorMatch AI — shared UI components and helpers
   ============================================================ */

const UI = (() => {
  /* ---------- Safety ---------- */
  const ESC = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  /** Escape untrusted text (user-entered briefs, brand names) before it hits innerHTML. */
  const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ESC[c]);

  /* ---------- Formatting ---------- */
  const money = (v) => (v == null || isNaN(v) ? "—" : "₹" + Number(v).toLocaleString("en-IN"));
  const compactMoney = (v) => {
    if (v == null || isNaN(v)) return "—";
    const n = Number(v);
    if (n >= 10000000) return "₹" + (n / 10000000).toFixed(2) + "Cr";
    if (n >= 100000) return "₹" + (n / 100000).toFixed(2) + "L";
    if (n >= 1000) return "₹" + (n / 1000).toFixed(n >= 10000 ? 0 : 1) + "k";
    return "₹" + n;
  };
  const compact = (v) => {
    const n = Number(v || 0);
    if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
    if (n >= 1000) return (n / 1000).toFixed(n >= 10000 ? 0 : 1) + "k";
    return String(n);
  };
  const pct = (v, d = 0) => `${(v * 100).toFixed(d)}%`;
  const date = (ts) => new Date(ts).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  const dateTime = (ts) => new Date(ts).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
  const rel = (ts) => {
    const d = Date.now() - new Date(ts).getTime();
    const mins = Math.round(d / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const h = Math.round(mins / 60);
    if (h < 24) return `${h}h ago`;
    const days = Math.round(h / 24);
    if (days < 30) return `${days}d ago`;
    const mo = Math.round(days / 30);
    if (mo < 12) return `${mo}mo ago`;
    return `${Math.round(mo / 12)}y ago`;
  };
  const daysLeft = (ts) => Math.ceil((new Date(ts).getTime() - Date.now()) / 86400000);
  const qs = (name) => new URLSearchParams(location.search).get(name);

  /* ---------- Procedural colour ---------- */
  const avatarBg = (hue) => `linear-gradient(138deg, hsl(${hue} 82% 66%), hsl(${(hue + 46) % 360} 74% 48%))`;
  const tileBg = (hue) => `linear-gradient(142deg, hsl(${hue} 72% 52%), hsl(${(hue + 58) % 360} 68% 34%))`;
  const initials = (name) => String(name || "?").split(/\s+/).slice(0, 2).map((w) => w[0] || "").join("").toUpperCase();

  /* ---------- Icons ---------- */
  const PATHS = {
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    star: '<path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.5 9.7l5.9-.9z"/>',
    check: '<path d="m4.5 12.5 5 5 10-11"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    spark: '<path d="M12 3v5M12 16v5M3 12h5M16 12h5M6.5 6.5l3 3M14.5 14.5l3 3M17.5 6.5l-3 3M9.5 14.5l-3 3"/>',
    bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5.5l3.5 2"/>',
    users: '<circle cx="9" cy="8" r="3.4"/><path d="M2.8 20c0-3.5 2.8-5.6 6.2-5.6s6.2 2.1 6.2 5.6"/><path d="M16.5 5.2a3.4 3.4 0 0 1 0 6.4M18 14.9c2.1.6 3.4 2.3 3.4 4.6"/>',
    chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    briefcase: '<rect x="2.5" y="7" width="19" height="13" rx="2.4"/><path d="M8.5 7V5.4A1.9 1.9 0 0 1 10.4 3.5h3.2A1.9 1.9 0 0 1 15.5 5.4V7M2.5 12.5h19"/>',
    bookmark: '<path d="M6 3.5h12v17l-6-4.4-6 4.4z"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    filter: '<path d="M3 5h18l-7 8v6l-4 2v-8z"/>',
    chevron: '<path d="m9 5 7 7-7 7"/>',
    shield: '<path d="M12 2.8 4.5 6v6c0 4.6 3.2 8.2 7.5 9.4 4.3-1.2 7.5-4.8 7.5-9.4V6z"/><path d="m9 12 2.2 2.2L15.4 10"/>',
    wallet: '<rect x="2.5" y="5.5" width="19" height="13" rx="2.4"/><path d="M2.5 10h19M17 14.5h1.5"/>',
    layers: '<path d="m12 2.8 9.2 5-9.2 5-9.2-5z"/><path d="m3.2 12.4 8.8 4.8 8.8-4.8M3.2 16.8l8.8 4.8 8.8-4.8"/>',
    globe: '<circle cx="12" cy="12" r="9.2"/><path d="M2.8 12h18.4M12 2.8c2.6 2.6 3.9 5.8 3.9 9.2s-1.3 6.6-3.9 9.2c-2.6-2.6-3.9-5.8-3.9-9.2S9.4 5.4 12 2.8z"/>',
    trend: '<path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.4"/>',
    doc: '<path d="M14 2.8H6.8A1.8 1.8 0 0 0 5 4.6v14.8a1.8 1.8 0 0 0 1.8 1.8h10.4a1.8 1.8 0 0 0 1.8-1.8V7.8z"/><path d="M14 2.8v5h5M8.5 13h7M8.5 17h4.5"/>',
    edit: '<path d="M4 20h4l10.5-10.5a2.1 2.1 0 0 0-3-3L5 17z"/><path d="M14.5 6.5l3 3"/>',
    play: '<path d="M7 4.5l12 7.5-12 7.5z"/>',
    grid: '<rect x="3" y="3" width="7.5" height="7.5" rx="1.6"/><rect x="13.5" y="3" width="7.5" height="7.5" rx="1.6"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="1.6"/><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.6"/>',
    logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>'
  };

  const icon = (name, size = 16, stroke = 1.75) => {
    const d = PATHS[name] || PATHS.spark;
    const fill = name === "star" || name === "bolt" || name === "play" || name === "bookmark" ? "currentColor" : "none";
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${fill}" stroke="${fill === "none" ? "currentColor" : "none"}" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
  };

  /* ---------- Primitives ---------- */
  const avatar = (creator, size = "md", { online } = {}) => {
    const on = online ?? creator.online;
    return `<span class="avatar avatar-${size}${on ? " avatar-online" : ""}" style="background:${avatarBg(creator.hue)}" role="img" aria-label="${esc(creator.name)}">${esc(initials(creator.name))}</span>`;
  };

  const stars = (rating, reviews) =>
    `<span class="stars">${icon("star", 13, 0)}<span class="n">${Number(rating).toFixed(1)}</span>${reviews != null ? `<span class="c">(${compact(reviews)})</span>` : ""}</span>`;

  const chip = (text, variant = "", extra = "") => `<span class="chip ${variant ? "chip-" + variant : ""}" ${extra}>${esc(text)}</span>`;

  const chips = (list, variant) => (list || []).map((t) => chip(t, variant)).join("");

  const statusPill = (status) => {
    const cls = { placed: "status-placed", "in-progress": "status-progress", review: "status-review", delivered: "status-delivered", open: "status-open", "in-review": "status-review", filled: "status-delivered", awarded: "status-delivered", cancelled: "status-cancelled" }[status] || "";
    return `<span class="status ${cls}">${icon("clock", 11, 2)} ${esc(Store.statusLabel(status))}</span>`;
  };

  const scoreRing = (score, size = "", label) => {
    const r = size === "score-ring-lg" ? 42 : 26;
    const c = 2 * Math.PI * r;
    const off = c - (AI.clamp(score) / 100) * c;
    const colour = score >= 80 ? "var(--mint)" : score >= 62 ? "var(--violet)" : score >= 45 ? "var(--amber)" : "var(--rose)";
    return `<span class="score-ring ${size}" role="img" aria-label="${label || "Score"}: ${score} out of 100">
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        <circle cx="50" cy="50" r="${r * (100 / (size === "score-ring-lg" ? 96 : 62))}" fill="none" stroke="var(--ink-600)" stroke-width="8"/>
        <circle cx="50" cy="50" r="${r * (100 / (size === "score-ring-lg" ? 96 : 62))}" fill="none" stroke="${colour}" stroke-width="8" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${off}" style="transition:stroke-dashoffset .7s cubic-bezier(.22,1,.36,1)"/>
      </svg>
      <span class="val" style="color:${colour}">${score}</span>
    </span>`;
  };

  const bar = (value, max = 100, colour) => {
    const p = AI.clamp((value / (max || 1)) * 100);
    return `<span class="score-bar" role="progressbar" aria-valuenow="${Math.round(p)}" aria-valuemin="0" aria-valuemax="100"><i style="width:${p}%;${colour ? `background:${colour}` : ""}"></i></span>`;
  };

  const factorList = (factors) => `<div>${factors.map((f) => {
    const p = (f.points / f.max) * 100;
    return `<div class="factor">
      <span class="fname">${esc(f.label)}</span>
      <span class="fpts ${p < 55 ? "low" : ""}">${f.points.toFixed(1)}/${f.max}</span>
      <span class="fwhy">${esc(f.reason)}</span>
      <span style="grid-column:1/-1;margin-top:5px">${bar(f.points, f.max)}</span>
    </div>`;
  }).join("")}</div>`;

  /* ---------- Cards ---------- */
  function creatorCard(creator, opts = {}) {
    const q = AI.qualityScore(creator);
    const gigs = DB.gigsOf(creator.id);
    const from = Math.min(...gigs.map((g) => DB.LOWEST(g)));
    const saved = Store.isSaved(creator.id);
    const cats = creator.categories.map((c) => DB.byId.category[c].short);
    return `<article class="card card-hover creator-card">
      <div class="creator-head">
        ${avatar(creator, "md")}
        <div class="grow" style="min-width:0">
          <div class="row" style="gap:6px;flex-wrap:nowrap">
            <a href="creator.html?id=${creator.id}" style="font-family:var(--font-display);font-weight:600;font-size:1.02rem;letter-spacing:-.02em" class="truncate">${esc(creator.name)}</a>
            ${creator.verified ? `<span class="badge badge-verified" title="Identity verified">${icon("shield", 10, 2.2)}</span>` : ""}
          </div>
          <div class="tiny truncate">${esc(creator.title)}</div>
          <div class="row mt-1" style="gap:8px">${stars(creator.rating, creator.reviews)}<span class="tiny">${esc(creator.location.split(",")[0])}</span></div>
        </div>
        <button class="btn btn-ghost btn-icon" data-save="${creator.id}" aria-pressed="${saved}" title="${saved ? "Remove from shortlist" : "Save to shortlist"}" aria-label="${saved ? "Remove from shortlist" : "Save to shortlist"}" style="${saved ? "color:var(--mint);border-color:rgba(0,229,195,.35)" : ""}">${icon("bookmark", 15, saved ? 0 : 1.75)}</button>
      </div>

      <p class="sub clamp-2" style="font-size:.87rem">${esc(creator.bio)}</p>

      <div class="row" style="gap:5px">${cats.map((c) => chip(c, "violet")).join("")}${creator.tools.slice(0, 2).map((t) => chip(t)).join("")}</div>

      ${opts.match ? `<div class="ai-panel" style="padding:var(--sp-3);border-radius:var(--r-md)">
        <div class="row" style="gap:10px;flex-wrap:nowrap">
          ${scoreRing(opts.match.score)}
          <div class="grow" style="min-width:0">
            <div class="eyebrow" style="font-size:.64rem">${icon("spark", 10, 2.2)} AI match</div>
            <div class="tiny clamp-2" style="line-height:1.45">${esc(opts.match.verdict.text)}</div>
          </div>
        </div>
      </div>` : ""}

      <div class="creator-meta">
        <div class="meta-item"><span class="k">From</span><span class="v">${compactMoney(from)}</span></div>
        <div class="meta-item"><span class="k">Delivery</span><span class="v">${creator.deliveryDays}d</span></div>
        <div class="meta-item"><span class="k">Orders</span><span class="v">${compact(creator.completedOrders)}</span></div>
        <div class="meta-item"><span class="k">Quality</span><span class="v" style="color:var(--${q.band.color})">${q.score} · ${q.grade}</span></div>
      </div>

      <div class="row" style="gap:8px;margin-top:2px">
        <a class="btn btn-primary btn-sm grow" href="creator.html?id=${creator.id}">View profile</a>
        ${gigs[0] ? `<a class="btn btn-sm" href="gig.html?id=${gigs[0].id}">Top gig</a>` : ""}
      </div>
    </article>`;
  }

  function gigCard(gig) {
    const creator = DB.byId.creator[gig.creatorId];
    const cat = DB.byId.category[gig.category];
    const from = DB.LOWEST(gig);
    return `<article class="card card-hover" style="display:flex;flex-direction:column;gap:var(--sp-3);height:100%;padding:0;overflow:hidden">
      <a href="gig.html?id=${gig.id}" style="display:block;position:relative">
        <span class="tile" style="--tile-bg:${tileBg(creator.hue)};border-radius:0;border:0;aspect-ratio:16/9">
          <span class="tile-glyph">${esc(cat.short.split(" ")[0].toUpperCase())}</span>
          <span class="tile-metric">${compact(gig.views)} views</span>
        </span>
      </a>
      <div style="padding:0 var(--sp-4) var(--sp-4);display:flex;flex-direction:column;gap:var(--sp-3);flex:1">
        <a href="creator.html?id=${creator.id}" class="row" style="gap:8px;flex-wrap:nowrap">
          ${avatar(creator, "xs")}
          <span class="tiny truncate">${esc(creator.name)}</span>
          ${creator.verified ? `<span class="badge badge-verified" style="padding:2px 6px">${icon("shield", 9, 2.4)}</span>` : ""}
        </a>
        <h3 style="font-size:1rem;line-height:1.35"><a href="gig.html?id=${gig.id}" class="clamp-2">${esc(gig.title)}</a></h3>
        <div class="row" style="gap:8px">${stars(gig.rating, gig.reviews)}<span class="tiny">${compact(gig.orders)} orders</span>${gig.trending ? `<span class="badge badge-hot">Trending</span>` : ""}</div>
        <div class="row" style="gap:5px">${chip(cat.short)}${chip(gig.packages.basic.deliveryDays + "d", "mint")}</div>
        <div class="spread" style="margin-top:auto;padding-top:var(--sp-3);border-top:1px solid var(--line)">
          <div><div class="tiny">Starting at</div><div class="num" style="font-size:1.15rem">${money(from)}</div></div>
          <a class="btn btn-sm btn-primary" href="gig.html?id=${gig.id}">View ${icon("arrow", 13, 2.2)}</a>
        </div>
      </div>
    </article>`;
  }

  function briefCard(brief, opts = {}) {
    const cat = DB.byId.category[brief.category] || { name: brief.category, short: brief.category };
    const isSeeded = brief.seeded;
    return `<article class="card card-hover" style="display:flex;flex-direction:column;gap:var(--sp-3)">
      <div class="row-between" style="gap:8px">
        <div class="row" style="gap:7px">
          ${statusPill(brief.status)}
          ${isSeeded ? chip("Sample brief") : chip("Your brief", "violet")}
        </div>
        <span class="tiny">${rel(brief.createdAt || new Date(brief.postedAt).getTime())}</span>
      </div>
      <div>
        <h3 style="font-size:1.04rem;line-height:1.35">${esc(brief.title)}</h3>
        <div class="tiny mt-1">${esc(brief.brand)} · ${esc(brief.brandType || "Brand")}</div>
      </div>
      <p class="sub clamp-3" style="font-size:.86rem">${esc(brief.description || brief.summary || "")}</p>
      <div class="row" style="gap:5px">${chip(cat.short, "violet")}${brief.language ? chip(brief.language) : ""}${brief.complexity ? chip(brief.complexity + " complexity", brief.complexity === "high" ? "amber" : "") : ""}</div>
      <div class="creator-meta">
        <div class="meta-item"><span class="k">Budget</span><span class="v">${compactMoney(brief.budgetMin)}–${compactMoney(brief.budgetMax)}</span></div>
        <div class="meta-item"><span class="k">Timeline</span><span class="v">${brief.deadlineDays}d</span></div>
        <div class="meta-item"><span class="k">Proposals</span><span class="v">${brief.applicants ?? 0}</span></div>
      </div>
      ${opts.actions === false ? "" : `<a class="btn btn-sm btn-primary" href="brief.html?id=${esc(brief.id)}#matches">See AI matches ${icon("arrow", 13, 2.2)}</a>`}
    </article>`;
  }

  function orderRow(o) {
    const dl = daysLeft(o.dueAt);
    return `<tr>
      <td>
        <div class="row" style="gap:9px;flex-wrap:nowrap">
          <span class="avatar avatar-xs" style="background:${avatarBg(o.creatorHue || 220)}">${esc(initials(o.creatorName))}</span>
          <div style="min-width:0">
            <div class="truncate" style="font-weight:550;font-size:.88rem">${esc(o.gigTitle)}</div>
            <div class="tiny truncate">${esc(o.creatorName)} · ${esc(o.packageName)}</div>
          </div>
        </div>
      </td>
      <td>${statusPill(o.status)}</td>
      <td class="td-num">${money(o.total)}</td>
      <td class="td-num">${o.status === "delivered" ? `<span class="text-mint">Delivered</span>` : o.status === "cancelled" ? `<span class="text-dim">—</span>` : `<span class="${dl < 0 ? "text-rose" : dl <= 1 ? "text-amber" : ""}">${dl < 0 ? `${Math.abs(dl)}d late` : `${dl}d left`}</span>`}</td>
      <td class="text-right"><a class="btn btn-sm btn-ghost" href="dashboard.html#order-${o.id}">Open</a></td>
    </tr>`;
  }

  const empty = ({ title, body, cta, icon: ic = "layers" }) => `<div class="empty">
    <div class="empty-glyph">${icon(ic, 22)}</div>
    <h3 style="font-size:1.06rem">${esc(title)}</h3>
    <p class="sub mt-2" style="max-width:44ch;margin-inline:auto">${esc(body)}</p>
    ${cta ? `<div class="mt-4">${cta}</div>` : ""}
  </div>`;

  /* ---------- Toasts ---------- */
  let toastHost = null;
  function toast(message, type = "ok", ms = 3400) {
    if (!toastHost) {
      toastHost = document.createElement("div");
      toastHost.className = "toasts";
      toastHost.setAttribute("role", "status");
      toastHost.setAttribute("aria-live", "polite");
      document.body.appendChild(toastHost);
    }
    const el = document.createElement("div");
    el.className = `toast toast-${type}`;
    const glyph = type === "ok" ? "✓" : type === "err" ? "!" : "i";
    el.innerHTML = `<span class="toast-icon">${glyph}</span><span>${esc(message)}</span>`;
    toastHost.appendChild(el);
    setTimeout(() => {
      el.classList.add("toast-out");
      el.addEventListener("animationend", () => el.remove(), { once: true });
    }, ms);
  }

  /* ---------- Modal ---------- */
  function modal({ title, subtitle, body, actions = [], wide = false, onClose }) {
    const back = document.createElement("div");
    back.className = "modal-backdrop";
    back.innerHTML = `<div class="modal ${wide ? "modal-wide" : ""}" role="dialog" aria-modal="true" aria-label="${esc(title || "Dialog")}">
      <div class="modal-head">
        <div style="min-width:0">
          ${title ? `<h3 style="font-size:1.1rem">${esc(title)}</h3>` : ""}
          ${subtitle ? `<p class="tiny mt-1">${esc(subtitle)}</p>` : ""}
        </div>
        <button class="modal-close" data-close aria-label="Close dialog">${icon("x", 15, 2.2)}</button>
      </div>
      <div class="modal-body">${body || ""}</div>
      ${actions.length ? `<div class="modal-foot">${actions.map((a, i) => `<button class="btn ${a.variant === "primary" ? "btn-primary" : a.variant === "danger" ? "" : "btn-ghost"}" data-action="${i}" ${a.danger ? 'style="border-color:rgba(255,92,122,.4);color:var(--rose)"' : ""}>${esc(a.label)}</button>`).join("")}</div>` : ""}
    </div>`;
    document.body.appendChild(back);
    document.body.style.overflow = "hidden";

    const close = () => {
      back.remove();
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
      onClose?.();
    };
    const onKey = (e) => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", onKey);
    back.addEventListener("click", (e) => {
      if (e.target === back || e.target.closest("[data-close]")) return close();
      const btn = e.target.closest("[data-action]");
      if (btn) {
        const a = actions[+btn.dataset.action];
        if (a.onClick?.(close) !== false && !a.keepOpen) close();
      }
    });
    back.querySelector(".modal-body [autofocus], .modal-foot [data-action='0']")?.focus();
    return close;
  }

  const confirmDialog = ({ title, body, confirmLabel = "Confirm", danger = false, onConfirm }) =>
    modal({
      title, body: `<p class="sub">${body}</p>`,
      actions: [{ label: "Cancel" }, { label: confirmLabel, variant: danger ? "danger" : "primary", danger, onClick: () => onConfirm?.() }]
    });

  /* ---------- Chrome ---------- */
  const NAV = [
    { href: "index.html", label: "Discover", id: "home" },
    { href: "creators.html", label: "Browse creators", id: "creators" },
    { href: "brief.html", label: "Post a brief", id: "brief" },
    { href: "dashboard.html", label: "My orders", id: "dashboard" },
    { href: "creator-dashboard.html", label: "Creator Studio", id: "creator-dashboard" },
    { href: "insights.html", label: "Insights", id: "insights" }
  ];

  function renderAuthSlot(host) {
    const slot = host.querySelector("#navAuthSlot");
    if (!slot) return;
    const user = typeof SupabaseBridge !== "undefined" ? SupabaseBridge.getUser() : null;
    const profile = typeof SupabaseBridge !== "undefined" ? SupabaseBridge.getProfile() : null;

    if (user) {
      const displayName = profile?.name || user.user_metadata?.name || user.email?.split("@")[0] || "User";
      const role = profile?.role || user.user_metadata?.role || "brand";
      slot.innerHTML = `
        <div class="row" style="gap:8px;align-items:center">
          <span class="chip chip-${role === "creator" ? "mint" : "violet"}" style="padding:2px 9px;font-size:.76rem" title="${esc(user.email)}">
            ${icon("users", 12, 2)} ${esc(displayName)} <span class="mono" style="opacity:.7">(${esc(role)})</span>
          </span>
          <button class="btn btn-ghost btn-sm" id="signOutBtn" style="padding:4px 9px;font-size:.78rem" title="Sign out">${icon("logout", 13)}</button>
        </div>`;
      slot.querySelector("#signOutBtn")?.addEventListener("click", async () => {
        if (typeof SupabaseBridge !== "undefined") {
          await SupabaseBridge.signOut();
          toast("Signed out successfully", "ok");
          renderAuthSlot(host);
        }
      });
    } else {
      slot.innerHTML = `<button class="btn btn-primary btn-sm" id="openAuthBtn" style="padding:5px 12px;font-size:.82rem">${icon("users", 13)} Sign in</button>`;
      slot.querySelector("#openAuthBtn")?.addEventListener("click", () => openAuthModal());
    }
  }

  function openAuthModal(defaultTab = "signin") {
    let activeTab = defaultTab;
    const renderModalBody = () => `
      <div class="tabs mb-4" role="tablist">
        <button class="tab" id="tabSignIn" style="${activeTab === "signin" ? "color:var(--text);border-color:var(--violet)" : ""}" type="button">Sign in</button>
        <button class="tab" id="tabSignUp" style="${activeTab === "signup" ? "color:var(--text);border-color:var(--violet)" : ""}" type="button">Create account</button>
        <button class="tab" id="tabReset" style="${activeTab === "reset" ? "color:var(--text);border-color:var(--violet)" : ""}" type="button">Reset password</button>
      </div>

      ${activeTab === "signin" ? `
        <form id="authSignInForm" class="stack" style="gap:var(--sp-3)">
          <label class="field">
            <span class="field-label">Email address</span>
            <input class="input" id="authEmail" type="email" required placeholder="name@company.com" autofocus>
          </label>
          <label class="field">
            <span class="field-label">Password</span>
            <input class="input" id="authPassword" type="password" required placeholder="••••••••">
          </label>
          <button class="btn btn-primary mt-2" type="submit">Sign in to CreatorOS</button>
        </form>
      ` : activeTab === "signup" ? `
        <form id="authSignUpForm" class="stack" style="gap:var(--sp-3)">
          <label class="field">
            <span class="field-label">Full name or Brand</span>
            <input class="input" id="authUpName" required placeholder="e.g. Maya Chen / Nova Labs" autofocus>
          </label>
          <label class="field">
            <span class="field-label">Email address</span>
            <input class="input" id="authUpEmail" type="email" required placeholder="name@company.com">
          </label>
          <label class="field">
            <span class="field-label">Password (min 6 characters)</span>
            <input class="input" id="authUpPassword" type="password" minlength="6" required placeholder="••••••••">
          </label>
          <label class="field">
            <span class="field-label">I am joining as</span>
            <select class="select" id="authUpRole">
              <option value="brand">Brand / Client (Hiring AI Creators)</option>
              <option value="creator">AI Content Creator (Offering Services)</option>
            </select>
          </label>
          <button class="btn btn-primary mt-2" type="submit">Create account</button>
        </form>
      ` : `
        <form id="authResetForm" class="stack" style="gap:var(--sp-3)">
          <label class="field">
            <span class="field-label">Registered email</span>
            <input class="input" id="authResetEmail" type="email" required placeholder="name@company.com" autofocus>
          </label>
          <p class="tiny" style="color:var(--muted)">We will send official Supabase password reset instructions to this address.</p>
          <button class="btn btn-primary mt-2" type="submit">Send reset instructions</button>
        </form>
      `}
    `;

    const close = modal({
      title: "CreatorOS AI Account",
      subtitle: "Secure authentication powered by Supabase",
      body: `<div id="authModalContainer">${renderModalBody()}</div>`,
      actions: [{ label: "Close" }]
    });

    const bindTabs = () => {
      const container = document.getElementById("authModalContainer");
      if (!container) return;
      container.querySelector("#tabSignIn")?.addEventListener("click", () => { activeTab = "signin"; container.innerHTML = renderModalBody(); bindTabs(); });
      container.querySelector("#tabSignUp")?.addEventListener("click", () => { activeTab = "signup"; container.innerHTML = renderModalBody(); bindTabs(); });
      container.querySelector("#tabReset")?.addEventListener("click", () => { activeTab = "reset"; container.innerHTML = renderModalBody(); bindTabs(); });

      container.querySelector("#authSignInForm")?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = container.querySelector("#authEmail").value.trim();
        const password = container.querySelector("#authPassword").value;
        const submitBtn = e.target.querySelector("button[type='submit']");
        submitBtn.disabled = true;
        submitBtn.textContent = "Signing in…";
        try {
          if (typeof SupabaseBridge !== "undefined") {
            await SupabaseBridge.signIn({ email, password });
            toast("Welcome back! Signed in successfully.", "ok");
            close();
            const host = document.getElementById("nav");
            if (host) renderAuthSlot(host);
          }
        } catch (err) {
          toast(err.message || "Failed to sign in", "err");
          submitBtn.disabled = false;
          submitBtn.textContent = "Sign in to CreatorOS";
        }
      });

      container.querySelector("#authSignUpForm")?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const name = container.querySelector("#authUpName").value.trim();
        const email = container.querySelector("#authUpEmail").value.trim();
        const password = container.querySelector("#authUpPassword").value;
        const role = container.querySelector("#authUpRole").value;
        const submitBtn = e.target.querySelector("button[type='submit']");
        submitBtn.disabled = true;
        submitBtn.textContent = "Creating account…";
        try {
          if (typeof SupabaseBridge !== "undefined") {
            await SupabaseBridge.signUp({ email, password, name, role });
            toast("Account created! Check email or sign in.", "ok");
            close();
            const host = document.getElementById("nav");
            if (host) renderAuthSlot(host);
          }
        } catch (err) {
          toast(err.message || "Failed to create account", "err");
          submitBtn.disabled = false;
          submitBtn.textContent = "Create account";
        }
      });

      container.querySelector("#authResetForm")?.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = container.querySelector("#authResetEmail").value.trim();
        const submitBtn = e.target.querySelector("button[type='submit']");
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending…";
        try {
          if (typeof SupabaseBridge !== "undefined") {
            await SupabaseBridge.resetPassword(email);
            toast("Password reset email sent! Check your inbox.", "ok");
            close();
          }
        } catch (err) {
          toast(err.message || "Could not send reset email", "err");
          submitBtn.disabled = false;
          submitBtn.textContent = "Send reset instructions";
        }
      });
    };

    bindTabs();
  }

  function mountNav(active) {
    const host = document.getElementById("nav");
    if (!host) return;
    host.innerHTML = `<div class="wrap nav-inner">
      <a class="brand" href="index.html"><span class="brand-mark">C</span><span>Creator<em>OS</em>&nbsp;AI</span></a>
      <button class="nav-toggle" id="navToggle" aria-label="Toggle navigation" aria-expanded="false" aria-controls="navLinks"><span></span></button>
      <nav class="nav-links" id="navLinks" aria-label="Main">
        ${NAV.map((n) => `<a href="${n.href}" ${n.id === active ? 'aria-current="page"' : ""}>${esc(n.label)}</a>`).join("")}
        <div id="navAuthSlot" style="margin-left:auto;display:inline-flex;align-items:center"></div>
      </nav>
    </div>`;

    renderAuthSlot(host);

    if (typeof SupabaseBridge !== "undefined" && typeof SupabaseBridge.onAuthChange === "function") {
      SupabaseBridge.onAuthChange(() => renderAuthSlot(host));
    }

    const toggle = host.querySelector("#navToggle");
    const links = host.querySelector("#navLinks");
    toggle?.addEventListener("click", () => {
      const open = links.dataset.open === "true";
      links.dataset.open = String(!open);
      toggle.setAttribute("aria-expanded", String(!open));
    });
  }

  function mountFooter() {
    const host = document.getElementById("footer");
    if (!host) return;
    host.innerHTML = `<div class="wrap">
      <div class="footer-grid">
        <div>
          <a class="brand" href="index.html"><span class="brand-mark">C</span><span>Creator<em>OS</em>&nbsp;AI</span></a>
          <p class="sub mt-3" style="font-size:.87rem;max-width:34ch">A marketplace where brands hire AI-native creators, and an explainable matching engine decides who is actually right for the brief.</p>
          <div class="row mt-4" style="gap:6px">${chip("CreatorOS AI", "violet")}${chip("Verified Escrow")}</div>
        </div>
        <div><h4>Marketplace</h4><ul>
          <li><a href="creators.html">Browse creators</a></li>
          <li><a href="creators.html?sort=trending">Trending gigs</a></li>
          <li><a href="brief.html">Post a brief</a></li>
          <li><a href="insights.html">Category insights</a></li>
        </ul></div>
        <div><h4>For creators</h4><ul>
          <li><a href="creator-dashboard.html">Creator Studio</a></li>
          <li><a href="creator-dashboard.html#pricing">AI pricing advisor</a></li>
          <li><a href="creator-dashboard.html#orders">Incoming orders</a></li>
          <li><a href="insights.html#tools">Tool demand</a></li>
        </ul></div>
        <div><h4>Trust</h4><ul>
          <li><a href="brief.html#risk">Risk assessment</a></li>
          <li><a href="creator.html?id=c03">Verification badges</a></li>
          <li><a href="dashboard.html">Escrow protection</a></li>
          <li><a href="insights.html#quality">Quality scoring</a></li>
        </ul></div>
      </div>
      <div class="footer-base">
        <span>CreatorOS AI · Production AI Content Creator Marketplace & Escrow Protocol.</span>
        <span class="mono">v2.0 · Production</span>
      </div>
    </div>`;
  }

  /* ---------- Misc ---------- */
  function bindSaveButtons(root = document) {
    root.querySelectorAll("[data-save]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const id = btn.dataset.save;
        const nowSaved = Store.toggleSaved(id);
        const c = DB.byId.creator[id];
        btn.setAttribute("aria-pressed", String(nowSaved));
        btn.style.color = nowSaved ? "var(--mint)" : "";
        btn.style.borderColor = nowSaved ? "rgba(0,229,195,.35)" : "";
        btn.innerHTML = icon("bookmark", 15, nowSaved ? 0 : 1.75);
        toast(nowSaved ? `${c?.name || "Creator"} saved to your shortlist` : `${c?.name || "Creator"} removed from shortlist`, nowSaved ? "ok" : "info");
      });
    });
  }

  function sectionHeader(eyebrow, title, sub, right) {
    return `<div class="row-between mb-4" style="align-items:flex-end">
      <div>
        ${eyebrow ? `<span class="eyebrow">${icon("spark", 11, 2.4)} ${esc(eyebrow)}</span>` : ""}
        <h2 class="mt-2">${title}</h2>
        ${sub ? `<p class="sub mt-2" style="max-width:62ch">${esc(sub)}</p>` : ""}
      </div>
      ${right || ""}
    </div>`;
  }

  return {
    esc, money, compactMoney, compact, pct, date, dateTime, rel, daysLeft, qs,
    avatarBg, tileBg, initials, icon,
    avatar, stars, chip, chips, statusPill, scoreRing, bar, factorList,
    creatorCard, gigCard, briefCard, orderRow, empty,
    toast, modal, confirmDialog,
    mountNav, mountFooter, bindSaveButtons, sectionHeader, NAV, openAuthModal
  };
})();

/* ---------- Page bootstrap ---------- */
document.addEventListener("DOMContentLoaded", () => {
  const active = document.body.dataset.page;
  UI.mountNav(active);
  UI.mountFooter();
});
