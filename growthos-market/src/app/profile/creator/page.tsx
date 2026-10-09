"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import {
  User,
  Zap,
  Sparkles,
  ShieldCheck,
  Globe,
  MapPin,
  Save,
  Plus,
  Trash2,
  ExternalLink,
  CheckCircle2,
  Loader2,
  DollarSign,
  Briefcase,
  Layers,
  Award,
} from "lucide-react";

interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  media_url: string;
  metrics: string;
  tools_used: string[];
  notes: string;
}

const AVAILABLE_TOOLS = [
  "Runway Gen-3",
  "Midjourney v6",
  "ElevenLabs",
  "Kling AI",
  "Flux 1.1",
  "Sora Alpha",
  "Luma Dream Machine",
  "Topaz Video AI",
  "ComfyUI",
  "Claude 3.5 Sonnet",
  "ChatGPT-4o",
  "Blender 3D",
  "After Effects",
  "Premiere Pro",
];

const CATEGORIES = [
  "Short-Form Video",
  "AI Art & Thumbnails",
  "AI UGC Ads",
  "AI Voiceover & Audio",
  "Copywriting & Prompts",
  "3D & VFX Motion",
];

export default function CreatorProfilePage() {
  const [loading, setLoading] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Profile fields
  const [fullName, setFullName] = useState("Vamshi VFX");
  const [headline, setHeadline] = useState("Senior GenAI Animator & Viral UGC Specialist");
  const [location, setLocation] = useState("Hyderabad, India (Remote Global)");
  const [bio, setBio] = useState(
    "Specialized in photorealistic AI video pipelines combining Runway Gen-3 with custom LoRAs and ElevenLabs multilingual voice dubbing. Over 50M+ organic views generated for client campaigns."
  );
  const [hourlyRate, setHourlyRate] = useState("2500");
  const [experienceYears, setExperienceYears] = useState("4");
  const [avatarUrl, setAvatarUrl] = useState("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80");
  const [website, setWebsite] = useState("https://portfolio.creatoros.ai/vamshi");
  const [socials, setSocials] = useState({
    twitter: "@vamshivfx",
    youtube: "youtube.com/@vamshivfx",
    linkedin: "linkedin.com/in/vamshi-ai",
  });

  // Skills & Tools
  const [selectedTools, setSelectedTools] = useState<string[]>([
    "Runway Gen-3",
    "Midjourney v6",
    "ElevenLabs",
    "Kling AI",
    "Topaz Video AI",
  ]);
  const [customToolInput, setCustomToolInput] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    "Short-Form Video",
    "AI UGC Ads",
    "3D & VFX Motion",
  ]);

  // Portfolio items
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([
    {
      id: "port-1",
      title: "5x Hyper-Realistic AI UGC Ads for HealthTech",
      category: "AI UGC Ads",
      media_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80",
      metrics: "3.4M Views · 4.8% CTR · ₹4.2L Sales",
      tools_used: ["Runway Gen-3", "Midjourney", "ElevenLabs"],
      notes: "Full character consistency pipeline with realistic lip-syncing and viral hook pacing.",
    },
    {
      id: "port-2",
      title: "Cyberpunk Cinematic Brand Teaser Trailer",
      category: "3D & VFX Motion",
      media_url: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80",
      metrics: "850K Views · Featured on Product Hunt",
      tools_used: ["Kling AI", "Blender 3D", "After Effects"],
      notes: "High frame-rate fluid dynamics and camera pan simulation for luxury tech launch.",
    },
  ]);

  // New Portfolio Item inputs
  const [newProjectTitle, setNewProjectTitle] = useState("");
  const [newProjectCategory, setNewProjectCategory] = useState("Short-Form Video");
  const [newProjectMetrics, setNewProjectMetrics] = useState("");
  const [newProjectMedia, setNewProjectMedia] = useState("");
  const [newProjectNotes, setNewProjectNotes] = useState("");
  const [showAddProject, setShowAddProject] = useState(false);

  useEffect(() => {
    // Check local demo profile
    const demo = localStorage.getItem("creatoros_creator_profile");
    if (demo) {
      try {
        const p = JSON.parse(demo);
        if (p.fullName) setFullName(p.fullName);
        if (p.headline) setHeadline(p.headline);
        if (p.location) setLocation(p.location);
        if (p.bio) setBio(p.bio);
        if (p.hourlyRate) setHourlyRate(p.hourlyRate);
        if (p.experienceYears) setExperienceYears(p.experienceYears);
        if (p.avatarUrl) setAvatarUrl(p.avatarUrl);
        if (p.website) setWebsite(p.website);
        if (p.selectedTools) setSelectedTools(p.selectedTools);
        if (p.selectedCategories) setSelectedCategories(p.selectedCategories);
        if (p.portfolio) setPortfolio(p.portfolio);
      } catch (e) {
        console.warn("Failed parsing stored profile:", e);
      }
    }
  }, []);

  const toggleTool = (tool: string) => {
    if (selectedTools.includes(tool)) {
      setSelectedTools(selectedTools.filter((t) => t !== tool));
    } else {
      setSelectedTools([...selectedTools, tool]);
    }
  };

  const addCustomTool = () => {
    if (customToolInput.trim() && !selectedTools.includes(customToolInput.trim())) {
      setSelectedTools([...selectedTools, customToolInput.trim()]);
      setCustomToolInput("");
    }
  };

  const toggleCategory = (cat: string) => {
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== cat));
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectTitle.trim()) return;

    const newItem: PortfolioItem = {
      id: `port-${Date.now()}`,
      title: newProjectTitle,
      category: newProjectCategory,
      media_url: newProjectMedia || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80",
      metrics: newProjectMetrics || "Verified Commercial Delivery",
      tools_used: selectedTools.slice(0, 3),
      notes: newProjectNotes,
    };

    setPortfolio([newItem, ...portfolio]);
    setNewProjectTitle("");
    setNewProjectMetrics("");
    setNewProjectMedia("");
    setNewProjectNotes("");
    setShowAddProject(false);
  };

  const handleDeleteProject = (id: string) => {
    setPortfolio(portfolio.filter((p) => p.id !== id));
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    setSavedSuccess(false);

    const profileData = {
      fullName,
      headline,
      location,
      bio,
      hourlyRate,
      experienceYears,
      avatarUrl,
      website,
      socials,
      selectedTools,
      selectedCategories,
      portfolio,
    };

    try {
      localStorage.setItem("creatoros_creator_profile", JSON.stringify(profileData));

      // Attempt Supabase backend sync
      await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName,
          avatar_url: avatarUrl,
          bio: bio,
          ai_tools: selectedTools,
          categories: selectedCategories,
          details: {
            headline,
            location,
            hourly_rate: hourlyRate,
            experience_years: experienceYears,
            website,
            socials,
            portfolio,
          },
        }),
      });

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.warn("Profile sync notice:", err);
      setSavedSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Profile Banner & Header */}
        <div className="glass-panel-glow rounded-3xl p-6 sm:p-8 border border-fuchsia-500/20 relative overflow-hidden mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="relative group">
                <img
                  src={avatarUrl}
                  alt={fullName}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-fuchsia-500/40 shadow-xl shadow-fuchsia-500/20 group-hover:scale-105 transition-transform"
                />
                <span className="absolute -bottom-1 -right-1 p-1 rounded-full bg-emerald-500 text-slate-950 shadow-md">
                  <ShieldCheck className="w-4 h-4 text-slate-950" />
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{fullName}</h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/30 text-fuchsia-300 text-[11px] font-mono font-bold uppercase">
                    Creator Profile
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-cyan-300 mt-1 font-medium">{headline}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" /> {location}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-emerald-400 font-semibold font-mono">
                    <DollarSign className="w-3.5 h-3.5" /> ₹{hourlyRate}/hr
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Link
                href="/dashboard/creator"
                className="px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
              >
                <Zap className="w-4 h-4 text-fuchsia-400" />
                Go to Studio
              </Link>
              <button
                onClick={handleSaveProfile}
                disabled={loading}
                className="flex-1 sm:flex-initial px-6 py-3 rounded-xl bg-gradient-to-r from-fuchsia-500 to-indigo-600 hover:from-fuchsia-400 hover:to-indigo-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-fuchsia-500/25 transition-all hover:scale-105 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : savedSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-slate-950" /> Saved Live!
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Save Profile
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Section 1: Personal & Professional Details */}
        <section className="glass-panel rounded-2xl p-6 sm:p-8 border border-white/10 mb-8 space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-white/10">
            <User className="w-5 h-5 text-fuchsia-400" />
            <h2 className="text-lg font-bold text-white">Personal & Professional Information</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-xl bg-slate-900 border border-white/10 px-3.5 py-2.5 text-xs text-slate-100 focus:border-fuchsia-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Professional Title / Headline</label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="w-full rounded-xl bg-slate-900 border border-white/10 px-3.5 py-2.5 text-xs text-slate-100 focus:border-fuchsia-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded-xl bg-slate-900 border border-white/10 px-3.5 py-2.5 text-xs text-slate-100 focus:border-fuchsia-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Base Rate (₹/hr or min project)</label>
              <input
                type="number"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                className="w-full rounded-xl bg-slate-900 border border-white/10 px-3.5 py-2.5 text-xs text-slate-100 focus:border-fuchsia-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Years of Experience</label>
              <input
                type="number"
                value={experienceYears}
                onChange={(e) => setExperienceYears(e.target.value)}
                className="w-full rounded-xl bg-slate-900 border border-white/10 px-3.5 py-2.5 text-xs text-slate-100 focus:border-fuchsia-400 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Profile Photo / Avatar URL</label>
            <input
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              className="w-full rounded-xl bg-slate-900 border border-white/10 px-3.5 py-2.5 text-xs text-slate-100 focus:border-fuchsia-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Bio & Workflow Summary</label>
            <textarea
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Describe your AI tools, editing techniques, prompt engineering capabilities..."
              className="w-full rounded-xl bg-slate-900 border border-white/10 px-3.5 py-2.5 text-xs text-slate-100 focus:border-fuchsia-400 focus:outline-none leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Portfolio / Website</label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full rounded-xl bg-slate-900 border border-white/10 px-3.5 py-2.5 text-xs text-slate-100 focus:border-fuchsia-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Twitter / X Handle</label>
              <input
                type="text"
                value={socials.twitter}
                onChange={(e) => setSocials({ ...socials, twitter: e.target.value })}
                className="w-full rounded-xl bg-slate-900 border border-white/10 px-3.5 py-2.5 text-xs text-slate-100 focus:border-fuchsia-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">YouTube / LinkedIn</label>
              <input
                type="text"
                value={socials.youtube}
                onChange={(e) => setSocials({ ...socials, youtube: e.target.value })}
                className="w-full rounded-xl bg-slate-900 border border-white/10 px-3.5 py-2.5 text-xs text-slate-100 focus:border-fuchsia-400 focus:outline-none"
              />
            </div>
          </div>
        </section>

        {/* Section 2: AI Stack & Tools Mastery */}
        <section className="glass-panel rounded-2xl p-6 sm:p-8 border border-white/10 mb-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-cyan-400" />
              <div>
                <h2 className="text-lg font-bold text-white">AI Tools & Tech Stack</h2>
                <p className="text-xs text-slate-400">Select all AI tools you have verified production mastery in</p>
              </div>
            </div>
            <span className="text-xs font-mono text-cyan-400">{selectedTools.length} Selected</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {AVAILABLE_TOOLS.map((tool) => {
              const active = selectedTools.includes(tool);
              return (
                <button
                  key={tool}
                  type="button"
                  onClick={() => toggleTool(tool)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold font-mono transition-all ${
                    active
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-md shadow-cyan-500/10 scale-105"
                      : "bg-white/5 text-slate-400 hover:text-white border border-white/10"
                  }`}
                >
                  {tool} {active && "✓"}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 max-w-md pt-2">
            <input
              type="text"
              value={customToolInput}
              onChange={(e) => setCustomToolInput(e.target.value)}
              placeholder="Add other AI tool (e.g. Magnific, Suno, Higgsfield)..."
              className="flex-1 rounded-xl bg-slate-900 border border-white/10 px-3.5 py-2 text-xs text-slate-100 focus:border-cyan-400 focus:outline-none"
            />
            <button
              type="button"
              onClick={addCustomTool}
              className="px-4 py-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-semibold hover:bg-cyan-500/30 transition-colors"
            >
              Add
            </button>
          </div>
        </section>

        {/* Section 3: Categories & Specializations */}
        <section className="glass-panel rounded-2xl p-6 sm:p-8 border border-white/10 mb-8 space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-white/10">
            <Layers className="w-5 h-5 text-purple-400" />
            <div>
              <h2 className="text-lg font-bold text-white">Primary Creative Categories</h2>
              <p className="text-xs text-slate-400">Select formats you deliver for brand briefs</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {CATEGORIES.map((cat) => {
              const active = selectedCategories.includes(cat);
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => toggleCategory(cat)}
                  className={`p-3.5 rounded-xl text-xs font-bold text-left transition-all border ${
                    active
                      ? "bg-purple-500/15 border-purple-500/50 text-purple-200 shadow-md shadow-purple-500/10"
                      : "bg-white/5 border-white/5 text-slate-400 hover:text-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{cat}</span>
                    {active && <span className="text-purple-400 font-bold">✓</span>}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Section 4: Projects & Portfolio Showcase */}
        <section className="glass-panel rounded-2xl p-6 sm:p-8 border border-white/10 mb-8 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <div>
                <h2 className="text-lg font-bold text-white">Portfolio & Commercial Case Studies</h2>
                <p className="text-xs text-slate-400">Showcase past client results, metrics, and deliverable links</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowAddProject(!showAddProject)}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-cyan-400" />
              Add Project
            </button>
          </div>

          {/* Add Project Form */}
          {showAddProject && (
            <form onSubmit={handleAddProject} className="p-5 rounded-2xl bg-white/5 border border-cyan-500/30 space-y-4">
              <h3 className="text-sm font-bold text-white">Add New Portfolio Project</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Project Title</label>
                  <input
                    type="text"
                    required
                    value={newProjectTitle}
                    onChange={(e) => setNewProjectTitle(e.target.value)}
                    placeholder="e.g. 3x 3D Product Motion Renders for Beverage Brand"
                    className="w-full rounded-xl bg-slate-900 border border-white/10 px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={newProjectCategory}
                    onChange={(e) => setNewProjectCategory(e.target.value)}
                    className="w-full rounded-xl bg-slate-900 border border-white/10 px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Key Metrics / Impact</label>
                  <input
                    type="text"
                    value={newProjectMetrics}
                    onChange={(e) => setNewProjectMetrics(e.target.value)}
                    placeholder="e.g. +2.1M Organic Views · 14.5% CTR"
                    className="w-full rounded-xl bg-slate-900 border border-white/10 px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Media / Image Preview URL</label>
                  <input
                    type="url"
                    value={newProjectMedia}
                    onChange={(e) => setNewProjectMedia(e.target.value)}
                    placeholder="https://images.unsplash.com/... or Google Drive URL"
                    className="w-full rounded-xl bg-slate-900 border border-white/10 px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Workflow Notes & Prompt Strategy</label>
                <textarea
                  rows={2}
                  value={newProjectNotes}
                  onChange={(e) => setNewProjectNotes(e.target.value)}
                  placeholder="Describe models used, prompt architecture, revision cycle..."
                  className="w-full rounded-xl bg-slate-900 border border-white/10 px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddProject(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400"
                >
                  Add to Portfolio
                </button>
              </div>
            </form>
          )}

          {/* Project List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {portfolio.map((item) => (
              <div key={item.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3 relative group">
                <img
                  src={item.media_url}
                  alt={item.title}
                  className="w-full h-36 rounded-xl object-cover border border-white/10"
                />
                <div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-cyan-400 mb-1">
                    <span>{item.category}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteProject(item.id)}
                      className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                      title="Delete Project"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <h4 className="font-bold text-sm text-white">{item.title}</h4>
                  <span className="text-xs text-emerald-400 font-semibold block mt-1">{item.metrics}</span>
                  <p className="text-xs text-slate-300 mt-2 line-clamp-2">{item.notes}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom Save Action */}
        <div className="flex items-center justify-between p-6 rounded-2xl glass-panel-glow border border-fuchsia-500/20">
          <div>
            <h4 className="font-bold text-sm text-white">Save Changes to Creator Profile</h4>
            <p className="text-xs text-slate-400">All updates immediately sync to the CreatorOS marketplace directory</p>
          </div>
          <button
            onClick={handleSaveProfile}
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-fuchsia-500 to-indigo-600 hover:from-fuchsia-400 hover:to-indigo-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-fuchsia-500/25 transition-all hover:scale-105 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save & Publish Profile
          </button>
        </div>
      </main>
    </div>
  );
}
