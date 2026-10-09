import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const BRIEF_COLUMNS = "id,title,brand,category,language,quantity,deadline_days,budget_min,budget_max,description,deliverables,signals,ai_confidence,status,created_at";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const supabase = createAdminClient();

    let query = supabase.from("briefs").select(BRIEF_COLUMNS).order("created_at", { ascending: false }).limit(100);

    if (status === "open") {
      query = query.in("status", ["open", "in-review"]);
    } else if (status && ["open", "in-review", "filled", "closed"].includes(status)) {
      query = query.eq("status", status);
    } else {
      query = query.neq("status", "deleted");
    }

    const { data, error } = await query;

    if (error) {
      console.error("Database query failed:", error);
      return NextResponse.json({ ok: false, error: "database_request_failed" }, { status: 503 });
    }

    return NextResponse.json({ ok: true, items: data || [] });
  } catch (err) {
    console.error("GET /api/briefs error:", err);
    return NextResponse.json({ ok: false, error: "internal_server_error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body || typeof body !== "object") {
      return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
    }

    const serverClient = await createServerSupabaseClient();
    const { data: { user } } = await serverClient.auth.getUser();

    const supabase = createAdminClient();
    const editKey = crypto.randomUUID();
    const briefId = body.id || `b-${crypto.randomUUID().slice(0, 8)}`;

    const row = {
      id: briefId,
      brand_id: user?.id || body.brandId || null,
      title: (body.title || "Untitled Brief").slice(0, 140),
      brand: (body.brand || user?.user_metadata?.full_name || "Your Brand").slice(0, 60),
      category: body.category || "Short-Form Video",
      language: body.language || "english",
      quantity: Number(body.quantity) || 1,
      deadline_days: Number(body.deadlineDays || body.deadline_days) || 14,
      budget_min: Number(body.budgetMin || body.budget_min) || 200,
      budget_max: Number(body.budgetMax || body.budget_max) || 800,
      description: body.description || "",
      deliverables: Array.isArray(body.deliverables) ? body.deliverables : ["1x 4K Video Master", "3x Hook Iterations"],
      signals: body.signals || {
        tools: body.tools || ["Midjourney", "Runway Gen-3", "ElevenLabs"],
        complexity: "medium",
        summary: body.summary || "High-converting UGC video with viral pacing.",
      },
      ai_confidence: body.aiConfidence || 88,
      status: "open",
      edit_key: editKey,
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase.from("briefs").insert(row).select(`${BRIEF_COLUMNS},edit_key`).single();

    if (error) {
      console.error("Failed to insert brief:", error);
      return NextResponse.json({ ok: false, error: "database_request_failed" }, { status: 503 });
    }

    return NextResponse.json({ ok: true, item: data });
  } catch (err) {
    console.error("POST /api/briefs error:", err);
    return NextResponse.json({ ok: false, error: "internal_server_error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const id = body.id;
    const editKey = body.editKey;

    if (!id) {
      return NextResponse.json({ ok: false, error: "id_required" }, { status: 400 });
    }

    const serverClient = await createServerSupabaseClient();
    const { data: { user } } = await serverClient.auth.getUser();

    const supabase = createAdminClient();
    const { data: existing, error: fetchErr } = await supabase.from("briefs").select("id,brand_id,edit_key").eq("id", id).maybeSingle();

    if (fetchErr || !existing) {
      return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
    }

    const isOwner = (user && user.id === existing.brand_id) || (editKey && editKey === existing.edit_key);
    if (!isOwner) {
      return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 403 });
    }

    const patch: Record<string, unknown> = {};
    if (body.title) patch.title = body.title;
    if (body.status) patch.status = body.status;
    if (body.description) patch.description = body.description;
    if (body.budgetMin) patch.budget_min = body.budgetMin;
    if (body.budgetMax) patch.budget_max = body.budgetMax;
    patch.updated_at = new Date().toISOString();

    const { data, error } = await supabase.from("briefs").update(patch).eq("id", id).select(BRIEF_COLUMNS).single();

    if (error) {
      return NextResponse.json({ ok: false, error: "database_request_failed" }, { status: 503 });
    }

    return NextResponse.json({ ok: true, item: data });
  } catch (err) {
    console.error("PATCH /api/briefs error:", err);
    return NextResponse.json({ ok: false, error: "internal_server_error" }, { status: 500 });
  }
}
