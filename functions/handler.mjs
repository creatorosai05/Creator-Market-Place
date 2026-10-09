/* ============================================================
   CreatorMatch AI — application handler
   Routes (query-param routed, pathname-independent):
     GET    ?r=health
     GET    ?r=briefs[&status=open]        public brief board
     GET    ?r=brief&id=                   one public brief
     POST   ?r=briefs                      post a brief (returns edit_key once)
     PATCH  ?r=briefs                      edit own brief (edit_key required)
     GET    ?r=orders&keys=k1,k2           orders owned by the supplied edit keys
     POST   ?r=orders                      place an order (returns edit_key once)
     PATCH  ?r=orders                      advance/cancel own order
     GET    ?r=proposals&brief=            proposals for one brief
     POST   ?r=proposals                   send a proposal
   Access model: public read + public create; updates require the edit_key
   that was returned once at create time and stored on the posting device.
   No delete is granted anywhere — removals are soft (status "deleted").
   ============================================================ */

const json = (body, status = 200, headers = {}) => Response.json(body, {
  status,
  headers: { "cache-control": "no-store", ...headers },
});

const MAX_BODY = 64000;
const ID_RE = /^[A-Za-z0-9_-]{2,40}$/;
const KEY_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const BRIEF_COLUMNS = "id,title,brand,category,language,quantity,deadline_days,budget_min,budget_max,description,deliverables,signals,ai_confidence,status,created_at";
const ORDER_COLUMNS = "id,gig_id,creator_id,package_key,package_name,brand,brief_text,subtotal,fee,total,due_days,addons,status,created_at,updated_at";
const PROPOSAL_COLUMNS = "id,brief_id,creator_id,note,created_at";

const BRIEF_STATUS = ["open", "in-review", "filled", "closed", "deleted"];
const ORDER_STATUS = ["placed", "in-progress", "review", "delivered", "cancelled"];
const PACKAGE_KEYS = ["basic", "standard", "premium"];

/* ---------- validation helpers ---------- */
const str = (v, max, fallback = "") => (typeof v === "string" ? v.slice(0, max) : fallback);
const int = (v, lo, hi, fallback) => {
  const n = typeof v === "number" ? v : parseInt(v, 10);
  return Number.isInteger(n) && n >= lo && n <= hi ? n : fallback;
};
const strList = (v, maxItems, maxLen) => {
  if (!Array.isArray(v)) return [];
  return v.filter((x) => typeof x === "string" && x.trim()).slice(0, maxItems).map((x) => x.trim().slice(0, maxLen));
};
const nowIso = () => new Date().toISOString();

function readBody(request) {
  return request.json();
}

function briefRow(b) {
  return {
    id: str(b.id, 40),
    title: str(b.title, 140, "Untitled brief"),
    brand: str(b.brand, 60, "Your Brand"),
    category: str(b.category, 24),
    language: str(b.language, 24, "english"),
    quantity: int(b.quantity, 1, 500, 1),
    deadline_days: int(b.deadlineDays ?? b.deadline_days, 1, 365, 14),
    budget_min: int(b.budgetMin ?? b.budget_min, 0, 100000000, null),
    budget_max: int(b.budgetMax ?? b.budget_max, 0, 100000000, null),
    description: str(b.description, 4000),
    deliverables: strList(b.deliverables, 12, 90),
    signals: {
      tools: strList(b.tools ?? b.signals?.tools, 12, 40),
      niches: strList(b.niches ?? b.signals?.niches, 8, 40),
      complexity: str(b.complexity ?? b.signals?.complexity, 12, "medium"),
      summary: str(b.summary ?? b.signals?.summary, 400),
      keywords: strList(b.searchKeywords ?? b.signals?.keywords, 24, 30),
      brandType: str(b.brandType ?? b.signals?.brandType, 24, "Brand"),
    },
    ai_confidence: int(b.aiConfidence ?? b.ai_confidence, 0, 100, 0),
    status: BRIEF_STATUS.includes(b.status) ? b.status : "open",
    created_at: nowIso(),
  };
}

function orderRow(o) {
  return {
    id: str(o.id, 40),
    gig_id: str(o.gigId ?? o.gig_id, 40),
    creator_id: str(o.creatorId ?? o.creator_id, 40),
    package_key: PACKAGE_KEYS.includes(o.packageKey ?? o.package_key) ? (o.packageKey ?? o.package_key) : "standard",
    package_name: str(o.packageName ?? o.package_name, 60, "Standard"),
    brand: str(o.brand, 60, "Your Brand"),
    brief_text: str(o.briefText ?? o.brief ?? o.brief_text, 4000),
    subtotal: int(o.subtotal, 0, 100000000, 0),
    fee: int(o.fee, 0, 100000000, 0),
    total: int(o.total, 0, 100000000, 0),
    due_days: int(o.dueDays ?? o.due_days, 1, 365, 7),
    addons: Array.isArray(o.addons)
      ? o.addons.slice(0, 8).map((a) => ({ name: str(a?.name, 60), price: int(a?.price, 0, 100000000, 0) }))
      : [],
    status: ORDER_STATUS.includes(o.status) ? o.status : "placed",
    created_at: nowIso(),
    updated_at: nowIso(),
  };
}

