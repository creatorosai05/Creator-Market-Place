"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import PostBriefModal from "@/components/PostBriefModal";
import FeedbackModal from "@/components/FeedbackModal";
import RazorpayCheckout from "@/components/RazorpayCheckout";
import {
  Briefcase,
  Plus,
  Clock,
  CheckCircle,
  FileText,
  Star,
  ExternalLink,
  ChevronRight,
  Shield,
  CreditCard,
  MessageSquare,
  AlertCircle,
  Loader2,
} from "lucide-react";

interface Brief {
  id: string;
  title: string;
  category: string;
  budget_min: number;
  budget_max: number;
  deadline_days: number;
  status: string;
  created_at: string;
}

interface Proposal {
  id: string;
  brief_id: string;
  creator_name: string;
  creator_id: string;
  price: number;
  delivery_days: number;
  note: string;
  status: string;
  created_at: string;
}

interface Order {
  id: string;
  package_name: string;
  total: number;
  status: string;
  deliverables_url?: string;
  payment_id?: string;
  created_at: string;
}

export default function BrandDashboard() {
  const [briefs, setBriefs] = useState<Brief[]>([]);
  const [proposals, setProposals] = useState<Record<string, Proposal[]>>({});
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeBriefId, setActiveBriefId] = useState<string | null>(null);

  // Modals
  const [isPostBriefOpen, setIsPostBriefOpen] = useState(false);
  const [feedbackOrderId, setFeedbackOrderId] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Briefs
      const briefRes = await fetch("/api/briefs");
      const briefData = await briefRes.json();
      if (briefData.ok && Array.isArray(briefData.items)) {
        setBriefs(briefData.items);
        if (briefData.items.length > 0 && !activeBriefId) {
          setActiveBriefId(briefData.items[0].id);
          loadProposalsForBrief(briefData.items[0].id);
        }
      }

      // 2. Fetch Orders
      const orderRes = await fetch("/api/orders?role=brand");
      const orderData = await orderRes.json();
      if (orderData.ok && Array.isArray(orderData.items)) {
        setOrders(orderData.items);
      } else {
        // Fallback demo order
        setOrders([
          {
            id: "ord-883a1b",
            package_name: "5x Hyper-Realistic AI UGC Video Ads",
            total: 650,
            status: "delivered",
            deliverables_url: "https://drive.google.com/drive/folders/sample-ai-ugc-delivery",
            created_at: new Date().toISOString(),
          },
        ]);
      }
    } catch (e) {
      console.warn("Failed loading dashboard data:", e);
    } finally {
      setLoading(false);
    }
  };

  const loadProposalsForBrief = async (briefId: string) => {
    try {
      const res = await fetch(`/api/proposals?brief=${briefId}`);
      const data = await res.json();
      if (data.ok && Array.isArray(data.items)) {
        setProposals((prev) => ({
          ...prev,
          [briefId]: data.items.length > 0 ? data.items : [
            {
              id: "p-sample1",
              brief_id: briefId,
              creator_name: "Alex V. (GenAI Studio)",
              creator_id: "c-01",
              price: 550,
              delivery_days: 4,
              note: "I have trained custom LoRA models on Runway Gen-3 and ElevenLabs for realistic lip-syncing. Can deliver in 4 days with 3 hook variations.",
              status: "sent",
              created_at: new Date().toISOString(),
            },
          ],
        }));
      }
    } catch (e) {
      console.warn("Error fetching proposals:", e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAcceptProposal = async (p: Proposal) => {
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          briefId: p.brief_id,
          creatorId: p.creator_id,
          packageName: `Custom Proposal (${p.creator_name})`,
          total: p.price,
          dueDays: p.delivery_days,
          briefText: p.note,
        }),
      });

      const data = await res.json();
      if (data.ok) {
        alert("Order created in escrow! You can now fund and release payment when satisfied.");
        loadData();
      }
    } catch (err) {
      console.error("Order creation failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-8 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-white">Brand OS Command Center</h1>
                <p className="text-xs text-slate-400">
                  Manage active briefs, review creator pitches, and release secure escrow payments.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsPostBriefOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/25 transition-all"
          >
            <Plus className="w-4 h-4" />
            Post New Brief
          </button>
        </div>

        {/* Quick KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-8">
          <div className="p-5 rounded-2xl glass-panel border border-white/10">
            <span className="text-xs text-slate-400 uppercase font-mono">Active Briefs</span>
            <div className="text-2xl font-extrabold text-white mt-1 font-mono">{briefs.length}</div>
            <span className="text-[11px] text-cyan-400">Receiving incoming creator proposals</span>
          </div>
          <div className="p-5 rounded-2xl glass-panel border border-white/10">
            <span className="text-xs text-slate-400 uppercase font-mono">Active Orders & Escrow</span>
            <div className="text-2xl font-extrabold text-white mt-1 font-mono">{orders.length}</div>
            <span className="text-[11px] text-emerald-400">Funds locked in Razorpay escrow</span>
          </div>
          <div className="p-5 rounded-2xl glass-panel border border-white/10">
            <span className="text-xs text-slate-400 uppercase font-mono">Deliveries Ready for Review</span>
            <div className="text-2xl font-extrabold text-amber-400 mt-1 font-mono">
              {orders.filter((o) => o.status === "delivered").length}
            </div>
            <span className="text-[11px] text-slate-400">Review output & release payment</span>
          </div>
        </div>

        {/* Section 1: Orders Requiring Release & Feedback */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-4 h-4 text-emerald-400" />
            <h2 className="text-lg font-bold text-white">Deliverables & Escrow Payments</h2>
          </div>

          <div className="glass-panel rounded-2xl border border-white/10 divide-y divide-white/5 overflow-hidden">
            {orders.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No active orders yet. Accept a creator proposal below to initiate escrow.
              </div>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-slate-400">{order.id}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                        order.status === "paid" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" :
                        order.status === "delivered" ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" :
                        "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-white">{order.package_name}</h3>
                    <div className="text-xs text-slate-400 flex items-center gap-3">
                      <span>Total: <strong className="text-white font-mono">₹{order.total}</strong></span>
                      {order.deliverables_url && (
                        <a
                          href={order.deliverables_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
                        >
                          <FileText className="w-3 h-3" />
                          View Deliverable Files <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {order.status !== "paid" ? (
                      <RazorpayCheckout
                        orderId={order.id}
                        amount={order.total}
                        onSuccess={() => {
                          loadData();
                          setFeedbackOrderId(order.id);
                        }}
                      />
                    ) : (
                      <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1 px-3 py-1.5 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                        <CheckCircle className="w-3.5 h-3.5" /> Paid & Settled
                      </span>
                    )}

                    <button
                      onClick={() => setFeedbackOrderId(order.id)}
                      className="px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors"
                    >
                      <Star className="w-3.5 h-3.5 text-amber-400" />
                      Give Feedback
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Section 2: Manage My Briefs and Proposals */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan-400" />
              <h2 className="text-lg font-bold text-white">My Posted Briefs & Incoming Pitches</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Briefs List */}
            <div className="lg:col-span-1 space-y-3">
              <span className="text-xs font-mono uppercase text-slate-400 block mb-2">Select Brief to Review:</span>
              {briefs.map((b) => (
                <div
                  key={b.id}
                  onClick={() => {
                    setActiveBriefId(b.id);
                    loadProposalsForBrief(b.id);
                  }}
                  className={`p-4 rounded-xl cursor-pointer transition-all border ${
                    activeBriefId === b.id
                      ? "bg-cyan-500/10 border-cyan-500/40 shadow-md shadow-cyan-500/10"
                      : "glass-panel border-white/10 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                    <span className="font-mono text-cyan-400">{b.category}</span>
                    <span className="uppercase font-mono">{b.status}</span>
                  </div>
                  <h4 className="font-bold text-xs text-white line-clamp-1">{b.title}</h4>
                  <div className="mt-2 text-[11px] text-slate-300 font-mono">
                    ₹{b.budget_min} - ₹{b.budget_max} • {b.deadline_days}d
                  </div>
                </div>
              ))}
            </div>

            {/* Proposals for selected brief */}
            <div className="lg:col-span-2 glass-panel rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                <div>
                  <h3 className="font-bold text-sm text-white">Proposals Received</h3>
                  <span className="text-xs text-slate-400 font-mono">
                    Brief: {activeBriefId || "Select a brief"}
                  </span>
                </div>
              </div>

              {activeBriefId && proposals[activeBriefId] && proposals[activeBriefId].length > 0 ? (
                <div className="space-y-4">
                  {proposals[activeBriefId].map((p) => (
                    <div key={p.id} className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-bold text-sm text-white">{p.creator_name}</h4>
                          <span className="text-xs text-slate-400 font-mono">
                            Turnaround: {p.delivery_days} days
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-base font-extrabold text-cyan-400 font-mono">
                            ₹{p.price}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed bg-black/30 p-3 rounded-lg border border-white/5">
                        &quot;{p.note}&quot;
                      </p>

                      <div className="flex items-center justify-end gap-2 pt-1">
                        <button
                          onClick={() => handleAcceptProposal(p)}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs flex items-center gap-1 shadow-md shadow-emerald-500/20 transition-all"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          Accept & Initialize Escrow
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-xs text-slate-400">
                  <MessageSquare className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  No proposals submitted for this brief yet. Verified creators are being notified.
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Modals */}
      <PostBriefModal
        isOpen={isPostBriefOpen}
        onClose={() => setIsPostBriefOpen(false)}
        onBriefCreated={loadData}
      />

      {feedbackOrderId && (
        <FeedbackModal
          orderId={feedbackOrderId}
          isOpen={true}
          onClose={() => setFeedbackOrderId(null)}
          onSubmitted={loadData}
        />
      )}
    </div>
  );
}
