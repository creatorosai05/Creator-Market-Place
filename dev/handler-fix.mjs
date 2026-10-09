/* Local fixture check for functions/handler.mjs — credential-free fake Supabase.
   Run: node dev/handler-fix.mjs   (from project root) */
import { handleMarket } from "../functions/handler.mjs";

const db = { briefs: [], orders: [], proposals: [] };

class Q {
  constructor(table) { this.table = table; this.filters = []; this.cols = null; this.lim = null; this.ord = null; this.term = "list"; }
  select(cols) { this.cols = cols; return this; }
  insert(row) { this.mode = "insert"; this.row = row; return this; }
  update(patch) { this.mode = "update"; this.patch = patch; return this; }
  eq(c, v) { this.filters.push((r) => r[c] === v); return this; }
  neq(c, v) { this.filters.push((r) => r[c] !== v); return this; }
  in(c, arr) { this.filters.push((r) => arr.includes(r[c])); return this; }
  order(c, { ascending = true } = {}) { this.ord = [c, ascending]; return this; }
  limit(n) { this.lim = n; return this; }
  maybeSingle() { this.term = "maybe"; return this; }
  single() { this.term = "single"; return this; }
  then(res, rej) { try { res(this.run()); } catch (e) { rej(e); } }
  pick(rows) {
    if (!this.cols) return rows.map((r) => ({ ...r }));
    const keys = this.cols.split(",").map((s) => s.trim());
    return rows.map((r) => Object.fromEntries(keys.map((k) => [k, r[k] === undefined ? null : r[k]])));
  }
  run() {
    const t = db[this.table];
    if (this.mode === "insert") {
      if (t.some((r) => r.id === this.row.id)) return { data: null, error: { code: "23505" } };
      t.push({ ...this.row });
      const row = t[t.length - 1];
      return { data: this.term === "single" ? this.pick([row])[0] : this.pick([row]), error: null };
    }
    if (this.mode === "update") {
      const hit = t.filter((r) => this.filters.every((f) => f(r)));
      for (const r of hit) Object.assign(r, this.patch);
      const out = this.pick(hit);
      return { data: this.term === "maybe" ? (out[0] ?? null) : out, error: null };
    }
    let rows = t.filter((r) => this.filters.every((f) => f(r)));
    if (this.ord) { const [c, asc] = this.ord; rows = rows.slice().sort((a, b) => (a[c] > b[c] ? 1 : -1) * (asc ? 1 : -1)); }
    if (this.lim) rows = rows.slice(0, this.lim);
    const out = this.pick(rows);
    return { data: this.term === "maybe" ? (out[0] ?? null) : out, error: null };
  }
}
const supabase = { from: (t) => new Q(t) };

const req = (method, url, body) => new Request(`http://fn.local/functions/v1/app${url}`, {
  method,
  headers: body ? { "content-type": "application/json", "content-length": String(JSON.stringify(body).length) } : {},
  body: body ? JSON.stringify(body) : undefined,
});
const call = async (method, url, body) => {
  const r = await handleMarket({ request: req(method, url, body), supabase });
  return { status: r.status, body: await r.json() };
};

let pass = 0, fail = 0;
const check = (name, cond, extra = "") => {
  if (cond) { pass++; console.log("  ok  ", name); }
  else { fail++; console.log("  FAIL", name, extra); }
};

const briefPayload = {
  id: "b-test-001", title: "12 reels for a D2C launch", brand: "Glow Labs", category: "video",
  language: "hindi", quantity: 12, deadlineDays: 30, budgetMin: 27000, budgetMax: 45500,
  description: "Sample cloud round-trip brief.", deliverables: ["12 reels", "Landing page"],
  tools: ["Runway"], niches: ["d2c"], complexity: "high", summary: "s", searchKeywords: ["reels"],
  aiConfidence: 94,
};

const r1 = await call("POST", "?r=briefs", briefPayload);
check("create brief", r1.status === 200 && r1.body.ok && r1.body.item.edit_key, JSON.stringify(r1));
const editKey = r1.body.item?.edit_key;
check("created row keeps client id", r1.body.item?.id === "b-test-001");

const r2 = await call("GET", "?r=briefs");
check("list briefs hides edit_key", r2.body.items?.length === 1 && !("edit_key" in r2.body.items[0]));

const r3 = await call("PATCH", "?r=briefs", { id: "b-test-001", editKey: "00000000-0000-4000-8000-000000000000", patch: { status: "filled" } });
check("wrong edit key rejected 403", r3.status === 403 && r3.body.error === "not_owner", JSON.stringify(r3));

const r4 = await call("PATCH", "?r=briefs", { id: "b-test-001", editKey, patch: { status: "filled", title: "12 reels — updated" } });
check("owner update applies", r4.body.item?.status === "filled" && r4.body.item?.title === "12 reels — updated");

const r5 = await call("GET", "?r=briefs&status=open");
check("filled brief leaves open board", r5.body.items?.length === 0);

const r6 = await call("PATCH", "?r=briefs", { id: "b-nope", editKey, patch: { status: "open" } });
check("unknown brief 404", r6.status === 404);

const r7 = await call("POST", "?r=orders", {
  id: "o-test-001", gigId: "g01", creatorId: "c01", packageKey: "premium", packageName: "Growth",
  brand: "Glow Labs", brief: "12 reels", subtotal: 24999, fee: 2000, total: 26999, dueDays: 2,
  addons: [{ name: "Rush", price: 1500 }],
});
check("create order", r7.status === 200 && r7.body.item?.edit_key, JSON.stringify(r7));
const orderKey = r7.body.item?.edit_key;

const r8 = await call("GET", `?r=orders&keys=${orderKey}`);
check("orders by key, no edit_key leaked", r8.body.items?.length === 1 && !("edit_key" in r8.body.items[0]));

const r9 = await call("GET", "?r=orders&keys=00000000-0000-4000-8000-000000000000");
check("foreign key sees nothing", r9.body.items?.length === 0);

const r10 = await call("PATCH", "?r=orders", { id: "o-test-001", editKey: orderKey, status: "delivered" });
check("order advance", r10.body.item?.status === "delivered");

const r11 = await call("PATCH", "?r=orders", { id: "o-test-001", editKey: orderKey, status: "bogus" });
check("bad status rejected 400", r11.status === 400);

const r12 = await call("POST", "?r=proposals", { id: "p-test-001", briefId: "b-test-001", creatorId: "c01", note: "Keen to take this on." });
check("create proposal", r12.status === 200);
const r13 = await call("GET", "?r=proposals&brief=b-test-001");
check("list proposals", r13.body.items?.length === 1);

const r14 = await call("GET", "?r=nope");
check("unknown route 404", r14.status === 404);
const r15 = await call("DELETE", "?r=briefs");
check("unsupported method 405", r15.status === 405);
const r16 = await call("POST", "?r=briefs", { title: "x".repeat(500), category: "video" });
check("oversized title truncated not rejected", r16.status === 200 && r16.body.item.title.length === 140);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
