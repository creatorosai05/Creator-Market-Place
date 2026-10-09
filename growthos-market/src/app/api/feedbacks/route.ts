import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("orderId") || searchParams.get("order_id");
    const supabase = createAdminClient();

    let query = supabase.from("feedbacks").select("id,order_id,rating,comment,created_by,created_at").order("created_at", { ascending: false });

    if (orderId) {
      query = query.eq("order_id", orderId);
    }

    const { data, error } = await query.limit(50);

    if (error) {
      return NextResponse.json({ ok: false, error: "database_request_failed" }, { status: 503 });
    }

    return NextResponse.json({ ok: true, items: data || [] });
  } catch (err) {
    console.error("GET /api/feedbacks error:", err);
    return NextResponse.json({ ok: false, error: "internal_server_error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const orderId = body.orderId || body.order_id;
    const rating = Number(body.rating);
    const comment = body.comment || "";

    if (!orderId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json({ ok: false, error: "rating_between_1_and_5_required" }, { status: 400 });
    }

    const serverClient = await createServerSupabaseClient();
    const { data: { user } } = await serverClient.auth.getUser();

    const supabase = createAdminClient();
    const row = {
      order_id: orderId,
      rating,
      comment: comment.slice(0, 1000),
      created_by: user?.id || null,
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase.from("feedbacks").insert(row).select().single();

    if (error) {
      console.error("Failed to insert feedback:", error);
      return NextResponse.json({ ok: false, error: "database_request_failed" }, { status: 503 });
    }

    return NextResponse.json({ ok: true, item: data });
  } catch (err) {
    console.error("POST /api/feedbacks error:", err);
    return NextResponse.json({ ok: false, error: "internal_server_error" }, { status: 500 });
  }
}
