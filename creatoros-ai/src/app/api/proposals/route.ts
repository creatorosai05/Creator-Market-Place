import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const PROPOSAL_COLUMNS = "id,brief_id,creator_id,creator_name,price,delivery_days,note,status,created_at";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const briefId = searchParams.get("brief");
    const creatorId = searchParams.get("creator");
    const supabase = createAdminClient();

    let query = supabase.from("proposals").select(PROPOSAL_COLUMNS).order("created_at", { ascending: false });

    if (briefId) {
      query = query.eq("brief_id", briefId);
    } else if (creatorId) {
      query = query.eq("creator_id", creatorId);
    }

    const { data, error } = await query.limit(50);

    if (error) {
      return NextResponse.json({ ok: false, error: "database_request_failed" }, { status: 503 });
    }

    return NextResponse.json({ ok: true, items: data || [] });
  } catch (err) {
    console.error("GET /api/proposals error:", err);
    return NextResponse.json({ ok: false, error: "internal_server_error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body || !body.briefId || !body.note) {
      return NextResponse.json({ ok: false, error: "invalid_proposal" }, { status: 400 });
    }

    const serverClient = await createServerSupabaseClient();
    const { data: { user } } = await serverClient.auth.getUser();

    const supabase = createAdminClient();
    const proposalId = `p-${crypto.randomUUID().slice(0, 8)}`;

    const row = {
      id: proposalId,
      brief_id: body.briefId,
      creator_id: user?.id || body.creatorId || null,
      creator_name: user?.user_metadata?.full_name || body.creatorName || "Verified Creator",
      price: Number(body.price) || 350,
      delivery_days: Number(body.deliveryDays) || 5,
      note: body.note.slice(0, 2000),
      status: "sent",
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase.from("proposals").insert(row).select(PROPOSAL_COLUMNS).single();

    if (error) {
      console.error("Failed to insert proposal:", error);
      return NextResponse.json({ ok: false, error: "database_request_failed" }, { status: 503 });
    }

    return NextResponse.json({ ok: true, item: data });
  } catch (err) {
    console.error("POST /api/proposals error:", err);
    return NextResponse.json({ ok: false, error: "internal_server_error" }, { status: 500 });
  }
}
