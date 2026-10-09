import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const amount = Number(body.amount) || 500;
    const currency = body.currency || "INR";
    const receipt = body.orderId || `rcpt_${Date.now()}`;

    const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    // Check if live/valid Razorpay credentials are provided
    if (keyId && keySecret && keyId !== "rzp_test_placeholder" && !keyId.includes("placeholder")) {
      try {
        const razorpay = new Razorpay({
          key_id: keyId,
          key_secret: keySecret,
        });

        const order = await razorpay.orders.create({
          amount: Math.round(amount * 100), // amount in lowest currency unit (paisa)
          currency,
          receipt,
          notes: {
            orderId: body.orderId || "",
            brand: body.brand || "",
          },
        });

        return NextResponse.json({
          ok: true,
          orderId: order.id,
          amount: order.amount,
          currency: order.currency,
          keyId,
        });
      } catch (rzpErr) {
        console.warn("Razorpay API call failed, falling back to simulated sandbox order:", rzpErr);
      }
    }

    // Graceful simulated test order for sandbox/demo
    const simulatedOrderId = `order_${crypto.randomUUID().slice(0, 14)}`;
    return NextResponse.json({
      ok: true,
      orderId: simulatedOrderId,
      amount: Math.round(amount * 100),
      currency,
      keyId: keyId || "rzp_test_placeholder",
      isDemo: true,
    });
  } catch (err) {
    console.error("POST /api/create-order error:", err);
    return NextResponse.json({ ok: false, error: "failed_to_create_order" }, { status: 500 });
  }
}