/* ---------- ownership check: the edit key proves the posting device ---------- */
async function ownerOf(supabase, table, id, editKey) {
  const { data, error } = await supabase.from(table).select("id,edit_key").eq("id", id).maybeSingle();
  if (error || data === undefined) throw new Error("database_request_failed");
  if (!data) return { code: "not_found", status: 404 };
  if (data.edit_key !== editKey) return { code: "not_owner", status: 403 };
  return { code: null, status: 200 };
}

export async function handleMarket({ request, supabase }) {
  const url = new URL(request.url);
  const route = url.searchParams.get("r");
  const method = request.method;

  try {
    if (route === "health") {
      if (method !== "GET") return json({ ok: false, error: "method_not_allowed" }, 405, { allow: "GET" });
      return json({ ok: true, service: "creatormatch", schema: 1 });
    }

    /* ---------------- briefs ---------------- */
    if (route === "briefs") {
      if (method === "GET") {
        const status = url.searchParams.get("status");
        let q = supabase.from("briefs").select(BRIEF_COLUMNS).order("created_at", { ascending: false }).limit(100);
        if (status === "open") q = q.in("status", ["open", "in-review"]);
        else if (status && BRIEF_STATUS.includes(status)) q = q.eq("status", status);
        else q = q.neq("status", "deleted");
        const { data, error } = await q;
        if (error || !Array.isArray(data)) return json({ ok: false, error: "database_request_failed" }, 503);
        return json({ ok: true, items: data });
      }
      if (method === "POST") {
        if ((request.headers.get("content-length") || "0") > MAX_BODY) return json({ ok: false, error: "body_too_large" }, 413);
        const body = await readBody(request);
        if (!body || typeof body !== "object") return json({ ok: false, error: "invalid_body" }, 400);
        const row = briefRow(body);
        if (!row.category) return json({ ok: false, error: "invalid_category" }, 400);
        if (!ID_RE.test(row.id)) row.id = crypto.randomUUID();
        const editKey = crypto.randomUUID();
        const { data, error } = await supabase.from("briefs")
          .insert({ ...row, edit_key: editKey })
          .select(`${BRIEF_COLUMNS},edit_key`).single();
        if (error) {
          if (error.code === "23505") return json({ ok: false, error: "conflict" }, 409);
          return json({ ok: false, error: "database_request_failed" }, 503);
        }
        return json({ ok: true, item: data });
      }
      if (method === "PATCH") {
        const body = await readBody(request);
        const id = str(body?.id, 40);
        const editKey = str(body?.editKey, 64);
        if (!ID_RE.test(id) || !KEY_RE.test(editKey)) return json({ ok: false, error: "invalid_body" }, 400);
        const own = await ownerOf(supabase, "briefs", id, editKey);
        if (own.code) return json({ ok: false, error: own.code }, own.status);
        const patch = {};
        const src = body.patch || body;
        if (src.title !== undefined) patch.title = str(src.title, 140, "Untitled brief");
        if (src.brand !== undefined) patch.brand = str(src.brand, 60, "Your Brand");
        if (src.category !== undefined) patch.category = str(src.category, 24);
        if (src.language !== undefined) patch.language = str(src.language, 24, "english");
        if (src.quantity !== undefined) patch.quantity = int(src.quantity, 1, 500, 1);
        if (src.deadlineDays !== undefined) patch.deadline_days = int(src.deadlineDays, 1, 365, 14);
        if (src.budgetMin !== undefined) patch.budget_min = int(src.budgetMin, 0, 100000000, null);
        if (src.budgetMax !== undefined) patch.budget_max = int(src.budgetMax, 0, 100000000, null);
        if (src.description !== undefined) patch.description = str(src.description, 4000);
        if (src.deliverables !== undefined) patch.deliverables = strList(src.deliverables, 12, 90);
        if (src.status !== undefined && BRIEF_STATUS.includes(src.status)) patch.status = src.status;
        if (src.aiConfidence !== undefined) patch.ai_confidence = int(src.aiConfidence, 0, 100, 0);
        if (!Object.keys(patch).length) return json({ ok: false, error: "nothing_to_update" }, 400);
        const { data, error } = await supabase.from("briefs").update(patch).eq("id", id)
          .select(BRIEF_COLUMNS).maybeSingle();
        if (error) return json({ ok: false, error: "database_request_failed" }, 503);
        if (!data) return json({ ok: false, error: "not_found" }, 404);
        return json({ ok: true, item: data });
      }
      return json({ ok: false, error: "method_not_allowed" }, 405, { allow: "GET, POST, PATCH" });
    }

    if (route === "brief") {
      if (method !== "GET") return json({ ok: false, error: "method_not_allowed" }, 405, { allow: "GET" });
      const id = str(url.searchParams.get("id"), 40);
      if (!ID_RE.test(id)) return json({ ok: false, error: "invalid_id" }, 400);
      const { data, error } = await supabase.from("briefs").select(BRIEF_COLUMNS).eq("id", id).maybeSingle();
      if (error) return json({ ok: false, error: "database_request_failed" }, 503);
      if (!data || data.status === "deleted") return json({ ok: false, error: "not_found" }, 404);
      return json({ ok: true, item: data });
    }

    /* ---------------- orders ---------------- */
    if (route === "orders") {
      if (method === "GET") {
        const keys = (url.searchParams.get("keys") || "").split(",").filter((k) => KEY_RE.test(k)).slice(0, 50);
        if (!keys.length) return json({ ok: true, items: [] });
        const { data, error } = await supabase.from("orders").select(ORDER_COLUMNS)
          .in("edit_key", keys).order("created_at", { ascending: false }).limit(100);
        if (error || !Array.isArray(data)) return json({ ok: false, error: "database_request_failed" }, 503);
        return json({ ok: true, items: data });
      }
      if (method === "POST") {
        if ((request.headers.get("content-length") || "0") > MAX_BODY) return json({ ok: false, error: "body_too_large" }, 413);
        const body = await readBody(request);
        if (!body || typeof body !== "object") return json({ ok: false, error: "invalid_body" }, 400);
        const row = orderRow(body);
        if (!row.gig_id || !row.creator_id) return json({ ok: false, error: "invalid_order" }, 400);
        if (!ID_RE.test(row.id)) row.id = crypto.randomUUID();
        const editKey = crypto.randomUUID();
        const { data, error } = await supabase.from("orders")
          .insert({ ...row, edit_key: editKey })
          .select(`${ORDER_COLUMNS},edit_key`).single();
        if (error) {
          if (error.code === "23505") return json({ ok: false, error: "conflict" }, 409);
          return json({ ok: false, error: "database_request_failed" }, 503);
        }
        return json({ ok: true, item: data });
      }
      if (method === "PATCH") {
        const body = await readBody(request);
        const id = str(body?.id, 40);
        const editKey = str(body?.editKey, 64);
        const status = str(body?.status, 20);
        if (!ID_RE.test(id) || !KEY_RE.test(editKey) || !ORDER_STATUS.includes(status)) {
          return json({ ok: false, error: "invalid_body" }, 400);
        }
        const own = await ownerOf(supabase, "orders", id, editKey);
        if (own.code) return json({ ok: false, error: own.code }, own.status);
        const { data, error } = await supabase.from("orders")
          .update({ status, updated_at: nowIso() }).eq("id", id)
          .select(ORDER_COLUMNS).maybeSingle();
        if (error) return json({ ok: false, error: "database_request_failed" }, 503);
        if (!data) return json({ ok: false, error: "not_found" }, 404);
        return json({ ok: true, item: data });
      }
      return json({ ok: false, error: "method_not_allowed" }, 405, { allow: "GET, POST, PATCH" });
    }

    /* ---------------- proposals ---------------- */
    if (route === "proposals") {
      if (method === "GET") {
        const briefId = str(url.searchParams.get("brief"), 40);
        if (!ID_RE.test(briefId)) return json({ ok: false, error: "invalid_id" }, 400);
        const { data, error } = await supabase.from("proposals").select(PROPOSAL_COLUMNS)
          .eq("brief_id", briefId).order("created_at", { ascending: false }).limit(50);
        if (error || !Array.isArray(data)) return json({ ok: false, error: "database_request_failed" }, 503);
        return json({ ok: true, items: data });
      }
      if (method === "POST") {
        const body = await readBody(request);
        if (!body || typeof body !== "object") return json({ ok: false, error: "invalid_body" }, 400);
        const row = {
          id: ID_RE.test(str(body.id, 40)) ? str(body.id, 40) : crypto.randomUUID(),
          brief_id: str(body.briefId ?? body.brief_id, 40),
          creator_id: str(body.creatorId ?? body.creator_id, 40),
          note: str(body.note, 2000),
          created_at: nowIso(),
        };
        if (!ID_RE.test(row.brief_id) || !ID_RE.test(row.creator_id)) return json({ ok: false, error: "invalid_proposal" }, 400);
        const { data, error } = await supabase.from("proposals").insert(row).select(PROPOSAL_COLUMNS).single();
        if (error) {
          if (error.code === "23505") return json({ ok: false, error: "conflict" }, 409);
          return json({ ok: false, error: "database_request_failed" }, 503);
        }
        return json({ ok: true, item: data });
      }
      return json({ ok: false, error: "method_not_allowed" }, 405, { allow: "GET, POST" });
    }

    return json({ ok: false, error: "not_found" }, 404);
  } catch {
    /* Transport-level database failures surface as one stable code. */
    return json({ ok: false, error: "database_request_failed" }, 503);
  }
}
