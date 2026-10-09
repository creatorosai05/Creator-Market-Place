import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("id");

    const serverClient = await createServerSupabaseClient();
    const { data: { user } } = await serverClient.auth.getUser();

    const targetId = userId || user?.id;

    if (!targetId) {
      return NextResponse.json({ ok: false, error: "not_authenticated" }, { status: 401 });
    }

    const supabase = createAdminClient();
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", targetId)
      .maybeSingle();

    if (error) {
      console.error("GET profile error:", error);
      return NextResponse.json({ ok: false, error: "database_error" }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      profile: profile || {
        id: targetId,
        full_name: user?.user_metadata?.full_name || "CreatorOS Member",
        role: user?.user_metadata?.role || "creator",
      },
    });
  } catch (err) {
    console.error("GET /api/profile error:", err);
    return NextResponse.json({ ok: false, error: "internal_error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const serverClient = await createServerSupabaseClient();
    const { data: { user } } = await serverClient.auth.getUser();

    const targetId = body.id || user?.id;

    if (!targetId) {
      return NextResponse.json({ ok: false, error: "not_authenticated" }, { status: 401 });
    }

    const supabase = createAdminClient();

    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (body.full_name !== undefined) {
      updates.full_name = body.full_name;
      updates.name = body.full_name;
    }
    if (body.avatar_url !== undefined) updates.avatar_url = body.avatar_url;
    if (body.company_name !== undefined) updates.company_name = body.company_name;
    if (body.bio !== undefined) updates.bio = body.bio;
    if (body.ai_tools !== undefined) updates.ai_tools = body.ai_tools;
    if (body.categories !== undefined) updates.categories = body.categories;
    if (body.details !== undefined) updates.details = body.details;

    const { data, error } = await supabase
      .from("profiles")
      .upsert({ id: targetId, ...updates })
      .select()
      .single();

    if (error) {
      console.error("PATCH profile error:", error);
      return NextResponse.json({ ok: false, error: "database_error" }, { status: 500 });
    }

    return NextResponse.json({ ok: true, profile: data });
  } catch (err) {
    console.error("PATCH /api/profile error:", err);
    return NextResponse.json({ ok: false, error: "internal_error" }, { status: 500 });
  }
}
