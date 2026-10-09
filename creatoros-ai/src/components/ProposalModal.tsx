"use client";

import { useState } from "react";
import { X, Zap, Loader2, CheckCircle2 } from "lucide-react";

interface ProposalModalProps {
  briefId: string;
  briefTitle: string;
  isOpen: boolean;
  onClose: () => void;
  onProposalSent?: () => void;
}

export default function ProposalModal({
  briefId,
  briefTitle,
  isOpen,
  onClose,
  onProposalSent,
}: ProposalModalProps) {
  const [pitch, setPitch] = useState("");
  const [price, setPrice] = useState(350);
  const [deliveryDays, setDeliveryDays] = useState(4);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          briefId,
          price: Number(price),
          deliveryDays: Number(deliveryDays),
          note: pitch,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Failed to send proposal");
      }

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        if (onProposalSent) onProposalSent();
      }, 1500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error sending proposal";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl border border-fuchsia-500/30 bg-[#0d111b] p-6 shadow-2xl shadow-fuchsia-500/10">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {success ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto animate-bounce" />
            <h3 className="text-xl font-bold text-white">Proposal Dispatched!</h3>
            <p className="text-xs text-slate-300">
              The brand has been notified and can initiate escrow immediately.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-fuchsia-500/10 border border-fuchsia-500/30 text-fuchsia-400">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Pitch Proposal</h3>
                <p className="text-xs text-slate-400 truncate max-w-[280px]">For: {briefTitle}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Your Quote (₹/$)</label>
                <input
                  type="number"
                  required
                  min={10}
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full rounded-xl bg-slate-900/90 border border-white/10 px-3.5 py-2 text-xs text-slate-100 focus:border-fuchsia-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Turnaround (Days)</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={deliveryDays}
                  onChange={(e) => setDeliveryDays(Number(e.target.value))}
                  className="w-full rounded-xl bg-slate-900/90 border border-white/10 px-3.5 py-2 text-xs text-slate-100 focus:border-fuchsia-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Pitch Note & Portfolio Links
              </label>
              <textarea
                required
                rows={4}
                value={pitch}
                onChange={(e) => setPitch(e.target.value)}
                placeholder="Explain your AI workflow (e.g. Midjourney + Runway camera controls + ElevenLabs voice clone) and past metrics..."
                className="w-full rounded-xl bg-slate-900/90 border border-white/10 px-3.5 py-2.5 text-xs text-slate-100 placeholder:text-slate-500 focus:border-fuchsia-400 focus:outline-none"
              />
            </div>

            {error && (
              <p className="text-xs text-rose-400 bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20">{error}</p>
            )}

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border border-white/10 text-xs font-semibold text-slate-300 hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-fuchsia-500 to-purple-600 hover:from-fuchsia-400 hover:to-purple-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-fuchsia-500/25 disabled:opacity-50 transition-all"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send Proposal"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
