"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Sparkles, Briefcase, Zap, Lock, Mail, Loader2, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<"brand" | "creator">("brand");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const supabase = createClient();
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        throw authError;
      }

      // Check user role from metadata or profile
      const userRole = data.user?.user_metadata?.role || role;
      if (userRole === "creator") {
        router.push("/dashboard/creator");
      } else {
        router.push("/dashboard/brand");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Authentication failed";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (demoRole: "brand" | "creator") => {
    // Quick instant demo login for reviewers and judging
    const demoUser = {
      id: demoRole === "brand" ? "brand-demo-uuid" : "creator-demo-uuid",
      email: demoRole === "brand" ? "lead@nexusbrand.ai" : "vamshi@creatoros.ai",
      full_name: demoRole === "brand" ? "Nexus AI Studios (Brand)" : "Vamshi VFX (AI Creator)",
      role: demoRole,
    };
    localStorage.setItem("creatoros_demo_user", JSON.stringify(demoUser));
    if (demoRole === "brand") {
      router.push("/dashboard/brand");
    } else {
      router.push("/dashboard/creator");
    }
  };

  return (
    <div className="min-h-screen grid-bg flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-[#07090e]">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2 group mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-white">
            Creator<span className="text-cyan-400">OS</span> AI
          </span>
        </Link>
        <h2 className="text-2xl font-bold tracking-tight text-white">
          Access Your AI Command Center
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          The explainable AI content marketplace for verified brands and elite creators.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="glass-panel-glow rounded-2xl p-6 sm:p-8">
          {/* Role Selection Tabs */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-white/5 rounded-xl mb-6 border border-white/5">
            <button
              type="button"
              onClick={() => setRole("brand")}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${
                role === "brand"
                  ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              I am a Brand
            </button>
            <button
              type="button"
              onClick={() => setRole("creator")}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${
                role === "creator"
                  ? "bg-fuchsia-500 text-slate-950 shadow-md shadow-fuchsia-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              I am a Creator
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Work Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={role === "brand" ? "brand@company.com" : "creator@studio.ai"}
                  className="w-full rounded-xl bg-slate-900/80 border border-white/10 pl-10 pr-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-xl bg-slate-900/80 border border-white/10 pl-10 pr-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all ${
                role === "brand"
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-cyan-500/25"
                  : "bg-gradient-to-r from-fuchsia-500 to-purple-600 hover:from-fuchsia-400 hover:to-purple-500 text-slate-950 shadow-fuchsia-500/25"
              }`}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Sign In as {role === "brand" ? "Brand" : "Creator"} <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          {/* Quick Sandbox Bypass for Instant Testing */}
          <div className="mt-6 pt-5 border-t border-white/10 text-center">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-mono block mb-2">
              ⚡️ Instant Test Demo Access
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo("brand")}
                className="px-3 py-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-semibold transition-colors"
              >
                Launch Brand Demo
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo("creator")}
                className="px-3 py-2 rounded-lg bg-fuchsia-500/10 hover:bg-fuchsia-500/20 border border-fuchsia-500/30 text-fuchsia-300 text-xs font-semibold transition-colors"
              >
                Launch Creator Demo
              </button>
            </div>
          </div>

          <div className="mt-5 text-center text-xs text-slate-400">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-cyan-400 hover:underline font-semibold">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
