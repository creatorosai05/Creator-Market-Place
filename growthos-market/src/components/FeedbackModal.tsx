"use client";

import { useState } from "react";
import { Star, X, CheckCircle, Loader2 } from "lucide-react";

interface FeedbackModalProps {
  orderId: string;
  orderTitle?: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmitted?: () => void;
}

export default function FeedbackModal({
  orderId,
  orderTitle = "Content Delivery",
  isOpen,
  onClose,
  onSubmitted,
}: FeedbackModalProps) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/feedbacks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          rating,
          comment,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Failed to submit feedback");
      }

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        if (onSubmitted) onSubmitted();
      }, 1500);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl border border-cyan-500/30 bg-[#0d111b] p-6 shadow-2xl shadow-cyan-500/10">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {success ? (
          <div className="py-8 text-center flex flex-col items-center">
            <CheckCircle className="w-16 h-16 text-emerald-400 mb-3 animate-bounce" />
            <h3 className="text-xl font-bold text-white">Feedback Submitted!</h3>
            <p className="text-sm text-slate-300 mt-1">
              Your rating has been recorded and verified on-chain.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <span className="text-xs font-mono uppercase text-cyan-400 tracking-wider">Verified Escrow Review</span>
              <h3 className="text-lg font-bold text-white mt-1">Rate Creator Output</h3>
              <p className="text-xs text-slate-400 mt-0.5">Order ID: <span className="font-mono text-slate-300">{orderId}</span></p>
            </div>

            {/* Star Rating Select */}
            <div className="flex flex-col items-center justify-center py-3 bg-white/5 rounded-xl border border-white/5">
              <span className="text-xs text-slate-400 mb-2">Quality & Prompt Alignment</span>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 transition-transform hover:scale-125 focus:outline-none"
                  >
                    <Star
                      className={`w-7 h-7 transition-colors ${
                        (hoverRating || rating) >= star
                          ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]"
                          : "text-slate-600"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-xs font-semibold text-amber-300 mt-2">
                {rating === 5 ? "⭐️ 5.0 — Outstanding / Viral Quality" :
                 rating === 4 ? "⭐️ 4.0 — High Quality / Met Specs" :
                 rating === 3 ? "⭐️ 3.0 — Satisfactory Deliverable" :
                 rating === 2 ? "⭐️ 2.0 — Needs Revisions" : "⭐️ 1.0 — Unsatisfactory"}
              </span>
            </div>

            {/* Comment Area */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Review & Constructive Notes
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                placeholder="Describe pacing, prompt adherence, audio clarity, or workflow efficiency..."
                className="w-full rounded-xl bg-slate-900/90 border border-white/10 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
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
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 disabled:opacity-50 transition-all"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit Review"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
