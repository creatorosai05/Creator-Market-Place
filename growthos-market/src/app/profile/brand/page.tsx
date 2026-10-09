"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import {
  Briefcase,
  Building,
  Globe,
  Mail,
  ShieldCheck,
  Save,
  CheckCircle2,
  Loader2,
  DollarSign,
  Clock,
  Layers,
  FileText,
  CreditCard,
} from "lucide-react";

const INDUSTRIES = [
  "SaaS & B2B Tech",
  "E-Commerce & DTC Brands",
  "Mobile Apps & Gaming",
  "HealthTech & Wellness",
  "FinTech & Web3",
  "Creative & Performance Agency",
];

const PREFERRED_FORMATS = [
  "Short-Form Video (9:16)",
  "AI UGC Video Ads",
  "High-CTR YouTube Thumbnails",
  "AI Voiceover & Multilingual Dubbing",
  "3D Product Renders & Motion",
  "Viral Scriptwriting & Ad Copy",
];

export default function BrandProfilePage() {
  const [loading, setLoading] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Brand details
  const [companyName, setCompanyName] = useState("Nexus AI Studios");
  const [tagline, setTagline] = useState("Next-Gen Generative AI Media & Performance Marketing");
  const [industry, setIndustry] = useState("SaaS & B2B Tech");
  const [companySize, setCompanySize] = useState("11-50 employees");
  const [website, setWebsite] = useState("https://nexusbrand.ai");
  const [logoUrl, setLogoUrl] = useState("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80");
  const [description, setDescription] = useState(
    "We partner with elite GenAI creators to scale our performance ad creative pipeline across TikTok, Meta, and YouTube Shorts. We release escrow within 24 hours of deliverable approval."
  );

  // Content requirements
  const [monthlyBudget, setMonthlyBudget] = useState("150000");
  const [targetTurnaround, setTargetTurnaround] = useState("5");
  const [brandVoice, setBrandVoice] = useState("Clean, modern, high-contrast, energetic pacing with verified realistic human-like avatars.");
  const [selectedFormats, setSelectedFormats] = useState<string[]>([
    "Short-Form Video (9:16)",
    "AI UGC Video Ads",
    "High-CTR YouTube Thumbnails",
  ]);

  // Billing & Contact
  const [contactName, setContactName] = useState("Alexander Wright (Head of Creative)");
  const [billingEmail, setBillingEmail] = useState("billing@nexusbrand.ai");
  const [taxId, setTaxId] = useState("GSTIN-36AAACN1234F1Z5");
  const [location, setLocation] = useState("Bangalore, India");

  useEffect(() => {
    const demo = localStorage.getItem("creatoros_brand_profile");
    if (demo) {
      try {
        const p = JSON.parse(demo);
        if (p.companyName) setCompanyName(p.companyName);
        if (p.tagline) setTagline(p.tagline);
        if (p.industry) setIndustry(p.industry);
        if (p.companySize) setCompanySize(p.companySize);
        if (p.website) setWebsite(p.website);
        if (p.logoUrl) setLogoUrl(p.logoUrl);
        if (p.description) setDescription(p.description);
        if (p.monthlyBudget) setMonthlyBudget(p.monthlyBudget);
        if (p.targetTurnaround) setTargetTurnaround(p.targetTurnaround);
        if (p.brandVoice) setBrandVoice(p.brandVoice);
        if (p.selectedFormats) setSelectedFormats(p.selectedFormats);
        if (p.contactName) setContactName(p.contactName);
        if (p.billingEmail) setBillingEmail(p.billingEmail);
      } catch (e) {
        console.warn("Failed parsing stored brand profile:", e);
      }
    }
  }, []);

  const toggleFormat = (format: string) => {
    if (selectedFormats.includes(format)) {
      setSelectedFormats(selectedFormats.filter((f) => f !== format));
    } else {
      setSelectedFormats([...selectedFormats, format]);
    }
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    setSavedSuccess(false);

    const profileData = {
      companyName,
      tagline,
      industry,
      companySize,
      website,
      logoUrl,
      description,
      monthlyBudget,
      targetTurnaround,
      brandVoice,
      selectedFormats,
      contactName,
      billingEmail,
      taxId,
      location,
    };

    try {
      localStorage.setItem("creatoros_brand_profile", JSON.stringify(profileData));

      await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: companyName,
          company_name: companyName,
          avatar_url: logoUrl,
          bio: description,
          categories: selectedFormats,
          details: profileData,
        }),
      });

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.warn("Brand profile sync notice:", err);
      setSavedSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Profile Header */}
        <div className="glass-panel-glow rounded-3xl p-6 sm:p-8 border border-cyan-500/20 relative overflow-hidden mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="relative group">
                <img
                  src={logoUrl}
                  alt={companyName}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-cyan-500/40 shadow-xl shadow-cyan-500/20 group-hover:scale-105 transition-transform"
                />
                <span className="absolute -bottom-1 -right-1 p-1 rounded-full bg-cyan-400 text-slate-950 shadow-md">
                  <ShieldCheck className="w-4 h-4 text-slate-950" />
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{companyName}</h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[11px] font-mono font-bold uppercase">
                    Brand OS Profile
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 font-medium">{tagline}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                  <span className="flex items-center gap-1 font-mono text-cyan-400">
                    <Building className="w-3.5 h-3.5" /> {industry}
                  </span>
                  <span>•</span>
                  <span>{companySize}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Link
                href="/dashboard/brand"
                className="px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
              >
                <Briefcase className="w-4 h-4 text-cyan-400" />
                Go to Brand OS
              </Link>
              <button
                onClick={handleSaveProfile}
                disabled={loading}
                className="flex-1 sm:flex-initial px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition-all hover:scale-105 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : savedSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-slate-950" /> Saved Live!
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Save Brand Profile
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Section 1: Company & Brand Identity */}
        <section className="glass-panel rounded-2xl p-6 sm:p-8 border border-white/10 mb-8 space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-white/10">
            <Building className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white">Company Identity & Information</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Brand / Company Name</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full rounded-xl bg-slate-900 border border-white/10 px-3.5 py-2.5 text-xs text-slate-100 focus:border-cyan-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Company Tagline / One-Liner</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full rounded-xl bg-slate-900 border border-white/10 px-3.5 py-2.5 text-xs text-slate-100 focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Industry Vertical</label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full rounded-xl bg-slate-900 border border-white/10 px-3 py-2.5 text-xs text-slate-100 focus:border-cyan-400 focus:outline-none"
              >
                {INDUSTRIES.map((ind) => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Company Size</label>
              <input
                type="text"
                value={companySize}
                onChange={(e) => setCompanySize(e.target.value)}
                placeholder="e.g. 11-50 employees"
                className="w-full rounded-xl bg-slate-900 border border-white/10 px-3.5 py-2.5 text-xs text-slate-100 focus:border-cyan-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Official Website</label>
              <input
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full rounded-xl bg-slate-900 border border-white/10 px-3.5 py-2.5 text-xs text-slate-100 focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Company Logo URL</label>
            <input
              type="url"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              className="w-full rounded-xl bg-slate-900 border border-white/10 px-3.5 py-2.5 text-xs text-slate-100 focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">About the Brand & Mission</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl bg-slate-900 border border-white/10 px-3.5 py-2.5 text-xs text-slate-100 focus:border-cyan-400 focus:outline-none leading-relaxed"
            />
          </div>
        </section>

        {/* Section 2: Content Strategy & Preferred Formats */}
        <section className="glass-panel rounded-2xl p-6 sm:p-8 border border-white/10 mb-8 space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-white/10">
            <Layers className="w-5 h-5 text-indigo-400" />
            <div>
              <h2 className="text-lg font-bold text-white">Content Production Strategy & Budgets</h2>
              <p className="text-xs text-slate-400">Helps creators align their proposals to your exact expectations</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Monthly Creator Budget (₹)</label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-emerald-400 absolute left-3.5 top-3" />
                <input
                  type="number"
                  value={monthlyBudget}
                  onChange={(e) => setMonthlyBudget(e.target.value)}
                  className="w-full rounded-xl bg-slate-900 border border-white/10 pl-9 pr-3.5 py-2.5 text-xs text-slate-100 focus:border-cyan-400 focus:outline-none font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Target Turnaround Expectation (Days)</label>
              <div className="relative">
                <Clock className="w-4 h-4 text-cyan-400 absolute left-3.5 top-3" />
                <input
                  type="number"
                  value={targetTurnaround}
                  onChange={(e) => setTargetTurnaround(e.target.value)}
                  className="w-full rounded-xl bg-slate-900 border border-white/10 pl-9 pr-3.5 py-2.5 text-xs text-slate-100 focus:border-cyan-400 focus:outline-none font-mono"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Preferred Deliverable Formats</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {PREFERRED_FORMATS.map((format) => {
                const active = selectedFormats.includes(format);
                return (
                  <button
                    key={format}
                    type="button"
                    onClick={() => toggleFormat(format)}
                    className={`p-3 rounded-xl text-xs font-semibold text-left transition-all border ${
                      active
                        ? "bg-cyan-500/15 border-cyan-500/50 text-cyan-200 shadow-md shadow-cyan-500/10"
                        : "bg-white/5 border-white/5 text-slate-400 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{format}</span>
                      {active && <span className="text-cyan-400 font-bold">✓</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Brand Tone & Creative Guidelines</label>
            <textarea
              rows={3}
              value={brandVoice}
              onChange={(e) => setBrandVoice(e.target.value)}
              placeholder="e.g. Bold, energetic pacing, viral hooks, clean lighting, no distorted AI artifacts..."
              className="w-full rounded-xl bg-slate-900 border border-white/10 px-3.5 py-2.5 text-xs text-slate-100 focus:border-cyan-400 focus:outline-none leading-relaxed"
            />
          </div>
        </section>

        {/* Section 3: Point of Contact & Billing Details */}
        <section className="glass-panel rounded-2xl p-6 sm:p-8 border border-white/10 mb-8 space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-white/10">
            <CreditCard className="w-5 h-5 text-emerald-400" />
            <div>
              <h2 className="text-lg font-bold text-white">Billing & Invoicing Information</h2>
              <p className="text-xs text-slate-400">Used for generating official Razorpay escrow invoices and receipts</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Point of Contact / Creative Lead</label>
              <input
                type="text"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="w-full rounded-xl bg-slate-900 border border-white/10 px-3.5 py-2.5 text-xs text-slate-100 focus:border-cyan-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Invoicing Business Email</label>
              <input
                type="email"
                value={billingEmail}
                onChange={(e) => setBillingEmail(e.target.value)}
                className="w-full rounded-xl bg-slate-900 border border-white/10 px-3.5 py-2.5 text-xs text-slate-100 focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">GSTIN / Business Tax Identification</label>
              <input
                type="text"
                value={taxId}
                onChange={(e) => setTaxId(e.target.value)}
                className="w-full rounded-xl bg-slate-900 border border-white/10 px-3.5 py-2.5 text-xs text-slate-100 focus:border-cyan-400 focus:outline-none font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Billing Headquarters Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded-xl bg-slate-900 border border-white/10 px-3.5 py-2.5 text-xs text-slate-100 focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>
        </section>

        {/* Bottom Save Action */}
        <div className="flex items-center justify-between p-6 rounded-2xl glass-panel-glow border border-cyan-500/20">
          <div>
            <h4 className="font-bold text-sm text-white">Save Changes to Brand Profile</h4>
            <p className="text-xs text-slate-400">Your profile information is shared with creators pitching on your briefs</p>
          </div>
          <button
            onClick={handleSaveProfile}
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/25 transition-all hover:scale-105 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Brand Profile
          </button>
        </div>
      </main>
    </div>
  );
}
