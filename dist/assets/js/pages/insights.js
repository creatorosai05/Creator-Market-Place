/* Marketplace insights — computed live from the catalogue */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const T = AI.trends();
  const t = T.totals;

  /* ---------- Headline totals ---------- */
  $("#totals").innerHTML = [
    { k: "Verified creators", v: t.creators, d: `${t.verifiedShare}% identity-verified`, icon: "users" },
    { k: "Live listings", v: t.gigs, d: `${t.openBriefs} open briefs competing`, icon: "layers" },
    { k: "Orders fulfilled", v: UI.compact(t.orders), d: `${UI.compactMoney(t.gmv)} transacted`, icon: "briefcase" },
    { k: "Avg first response", v: `${t.avgResponse}m`, d: `Marketplace rating ${t.avgRating}★`, icon: "clock" }
  ].map((s) => `<div class="stat">
    <span class="k">${UI.icon(s.icon, 13, 2)} ${UI.esc(s.k)}</span>
    <span class="v">${typeof s.v === "number" ? s.v : UI.esc(s.v)}</span>
    <span class="d">${UI.esc(s.d)}</span>
  </div>`).join("");

  /* ---------- Category economics ---------- */
  const maxOrders = Math.max(...T.categories.map((c) => c.orders));
  $("#categoryTable").innerHTML = `<div class="table-wrap">
    <table>
      <thead><tr>
        <th>Category</th><th class="td-num">Creators</th><th class="td-num">Listings</th>
        <th class="td-num">Orders</th><th>Demand</th><th class="td-num">Avg price</th>
        <th class="td-num">Supply / demand</th><th>Signal</th>
      </tr></thead>
      <tbody>${T.categories.map((c) => {
        const gap = c.supplyGap;
        const tight = gap < 1.2;
        const loose = gap > 3;
        return `<tr>
          <td><a href="creators.html?category=${c.id}" style="font-weight:550">${UI.esc(c.name)}</a><div class="tiny">${UI.esc(c.blurb.slice(0, 52))}…</div></td>
          <td class="td-num">${c.creators}</td>
          <td class="td-num">${c.gigs}</td>
          <td class="td-num">${UI.compact(c.orders)}</td>
          <td style="min-width:110px">${UI.bar(c.orders, maxOrders)}</td>
          <td class="td-num">${UI.compactMoney(c.avgPrice)}</td>
          <td class="td-num"><span class="${tight ? "text-rose" : loose ? "text-sky" : "text-mint"}">${gap.toFixed(2)}</span></td>
          <td>${tight ? `<span class="chip chip-rose">Tight supply</span>` : loose ? `<span class="chip chip-sky">Buyer's market</span>` : `<span class="chip chip-mint">Balanced</span>`}</td>
        </tr>`;
      }).join("")}</tbody>
    </table>
  </div>
  <p class="tiny mt-3" style="color:var(--dim)">Supply/demand compares creators in a category against open briefs plus trending listings. Below 1.20 means brands are competing for the same few people.</p>`;

  /* ---------- Price chart ---------- */
  const maxPrice = Math.max(...T.priceByCategory.map((c) => c.value));
  $("#priceChart").innerHTML = `<div class="stack" style="gap:13px">
    ${T.priceByCategory.slice().sort((a, b) => b.value - a.value).map((c) => `<div>
      <div class="spread" style="gap:10px"><span style="font-size:.84rem">${UI.esc(c.name)}</span><span class="tiny mono">${UI.money(c.value)}</span></div>
      <div class="mt-1">${UI.bar(c.value, maxPrice)}</div>
    </div>`).join("")}
  </div>
  <p class="tiny mt-4" style="line-height:1.6;color:var(--dim)">Mean of all three package tiers across every listing in the category. Long-form video and brand identity command the highest absolute prices; short-form video has the tightest spread.</p>`;

  /* ---------- Tool demand ---------- */
  const maxTool = Math.max(...T.topTools.map((x) => x.creators));
  $("#toolChart").innerHTML = `<div class="stack" style="gap:11px">
    ${T.topTools.map((x) => `<div>
      <div class="spread" style="gap:10px">
        <a href="creators.html?tool=${encodeURIComponent(x.name)}" style="font-size:.84rem">${UI.esc(x.name)}</a>
        <span class="tiny mono">${x.creators} creators · ${x.avgRating}★</span>
      </div>
      <div class="mt-1">${UI.bar(x.creators, maxTool)}</div>
    </div>`).join("")}
  </div>`;

  /* ---------- Quality leaderboard ---------- */
  $("#leaderboard").innerHTML = `<table>
    <thead><tr><th>#</th><th>Creator</th><th class="td-num">Score</th><th class="td-num">Rating</th><th class="td-num">Orders</th><th class="td-num">Repeat</th><th>Band</th></tr></thead>
    <tbody>${DB.CREATORS.map((c) => ({ c, q: AI.qualityScore(c) }))
      .sort((a, b) => b.q.score - a.q.score)
      .map((row, i) => `<tr>
        <td class="td-num mono">${String(i + 1).padStart(2, "0")}</td>
        <td><div class="row" style="gap:9px;flex-wrap:nowrap">
          ${UI.avatar(row.c, "xs")}
          <div style="min-width:0"><a href="creator.html?id=${row.c.id}" style="font-weight:550;font-size:.87rem">${UI.esc(row.c.name)}</a>
          <div class="tiny truncate" style="max-width:24ch">${UI.esc(row.c.title)}</div></div>
        </div></td>
        <td class="td-num"><strong style="color:var(--${row.q.band.color})">${row.q.score}</strong> <span class="tiny">${row.q.grade}</span></td>
        <td class="td-num">${row.c.rating.toFixed(1)}</td>
        <td class="td-num">${UI.compact(row.c.completedOrders)}</td>
        <td class="td-num">${Math.round(row.c.repeatClientRate * 100)}%</td>
        <td><span class="chip chip-${row.q.band.color}">${UI.esc(row.q.band.label)}</span></td>
      </tr>`).join("")}</tbody>
  </table>`;

  /* ---------- Weight card ---------- */
  const WEIGHTS = [
    { label: "Buyer rating", w: 34, note: "Normalised between 3.5★ and 5.0★, so the difference between 4.6 and 4.9 actually counts." },
    { label: "On-time delivery", w: 17, note: "Share of orders delivered by the promised date." },
    { label: "Repeat clients", w: 17, note: "The hardest signal to fake — buyers who came back." },
    { label: "Order volume", w: 16, note: "Log-scaled so a new specialist is not permanently buried under veterans." },
    { label: "Response speed", w: 11, note: "Inverse of typical first-reply time, capped at three hours." },
    { label: "Identity verified", w: 5, note: "Binary gate. Some enterprise briefs exclude unverified creators entirely." }
  ];
  $("#weightCard").innerHTML = `
    <span class="eyebrow">Scoring model</span>
    <h3 class="mt-2" style="font-size:1.05rem">Six weighted signals</h3>
    <p class="sub mt-2" style="font-size:.86rem">Deliberately excludes anything a creator can buy: no sponsored placement, no paid boost, no listing-age bonus.</p>
    <div class="stack mt-4" style="gap:13px">
      ${WEIGHTS.map((w) => `<div>
        <div class="spread" style="gap:10px"><span style="font-size:.85rem;font-weight:550">${UI.esc(w.label)}</span><span class="tiny mono text-violet">${w.w}%</span></div>
        <div class="mt-1">${UI.bar(w.w, 34)}</div>
        <p class="tiny mt-1" style="line-height:1.5;color:var(--dim)">${UI.esc(w.note)}</p>
      </div>`).join("")}
    </div>
    <div class="card card-flat card-pad-sm mt-4" style="border-color:rgba(0,229,195,.22)">
      <div class="row" style="gap:8px"><span class="text-mint">${UI.icon("shield", 14, 2.2)}</span><strong style="font-size:.85rem">Grade bands</strong></div>
      <div class="row mt-3" style="gap:5px">
        ${[["A+ / A", 85, "mint"], ["A-", 78, "mint"], ["B+", 70, "violet"], ["B", 62, "violet"], ["C+", 55, "amber"], ["C", 0, "sky"]].map(([g, min, col]) => `<span class="chip chip-${col}" title="${min}+">${g}</span>`).join("")}
      </div>
    </div>`;

  /* ---------- Tag cloud ---------- */
  const maxTag = Math.max(...T.risingTags.map((x) => x.weight));
  $("#tagCloud").innerHTML = T.risingTags.map((x) => {
    const scale = 0.78 + (x.weight / maxTag) * 0.62;
    return `<a href="creators.html?q=${encodeURIComponent(x.tag)}" class="chip chip-btn" style="font-size:${scale.toFixed(2)}rem;padding:${(4 + scale * 3).toFixed(0)}px ${(9 + scale * 5).toFixed(0)}px">${UI.esc(x.tag)} <span class="mono" style="opacity:.55">${x.weight}</span></a>`;
  }).join("");
})();
