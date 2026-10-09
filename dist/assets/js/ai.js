/* ============================================================
   CreatorMatch AI — inference layer
   Everything here runs client-side and is deterministic: the same
   input always produces the same output. Scores are explainable —
   every match returns the factors behind it, not a black-box number.
   ============================================================ */

const AI = (() => {
  /* ---------- Text utilities ---------- */
  const STOP = new Set(("a an the and or but if then than that this these those for from with without into onto over under to of in on at by be is are was were been being do does did doing have has had having i you he she it we they them his her its our your their me my mine will would can could should shall may might must not no nor so such very too also just only even still yet about above below up down out off again more most other some any each few many much own same as").split(" "));

  /** Grammatical filler that carries no matching signal in a brief. */
  const NOISE = new Set(("need needs needed want wants wanted looking please would like our your their there here where when which who whom whose what why how all any both either neither each every none one two three four five six seven eight nine ten first second third also plus around about across against within without before after during while because however therefore currently previous previously actually really basically simply maybe perhaps probably definitely exactly approximately roughly nearly almost quite rather somewhat fairly someone anybody something anything everything everyone find found help make made making get got getting use uses used using new next time times work works working well good best top high low big small large long short full complete entire total able going want will shall might must can could should very much many more most less least").split(" "));

  function norm(s) {
    return String(s || "").toLowerCase().replace(/[^\w\s\u00C0-\u024F.:+-]/g, " ").replace(/\s+/g, " ").trim();
  }

  function tokens(s) {
    return norm(s).split(" ").filter((t) => t.length > 2 && !STOP.has(t) && !NOISE.has(t) && !/^\d+$/.test(t));
  }

  function escapeRe(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  /** Does `term` occur in `hay` as a whole word/phrase? */
  function hasTerm(hay, term) {
    return new RegExp(`\\b${escapeRe(term)}\\b`).test(hay);
  }

  function pick(hay, words) {
    return words.filter((w) => hay.includes(w));
  }

  /** Drop the trailing plural so "reel" and "reels" count as one signal. */
  const lemma = (t) => t.replace(/-/g, " ").replace(/(?:s|es)$/, "");

  const clamp = (v, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, v));
  const round = (v, d = 0) => {
    const m = Math.pow(10, d);
    return Math.round(v * m) / m;
  };
  const median = (arr) => {
    if (!arr.length) return 0;
    const s = arr.slice().sort((a, b) => a - b);
    const mid = Math.floor(s.length / 2);
    return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
  };

  /* ============================================================
     Category lexicon — [term, weight]. Weights encode how strongly
     a term implies the category, so "reel" beats "video" beats
     "content". Terms are deduped by lemma so plurals do not double
     count.
     ============================================================ */
  const LEXICON = {
    video: [["reel", 6], ["reels", 6], ["shorts", 5], ["short-form", 5], ["tiktok", 5], ["9:16", 5], ["vertical video", 6], ["video", 4], ["videos", 4], ["clip", 3], ["clips", 3], ["footage", 3], ["montage", 3], ["b-roll", 3], ["hook", 2], ["hooks", 2], ["podcast clip", 5], ["caption", 2], ["captions", 2]],
    aiart: [["illustration", 5], ["illustrations", 5], ["artwork", 5], ["ai art", 7], ["render", 4], ["renders", 4], ["concept art", 7], ["key art", 7], ["poster", 3], ["midjourney", 5], ["image", 3], ["images", 3], ["visual", 3], ["visuals", 3], ["graphic", 3], ["graphics", 3], ["lookbook", 6], ["virtual staging", 7], ["moodboard", 4], ["drawing", 4], ["staging", 4]],
    copy: [["blog", 5], ["blogs", 5], ["article", 5], ["articles", 5], ["copywriting", 7], ["copy", 4], ["seo", 5], ["script", 5], ["scripts", 5], ["email", 3], ["emails", 3], ["newsletter", 5], ["landing page", 7], ["rewrite", 4], ["writing", 4], ["writer", 4], ["content writing", 7], ["policy document", 5], ["blog post", 6], ["longform", 3], ["words", 2], ["policy", 4], ["policies", 4], ["governance", 5], ["framework", 4], ["playbook", 4], ["style guide", 5], ["documentation", 3], ["training", 3]],
    voice: [["voiceover", 7], ["voice over", 7], ["narration", 6], ["dubbing", 6], ["voice", 3], ["audio", 3], ["tts", 5], ["speech", 3], ["spoken", 3], ["accent", 3], ["multilingual voice", 6]],
    social: [["social media", 7], ["social", 4], ["instagram", 3], ["calendar", 4], ["community management", 7], ["engagement", 3], ["followers", 4], ["content plan", 5], ["retainer", 5], ["always-on", 5], ["posting schedule", 5], ["content engine", 6]],
    ads: [["ad", 4], ["ads", 5], ["advert", 5], ["campaign", 4], ["campaigns", 4], ["performance creative", 7], ["roas", 7], ["meta ads", 7], ["google ads", 6], ["banner", 3], ["banners", 3], ["cpc", 5], ["cpa", 5], ["media buying", 7], ["paid social", 7], ["creative batch", 7], ["conversion", 3], ["funnel", 4], ["ad creative", 6], ["ad creatives", 6]],
    youtube: [["youtube", 8], ["retention", 5], ["vlog", 5], ["episode", 4], ["episodes", 4], ["channel", 3], ["subscriber", 5], ["subscribers", 5], ["average view duration", 8], ["avd", 6], ["long-form", 4]],
    brand: [["brand identity", 8], ["branding", 5], ["logo", 6], ["logotype", 8], ["identity", 4], ["rebrand", 6], ["brand book", 8], ["typography", 5], ["palette", 4], ["visual identity", 8], ["signage", 5], ["guideline", 3], ["guidelines", 3]],
    avatar: [["avatar", 6], ["avatars", 6], ["spokesperson", 7], ["presenter", 5], ["talking head", 8], ["heygen", 7], ["d-id", 7], ["lip sync", 7], ["lip-sync", 7], ["virtual human", 8], ["synthetic presenter", 8], ["clone", 4], ["digital twin", 7], ["instructor", 3], ["ugc", 4]],
    music: [["music", 5], ["song", 5], ["songs", 5], ["jingle", 7], ["soundtrack", 7], ["background music", 8], ["sonic", 4], ["beat", 4], ["beats", 4], ["sfx", 7], ["sound design", 8], ["sound effect", 7], ["sound effects", 7], ["audio logo", 8], ["stems", 5], ["score", 3]]
  };

  const DELIVERABLE_WORDS = {
    reel: ["reel", "reels"],
    video: ["video", "videos"],
    post: ["post", "posts"],
    article: ["article", "articles", "blog", "blogs"],
    visual: ["visual", "visuals", "image", "images", "asset", "assets", "illustration", "illustrations"],
    creative: ["creative", "creatives", "banner", "banners"],
    voiceover: ["voiceover", "voice over", "narration"],
    logo: ["logo", "logos", "logotype"],
    script: ["script", "scripts"],
    email: ["email", "emails"],
    lesson: ["lesson", "lessons", "module", "modules", "lecture", "lectures"],
    look: ["lookbook", "look book", "outfit", "outfits", "flat lay", "flat lays"],
    track: ["track", "tracks", "song", "songs", "jingle"],
    clip: ["clip", "clips"],
    page: ["landing page", "web page"],
    framework: ["framework", "playbook"],
    policy: ["policy", "policies"]
  };

  /* Human label for a single uncounted deliverable of each category unit. */
  const UNIT_LABEL = {
    piece: "Written deliverable", reel: "Reel edit", video: "Video edit",
    visual: "Visual asset", creative: "Ad creative", track: "Music track",
    logo: "Logo concept", script: "Script", lesson: "Lesson module",
    voiceover: "Voiceover session", post: "Social post", article: "Article",
    email: "Email sequence", look: "Lookbook", clip: "Clip edit", page: "Page copy"
  };

  const PLATFORMS = ["instagram", "youtube", "linkedin", "twitter", "facebook", "tiktok", "meta", "pinterest", "whatsapp", "spotify"];

  const TONE_WORDS = {
    premium: ["luxury", "luxurious", "premium", "high-end", "elegant", "sophisticated", "minimal", "refined", "upscale"],
    playful: ["fun", "playful", "quirky", "witty", "casual", "energetic", "bold", "loud", "meme", "memes"],
    professional: ["professional", "corporate", "b2b", "formal", "enterprise", "trusted", "authoritative"],
    urgent: ["urgent", "asap", "immediately", "rush", "tight deadline", "fast turnaround"],
    educational: ["explain", "explainer", "educational", "teach", "teaching", "learning", "course", "tutorial", "how-to", "training", "curriculum", "syllabus"],
    emotional: ["emotional", "story", "stories", "storytelling", "heartfelt", "inspiring", "community"]
  };

  const TOOL_HINTS = {
    midjourney: "Midjourney", runway: "Runway", kling: "Kling", sora: "Sora",
    elevenlabs: "ElevenLabs", heygen: "HeyGen", capcut: "CapCut", premiere: "Premiere Pro",
    "after effects": "After Effects", figma: "Figma", canva: "Canva", descript: "Descript",
    suno: "Suno", udio: "Udio", flux: "Flux", "stable diffusion": "Stable Diffusion",
    ideogram: "Ideogram", chatgpt: "ChatGPT", claude: "Claude", gemini: "Gemini",
    whisper: "Whisper", "notion ai": "Notion AI", jasper: "Jasper",
    "meta ads": "Meta Ads Manager", buffer: "Buffer", "google analytics": "Google Analytics",
    davinci: "DaVinci Resolve"
  };

  const CATEGORY_TOOLS = {
    video: ["Runway", "CapCut", "Premiere Pro", "ElevenLabs"],
    aiart: ["Midjourney", "Flux", "Stable Diffusion", "Figma"],
    copy: ["ChatGPT", "Claude", "Notion AI"],
    voice: ["ElevenLabs", "Descript", "Whisper"],
    social: ["Buffer", "Canva", "ChatGPT", "Google Analytics"],
    ads: ["Midjourney", "Figma", "Meta Ads Manager", "Canva"],
    youtube: ["Premiere Pro", "After Effects", "Descript"],
    brand: ["Figma", "Ideogram", "Midjourney"],
    avatar: ["HeyGen", "D-ID", "ElevenLabs"],
    music: ["Suno", "Udio", "Descript"]
  };

  const COMPLEXITY_WORDS = ["compliance", "regulated", "governance", "audit", "legal", "enterprise", "multilingual", "localisation", "localization", "multi-language", "3d", "animation", "animated", "integration", "framework", "certification", "rights", "consent", "accuracy", "non-negotiable", "brand book", "pipeline", "stakeholder", "bilingual", "multi-office", "rollout", "migration", "api", "scorm", "lms", "attribution", "funnel", "rebrand", "identity"];

  const PROJECT_WORDS = ["programme", "program", "system", "framework", "campaign", "rebrand", "identity", "course", "library", "pipeline", "strategy", "audit", "policy", "governance", "launch", "suite", "build", "overhaul", "relaunch", "full-funnel", "end to end", "complete"];

  const WORD_NUM = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, twelve: 12, fifteen: 15, twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, hundred: 100 };

  /* ============================================================
     1. Category classification
     ============================================================ */
  function classifyCategory(hay, rawLower) {
    /* Words that appear immediately after a number are strong format signals. */
    const nearNumber = new Set();
    for (const m of rawLower.matchAll(/(\d+|one|two|three|four|five|six|seven|eight|nine|ten|twelve|twenty|thirty|forty|fifty|sixty|hundred)\s+((?:\w+[- ]?){1,3})/g)) {
      for (const w of m[2].split(/[\s-]+/).filter(Boolean)) nearNumber.add(lemma(w));
    }

    const scored = Object.entries(LEXICON).map(([id, terms]) => {
      const byLemma = new Map();
      for (const [term, weight] of terms) {
        if (!hasTerm(hay, term)) continue;
        const key = lemma(term);
        byLemma.set(key, Math.max(byLemma.get(key) || 0, weight));
      }
      let score = 0;
      let proximity = 0;
      for (const [key, weight] of byLemma) {
        score += weight;
        if (nearNumber.has(key)) proximity += 5;
      }
      proximity = Math.min(proximity, 10);
      return { id, score: score + proximity, terms: [...byLemma.keys()], proximity };
    }).sort((a, b) => b.score - a.score);

    const total = scored.reduce((s, c) => s + c.score, 0);
    const top = scored[0];
    const runnerUp = scored[1] && scored[1].score > 0 ? scored[1].id : null;

    if (!top || top.score === 0) {
      /* No recognisable signal: fall back to the most general written-work
         category at low confidence so the user knows to correct the select. */
      return { category: "copy", confidence: 15, secondary: null, matched: [] };
    }

    /* Separation between first and second place drives confidence. */
    const gap = top.score - (scored[1]?.score || 0);
    const confidence = clamp(round(38 + top.score * 2.6 + gap * 2.2), 22, 97);

    return { category: top.id, confidence, secondary: runnerUp, matched: top.terms };
  }

  /* ============================================================
     2. Brief generator
     ============================================================ */
  function generateBrief(rawText) {
    const raw = String(rawText || "");
    const hay = norm(raw);
    const rawLower = raw.toLowerCase();

    const cls = classifyCategory(hay, rawLower);
    const category = cls.category;
    const cat = DB.byId.category[category];

    /* -- Quantity: a number followed within three words by a deliverable noun -- */
    let quantity = 0;
    let quantityUnit = null;
    for (const m of rawLower.matchAll(/\b(\d+|one|two|three|four|five|six|seven|eight|nine|ten|twelve|fifteen|twenty|thirty|forty|fifty|sixty|hundred)\b\s+((?:[\w-]+\s+){0,3}[\w-]+)/g)) {
      const n = WORD_NUM[m[1]] || parseInt(m[1], 10);
      if (!n || n > 5000) continue;
      const following = m[2].toLowerCase();
      for (const [unit, words] of Object.entries(DELIVERABLE_WORDS)) {
        if (words.some((w) => hasTerm(following, w))) {
          if (n > quantity || (n === quantity && !quantityUnit)) {
            quantity = n;
            quantityUnit = unit;
          }
          break;
        }
      }
    }
    if (!quantityUnit) {
      for (const [unit, words] of Object.entries(DELIVERABLE_WORDS)) {
        if (words.some((w) => hasTerm(hay, w))) { quantityUnit = unit; break; }
      }
    }
    if (!quantity) quantity = 1;
    if (!quantityUnit) quantityUnit = cat.unit;

    const cadence = /weekly|every week|per week/.test(hay) ? "weekly"
      : /monthly|every month|per month|always-on|always on/.test(hay) ? "monthly"
      : /daily|every day/.test(hay) ? "daily" : "one-off";

    /* -- Deadline -- */
    let deadlineDays = 14;
    let deadlineSource = "marketplace default";
    const dayMatch = hay.match(/\b(\d+)\s*(?:-\s*)?(?:day|days|d)\b/);
    const weekMatch = hay.match(/\b(\d+)?\s*(?:week|weeks)\b/);
    const monthMatch = hay.match(/\b(\d+)?\s*(?:month|months)\b/);
    if (/\basap\b|immediately|right away|urgent|\brush\b|tight deadline/.test(hay)) {
      deadlineDays = 3; deadlineSource = "detected urgency";
    } else if (dayMatch) {
      deadlineDays = parseInt(dayMatch[1], 10); deadlineSource = "explicit days";
    } else if (weekMatch) {
      deadlineDays = (parseInt(weekMatch[1], 10) || 1) * 7; deadlineSource = "explicit weeks";
    } else if (monthMatch) {
      deadlineDays = (parseInt(monthMatch[1], 10) || 1) * 30; deadlineSource = "explicit months";
    } else if (pick(hay, TONE_WORDS.urgent).length) {
      deadlineDays = 5; deadlineSource = "tone signal";
    }
    deadlineDays = clamp(deadlineDays, 1, 180);

    /* -- Tools -- */
    const tools = [];
    for (const [hint, tool] of Object.entries(TOOL_HINTS)) {
      if (hay.includes(hint) && !tools.includes(tool)) tools.push(tool);
    }
    for (const t of CATEGORY_TOOLS[category] || []) {
      if (tools.length >= 5) break;
      if (!tools.includes(t)) tools.push(t);
    }

    /* -- Platforms -- */
    const platforms = PLATFORMS.filter((p) => hasTerm(hay, p));

    /* -- Tone -- */
    const tone = Object.entries(TONE_WORDS)
      .map(([name, words]) => ({ name, hits: pick(hay, words).length }))
      .filter((t) => t.hits)
      .sort((a, b) => b.hits - a.hits)
      .slice(0, 2)
      .map((t) => t.name);

    /* -- Languages: detect all, primary is the first one mentioned -- */
    const langHits = DB.LANGUAGES
      .map((l) => ({ l, i: rawLower.indexOf(l.toLowerCase()) }))
      .filter((x) => x.i >= 0)
      .sort((a, b) => a.i - b.i);
    const language = langHits[0]?.l || "English";
    const multilingual = langHits.length > 1 || /multilingual|multiple languages|localis|localiz|bilingual|dubbing|dual language/.test(hay);

    /* -- Niches -- */
    const NICHE_WORDS = {
      d2c: ["d2c", "e-commerce", "ecommerce", "online store", "shopify", "product launch", "sku", "skus"],
      fintech: ["fintech", "bank", "banking", "payment", "loan", "invest", "financial", "insurance", "credit"],
      saas: ["saas", "b2b", "software", "platform", "api", "dashboard", "startup", "app install"],
      edtech: ["edtech", "course", "learning", "student", "school", "curriculum", "lesson", "training", "k-12", "university", "teach", "syllabus", "learner"],
      health: ["health", "wellness", "clinic", "medical", "hospital", "patient", "fitness", "pharma"],
      food: ["food", "restaurant", "cafe", "beverage", "recipe", "menu", "dish", "cold-brew", "coffee", "kitchen"],
      fashion: ["fashion", "beauty", "apparel", "clothing", "garment", "skincare", "makeup", "lookbook", "wear", "ethnic wear"],
      realestate: ["real estate", "property", "listing", "realty", "apartment", "homes", "agent"],
      gaming: ["game", "gaming", "player", "esports", "stream", "in-engine"],
      ngo: ["ngo", "non-profit", "nonprofit", "government", "public sector", "charity", "trust"]
    };
    const niches = Object.entries(NICHE_WORDS).filter(([, words]) => words.some((w) => hay.includes(w))).map(([id]) => id);

    /* -- Complexity -- */
    const complexityHits = pick(hay, COMPLEXITY_WORDS);
    const projectHits = pick(hay, PROJECT_WORDS);
    const wordCount = raw.trim().split(/\s+/).filter(Boolean).length;
    let complexityScore =
      complexityHits.length * 2 +
      (multilingual ? 2 : 0) +
      (wordCount > 90 ? 2 : wordCount > 45 ? 1 : 0) +
      (quantity > 20 ? 2 : quantity > 6 ? 1 : 0) +
      (platforms.length > 2 ? 1 : 0) +
      (projectHits.length ? 1 : 0) +
      (langHits.length > 1 ? 1 : 0);
    const complexity = complexityScore >= 5 ? "high" : complexityScore >= 2 ? "medium" : "low";

    /* -- Budget: symbol amounts, or a number near a budget word -- */
    let statedBudget = null;
    let budgetSource = null;
    const unitOf = (u) => ({ k: 1e3, kr: 1e3, lakh: 1e5, l: 1e5, lac: 1e5, cr: 1e7, crore: 1e7, m: 1e6, million: 1e6, bn: 1e9 }[(u || "").toLowerCase()] || 1);
    const symbolMoney = raw.match(/[₹$]\s?([\d,]+(?:\.\d+)?)\s*(k|kr|lakh|lac|cr|crore|m|million|bn)?/i);
    const wordedMoney = rawLower.match(/\b(?:budget|around|approximately|about|roughly|under|upto|up to|spend|quote|estimate(?:d)?|cost(?:s)?|price)\D{0,14}?([\d][\d,]*)\s*(k|kr|lakh|lac|cr|crore|m|million|bn)?\b/);
    const trailingWorded = rawLower.match(/\b([\d][\d,]*)\s*(k|kr|lakh|lac|cr|crore|m|million|bn)?\s*(?:rupees|inr|bucks)?\b[^.]{0,22}\b(?:budget|spend|quote|range)\b/);
    if (symbolMoney) {
      statedBudget = parseFloat(symbolMoney[1].replace(/,/g, "")) * unitOf(symbolMoney[2]);
      budgetSource = "stated amount";
    } else if (wordedMoney) {
      const v = parseFloat(wordedMoney[1].replace(/,/g, ""));
      if (v >= 500 && v <= 50000000) { statedBudget = v * unitOf(wordedMoney[2]); budgetSource = "budget keyword"; }
    } else if (trailingWorded) {
      const v = parseFloat(trailingWorded[1].replace(/,/g, ""));
      if (v >= 500 && v <= 50000000) { statedBudget = v * unitOf(trailingWorded[2]); budgetSource = "budget keyword"; }
    }

    /* -- Deliverables -- */
    const deliverables = [];
    for (const [unit, words] of Object.entries(DELIVERABLE_WORDS)) {
      const found = words.find((w) => hasTerm(hay, w));
      if (!found) continue;
      const count = unit === quantityUnit ? quantity : null;
      if (count && count > 1) { deliverables.push(`${count} ${plural(unit, count)}`); continue; }
      const ctx = rawLower.match(new RegExp(`(?:\\b([a-z]{3,12})\\s+)?${escapeRe(found)}\\b`));
      deliverables.push(ctx && ctx[1] && !STOP.has(ctx[1]) && !/^\d+$/.test(ctx[1]) ? `${cap(ctx[1])} ${found}` : cap(found));
    }
    if (!deliverables.length) {
      deliverables.push(quantity > 1 ? `${quantity} ${plural(cat.unit, quantity)}` : cap(UNIT_LABEL[cat.unit] || cat.unit));
    }
    if (platforms.length) deliverables.push(`Optimised exports for ${platforms.slice(0, 3).join(", ")}`);
    if (multilingual) deliverables.push(`Localisation into ${langHits.length > 1 ? langHits.map((x) => x.l).join(" + ") : "additional languages"}`);
    if (complexity === "high") deliverables.push("Usage rights and disclosure documentation");

    /* -- Price -- */
    const price = estimatePrice({ category, quantity, complexity, deadlineDays, quantityUnit, isProject: projectHits.length > 0 || complexity === "high" });

    const budgetMin = statedBudget ? Math.round((statedBudget * 0.85) / 500) * 500 : price.min;
    const budgetMax = statedBudget ? Math.round((statedBudget * 1.15) / 500) * 500 : price.max;

    /* -- Risk -- */
    const risks = assessRisk(raw);

    /* -- Search keywords -- */
    const searchKeywords = [...new Set(tokens(raw).filter((t) => t.length > 3))].slice(0, 16);

    /* -- Title & summary -- */
    const title = buildTitle(quantity, quantityUnit, cat, niches, projectHits, raw);
    const summary = buildSummary(raw, cat, quantity, quantityUnit, niches, platforms, deadlineDays, multilingual);

    const confidence = clamp(round(
      cls.confidence * 0.42 +
      (quantity > 1 ? 14 : 5) +
      (deadlineSource !== "marketplace default" ? 12 : 4) +
      (niches.length ? 11 : 2) +
      (tools.length ? 7 : 2) +
      (statedBudget ? 10 : 0) +
      (platforms.length ? 5 : 0) +
      (wordCount > 40 ? 7 : 3)), 5, 96);

    return {
      title, summary,
      category, categoryName: cat.name,
      secondaryCategory: cls.secondary,
      categoryConfidence: cls.confidence,
      matchedTerms: cls.matched,
      quantity, quantityUnit, cadence,
      deliverables: deliverables.slice(0, 6),
      platforms, tone: tone.length ? tone : ["professional"],
      complexity, complexityScore,
      deadlineDays, deadlineSource,
      budgetMin, budgetMax,
      budgetSuggested: statedBudget || price.suggested,
      statedBudget, budgetSource,
      priceBreakdown: price,
      tools: tools.slice(0, 5),
      niches, language, languages: langHits.map((x) => x.l), multilingual,
      searchKeywords, risks, confidence, wordCount
    };
  }

  function buildTitle(quantity, unit, cat, niches, projectHits, raw) {
    const niche = niches.length ? DB.NICHES.find((n) => n.id === niches[0]) : null;
    const audience = niche ? niche.name.toLowerCase() : "brand";
    if (projectHits.length && quantity <= 1) return `${cap(projectHits[0].replace(/-/g, " "))} — ${cat.short} engagement`;
    if (quantity > 1) return `${quantity} ${plural(unit, quantity)} for ${audience} — ${cat.short}`;
    return `${cat.name} for ${audience}`;
  }

  function buildSummary(raw, cat, quantity, unit, niches, platforms, deadlineDays, multilingual) {
    const sentences = raw.trim().split(/(?<=[.!?])\s+/).filter((s) => s.trim().length > 12);
    const lead = sentences.length ? sentences[0].trim() : "";
    const tail = [
      `${quantity > 1 ? `${quantity} ${plural(unit, quantity)}` : cap(cat.unit)} scope`,
      platforms.length ? platforms.slice(0, 2).join("/") : null,
      multilingual ? "multilingual" : null,
      `${deadlineDays}-day turnaround`
    ].filter(Boolean).join(" · ");
    return lead ? `${lead} (${tail})` : `${cat.name} engagement. (${tail})`;
  }

  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function plural(word, n) {
    if (n === 1) return word;
    if (word.endsWith("y") && !/[aeiou]y$/.test(word)) return word.slice(0, -1) + "ies";
    if (/(s|x|ch|sh)$/.test(word)) return word + "es";
    return word + "s";
  }

  /* ============================================================
     3. Price estimator — anchored on live marketplace percentiles
     ============================================================ */
  function estimatePrice({ category, quantity = 1, complexity = "medium", deadlineDays = 14, quantityUnit, isProject = false }) {
    const cat = DB.byId.category[category] || DB.CATEGORIES[0];
    const catGigs = DB.GIGS.filter((g) => g.category === category);
    const stdPrices = catGigs.map((g) => g.packages.standard.price).sort((a, b) => a - b);
    const allPrices = catGigs.flatMap((g) => Object.values(g.packages).map((p) => p.price)).sort((a, b) => a - b);

    const p25 = allPrices.length ? allPrices[Math.floor(allPrices.length * 0.25)] : cat.benchmark;
    const p50 = median(stdPrices) || median(allPrices) || cat.benchmark;
    const p75 = allPrices.length ? allPrices[Math.floor(allPrices.length * 0.75)] : cat.benchmark * 2;

    /* Scope factor: maps "how much work" onto the category's median package.
       A single unit buys roughly the entry tier; a large batch buys well past
       the premium tier. Project-shaped briefs (frameworks, rebrands, systems)
       are scoped like a premium engagement, not a single deliverable. */
    const scopeFactor = isProject && quantity <= 1 ? 1.85
      : quantity <= 1 ? 0.6
      : quantity <= 3 ? 0.9
      : quantity <= 6 ? 1.2
      : quantity <= 12 ? 1.7
      : quantity <= 25 ? 2.6
      : quantity <= 50 ? 3.6
      : 4.8;

    const COMPLEXITY_MULT = { low: 0.82, medium: 1, high: 1.35 };
    const cm = COMPLEXITY_MULT[complexity] ?? 1;

    const daysPerUnit = deadlineDays / Math.max(quantity, 1);
    const rushMult = quantity <= 1
      ? (deadlineDays <= 3 ? 1.35 : deadlineDays <= 7 ? 1.12 : 1)
      : (daysPerUnit < 0.4 ? 1.4 : daysPerUnit < 1 ? 1.2 : daysPerUnit < 2 ? 1.07 : 1);

    const bulkMult = quantity > 60 ? 0.8 : quantity > 25 ? 0.9 : 1;

    let suggested = p50 * scopeFactor * cm * rushMult * bulkMult;
    /* Never quote outside a sane band for the category. */
    suggested = clamp(suggested, Math.max(500, p25 * 0.55), p75 * 2.4);
    suggested = Math.round(suggested / 500) * 500;

    const perUnit = Math.round(suggested / Math.max(quantity, 1));

    return {
      min: Math.max(500, Math.round((suggested * 0.78) / 500) * 500),
      suggested,
      max: Math.round((suggested * 1.32) / 500) * 500,
      perUnit,
      marketSamples: allPrices.length,
      p25, p50, p75,
      scopeFactor: round(scopeFactor, 2),
      multipliers: { complexity: cm, scope: round(scopeFactor, 2), rush: round(rushMult, 2), bulk: bulkMult },
      rationale: [
        `Median standard-tier ${cat.short.toLowerCase()} listing is ${money(Math.round(p50))}, sampled across ${catGigs.length} live listings and ${allPrices.length} price points.`,
        isProject && quantity <= 1
          ? "Scoped as a project engagement (framework/system/campaign), not a single deliverable, so the anchor is scaled to premium tier."
          : `Quantity of ${quantity} ${plural(quantityUnit || cat.unit, quantity)} maps to a ${round(scopeFactor, 2)}x scope factor against that median.`,
        `"${complexity}" complexity adjusts the anchor by ${cm > 1 ? "+" : ""}${round((cm - 1) * 100)}%.`,
        rushMult > 1
          ? `Timeline of ${deadlineDays} days for ${quantity} unit${quantity === 1 ? "" : "s"} (${round(daysPerUnit, 1)} days each) adds a ${round((rushMult - 1) * 100)}% rush premium.`
          : "Timeline is comfortable for this scope, so no rush premium applies.",
        bulkMult < 1 ? `Very large volume applies a ${round((1 - bulkMult) * 100)}% bulk discount.` : null,
        "Estimate excludes the 8% platform fee and any add-ons."
      ].filter(Boolean)
    };
  }

  function money(v) {
    if (v == null || isNaN(v)) return "—";
    return "₹" + Math.round(Number(v)).toLocaleString("en-IN");
  }

  /* ============================================================
     4. Smart matching — explainable creator-to-brief scoring
     ============================================================ */
  function scoreCreatorForBrief(brief, creator) {
    const factors = [];
    const gigs = DB.gigsOf(creator.id);
    const relevantGigs = gigs.filter((g) => g.category === brief.category);
    const poolGigs = relevantGigs.length ? relevantGigs : gigs;
    const keywords = brief.searchKeywords?.length ? brief.searchKeywords : tokens(`${brief.title || ""} ${brief.description || ""}`);

    /* -- 1. Category expertise (26) -- */
    const catMax = 26;
    let catPts, catWhy;
    if (creator.categories.includes(brief.category)) {
      const orders = relevantGigs.reduce((s, g) => s + g.orders, 0);
      catPts = 20 + clamp(Math.log10(orders + 1) * 2.6, 0, 6);
      catWhy = `${brief.categoryName} is a core category, with ${orders.toLocaleString("en-IN")} completed orders across ${relevantGigs.length} active listing${relevantGigs.length === 1 ? "" : "s"}.`;
    } else if (brief.secondaryCategory && creator.categories.includes(brief.secondaryCategory)) {
      catPts = 13;
      catWhy = `Not a ${brief.categoryName} specialist, but works in the adjacent ${DB.byId.category[brief.secondaryCategory].name} category.`;
    } else {
      const tagHay = norm(gigs.map((g) => `${g.tags.join(" ")} ${g.title}`).join(" "));
      const overlap = keywords.slice(0, 8).filter((k) => tagHay.includes(k)).length;
      catPts = clamp(overlap * 2.2, 0, 9);
      catWhy = `No ${brief.categoryName} listing. ${overlap ? `${overlap} listing tags overlap with your brief keywords.` : "No tag overlap either — ranked on reputation alone."}`;
    }
    catPts = clamp(catPts, 0, catMax);
    factors.push({ key: "category", label: "Category expertise", points: round(catPts, 1), max: catMax, reason: catWhy });

    /* -- 2. Niche relevance (8) -- */
    const nicheMax = 8;
    const briefNiches = brief.niches || [];
    const nicheHits = briefNiches.filter((n) => creator.niches.includes(n));
    const nichePts = briefNiches.length
      ? clamp((nicheHits.length / briefNiches.length) * nicheMax + (nicheHits.length >= 2 ? 1.5 : 0), 0, nicheMax)
      : nicheMax * 0.5;
    factors.push({
      key: "niche", label: "Industry niche", points: round(nichePts, 1), max: nicheMax,
      reason: briefNiches.length
        ? (nicheHits.length
          ? `Has shipped for ${nicheHits.map((n) => DB.NICHES.find((x) => x.id === n)?.name).filter(Boolean).join(" and ")}, matching your brief.`
          : `No prior work in ${briefNiches.map((n) => DB.NICHES.find((x) => x.id === n)?.name).filter(Boolean).join(" or ")}. Their niches: ${creator.niches.map((n) => DB.NICHES.find((x) => x.id === n)?.name).filter(Boolean).join(", ")}.`)
        : "Brief specifies no industry, so niche is scored neutral."
    });

    /* -- 3. Keyword & tag relevance (8) -- */
    const kwMax = 8;
    const profileHay = norm([creator.bio, creator.title, gigs.map((g) => `${g.title} ${g.tags.join(" ")} ${g.summary}`).join(" ")].join(" "));
    const kwHits = keywords.filter((k) => k.length > 3 && profileHay.includes(k));
    const kwPts = keywords.length ? clamp((kwHits.length / Math.min(keywords.length, 8)) * kwMax, 0, kwMax) : kwMax * 0.4;
    factors.push({
      key: "keywords", label: "Keyword relevance", points: round(kwPts, 1), max: kwMax,
      reason: kwHits.length
        ? `Profile and listing tags match ${kwHits.length} brief signals: ${kwHits.slice(0, 6).map((k) => `"${k}"`).join(", ")}.`
        : "No keyword overlap with the brief text beyond the category."
    });

    /* -- 4. Toolchain match (12) -- */
    const toolMax = 12;
    const wantTools = (brief.tools || []).map((t) => t.toLowerCase());
    const hasTools = creator.tools.map((t) => t.toLowerCase());
    const toolOverlap = wantTools.filter((t) => hasTools.some((h) => h === t || h.includes(t) || t.includes(h)));
    const toolRatio = wantTools.length ? toolOverlap.length / wantTools.length : 0.65;
    factors.push({
      key: "tools", label: "Toolchain match", points: round(clamp(toolRatio * toolMax, 0, toolMax), 1), max: toolMax,
      reason: wantTools.length
        ? (toolOverlap.length
          ? `Already works in ${toolOverlap.map((t) => cap(t)).join(", ")} — no retooling needed.`
          : `Brief calls for ${wantTools.slice(0, 3).map((t) => cap(t)).join(", ")}; this creator uses ${creator.tools.slice(0, 3).join(", ")}.`)
        : `No tool requirement stated. Their stack: ${creator.tools.slice(0, 4).join(", ")}.`
    });

    /* -- 5. Budget fit (18) -- */
    const budMax = 18;
    const entryPrice = Math.min(...poolGigs.map((g) => DB.LOWEST(g)));
    const midBudget = ((brief.budgetMin || 0) + (brief.budgetMax || 0)) / 2 || entryPrice;
    const ratio = midBudget / (entryPrice || 1);
    let budPts, budWhy;
    if (ratio >= 1.6) {
      budPts = budMax;
      budWhy = `Your ${money(Math.round(midBudget))} budget comfortably clears their ${money(entryPrice)} entry tier, so a higher package is reachable.`;
    } else if (ratio >= 0.95) {
      budPts = budMax * 0.9;
      budWhy = `Budget of ${money(Math.round(midBudget))} aligns with their ${money(entryPrice)} starting price.`;
    } else if (ratio >= 0.6) {
      budPts = budMax * 0.5;
      budWhy = `They start at ${money(entryPrice)}, above your ${money(Math.round(midBudget))} budget. A reduced scope would be needed.`;
    } else {
      budPts = budMax * 0.16;
      budWhy = `Out of range — ${money(entryPrice)} entry price against a ${money(Math.round(midBudget))} budget.`;
    }
    factors.push({ key: "budget", label: "Budget fit", points: round(budPts, 1), max: budMax, reason: budWhy });

    /* -- 6. Reputation & reliability (14) -- */
    const repMax = 14;
    const repPts = clamp(
      clamp((creator.rating - 4) / 1, 0, 1) * 7 +
      clamp(Math.log10(creator.reviews + 1) / Math.log10(520), 0, 1) * 4.5 +
      creator.repeatClientRate * 2.5, 0, repMax);
    factors.push({
      key: "reputation", label: "Reputation & reliability", points: round(repPts, 1), max: repMax,
      reason: `${creator.rating.toFixed(1)}★ from ${creator.reviews} reviews, ${round(creator.repeatClientRate * 100)}% repeat clients, ${round(creator.onTimeRate * 100)}% on-time delivery.`
    });

    /* -- 7. Capacity & turnaround (8) -- */
    const capMaxPts = 8;
    const deadline = brief.deadlineDays ?? 14;
    let capPts = 0;
    const capNotes = [];
    if (creator.deliveryDays <= Math.max(2, Math.ceil(deadline / 3))) {
      capPts += 3.5;
      capNotes.push(`their ${creator.deliveryDays}-day standard turnaround leaves slack in your ${deadline}-day window`);
    } else if (creator.deliveryDays <= deadline) {
      capPts += 2;
      capNotes.push(`turnaround fits your ${deadline}-day window with little slack`);
    } else {
      capNotes.push(`their ${creator.deliveryDays}-day turnaround exceeds your ${deadline}-day window`);
    }
    if (creator.online) { capPts += 1.5; capNotes.push("online now"); }
    const queue = Math.min(...poolGigs.map((g) => g.queue));
    if (queue <= 4) { capPts += 2; capNotes.push(`short queue (${queue} orders)`); }
    else if (queue <= 7) { capPts += 0.8; capNotes.push(`moderate queue (${queue} orders)`); }
    else capNotes.push(`busy (${queue} orders queued)`);
    factors.push({ key: "capacity", label: "Capacity & turnaround", points: round(clamp(capPts, 0, capMaxPts), 1), max: capMaxPts, reason: capNotes.join("; ") + "." });

    /* -- 8. Language (6) -- */
    const langMax = 6;
    const lang = brief.language || "English";
    const langOk = creator.languages.some((l) => l.toLowerCase() === lang.toLowerCase());
    const multiNeed = brief.multilingual || (brief.languages?.length || 0) > 1;
    const wantedLangs = brief.languages?.length ? brief.languages : [lang];
    const covered = wantedLangs.filter((w) => creator.languages.some((l) => l.toLowerCase() === w.toLowerCase()));
    let langPts, langWhy;
    if (!multiNeed) {
      langPts = langOk ? langMax : creator.languages.includes("English") ? 2 : 0;
      langWhy = langOk ? `Works in ${lang}.` : `Does not list ${lang}. Available: ${creator.languages.join(", ")}.`;
    } else {
      langPts = clamp((covered.length / wantedLangs.length) * langMax, 0, langMax);
      langWhy = covered.length === wantedLangs.length
        ? `Covers every language you need: ${covered.join(", ")}.`
        : `Covers ${covered.length} of ${wantedLangs.length} requested languages (${covered.join(", ") || "none"}).`;
    }
    factors.push({ key: "language", label: "Language coverage", points: round(langPts, 1), max: langMax, reason: langWhy });

    const score = clamp(round(factors.reduce((s, f) => s + f.points, 0)));
    const best = poolGigs.slice().sort((a, b) => DB.LOWEST(a) - DB.LOWEST(b))[0];
    const matchable = keywords.length > 0 || !!brief.category;

    return {
      creator, score, factors,
      suggestedGig: best,
      suggestedPackage: best ? bestPackageFor(best, midBudget) : null,
      entryPrice,
      confidence: clamp(round(40 + (keywords.length ? 20 : 3) + (brief.tools?.length ? 12 : 3) + (brief.budgetMax ? 14 : 2) + ((brief.categoryConfidence || 50) * 0.08)), 20, 97),
      matchable,
      verdict: verdictFor(score, creator)
    };
  }

  function bestPackageFor(gig, budget) {
    const affordable = Object.entries(gig.packages).filter(([, p]) => p.price <= budget * 1.05);
    return affordable.length ? affordable[affordable.length - 1][0] : "basic";
  }

  function verdictFor(score, creator) {
    const first = creator.name.split(" ")[0];
    if (score >= 85) return { tone: "strong", text: `Excellent fit. ${first} covers your category, toolchain and budget with a strong delivery record.` };
    if (score >= 70) return { tone: "good", text: `Solid fit. Worth shortlisting — check the weaker factors below before committing.` };
    if (score >= 52) return { tone: "partial", text: `Partial fit. Capable in this space, but one or more requirements need a conversation first.` };
    return { tone: "weak", text: `Weak fit for this specific brief. Shown so you can see exactly where the trade-offs are.` };
  }

  function matchCreators(brief, { limit = 8, minScore = 0 } = {}) {
    const b = { ...brief, searchKeywords: brief.searchKeywords?.length ? brief.searchKeywords : tokens(`${brief.title || ""} ${brief.description || ""}`) };
    return DB.CREATORS
      .map((c) => scoreCreatorForBrief(b, c))
      .filter((m) => m.score >= minScore)
      .sort((a, b2) => b2.score - a.score || b2.creator.rating - a.creator.rating)
      .slice(0, limit);
  }

  /* ============================================================
     5. Search relevance
     ============================================================ */
  function searchCreators(query, creators = DB.CREATORS) {
    const hay = norm(query);
    if (!hay) return creators.map((c) => ({ creator: c, relevance: qualityScore(c).score }));
    const qTokens = tokens(query);
    return creators
      .map((creator) => {
        const gigs = DB.gigsOf(creator.id);
        const text = norm([creator.name, creator.title, creator.bio, creator.location, creator.tools.join(" "), creator.niches.join(" "), creator.categories.map((c) => DB.byId.category[c].name).join(" "), gigs.map((g) => `${g.title} ${g.tags.join(" ")} ${g.summary}`).join(" ")].join(" "));
        let rel = 0;
        for (const t of qTokens) {
          const hits = text.split(t).length - 1;
          if (hits) rel += 12 + Math.min(hits, 4) * 3;
          if (creator.name.toLowerCase().includes(t)) rel += 24;
          if (creator.tools.some((x) => x.toLowerCase() === t)) rel += 18;
          if (creator.categories.some((c) => DB.byId.category[c].name.toLowerCase().includes(t))) rel += 20;
          if (creator.niches.some((n) => DB.NICHES.find((x) => x.id === n)?.name.toLowerCase().includes(t))) rel += 14;
        }
        rel += qualityScore(creator).score * 0.22;
        return { creator, relevance: round(rel, 1) };
      })
      .filter((r) => r.relevance > 0)
      .sort((a, b) => b.relevance - a.relevance);
  }

  /* ============================================================
     6. Creator quality score
     ============================================================ */
  function qualityScore(creator) {
    const avgResponse = DB.CREATORS.reduce((s, c) => s + c.responseMins, 0) / DB.CREATORS.length;
    const parts = [
      { key: "rating", label: "Buyer rating", weight: 34, value: clamp((creator.rating - 3.5) / 1.5, 0, 1), detail: `${creator.rating.toFixed(1)} / 5.0` },
      { key: "volume", label: "Order volume", weight: 16, value: clamp(Math.log10(creator.completedOrders + 1) / Math.log10(600), 0, 1), detail: `${creator.completedOrders} completed` },
      { key: "ontime", label: "On-time delivery", weight: 17, value: creator.onTimeRate, detail: `${round(creator.onTimeRate * 100)}% on time` },
      { key: "repeat", label: "Repeat clients", weight: 17, value: creator.repeatClientRate, detail: `${round(creator.repeatClientRate * 100)}% return` },
      { key: "response", label: "Response speed", weight: 11, value: clamp(1 - creator.responseMins / 180, 0, 1), detail: `~${creator.responseMins} min (avg ${Math.round(avgResponse)})` },
      { key: "verified", label: "Identity verified", weight: 5, value: creator.verified ? 1 : 0, detail: creator.verified ? "Verified" : "Not verified" }
    ];
    const score = clamp(round(parts.reduce((s, p) => s + p.value * p.weight, 0)));
    return { score, grade: gradeFor(score), parts, band: bandFor(score) };
  }

  function gradeFor(s) {
    if (s >= 92) return "A+";
    if (s >= 85) return "A";
    if (s >= 78) return "A-";
    if (s >= 70) return "B+";
    if (s >= 62) return "B";
    if (s >= 52) return "C+";
    return "C";
  }

  function bandFor(s) {
    if (s >= 85) return { label: "Top tier", color: "mint" };
    if (s >= 70) return { label: "Established", color: "violet" };
    if (s >= 55) return { label: "Growing", color: "amber" };
    return { label: "Emerging", color: "sky" };
  }

  /* ============================================================
     7. Review intelligence
     ============================================================ */
  const ASPECTS = {
    speed: ["fast", "quick", "early", "days", "turnaround", "same-day", "ahead"],
    quality: ["quality", "beautiful", "excellent", "great", "strong", "flawless", "convincing", "sharp", "broadcast"],
    communication: ["communication", "replies", "reply", "told us", "call", "responsive", "async", "slow to reply"],
    value: ["value", "cheap", "worth", "roi", "roas", "conversion", "cpa", "views", "traffic", "subscribers", "gmv"],
    revisions: ["revision", "revisions", "re-take", "artefact", "artifact", "fixes", "comped"],
    strategy: ["strategy", "strategic", "pushed back", "challenged", "insight", "research", "data-driven", "systems"]
  };

  function summariseReviews(creator) {
    const reviews = creator.reviewList || [];
    if (!reviews.length) return { count: 0, average: 0, aspects: [], sentiment: null, negativeSignals: 0, highlights: [] };
    const hay = norm(reviews.map((r) => r.text).join(" "));
    const aspects = Object.entries(ASPECTS)
      .map(([name, words]) => ({ name, mentions: pick(hay, words).length }))
      .filter((a) => a.mentions > 0)
      .sort((a, b) => b.mentions - a.mentions);

    const negativeWords = ["slipped", "slow", "needed", "artefact", "artifact", "issue", "dense", "comped", "fixes", "re-take"];
    const negativeSignals = pick(hay, negativeWords).length;
    const average = round(reviews.reduce((s, r) => s + r.rating, 0) / reviews.length, 2);
    const sentiment = average >= 4.8 && negativeSignals === 0 ? "very-positive"
      : average >= 4.6 && negativeSignals <= 1 ? "positive"
      : average >= 4.2 ? "mixed-positive" : "mixed";

    return {
      count: reviews.length, average, aspects, sentiment, negativeSignals,
      highlights: reviews.slice().sort((a, b) => b.rating - a.rating || b.text.length - a.text.length).slice(0, 3)
    };
  }

  /* ============================================================
     8. Risk & trust assessment
     Returns a safety score: 100 = no concerns, lower = more control needed.
     ============================================================ */
  const RISK_RULES = [
    { id: "likeness", test: /\bdeepfake|face swap|clone (?:my|their|his|her|our)|likeness|real person|celebrity|influencer look/i, level: "high", title: "Likeness & consent risk", body: "Work using a real person's face or voice needs written consent and clear disclosure. Require the creator to deliver a signed likeness release before any asset ships.", action: "Require consent documentation" },
    { id: "regulated", test: /\bbank\b|banking|fintech|insurance|\bloan\b|invest(?:ing|ment)?\b|medical|clinic|patient|pharma|health claim|\blegal\b/i, level: "high", title: "Regulated content category", body: "Financial and health content carries advertising-standards obligations. Add a compliance review gate so nothing publishes without sign-off.", action: "Add compliance review gate" },
    { id: "minors", test: /\bchildren\b|\bkids\b|k-12|\bschool\b|\bminor\b|under 18|\bstudents?\b/i, level: "medium", title: "Audience includes minors", body: "Content aimed at children attracts stricter platform policies and advertising rules. Require an age-appropriateness review pass.", action: "Require age-appropriate review" },
    { id: "rights", test: /copyright|licens(?:e|ed|ing)|stock music|commercial rights|buyout|ownership|training data/i, level: "medium", title: "Rights & ownership", body: "AI-generated assets can have unclear training-data provenance. Specify rights transfer and an originality warranty in the order terms.", action: "Specify rights transfer" },
    { id: "disclosure", test: /ai-generated|ai generated|synthetic|\bavatar\b|virtual human|generated|deep ?fake/i, level: "medium", title: "AI disclosure labelling", body: "Several platforms and jurisdictions require synthetic media to be labelled. Confirm the creator ships disclosure metadata with every asset.", action: "Confirm disclosure labelling" },
    { id: "scale", test: /\b(?:[5-9]\d|\d{3,})\s+(?:reels?|videos?|assets?|creatives?|articles?|images?|looks?|lessons?|posts?)\b/i, level: "low", title: "High volume, short window", body: "Large asset counts compress review time. Split delivery into batches with a checkpoint after the first five assets.", action: "Split into review batches" },
    { id: "claims", test: /guarantee[ds]?|\d+(?:\.\d+)?x roas|\bviral\b|go viral|number one|#1\b|best in\b/i, level: "low", title: "Performance claims", body: "Guaranteed outcomes are rarely enforceable and can create misleading-advertising exposure. Reframe targets as goals, not promises.", action: "Reframe as targets" }
  ];

  function assessRisk(text) {
    const hay = norm(text);
    const flags = [];
    for (const r of RISK_RULES) {
      if (r.test.test(hay)) flags.push({ id: r.id, level: r.level, title: r.title, body: r.body, action: r.action });
    }
    const rank = { high: 3, medium: 2, low: 1 } ;
    const worst = flags.reduce((m, f) => Math.max(m, rank[f.level] || 0), 0);
    const highCount = flags.filter((f) => f.level === "high").length;
    const safety = clamp(round(100 - worst * 21 - highCount * 8 - flags.length * 4), 5, 100);

    return {
      flags,
      level: worst === 3 ? "elevated" : worst === 2 ? "moderate" : worst === 1 ? "low" : "clear",
      score: safety,
      summary: worst === 3
        ? "This brief touches regulated or likeness-sensitive territory. Put the controls below in place before awarding the work."
        : worst === 2
        ? "A few standard protections are worth writing into the order terms."
        : worst === 1
        ? "Low risk. Minor commercial hygiene points only."
        : "No elevated risk signals detected in this brief."
    };
  }

  /* ============================================================
     9. Marketplace intelligence
     ============================================================ */
  function trends() {
    const catRows = DB.CATEGORIES.map((cat) => {
      const gigs = DB.GIGS.filter((g) => g.category === cat.id);
      const creators = DB.CREATORS.filter((c) => c.categories.includes(cat.id));
      const orders = gigs.reduce((s, g) => s + g.orders, 0);
      const prices = gigs.flatMap((g) => Object.values(g.packages).map((p) => p.price));
      const openBriefs = DB.SEED_BRIEFS.filter((b) => b.category === cat.id && b.status === "open").length;
      const demand = openBriefs + gigs.filter((g) => g.trending).length;
      return {
        ...cat,
        gigs: gigs.length,
        creators: creators.length,
        orders,
        avgPrice: prices.length ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : 0,
        medianPrice: Math.round(median(gigs.map((g) => g.packages.standard.price))),
        openBriefs,
        trendingCount: gigs.filter((g) => g.trending).length,
        demandIndex: round(orders / Math.max(gigs.length, 1)),
        supplyGap: round(creators.length / Math.max(demand, 1), 2),
        avgRating: gigs.length ? round(gigs.reduce((s, g) => s + g.rating, 0) / gigs.length, 2) : 0
      };
    }).sort((a, b) => b.orders - a.orders);

    const toolCounts = new Map();
    for (const c of DB.CREATORS) {
      for (const t of c.tools) {
        const prev = toolCounts.get(t) || { count: 0, ratingSum: 0, orders: 0 };
        toolCounts.set(t, { count: prev.count + 1, ratingSum: prev.ratingSum + c.rating, orders: prev.orders + c.completedOrders });
      }
    }
    const topTools = [...toolCounts.entries()]
      .map(([name, v]) => ({ name, creators: v.count, avgRating: round(v.ratingSum / v.count, 2), orders: v.orders }))
      .sort((a, b) => b.creators - a.creators || b.orders - a.orders)
      .slice(0, 12);

    const tagCounts = new Map();
    for (const g of DB.GIGS) for (const t of g.tags) tagCounts.set(t, (tagCounts.get(t) || 0) + (g.trending ? 2 : 1));
    const risingTags = [...tagCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 16).map(([tag, weight]) => ({ tag, weight }));

    const totals = {
      creators: DB.CREATORS.length,
      gigs: DB.GIGS.length,
      orders: DB.GIGS.reduce((s, g) => s + g.orders, 0),
      gmv: DB.GIGS.reduce((s, g) => s + g.orders * DB.LOWEST(g), 0),
      openBriefs: DB.SEED_BRIEFS.filter((b) => b.status === "open").length,
      avgRating: round(DB.CREATORS.reduce((s, c) => s + c.rating, 0) / DB.CREATORS.length, 2),
      verifiedShare: round((DB.CREATORS.filter((c) => c.verified).length / DB.CREATORS.length) * 100),
      avgResponse: Math.round(DB.CREATORS.reduce((s, c) => s + c.responseMins, 0) / DB.CREATORS.length)
    };

    return {
      categories: catRows, topTools, risingTags, totals,
      priceByCategory: catRows.map((c) => ({ name: c.short, value: c.avgPrice })),
      topCreators: DB.CREATORS.map((c) => ({ creator: c, q: qualityScore(c) })).sort((a, b) => b.q.score - a.q.score).slice(0, 5)
    };
  }

  /* ============================================================
     10. Pricing advisor for creators
     Recommendations are bounded: no advice moves a price more than
     30%, because a marketplace that tells you to 6x your rate is
     useless advice.
     ============================================================ */
  function adviseCreatorPricing(creator) {
    const gigs = DB.gigsOf(creator.id);
    const q = qualityScore(creator).score;

    return gigs.map((gig) => {
      const peers = DB.GIGS.filter((x) => x.category === gig.category && x.id !== gig.id);
      const peerStd = peers.map((x) => x.packages.standard.price);
      const peerMedian = median(peerStd) || gig.packages.standard.price;
      const current = gig.packages.standard.price;

      /* Move at most halfway toward the category median, capped at ±15%. */
      const rawPull = peerMedian / current;
      const marketFactor = 1 + (clamp(rawPull, 0.75, 1.3) - 1) * 0.5;

      /* Quality premium: a top-decile score justifies charging more. */
      const qualityPremium = clamp((q - 70) / 150, -0.08, 0.2);

      /* Demand pressure: rating and queue depth. */
      const demandPremium =
        clamp((gig.rating - 4.6) / 4, -0.05, 0.1) +
        clamp(gig.queue / 60, 0, 0.1);

      const unclamped = current * marketFactor * (1 + qualityPremium + demandPremium);
      const bounded = clamp(unclamped, current * 0.8, current * 1.3);
      const recommended = Math.round(bounded / 500) * 500;
      const delta = recommended - current;
      const deltaPct = round((delta / current) * 100, 1);

      return {
        gig, current, recommended, delta, deltaPct,
        peerMedian: Math.round(peerMedian), peerCount: peers.length,
        marketFactor: round(marketFactor, 3),
        qualityPremium: round(qualityPremium * 100, 1),
        demandPremium: round(demandPremium * 100, 1),
        direction: deltaPct > 5 ? "raise" : deltaPct < -5 ? "lower" : "hold",
        rationale: [
          `Median standard tier across ${peers.length} comparable ${DB.byId.category[gig.category].short} listings is ${money(peerMedian)}; yours is ${money(current)}.`,
          `You are ${rawPull > 1.02 ? "below" : rawPull < 0.98 ? "above" : "level with"} that median, so the market pull is ${deltaPct > 0 ? "upward" : deltaPct < 0 ? "downward" : "neutral"} (${round((marketFactor - 1) * 100, 1)}% after damping halfway toward it).`,
          `Quality score ${q} adds ${qualityPremium >= 0 ? "+" : ""}${round(qualityPremium * 100, 1)}%; a ${gig.rating.toFixed(1)}★ rating and ${gig.queue} queued orders add ${round(demandPremium * 100, 1)}%.`,
          deltaPct > 5 ? "You look underpriced for the demand you carry. Test the raise on new orders only and watch conversion for two weeks."
            : deltaPct < -5 ? "You are priced above what the category currently supports. Add scope to the tier rather than cutting price."
            : "Pricing sits near market equilibrium. Conversion and packaging matter more than price right now."
        ]
      };
    });
  }

  return {
    generateBrief, classifyCategory, estimatePrice, matchCreators, scoreCreatorForBrief,
    searchCreators, qualityScore, summariseReviews, assessRisk, trends, adviseCreatorPricing,
    money, median, gradeFor, bandFor, clamp, round, norm, tokens, plural, cap, lemma, hasTerm
  };
})();
