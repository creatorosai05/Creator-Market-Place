"use client";

import { useState } from "react";
import { CreditCard, Loader2, CheckCircle2 } from "lucide-react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayCheckoutProps {
  orderId: string;
  amount: number;
  currency?: string;
  brandName?: string;
  onSuccess: (paymentId: string) => void;
}

export default function RazorpayCheckout({
  orderId,
  amount,
  currency = "INR",
  brandName = "CreatorOS AI Escrow",
  onSuccess,
}: RazorpayCheckoutProps) {
  const [loading, setLoading] = useState(false);
  const [paid, setPaid] = useState(false);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      const orderRes = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          amount,
          currency,
          brand: brandName,
        }),
      });

      const orderData = await orderRes.json();
      if (!orderData.ok) {
        throw new Error(orderData.error || "Order generation failed");
      }

      await loadRazorpayScript();

      // If simulated or test key placeholder
      if (orderData.isDemo || !window.Razorpay || orderData.keyId === "rzp_test_placeholder") {
        // Fast realistic sandbox verification simulation
        const verifyRes = await fetch("/api/verify-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            order_id: orderId,
            razorpay_order_id: orderData.orderId,
            razorpay_payment_id: `pay_sim_${Date.now().toString(36)}`,
            razorpay_signature: "mock_signature_sandbox",
          }),
        });

        const verifyData = await verifyRes.json();
        if (verifyData.ok) {
          setPaid(true);
          onSuccess(verifyData.paymentId);
        }
        return;
      }

      // Live Razorpay modal
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "CreatorOS AI Marketplace",
        description: `Escrow release for Order ${orderId}`,
        order_id: orderData.orderId,
        handler: async function (response: any) {
          const verifyRes = await fetch("/api/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              order_id: orderId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyData.ok) {
            setPaid(true);
            onSuccess(response.razorpay_payment_id);
          }
        },
        prefill: {
          name: "Brand Lead",
          email: "brand@growthos.market",
        },
        theme: {
          color: "#00f0ff",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err) {
      console.error("Payment error:", err);
      alert("Payment initialization error. Check console.");
    } finally {
      setLoading(false);
    }
  };

  if (paid) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
        <CheckCircle2 className="w-3.5 h-3.5" />
        Escrow Released
      </span>
    );
  }

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 disabled:opacity-50 transition-all"
    >
      {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CreditCard className="w-3.5 h-3.5" />}
      Release Escrow (₹{amount})
    </button>
  );
}
