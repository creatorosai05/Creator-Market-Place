import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const ORDER_COLUMNS = "id,brief_id,gig_id,creator_id,brand_id,package_key,package_name,brand,brief_text,subtotal,fee,total,due_days,addons,status,payment_id,deliverables_url,created_at,updated_at";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const keys = searchParams.get("keys");
    const role = searchParams.get("role");

    const serverClient = await createServerSupabaseClient();
    const { data: { user } } = await serverClient.auth.getUser();

    const supabase = createAdminClient();
    let query = supabase.from("orders").select(ORDER_COLUMNS).order("created_at", { ascending: false }).limit(100);

    if (user) {
      if (role === "creator") {
        query = query.eq("creator_id", user.id);
      } else if (role === "brand") {
        query = query.eq("brand_id", user.id);
      } else {
        query = query.or(`creator_id.eq.${user.id},brand_id.eq.${user.id}`);
      }
    } else if (keys) {
      const keyList = keys.split(",").map((k) => k.trim()).filter(Boolean);
      if (keyList.length > 0) {
        query = query.in("edit_key", keyList);
      } else {
        return NextResponse.json({ ok: true, items: [] });
      }
    } else {
      // Return public/recent orders for demo
      query = query.limit(20);
    }

    const { data, error } = await query;

    if (error) {
      console.error("GET orders error:", error);
      return NextResponse.json({ ok: false, error: "database_request_failed" }, { status: 503 });
    }

    return NextResponse.json({ ok: true, items: data || [] });
  } catch (err) {
    console.error("GET /api/orders error:", err);
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
    const orderId = body.id || `ord-${crypto.randomUUID().slice(0, 8)}`;

    const subtotal = Number(body.subtotal || body.total) || 300;
    const fee = Math.round(subtotal * 0.1);
    const total = subtotal + fee;

    const row = {
      id: orderId,
      brief_id: body.briefId || null,
      gig_id: body.gigId || null,
      creator_id: body.creatorId || null,
      brand_id: user?.id || body.brandId || null,
      package_key: body.packageKey || "standard",
      package_name: body.packageName || "Standard Production",
      brand: body.brand || user?.user_metadata?.full_name || "GrowthOS Client",
      brief_text: body.briefText || "",
      subtotal,
      fee,
      total,
      due_days: Number(body.dueDays) || 7,
      addons: Array.isArray(body.addons) ? body.addons : [],
      status: "placed",
      edit_key: editKey,
      deliverables_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase.from("orders").insert(row).select(`${ORDER_COLUMNS},edit_key`).single();

    if (error) {
      console.error("Insert order error:", error);
      return NextResponse.json({ ok: false, error: "database_request_failed" }, { status: 503 });
    }

    return NextResponse.json({ ok: true, item: data });
  } catch (err) {
    console.error("POST /api/orders error:", err);
    return NextResponse.json({ ok: false, error: "internal_server_error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const id = body.id;
    const editKey = body.editKey;
    const status = body.status;
    const deliverablesUrl = body.deliverablesUrl;

    if (!id) {
      return NextResponse.json({ ok: false, error: "id_required" }, { status: 400 });
    }

    const serverClient = await createServerSupabaseClient();
    const { data: { user } } = await serverClient.auth.getUser();

    const supabase = createAdminClient();
    const { data: existing, error: fetchErr } = await supabase.from("orders").select("id,creator_id,brand_id,edit_key").eq("id", id).maybeSingle();

    if (fetchErr || !existing) {
      return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
    }

    const isParty = (user && (user.id === existing.creator_id || user.id === existing.brand_id)) || (editKey && editKey === existing.edit_key);
    if (!isParty && !user) {
      return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 403 });
    }

    const patch: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (status && ["placed", "in-progress", "review", "delivered", "paid", "cancelled"].includes(status)) {
      patch.status = status;
    }

    if (deliverablesUrl) {
      patch.deliverables_url = deliverablesUrl;
      patch.status = "delivered";
    }

    if (body.paymentId) {
      patch.payment_id = body.paymentId;
      patch.status = "paid";
    }

    const { data, error } = await supabase.from("orders").update(patch).eq("id", id).select(ORDER_COLUMNS).single();

    if (error) {
      return NextResponse.json({ ok: false, error: "database_request_failed" }, { status: 503 });
    }

    return NextResponse.json({ ok: true, item: data });
  } catch (err) {
    console.error("PATCH /api/orders error:", err);
    return NextResponse.json({ ok: false, error: "internal_server_error" }, { status: 500 });
  }
}
