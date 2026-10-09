"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import ProposalModal from "@/components/ProposalModal";
import PostBriefModal from "@/components/PostBriefModal";
import {
  Sparkles,
  Search,
  Zap,
  Briefcase,
  ShieldCheck,
  Clock,
  ArrowRight,
  Cpu,
  Layers,
  Star,
  Flame,
  CheckCircle2,
} from "lucide-react";

interface BriefItem {
  id: string;
  title: string;
  brand: string;
  category: string;
  budget_min: number;
  budget_max: number;
  deadline_days: number;
  description: string;
  deliverables?: string[];
  signals?: {
    tools?: string[];
    complexity?: string;
  };
  ai_confidence?: number;
  status: string;
  created_at: string;
}

const CATEGORIES = [
  "All Categories",
  "Short-Form Video",
  "AI Art & Thumbnails",
  "AI UGC Ads",
  "AI Voiceover & Audio",
  "Copywriting & Prompts",
  "3D & VFX Motion",
];

const INITIAL_FALLBACK_BRIEFS: BriefItem[] = [
  {
    id: "b-ugc01",
    title: "5x Hyper-Realistic AI UGC Video Ads for HealthTech Launch",
    brand: "Vitals AI Health",
    category: "AI UGC Ads",
    budget_min: 450,
    budget_max: 950,
    deadline_days: 5,
    description: "Need realistic AI talking head avatars with Runway Gen-3 camera pans and ElevenLabs voice clones for TikTok/Meta ad spend.",
    deliverables: ["5x 9:16 Vertical Video Masters", "3x Hook Iterations per video", "Full Script Prompts"],
    signals: { tools: ["Runway Gen-3", "Midjourney v6", "ElevenLabs"], complexity: "medium" },
    ai_confidence: 94,
    status: "open",
    created_at: new Date().toISOString(),
  },
  {
    id: "b-art02",
    title: "Sci-Fi Cyberpunk YouTube Thumbnails (High CTR Package)",
    brand: "FutureTech Media",
    category: "AI Art & Thumbnails",
    budget_min: 200,
    budget_max: 500,
    deadline_days: 3,
    description: "Generate 10 cinematic YouTube thumbnails with hyper-detailed character models, neon lighting, and high contrast typography.",
    deliverables: ["10x 4K Thumbnail Files", "Editable PSD/Figma with layers", "Upscaled Master Renders"],
    signals: { tools: ["Midjourney v6", "Magnific AI", "Photoshop"], complexity: "easy" },
    ai_confidence: 91,
    status: "open",
    created_at: new Date().toISOString(),
  },
  {
    id: "b-vfx03",
    title: "Cinematic Product Reveal Animation with AI Fluid Simulation",
    brand: "Apex Energy Drink",
    category: "3D & VFX Motion",
    budget_min: 800,
    budget_max: 1800,
    deadline_days: 10,
    description: "Combine Unreal Engine / Blender 3D can renders with Kling AI / Sora-grade fluid splash background generations for a 30s launch teaser.",
    deliverables: ["30s Master Cut 4K", "Audio Stems + SFX", "Storyboards"],
    signals: { tools: ["Kling AI", "Blender", "After Effects", "Suno"], complexity: "hard" },
    ai_confidence: 89,
    status: "open",
    created_at: new Date().toISOString(),
  },
];

const FEATURED_CREATORS = [
  {
    name: "Alex V.",
    handle: "@alexvfx",
    rating: 4.98,
    reviews: 64,
    completed: 112,
    stack: ["Runway Gen-3", "Midjourney", "ElevenLabs", "Topaz"],
    badge: "Top Rated Plus",
    rate: "₹2,500/hr",
    avatar: "AV",
  },
  {
    name: "Maya Shen",
    handle: "@mayastudios",
    rating: 5.0,
    reviews: 42,
    completed: 78,
    stack: ["Kling AI", "Flux 1.1", "ComfyUI", "Magnific"],
    badge: "GenAI Specialist",
    rate: "₹3,200/hr",
    avatar: "MS",
  },
  {
    name: "Devon Reed",
    handle: "@devonmotion",
    rating: 4.92,
    reviews: 89,
    completed: 145,
    stack: ["Sora Alpha", "Luma Dream Machine", "Premiere Pro"],
    badge: "Viral UGC Lead",
    rate: "₹1,800/hr",
    avatar: "DR",
  },
];

