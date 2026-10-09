"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";

export default function ProfileRedirect() {
  const router = useRouter();

  useEffect(() => {
    async function determineRole() {
      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        const role = session?.user?.user_metadata?.role;

        if (role === "brand") {
          router.replace("/profile/brand");
          return;
        } else if (role === "creator") {
          router.replace("/profile/creator");
          return;
        }

        // Check local demo profile
        const demoUser = localStorage.getItem("creatoros_demo_user");
        if (demoUser) {
          const parsed = JSON.parse(demoUser);
          if (parsed.role === "brand") {
            router.replace("/profile/brand");
            return;
          }
        }

        // Default to creator profile
        router.replace("/profile/creator");
      } catch (err) {
        console.warn("Role detection error:", err);
        router.replace("/profile/creator");
      }
    }

    determineRole();
  }, [router]);

  return (
    <div className="min-h-screen bg-[#07090e] flex flex-col items-center justify-center text-slate-400 gap-3">
      <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
      <span className="text-xs font-mono uppercase tracking-wider">Loading your profile...</span>
    </div>
  );
}
