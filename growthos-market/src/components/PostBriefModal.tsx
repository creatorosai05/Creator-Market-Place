"use client";

import { useState } from "react";
import { X, Sparkles, Loader2, CheckCircle2 } from "lucide-react";

interface PostBriefModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBriefCreated?: () => void;
}

const CATEGORIES = [
  "Short-Form Video",
  "AI Art & Thumbnails",
  "AI UGC Ads",
  "AI Voiceover & Audio",
  "Copywriting & Prompts",
  "3D & VFX Motion",
];

export default function PostBriefModal({
  isOpen,
  onClose,
  onBriefCreated,
}: PostBriefModalProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Short-Form Video");
  const [budgetMin, setBudgetMin] = useState(250);
  const [budgetMax, setBudgetMax] = useState(750);
  const [deadlineDays, setDeadlineDays] = useState(7);
  const [description, setDescription] = useState("");
  const [tools, setTools] = useState("Runway Gen-3, Midjourney v6, ElevenLabs");
  const [loading, setLoading] = useState(false);
  const [successKey, setSuccessKey] = useState<string | null>(null);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/briefs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          category,
          budgetMin: Number(budgetMin),
          budgetMax: Number(budgetMax),
          deadlineDays: Number(deadlineDays),
          description,
          tools: tools.split(",").map((t) => t.trim()).filter(Boolean),
          deliverables: ["1x 4K Master Video (9:16)", "3x Hook Iterations", "Raw Project File & Prompts"],
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Failed to post brief");
      }

      setSuccessKey(data.item?.edit_key || "saved");
      if (onBriefCreated) onBriefCreated();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error posting brief";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-2xl border border-cyan-500/30 bg-[#0d111b] p-6 shadow-2xl shadow-cyan-500/10 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {successKey ? (
          <div className="py-8 text-center space-y-4">
            <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto animate-bounce" />
            <h3 className="text-xl font-bold text-white">Brief Published Live!</h3>
            <p className="text-sm text-slate-300">
              Creators with matching AI stacks are now reviewing your brief.
            </p>
            <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-xs">
              <span className="text-slate-400 block mb-1">Your Secret Edit Key:</span>
              <code className="text-cyan-400 font-mono text-[11px] break-all">{successKey}</code>
            </div>
            <button
              onClick={() => {
                setSuccessKey(null);
                onClose();
              }}
              className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs"
            >
              Done & View Brief
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Post an AI Content Brief</h3>
                <p className="text-xs text-slate-400">Target creator profiles by AI stack, turnaround, and budget</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Brief Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 5x Hyper-Realistic AI UGC Ads for SaaS Launch"
                className="w-full rounded-xl bg-slate-900/90 border border-white/10 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl bg-slate-900/90 border border-white/10 px-3 py-2.5 text-xs text-slate-100 focus:border-cyan-400 focus:outline-none"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Turnaround (Days)</label>
                <input
                  type="number"
                  min={1}
                  max={60}
                  value={deadlineDays}
                  onChange={(e) => setDeadlineDays(Number(e.target.value))}
                  className="w-full rounded-xl bg-slate-900/90 border border-white/10 px-3.5 py-2 text-xs text-slate-100 focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Min Budget (₹/$)</label>
                <input
                  type="number"
                  min={10}
                  value={budgetMin}
                  onChange={(e) => setBudgetMin(Number(e.target.value))}
                  className="w-full rounded-xl bg-slate-900/90 border border-white/10 px-3.5 py-2 text-xs text-slate-100 focus:border-cyan-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Max Budget (₹/$)</label>
                <input
                  type="number"
                  min={budgetMin}
                  value={budgetMax}
                  onChange={(e) => setBudgetMax(Number(e.target.value))}
                  className="w-full rounded-xl bg-slate-900/90 border border-white/10 px-3.5 py-2 text-xs text-slate-100 focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Required AI Stack (comma-separated)</label>
              <input
                type="text"
                value={tools}
                onChange={(e) => setTools(e.target.value)}
                placeholder="Runway Gen-3, Midjourney, Kling AI, ElevenLabs"
                className="w-full rounded-xl bg-slate-900/90 border border-white/10 px-3.5 py-2 text-xs text-slate-100 focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Detailed Brief & Guidelines</label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your brand voice, visual aesthetic, aspect ratios, and target audience..."
                className="w-full rounded-xl bg-slate-900/90 border border-white/10 px-3.5 py-2.5 text-xs text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
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
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 disabled:opacity-50 transition-all"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Publish Brief"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