export default function HomePage() {
  const [briefs, setBriefs] = useState<BriefItem[]>(INITIAL_FALLBACK_BRIEFS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [loading, setLoading] = useState(false);

  // Modals
  const [isPostBriefOpen, setIsPostBriefOpen] = useState(false);
  const [selectedBriefForPitch, setSelectedBriefForPitch] = useState<BriefItem | null>(null);

  const fetchBriefs = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/briefs?status=open");
      const data = await res.json();
      if (data.ok && Array.isArray(data.items) && data.items.length > 0) {
        setBriefs(data.items);
      }
    } catch (e) {
      console.warn("Failed fetching briefs, using fallback briefs:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBriefs();
  }, []);

  const filteredBriefs = briefs.filter((brief) => {
    const matchesCategory =
      selectedCategory === "All Categories" || brief.category === selectedCategory;
    const matchesQuery =
      searchQuery === "" ||
      brief.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      brief.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      brief.brand.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8 grid-bg overflow-hidden border-b border-white/5">
        {/* Glow Spheres */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-cyan-500/10 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 left-3/4 -translate-y-1/2 w-[450px] h-[300px] bg-purple-500/10 blur-[140px] rounded-full pointer-events-none" />

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-6 shadow-inner">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Content Creator Marketplace & Escrow Protocol</span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.1]">
            Find the creator whose{" "}
            <span className="gradient-text-jarvis">AI stack fits your brief</span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal">
            Explainable AI matching between forward-thinking brands and elite GenAI creators.
            Milestone escrow, prompt verification, and instant Razorpay settlement.
          </p>

          {/* Quick Stats Bar */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
              <div className="text-lg font-bold text-cyan-400 font-mono">99.4%</div>
              <div className="text-[11px] text-slate-400 uppercase tracking-wide">On-Time Escrow</div>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
              <div className="text-lg font-bold text-purple-400 font-mono">1,200+</div>
              <div className="text-[11px] text-slate-400 uppercase tracking-wide">Verified Creators</div>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
              <div className="text-lg font-bold text-emerald-400 font-mono">4.9/5.0</div>
              <div className="text-[11px] text-slate-400 uppercase tracking-wide">Quality Benchmark</div>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
              <div className="text-lg font-bold text-amber-400 font-mono">₹45L+</div>
              <div className="text-[11px] text-slate-400 uppercase tracking-wide">Volume Settled</div>
            </div>
          </div>

          {/* Search Bar & Category Controls */}
          <div className="mt-10 max-w-3xl mx-auto p-2 rounded-2xl glass-panel-glow border border-cyan-500/30">
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <div className="relative flex-1 w-full">
                <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search briefs by keyword, AI tool (Runway, Kling), or brand..."
                  className="w-full pl-11 pr-4 py-3 bg-transparent text-sm text-white placeholder:text-slate-400 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full sm:w-auto px-3.5 py-3 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => setIsPostBriefOpen(true)}
                  className="px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 whitespace-nowrap shadow-md shadow-cyan-500/20 transition-all"
                >
                  <Briefcase className="w-4 h-4" />
                  Post a Brief
                </button>
              </div>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm shadow-cyan-500/20"
                    : "bg-white/5 text-slate-400 hover:text-slate-200 border border-white/5"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Marketplace Briefs Board */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-cyan-500/20 text-cyan-400">
                <Layers className="w-4 h-4" />
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white">Live Open Briefs</h2>
              <span className="px-2 py-0.5 rounded-full bg-white/10 text-slate-300 text-xs font-mono">
                {filteredBriefs.length}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Active projects waiting for creator pitches. Filtered by {selectedCategory}.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPostBriefOpen(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Post Brief (Brand)
            </button>
            <Link
              href="/dashboard/creator"
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 flex items-center gap-1.5 transition-colors"
            >
              Creator Studio <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Briefs Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBriefs.map((brief) => (
            <div
              key={brief.id}
              className="glass-panel glass-card-hover rounded-2xl p-6 flex flex-col justify-between border border-white/10 relative overflow-hidden group"
            >
              {/* Category & Status */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                    {brief.category}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    {brief.status.toUpperCase()}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                  {brief.title}
                </h3>

                <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
                  <span className="font-semibold text-slate-300">{brief.brand}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-slate-400">
                    <Clock className="w-3 h-3 text-cyan-400" />
                    {brief.deadline_days}d turnaround
                  </span>
                </div>

                <p className="mt-3 text-xs text-slate-300/90 line-clamp-3 leading-relaxed">
                  {brief.description}
                </p>

                {/* AI Stack Badges */}
                {brief.signals?.tools && brief.signals.tools.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-white/5">
                    <span className="text-[10px] uppercase tracking-wider font-mono text-slate-400 block mb-1.5">
                      Required AI Stack:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {brief.signals.tools.map((tool) => (
                        <span
                          key={tool}
                          className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[11px] text-slate-300 font-mono"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-mono block">
                    Escrow Budget
                  </span>
                  <span className="text-base font-extrabold text-white font-mono">
                    ₹{brief.budget_min} - ₹{brief.budget_max}
                  </span>
                </div>

                <button
                  onClick={() => setSelectedBriefForPitch(brief)}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-fuchsia-500 to-purple-600 hover:from-fuchsia-400 hover:to-purple-500 text-slate-950 font-bold text-xs flex items-center gap-1 shadow-md shadow-fuchsia-500/20 transition-all hover:scale-105"
                >
                  <Zap className="w-3.5 h-3.5" />
                  Pitch
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Featured Elite AI Creators Section */}
        <section className="mt-20 pt-12 border-t border-white/10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-400" />
                <h2 className="text-xl sm:text-2xl font-bold text-white">Featured Explainable AI Creators</h2>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Verified portfolio metrics, audited prompt stacks, and strict on-time delivery track records.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURED_CREATORS.map((c) => (
              <div key={c.handle} className="glass-panel rounded-2xl p-6 border border-white/10 relative">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-fuchsia-600 flex items-center justify-center font-bold text-white text-base shadow-lg shadow-cyan-500/20">
                      {c.avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-sm text-white">{c.name}</h4>
                        <ShieldCheck className="w-4 h-4 text-cyan-400" />
                      </div>
                      <span className="text-xs text-slate-400">{c.handle}</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[10px] font-semibold">
                    {c.badge}
                  </span>
                </div>

                <div className="mt-4 flex items-center gap-3 text-xs text-slate-300">
                  <div className="flex items-center gap-1 text-amber-400 font-semibold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{c.rating}</span>
                  </div>
                  <span>•</span>
                  <span>{c.reviews} reviews</span>
                  <span>•</span>
                  <span className="text-emerald-400 font-semibold">{c.completed} orders</span>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5">
                  <span className="text-[10px] uppercase font-mono text-slate-400 block mb-1.5">
                    Verified Tools:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {c.stack.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono text-cyan-300"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between pt-3 border-t border-white/10">
                  <span className="text-xs font-mono text-slate-300">{c.rate}</span>
                  <button
                    onClick={() => setIsPostBriefOpen(true)}
                    className="px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-cyan-500/20 hover:text-cyan-300 border border-white/10 text-xs font-semibold text-slate-200 transition-colors"
                  >
                    Hire via Brief
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#05070a] py-10 px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="font-bold text-slate-300">CreatorOS AI (GrowthOS Market)</span>
            <span>— Production MVP Launch</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-slate-300 transition-colors">Marketplace</Link>
            <Link href="/dashboard/brand" className="hover:text-slate-300 transition-colors">Brand OS</Link>
            <Link href="/dashboard/creator" className="hover:text-slate-300 transition-colors">Creator Studio</Link>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <PostBriefModal
        isOpen={isPostBriefOpen}
        onClose={() => setIsPostBriefOpen(false)}
        onBriefCreated={fetchBriefs}
      />

      {selectedBriefForPitch && (
        <ProposalModal
          briefId={selectedBriefForPitch.id}
          briefTitle={selectedBriefForPitch.title}
          isOpen={true}
          onClose={() => setSelectedBriefForPitch(null)}
        />
      )}
    </div>
  );
}
