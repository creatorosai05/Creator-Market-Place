/* ============================================================
   CreatorMatch AI — persistence layer
   Uses browser localStorage so the demo keeps your orders,
   briefs and shortlist between visits on this device. This is
   device-local state, not a shared multi-user database.
   ============================================================ */

const Store = (() => {
  const KEY = "creatormatch.v1";
  const SEED_KEY = "creatormatch.seeded.v1";

  const DEFAULTS = {
    brand: { name: "Your Brand", company: "", role: "client" },
    orders: [],
    briefs: [],
    saved: [],
    proposals: [],
    visits: []
  };

  let cache = null;
  const listeners = [];

  /* Cloud sync hooks: the sync layer subscribes and mirrors writes. */
  const subscribe = (fn) => { listeners.push(fn); return () => { const i = listeners.indexOf(fn); if (i >= 0) listeners.splice(i, 1); }; };
  function emit(kind, op, record) {
    for (const fn of listeners.slice()) { try { fn(kind, op, record); } catch { /* a broken listener must not break the store */ } }
  }

  function read() {
    if (cache) return cache;
    try {
      const raw = localStorage.getItem(KEY);
      cache = raw ? { ...structuredClone(DEFAULTS), ...JSON.parse(raw) } : structuredClone(DEFAULTS);
    } catch {
      cache = structuredClone(DEFAULTS);
    }
    /* Seed the marketplace's sample open briefs once per device. */
    if (!localStorage.getItem(SEED_KEY)) {
      const seeded = DB.SEED_BRIEFS.map((b) => ({ ...b, seeded: true }));
      cache.briefs = [...seeded, ...cache.briefs.filter((b) => !b.seeded)];
      persist();
      try { localStorage.setItem(SEED_KEY, "1"); } catch { /* storage full or blocked */ }
    }
    return cache;
  }

  function persist() {
    try {
      localStorage.setItem(KEY, JSON.stringify(cache));
    } catch {
      /* Private mode / quota — keep the in-memory copy working. */
    }
  }

  const uid = (p) => `${p}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

  /* ---------- Brand / session ---------- */
  const getBrand = () => read().brand;
  const setBrand = (patch) => { read().brand = { ...read().brand, ...patch }; persist(); return read().brand; };

  /* ---------- Orders ---------- */
  const orders = () => read().orders.slice().sort((a, b) => b.placedAt - a.placedAt);
  const order = (id) => read().orders.find((o) => o.id === id);

  function placeOrder({ gigId, packageKey, addons = [], brief = "", brand = "", dueDays }) {
    const gig = DB.byId.gig[gigId];
    if (!gig) throw new Error("Unknown gig");
    const pkg = gig.packages[packageKey] || gig.packages.standard;
    const creator = DB.byId.creator[gig.creatorId];
    const addonTotal = addons.reduce((s, a) => s + (a.price || 0), 0);
    const subtotal = pkg.price + addonTotal;
    const fee = Math.round(subtotal * 0.08);
    const total = subtotal + fee;
    const placedAt = Date.now();
    const days = dueDays ?? pkg.deliveryDays;
    const record = {
      id: uid("o"), gigId, creatorId: gig.creatorId, packageKey,
      gigTitle: gig.title, creatorName: creator.name, creatorHue: creator.hue,
      packageName: pkg.name, units: pkg.units,
      addons: addons.map((a) => ({ name: a.name, price: a.price })),
      subtotal, fee, total, currency: "INR",
      status: "placed", placedAt,
      dueAt: placedAt + days * 86400000,
      deliveryDays: days,
      brief, brand: brand || getBrand().name || "Your Brand",
      escrow: true,
      timeline: [{ at: placedAt, event: "Order placed", note: `Payment of ${AI.money(total)} held in escrow.` }]
    };
    read().orders.unshift(record);
    persist();
    emit("orders", "create", record);
    return record;
  }

  function advanceOrder(id) {
    const o = order(id);
    if (!o) return null;
    const FLOW = ["placed", "in-progress", "review", "delivered"];
    const i = FLOW.indexOf(o.status);
    if (i < 0 || i >= FLOW.length - 1) return o;
    const next = FLOW[i + 1];
    o.status = next;
    o.timeline.push({ at: Date.now(), event: statusLabel(next), note: statusNote(next, o) });
    if (next === "delivered") o.completedAt = Date.now();
    persist();
    emit("orders", "status", o);
    return o;
  }

  function cancelOrder(id) {
    const o = order(id);
    if (!o || o.status === "delivered" || o.status === "cancelled") return o;
    o.status = "cancelled";
    o.timeline.push({ at: Date.now(), event: "Order cancelled", note: "Escrow released. Full refund issued." });
    persist();
    emit("orders", "status", o);
    return o;
  }

  const statusLabel = (s) => ({ placed: "Order placed", "in-progress": "In production", review: "Delivered for review", delivered: "Completed", cancelled: "Cancelled", open: "Open", "in-review": "In review", filled: "Filled", awarded: "Awarded" }[s] || s);
  const statusNote = (s, o) => ({
    placed: "Brief sent to the creator. Payment held in escrow.",
    "in-progress": `${o.creatorName.split(" ")[0]} accepted and started work.`,
    review: "First delivery received. Review and request revisions if needed.",
    delivered: `Escrow of ${AI.money(o.total)} released to ${o.creatorName.split(" ")[0]}.`,
    cancelled: "Order cancelled."
  }[s] || "");

  /* ---------- Briefs ---------- */
  const briefs = () => read().briefs.slice().sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  const openBriefs = () => briefs().filter((b) => b.status === "open" || b.status === "in-review");
  const brief = (id) => read().briefs.find((b) => b.id === id);

  function createBrief(data) {
    const record = {
      id: uid("b"),
      brand: data.brand || getBrand().name || "Your Brand",
      brandType: data.brandType || "Brand",
      commercialUse: data.commercialUse !== false,
      createdAt: Date.now(),
      postedAt: new Date().toISOString().slice(0, 10),
      status: "open",
      applicants: 0,
      ...data
    };
    read().briefs.unshift(record);
    persist();
    emit("briefs", "create", record);
    return record;
  }

  function updateBrief(id, patch) {
    const b = brief(id);
    if (!b) return null;
    Object.assign(b, patch);
    persist();
    emit("briefs", "update", b);
    return b;
  }

  function deleteBrief(id) {
    const s = read();
    s.briefs = s.briefs.filter((b) => b.id !== id);
    persist();
    emit("briefs", "delete", { id });
  }

  /* ---------- Shortlist ---------- */
  const saved = () => read().saved;
  const isSaved = (id) => read().saved.includes(id);
  function toggleSaved(id) {
    const s = read();
    const i = s.saved.indexOf(id);
    if (i >= 0) s.saved.splice(i, 1);
    else s.saved.push(id);
    persist();
    return i < 0;
  }

  /* ---------- Proposals (creator side) ---------- */
  const proposals = () => read().proposals;
  function addProposal(p) {
    const record = { id: uid("p"), createdAt: Date.now(), status: "sent", ...p };
    read().proposals.unshift(record);
    persist();
    emit("proposals", "create", record);
    return record;
  }

  /* ---------- Stats ---------- */
  const spend = () => orders().filter((o) => o.status !== "cancelled").reduce((s, o) => s + o.total, 0);
  const activeOrders = () => orders().filter((o) => !["delivered", "cancelled"].includes(o.status));
  const deliveredOrders = () => orders().filter((o) => o.status === "delivered");

  function reset() {
    cache = structuredClone(DEFAULTS);
    try {
      localStorage.removeItem(KEY);
      localStorage.removeItem(SEED_KEY);
    } catch { /* ignore */ }
    return read();
  }

  return {
    read, getBrand, setBrand,
    orders, order, placeOrder, advanceOrder, cancelOrder, activeOrders, deliveredOrders, spend,
    briefs, openBriefs, brief, createBrief, updateBrief, deleteBrief,
    saved, isSaved, toggleSaved,
    proposals, addProposal,
    statusLabel, reset, uid,
    subscribe, emit
  };
})();
