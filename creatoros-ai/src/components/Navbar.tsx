"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Sparkles, Briefcase, Zap, LogOut, User, ArrowRight } from "lucide-react";

export default function Navbar() {
  const [user, setUser] = useState<{ id: string; email?: string; role?: string; full_name?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    async function checkAuth() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email,
            role: session.user.user_metadata?.role || "brand",
            full_name: session.user.user_metadata?.full_name || session.user.email?.split("@")[0],
          });
        } else {
          // Check local demo mock state if any
          const demoUser = localStorage.getItem("creatoros_demo_user");
          if (demoUser) {
            setUser(JSON.parse(demoUser));
          }
        }
      } catch (e) {
        console.warn("Auth check error:", e);
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    localStorage.removeItem("creatoros_demo_user");
    setUser(null);
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#07090e]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight text-white group-hover:text-cyan-400 transition-colors">
            Creator<span className="text-cyan-400">OS</span> <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">AI</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <Link href="/" className="hover:text-cyan-400 transition-colors">
            Marketplace
          </Link>
          <Link href="/dashboard/brand" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
            <Briefcase className="w-4 h-4 text-cyan-400" />
            Brand OS
          </Link>
          <Link href="/dashboard/creator" className="hover:text-fuchsia-400 transition-colors flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-fuchsia-400" />
            Creator Studio
          </Link>
          <Link href="/profile" className="hover:text-cyan-400 transition-colors">
            My Profile
          </Link>
        </nav>

        {/* Auth / Account Controls */}
        <div className="flex items-center gap-3">
          {loading ? (
            <div className="w-20 h-8 rounded-lg bg-white/5 animate-pulse" />
          ) : user ? (
            <div className="flex items-center gap-2.5">
              <Link
                href={user.role === "creator" ? "/profile/creator" : "/profile/brand"}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-xs font-semibold text-cyan-300 transition-colors"
                title="Manage your profile"
              >
                <User className="w-3.5 h-3.5" />
                <span>{user.role === "creator" ? "Creator Profile" : "Brand Profile"}</span>
              </Link>
              <Link
                href={user.role === "creator" ? "/dashboard/creator" : "/dashboard/brand"}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-slate-200 transition-colors"
              >
                <span className="max-w-[100px] truncate">{user.full_name || user.email}</span>
                <span className="px-1.5 py-0.2 bg-cyan-500/20 text-cyan-300 rounded text-[10px] uppercase font-mono">
                  {user.role}
                </span>
              </Link>
              <button
                onClick={handleSignOut}
                title="Sign out"
                className="p-2 rounded-lg bg-white/5 hover:bg-rose-500/20 hover:text-rose-400 text-slate-400 border border-white/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/25 transition-all hover:scale-[1.02]"
              >
                Get Started
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
