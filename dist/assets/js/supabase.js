/* ============================================================
   CreatorOS AI — Supabase Integration & Authentication Layer
   Direct connection to Supabase Auth, PostgreSQL, & Storage
   ============================================================ */

const SupabaseBridge = (() => {
  const SUPABASE_URL = "https://rkmyzxkabtambnghtmux.supabase.co";
  const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJrbXl6eGthYnRhbWJuZ2h0bXV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE1NTAzNjcsImV4cCI6MjEwNzEyNjM2N30.JC5IO8w7-rlYtYwEjzATJ3iXZ2RSNhlVew94mrpFv8Y";

  let client = null;
  let currentUser = null;
  let currentProfile = null;
  const authListeners = [];

  const DEFAULT_SUPABASE_URL = "https://rkmyzxkabtambnghtmux.supabase.co";
  const DEFAULT_SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJrbXl6eGthYnRhbWJuZ2h0bXV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE1NTAzNjcsImV4cCI6MjEwNzEyNjM2N30.JC5IO8w7-rlYtYwEjzATJ3iXZ2RSNhlVew94mrpFv8Y";

  function getClient() {
    if (client) return client;
    if (typeof window !== "undefined" && window.supabase && typeof window.supabase.createClient === "function") {
      const targetUrl = (typeof SUPABASE_URL === "string" && SUPABASE_URL.startsWith("http")) ? SUPABASE_URL : DEFAULT_SUPABASE_URL;
      const targetKey = (typeof SUPABASE_PUBLISHABLE_KEY === "string" && !SUPABASE_PUBLISHABLE_KEY.startsWith("__")) ? SUPABASE_PUBLISHABLE_KEY : DEFAULT_SUPABASE_KEY;

      try {
        client = window.supabase.createClient(targetUrl, targetKey, {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true
          }
        });
      } catch (err) {
        console.error("Supabase client creation error:", err);
      }
    }
    return client;
  }

  /* ---------- Auth API ---------- */
  async function initAuth() {
    const sb = getClient();
    if (!sb) return null;
    try {
      const { data } = await sb.auth.getSession();
      if (data?.session?.user) {
        currentUser = data.session.user;
        await loadProfile(currentUser.id);
      }
      sb.auth.onAuthStateChange(async (event, session) => {
        currentUser = session?.user || null;
        if (currentUser) {
          await loadProfile(currentUser.id);
        } else {
          currentProfile = null;
        }
        notifyAuth(event, currentUser, currentProfile);
      });
    } catch (e) {
      console.warn("Supabase auth session lookup error:", e);
    }
    return currentUser;
  }

  async function loadProfile(userId) {
    const sb = getClient();
    if (!sb || !userId) return null;
    try {
      const { data, error } = await sb.from("profiles").select("*").eq("id", userId).maybeSingle();
      if (!error && data) {
        currentProfile = data;
      } else {
        // Fallback profile using user metadata
        currentProfile = {
          id: userId,
          name: currentUser?.user_metadata?.name || currentUser?.email?.split("@")[0] || "User",
          role: currentUser?.user_metadata?.role || "brand",
          verified: false
        };
      }
    } catch {
      currentProfile = {
        id: userId,
        name: currentUser?.email?.split("@")[0] || "User",
        role: "brand"
      };
    }
    return currentProfile;
  }

  async function signUp({ email, password, name, role = "brand" }) {
    const sb = getClient();
    if (!sb) throw new Error("Supabase client not initialized");
    // Roles cannot be self-escalated to admin
    const safeRole = role === "creator" ? "creator" : "brand";
    const { data, error } = await sb.auth.signUp({
      email,
      password,
      options: {
        data: { name, role: safeRole }
      }
    });
    if (error) throw error;
    currentUser = data.user;
    if (currentUser) {
      await loadProfile(currentUser.id);
      notifyAuth("SIGNED_IN", currentUser, currentProfile);
    }
    return data;
  }

  async function signIn({ email, password }) {
    const sb = getClient();
    if (!sb) throw new Error("Supabase client not initialized");
    const { data, error } = await sb.auth.signInWithPassword({ email, password });
    if (error) throw error;
    currentUser = data.user;
    await loadProfile(currentUser.id);
    notifyAuth("SIGNED_IN", currentUser, currentProfile);
    return data;
  }

  async function signOut() {
    const sb = getClient();
    if (!sb) return;
    await sb.auth.signOut();
    currentUser = null;
    currentProfile = null;
    notifyAuth("SIGNED_OUT", null, null);
  }

  async function resetPassword(email) {
    const sb = getClient();
    if (!sb) throw new Error("Supabase client not initialized");
    const { data, error } = await sb.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/index.html#reset-password"
    });
    if (error) throw error;
    return data;
  }

  function onAuthChange(fn) {
    authListeners.push(fn);
    return () => {
      const idx = authListeners.indexOf(fn);
      if (idx >= 0) authListeners.splice(idx, 1);
    };
  }

  function notifyAuth(event, user, profile) {
    for (const fn of authListeners.slice()) {
      try { fn(event, user, profile); } catch (e) { console.error(e); }
    }
  }

  /* ---------- Cloud Database Operations ---------- */
  async function syncBrief(brief) {
    const sb = getClient();
    if (!sb) return null;
    try {
      const row = {
        id: brief.id,
        title: brief.title,
        brand: brief.brand || "Your Brand",
        category: brief.category,
        language: brief.language || "english",
        quantity: brief.quantity || 1,
        deadline_days: brief.deadlineDays || 14,
        budget_min: brief.budgetMin || 0,
        budget_max: brief.budgetMax || 0,
        description: brief.description || "",
        deliverables: brief.deliverables || [],
        commercial_use: brief.commercialUse !== false,
        signals: {
          tools: brief.tools || [],
          niches: brief.niches || [],
          complexity: brief.complexity || "medium",
          summary: brief.summary || ""
        },
        ai_confidence: brief.aiConfidence || 90,
        status: brief.status || "open"
      };
      const { data, error } = await sb.from("briefs").upsert(row, { onConflict: "id" }).select().maybeSingle();
      if (error) {
        console.warn("Cloud sync brief notice:", error.message || error);
        return null;
      }
      return data;
    } catch (e) {
      console.warn("Could not sync brief to Supabase:", e.message);
      return null;
    }
  }

  async function fetchCloudBriefs() {
    const sb = getClient();
    if (!sb) return [];
    try {
      const { data, error } = await sb.from("briefs").select("*").neq("status", "deleted").order("created_at", { ascending: false }).limit(50);
      if (error || !data) return [];
      return data.map((r) => ({
        id: r.id,
        title: r.title,
        brand: r.brand,
        category: r.category,
        language: r.language,
        quantity: r.quantity,
        deadlineDays: r.deadline_days,
        budgetMin: r.budget_min,
        budgetMax: r.budget_max,
        description: r.description,
        deliverables: Array.isArray(r.deliverables) ? r.deliverables : [],
        commercialUse: r.commercial_use,
        tools: r.signals?.tools || [],
        niches: r.signals?.niches || [],
        status: r.status,
        postedAt: r.created_at ? new Date(r.created_at).toLocaleDateString() : "Recently",
        cloud: true
      }));
    } catch {
      return [];
    }
  }

  async function syncOrder(order) {
    const sb = getClient();
    if (!sb) return null;
    try {
      const row = {
        id: order.id,
        gig_id: order.gigId || null,
        creator_id: order.creatorId ? (order.creatorId.length === 36 ? order.creatorId : null) : null,
        package_key: order.packageKey || "standard",
        package_name: order.packageName || "Standard",
        brand: order.brand || "Your Brand",
        brief_text: order.brief || "",
        subtotal: order.subtotal || 0,
        fee: order.fee || 0,
        total: order.total || 0,
        due_days: order.deliveryDays || 7,
        addons: order.addons || [],
        status: order.status || "placed"
      };
      const { data, error } = await sb.from("orders").upsert(row, { onConflict: "id" }).select().maybeSingle();
      if (error) return null;
      return data;
    } catch {
      return null;
    }
  }

  /* ---------- Storage API ---------- */
  async function uploadMedia(file, bucket = "creator-media") {
    const sb = getClient();
    if (!sb) throw new Error("Supabase client not initialized");
    const ext = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const filePath = `uploads/${fileName}`;

    const { data, error } = await sb.storage.from(bucket).upload(filePath, file, {
      cacheControl: "3600",
      upsert: false
    });
    if (error) throw error;
    const { data: pubData } = sb.storage.from(bucket).getPublicUrl(filePath);
    return { path: filePath, url: pubData.publicUrl };
  }

  async function submitVerificationClaim({ creatorId, claimType, evidenceText, evidenceFile }) {
    const sb = getClient();
    if (!sb) throw new Error("Supabase client not initialized");
    let evidenceUrl = null;
    if (evidenceFile) {
      const up = await uploadMedia(evidenceFile, "verification-docs");
      evidenceUrl = up.url;
    }
    const { data, error } = await sb.from("verification_claims").insert({
      creator_id: creatorId,
      claim_type: claimType,
      evidence_text: evidenceText,
      evidence_url: evidenceUrl,
      status: "pending"
    }).select().single();
    if (error) throw error;
    return data;
  }

  return {
    getClient,
    initAuth,
    getUser: () => currentUser,
    getProfile: () => currentProfile,
    signUp,
    signIn,
    signOut,
    resetPassword,
    onAuthChange,
    syncBrief,
    fetchCloudBriefs,
    syncOrder,
    uploadMedia,
    submitVerificationClaim
  };
})();

// Auto-boot Supabase and synchronize with Store
document.addEventListener("DOMContentLoaded", () => {
  SupabaseBridge.getClient();
  SupabaseBridge.initAuth();

  // Wire Store writes to Cloud Sync
  if (typeof Store !== "undefined" && typeof Store.subscribe === "function") {
    Store.subscribe((kind, op, record) => {
      if (kind === "briefs" && (op === "create" || op === "update")) {
        SupabaseBridge.syncBrief(record);
      } else if (kind === "orders" && (op === "create" || op === "status")) {
        SupabaseBridge.syncOrder(record);
      }
    });

    // Merge cloud briefs into local store
    SupabaseBridge.fetchCloudBriefs().then((cloudBriefs) => {
      if (cloudBriefs && cloudBriefs.length) {
        const local = Store.read().briefs;
        const ids = new Set(local.map((b) => b.id));
        const newOnes = cloudBriefs.filter((b) => !ids.has(b.id));
        if (newOnes.length) {
          Store.read().briefs = [...newOnes, ...local];
        }
      }
    });
  }
});
