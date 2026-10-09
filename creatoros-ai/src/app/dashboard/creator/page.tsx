"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import ProposalModal from "@/components/ProposalModal";
import {
  Zap,
  Briefcase,
  Upload,
  CheckCircle2,
  Clock,
  Star,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  FileCheck,
  Sparkles,
  Link as LinkIcon,
  User,
} from "lucide-react";

interface Brief {
  id: string;
  title: string;
  brand: string;
  category: string;
  budget_min: number;
  budget_max: number;
  deadline_days: number;
  description: string;
  signals?: { tools?: string[] };
  status: string;
}

interface Order {
  id: string;
  package_name: string;
  brand: string;
  total: number;
  status: string;
  deliverables_url?: string;
  created_at: string;
}

export default function CreatorDashboard() {
  const [briefs, setBriefs] = useState<Brief[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Proposal Modal State
  const [selectedBrief, setSelectedBrief] = useState<Brief | null>(null);

  // Deliverable Upload State
  const [uploadOrderId, setUploadOrderId] = useState<string | null>(null);
  const [deliverableUrl, setDeliverableUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const briefRes = await fetch("/api/briefs?status=open");
      const briefData = await briefRes.json();
      if (briefData.ok && Array.isArray(briefData.items)) {
        setBriefs(briefData.items);
      }

      const orderRes = await fetch("/api/orders?role=creator");
      const orderData = await orderRes.json();
      if (orderData.ok && Array.isArray(orderData.items) && orderData.items.length > 0) {
        setOrders(orderData.items);
      } else {
        // Fallback realistic orders for demo
        setOrders([
          {
            id: "ord-91b42",
            package_name: "3x AI UGC Video Variations for SaaS",
            brand: "Nexus AI Ventures",
            total: 450,
            status: "in-progress",
            created_at: new Date().toISOString(),
          },
          {
            id: "ord-883a1b",
            package_name: "5x Hyper-Realistic AI UGC Video Ads",
            brand: "Vitals AI Health",
            total: 650,
            status: "delivered",
            deliverables_url: "https://drive.google.com/drive/folders/sample-ai-ugc-delivery",
            created_at: new Date().toISOString(),
          },
        ]);
      }
    } catch (e) {
      console.warn("Failed fetching creator dashboard data:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDeliver = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadOrderId || !deliverableUrl) return;

    setUploading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: uploadOrderId,
          status: "delivered",
          deliverablesUrl: deliverableUrl,
        }),
      });

      const data = await res.json();
      if (data.ok) {
        alert("Deliverables submitted to brand! Status is now DELIVERED.");
        setUploadOrderId(null);
        setDeliverableUrl("");
        loadData();
      }
    } catch (err) {
      console.error("Failed submitting deliverable:", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-8 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-fuchsia-500 to-indigo-600 text-slate-950 font-bold shadow-lg shadow-fuchsia-500/20">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-white">Creator Studio Command</h1>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[10px] font-mono uppercase">
                  Verified Tier 1
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Explore briefs tailored to your AI workflow, submit pitches, and deliver milestone assets.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/profile/creator"
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:from-fuchsia-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-fuchsia-500/20 transition-all hover:scale-[1.02]"
            >
              <User className="w-4 h-4" />
              Manage Creator Profile & Portfolio
            </Link>
          </div>
        </div>

        {/* Creator KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 my-8">
          <div className="p-5 rounded-2xl glass-panel border border-white/10">
            <span className="text-[11px] text-slate-400 uppercase font-mono">Quality Score</span>
            <div className="text-2xl font-extrabold text-emerald-400 mt-1 font-mono flex items-center gap-1.5">
              98/100
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-[11px] text-slate-400">Top 3% of GenAI Creators</span>
          </div>

          <div className="p-5 rounded-2xl glass-panel border border-white/10">
            <span className="text-[11px] text-slate-400 uppercase font-mono">Escrow In-Flight</span>
            <div className="text-2xl font-extrabold text-white mt-1 font-mono">₹1,100</div>
            <span className="text-[11px] text-cyan-400">2 active client contracts</span>
          </div>

          <div className="p-5 rounded-2xl glass-panel border border-white/10">
            <span className="text-[11px] text-slate-400 uppercase font-mono">Client Rating</span>
            <div className="text-2xl font-extrabold text-amber-400 mt-1 font-mono flex items-center gap-1.5">
              4.98
              <Star className="w-4 h-4 fill-amber-400" />
            </div>
            <span className="text-[11px] text-slate-400">Based on 64 reviews</span>
          </div>

          <div className="p-5 rounded-2xl glass-panel border border-white/10">
            <span className="text-[11px] text-slate-400 uppercase font-mono">Average Turnaround</span>
            <div className="text-2xl font-extrabold text-purple-400 mt-1 font-mono">3.2 Days</div>
            <span className="text-[11px] text-slate-400">99.2% prompt adherence</span>
          </div>
        </div>

        {/* Section 1: Active Production Orders */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            <h2 className="text-lg font-bold text-white">My Active Production Orders</h2>
          </div>

          <div className="glass-panel rounded-2xl border border-white/10 divide-y divide-white/5 overflow-hidden">
            {orders.map((o) => (
              <div key={o.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-slate-400">{o.id}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                      o.status === "delivered" ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" :
                      o.status === "paid" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" :
                      "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                    }`}>
                      {o.status}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-white">{o.package_name}</h3>
                  <div className="text-xs text-slate-400 flex items-center gap-3">
                    <span>Client: <strong className="text-slate-200">{o.brand}</strong></span>
                    <span>•</span>
                    <span>Locked Escrow: <strong className="text-white font-mono">₹{o.total}</strong></span>
                    {o.deliverables_url && (
                      <a
                        href={o.deliverables_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
                      >
                        <ExternalLink className="w-3 h-3" /> Submitted Link
                      </a>
                    )}
                  </div>
                </div>

                <div>
                  {o.status !== "delivered" && o.status !== "paid" ? (
                    <button
                      onClick={() => setUploadOrderId(o.id)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20 transition-all"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      Upload Deliverables
                    </button>
                  ) : (
                    <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1 px-3 py-1.5 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Work Delivered
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: Open Briefs Board for Pitching */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-fuchsia-400" />
              <h2 className="text-lg font-bold text-white">Recommended Open Briefs for Your AI Stack</h2>
            </div>
            <span className="text-xs text-slate-400">{briefs.length} available</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {briefs.map((b) => (
              <div key={b.id} className="glass-panel glass-card-hover rounded-2xl p-6 flex flex-col justify-between border border-white/10">
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-mono text-cyan-400 text-[11px]">{b.category}</span>
                    <span className="text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {b.deadline_days}d
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-white mb-2 line-clamp-2">{b.title}</h3>
                  <span className="text-xs text-slate-400 block mb-2">By {b.brand}</span>
                  <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">{b.description}</p>

                  {b.signals?.tools && (
                    <div className="mt-4 flex flex-wrap gap-1">
                      {b.signals.tools.map((t) => (
                        <span key={t} className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-[10px] text-slate-300 font-mono">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-mono text-slate-400 block">Budget</span>
                    <span className="text-sm font-bold text-white font-mono">₹{b.budget_min} - ₹{b.budget_max}</span>
                  </div>
                  <button
                    onClick={() => setSelectedBrief(b)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-fuchsia-500 to-purple-600 hover:from-fuchsia-400 hover:to-purple-500 text-slate-950 font-bold text-xs flex items-center gap-1 shadow-md shadow-fuchsia-500/20 transition-all hover:scale-105"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    Send Proposal
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Deliverable Upload Modal */}
      {uploadOrderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-cyan-500/30 bg-[#0d111b] p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-1">Submit Deliverable Links</h3>
            <p className="text-xs text-slate-400 mb-4">
              Enter your Google Drive, Dropbox, Frame.io, or WeTransfer delivery folder link.
            </p>

            <form onSubmit={handleDeliver} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Deliverables URL</label>
                <div className="relative">
                  <LinkIcon className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="url"
                    required
                    value={deliverableUrl}
                    onChange={(e) => setDeliverableUrl(e.target.value)}
                    placeholder="https://drive.google.com/drive/folders/..."
                    className="w-full rounded-xl bg-slate-900 border border-white/10 pl-9 pr-3.5 py-2.5 text-xs text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setUploadOrderId(null)}
                  className="flex-1 py-2.5 rounded-xl border border-white/10 text-xs font-semibold text-slate-300 hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
                >
                  {uploading ? "Submitting..." : "Submit to Brand"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Proposal Modal */}
      {selectedBrief && (
        <ProposalModal
          briefId={selectedBrief.id}
          briefTitle={selectedBrief.title}
          isOpen={true}
          onClose={() => setSelectedBrief(null)}
          onProposalSent={loadData}
        />
      )}
    </div>
  );
}
