/* Browse creators — filters, sorting and AI relevance ranking */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  const state = {
    q: "",
    categories: new Set(),
    tools: new Set(),
    niches: new Set(),
    languages: new Set(),
    budget: 60000,
    delivery: 10,
    rating: 4,
    verified: false,
    online: false,
    savedOnly: false,
    sort: "relevance"
  };

  /* Read URL params on load */
  const params = new URLSearchParams(location.search);
  if (params.get("category")) state.categories.add(params.get("category"));
  if (params.get("tool")) state.tools.add(params.get("tool"));
  if (params.get("q")) state.q = params.get("q");
  if (params.get("sort")) state.sort = params.get("sort");
  if (params.get("saved") === "1") state.savedOnly = true;

  const entryPrice = (c) => Math.min(...DB.gigsOf(c.id).map((g) => DB.LOWEST(g)));

  function buildFilters() {
    $("#searchIcon").innerHTML = UI.icon("search", 17);
    $("#filterIcon").innerHTML = UI.icon("filter", 16);

    const chipBtn = (label, group, value, count) =>
      `<button type="button" class="chip chip-btn" data-group="${group}" data-value="${UI.esc(value)}" aria-pressed="false">${UI.esc(label)}${count != null ? ` <span class="mono" style="opacity:.6">${count}</span>` : ""}</button>`;

    $("#fCategory").innerHTML = DB.CATEGORIES
      .map((c) => chipBtn(c.short, "categories", c.id, DB.CREATORS.filter((x) => x.categories.includes(c.id)).length))
      .join("");

    const toolCounts = new Map();
    DB.CREATORS.forEach((c) => c.tools.forEach((t) => toolCounts.set(t, (toolCounts.get(t) || 0) + 1)));
    const topTools = [...toolCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12);
    $("#fTools").innerHTML = topTools.map(([t, n]) => chipBtn(t, "tools", t, n)).join("");

    $("#fNiche").innerHTML = DB.NICHES
      .map((n) => chipBtn(n.name, "niches", n.id, DB.CREATORS.filter((c) => c.niches.includes(n.id)).length))
      .join("");

    const langCounts = new Map();
    DB.CREATORS.forEach((c) => c.languages.forEach((l) => langCounts.set(l, (langCounts.get(l) || 0) + 1)));
    $("#fLang").innerHTML = [...langCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 9)
      .map(([l, n]) => chipBtn(l, "languages", l, n)).join("");

    $$("[data-group]").forEach((btn) => btn.addEventListener("click", () => {
      const set = state[btn.dataset.group];
      const v = btn.dataset.value;
      if (set.has(v)) set.delete(v); else set.add(v);
      btn.setAttribute("aria-pressed", String(set.has(v)));
      render();
    }));
  }

  function syncControls() {
    $("#q").value = state.q;
    $("#sort").value = state.sort;
    $("#fBudget").value = state.budget;
    $("#fDelivery").value = state.delivery;
    $("#fRating").value = state.rating;
    $("#fVerified").checked = state.verified;
    $("#fOnline").checked = state.online;
    $("#fSaved").checked = state.savedOnly;
    $$("[data-group]").forEach((b) => b.setAttribute("aria-pressed", String(state[b.dataset.group].has(b.dataset.value))));
    $("#budgetValue").textContent = state.budget >= 60000 ? "Any" : `≤ ${UI.compactMoney(state.budget)}`;
    $("#deliveryValue").textContent = state.delivery >= 10 ? "Any" : `≤ ${state.delivery} days`;
    $("#ratingValue").textContent = `${state.rating.toFixed(1)}+`;
  }

  function matches(c) {
    if (state.categories.size && !c.categories.some((x) => state.categories.has(x))) return false;
    if (state.tools.size && !c.tools.some((t) => state.tools.has(t))) return false;
    if (state.niches.size && !c.niches.some((n) => state.niches.has(n))) return false;
    if (state.languages.size && !c.languages.some((l) => state.languages.has(l))) return false;
    if (state.budget < 60000 && entryPrice(c) > state.budget) return false;
    if (state.delivery < 10 && c.deliveryDays > state.delivery) return false;
    if (c.rating < state.rating) return false;
    if (state.verified && !c.verified) return false;
    if (state.online && !c.online) return false;
    if (state.savedOnly && !Store.isSaved(c.id)) return false;
    if (state.q) return true; /* handled by search ranking below */
    return true;
  }

  function sortList(rows) {
    const s = state.sort;
    const cmp = {
      quality: (a, b) => AI.qualityScore(b.creator).score - AI.qualityScore(a.creator).score,
      rating: (a, b) => b.creator.rating - a.creator.rating || b.creator.reviews - a.creator.reviews,
      "price-low": (a, b) => entryPrice(a.creator) - entryPrice(b.creator),
      "price-high": (a, b) => entryPrice(b.creator) - entryPrice(a.creator),
      fastest: (a, b) => a.creator.deliveryDays - b.creator.deliveryDays || b.creator.rating - a.creator.rating,
      orders: (a, b) => b.creator.completedOrders - a.creator.completedOrders,
      relevance: (a, b) => b.relevance - a.relevance
    }[s] || ((a, b) => b.relevance - a.relevance);
    return rows.sort(cmp);
  }

  function render() {
    syncControls();

    let rows;
    if (state.q.trim()) {
      rows = AI.searchCreators(state.q, DB.CREATORS.filter(matches));
    } else {
      rows = DB.CREATORS.filter(matches).map((c) => ({ creator: c, relevance: AI.qualityScore(c).score }));
    }
    rows = sortList(rows);

    const active = state.categories.size + state.tools.size + state.niches.size + state.languages.size +
      (state.budget < 60000 ? 1 : 0) + (state.delivery < 10 ? 1 : 0) + (state.rating > 4 ? 1 : 0) +
      (state.verified ? 1 : 0) + (state.online ? 1 : 0) + (state.savedOnly ? 1 : 0) + (state.q ? 1 : 0);
    $("#activeCount").textContent = `${active} active`;
    $("#activeCount").className = active ? "chip chip-violet" : "chip";

    $("#resultCount").textContent = rows.length
      ? `${rows.length} creator${rows.length === 1 ? "" : "s"} match your filters.`
      : "Nothing matches those filters yet.";

    $("#results").innerHTML = rows.length
      ? rows.map((r) => UI.creatorCard(r.creator)).join("")
      : UI.empty({
        title: "No creators match",
        body: "Loosen a filter or two. Price and delivery time are the two that narrow results fastest.",
        cta: `<button class="btn btn-primary btn-sm" id="emptyReset">Reset all filters</button>`
      });

    $("#emptyReset")?.addEventListener("click", resetAll);
    UI.bindSaveButtons($("#results"));

    /* Keep the URL shareable */
    const p = new URLSearchParams();
    if (state.q) p.set("q", state.q);
    if (state.categories.size === 1) p.set("category", [...state.categories][0]);
    if (state.sort !== "relevance") p.set("sort", state.sort);
    if (state.savedOnly) p.set("saved", "1");
    const next = `${location.pathname}${p.toString() ? "?" + p : ""}`;
    history.replaceState(null, "", next);
  }

  function resetAll() {
    state.q = "";
    state.categories.clear();
    state.tools.clear();
    state.niches.clear();
    state.languages.clear();
    state.budget = 60000;
    state.delivery = 10;
    state.rating = 4;
    state.verified = false;
    state.online = false;
    state.savedOnly = false;
    state.sort = "relevance";
    render();
  }

  /* Wire controls */
  let debounce;
  $("#q").addEventListener("input", (e) => {
    clearTimeout(debounce);
    debounce = setTimeout(() => { state.q = e.target.value; render(); }, 180);
  });
  $("#sort").addEventListener("change", (e) => { state.sort = e.target.value; render(); });
  $("#fBudget").addEventListener("input", (e) => { state.budget = +e.target.value; syncControls(); });
  $("#fBudget").addEventListener("change", render);
  $("#fDelivery").addEventListener("input", (e) => { state.delivery = +e.target.value; syncControls(); });
  $("#fDelivery").addEventListener("change", render);
  $("#fRating").addEventListener("input", (e) => { state.rating = +e.target.value; syncControls(); });
  $("#fRating").addEventListener("change", render);
  $("#fVerified").addEventListener("change", (e) => { state.verified = e.target.checked; render(); });
  $("#fOnline").addEventListener("change", (e) => { state.online = e.target.checked; render(); });
  $("#fSaved").addEventListener("change", (e) => { state.savedOnly = e.target.checked; render(); });
  $("#resetFilters").addEventListener("click", resetAll);

  buildFilters();
  render();
})();
