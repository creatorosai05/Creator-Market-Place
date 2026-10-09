import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

const BRIEF_COLUMNS = "id,title,brand,category,language,quantity,deadline_days,budget_min,budget_max,description,deliverables,signals,ai_confidence,status,created_at";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("briefs")
      .select(BRIEF_COLUMNS)
      .eq("id", id)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ ok: false, error: "database_request_failed" }, { status: 503 });
    }

    if (!data || data.status === "deleted") {
      return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, item: data });
  } catch (err) {
    console.error("GET /api/briefs/[id] error:", err);
    return NextResponse.json({ ok: false, error: "internal_server_error" }, { status: 500 });
  }
}
