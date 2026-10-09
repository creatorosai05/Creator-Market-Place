/* ============================================================
   CreatorOS AI — marketplace dataset
   Production seed catalogue for AI content creators, services,
   benchmarks and categories.
   ============================================================ */

const DB = (() => {
  /* ---------- Taxonomy ---------- */
  const CATEGORIES = [
    { id: "video", name: "Short-Form Video", short: "Reels & Shorts", blurb: "Vertical AI-edited reels, hooks and captions built for reach.", benchmark: 2400, unit: "reel" },
    { id: "aiart", name: "AI Art & Illustration", short: "AI Art", blurb: "Product visuals, mascots, concept art and editorial illustration.", benchmark: 1800, unit: "asset" },
    { id: "copy", name: "Copywriting & Blogs", short: "Copy", blurb: "SEO blogs, landing copy, scripts and email sequences.", benchmark: 1500, unit: "piece" },
    { id: "voice", name: "Voiceover & Audio", short: "Voice", blurb: "Multilingual AI voice, dubbing, mixing and sound design.", benchmark: 1200, unit: "minute" },
    { id: "social", name: "Social Media Management", short: "Social", blurb: "Calendars, community management and monthly content engines.", benchmark: 18000, unit: "month" },
    { id: "ads", name: "Performance Ad Creatives", short: "Ad Creatives", blurb: "Static and motion ad variants engineered for ROAS testing.", benchmark: 900, unit: "creative" },
    { id: "youtube", name: "Long-Form YouTube", short: "YouTube", blurb: "Script-to-publish editing, thumbnails, chapters and retention cuts.", benchmark: 6500, unit: "video" },
    { id: "brand", name: "Brand Identity & Logo", short: "Brand", blurb: "Logo systems, palettes, type pairing and mini brand books.", benchmark: 9000, unit: "project" },
    { id: "avatar", name: "AI Avatars & UGC", short: "Avatars", blurb: "Synthetic presenters, lip-synced UGC and spokesperson videos.", benchmark: 3200, unit: "video" },
    { id: "music", name: "AI Music & Sound", short: "Music", blurb: "Original scores, jingles, stings and licensed-safe beds.", benchmark: 4200, unit: "track" }
  ];

  const TOOLS = [
    "Midjourney", "Runway", "Sora", "Kling", "ElevenLabs", "ChatGPT", "Claude", "Gemini",
    "CapCut", "Premiere Pro", "After Effects", "DaVinci Resolve", "Figma", "Canva",
    "Suno", "Udio", "HeyGen", "D-ID", "Stable Diffusion", "Flux", "Ideogram", "Descript",
    "Whisper", "Notion AI", "Jasper", "Buffer", "Meta Ads Manager", "Google Analytics"
  ];

  const NICHES = [
    { id: "d2c", name: "D2C & E-commerce" },
    { id: "fintech", name: "Fintech" },
    { id: "saas", name: "SaaS & B2B" },
    { id: "edtech", name: "EdTech" },
    { id: "health", name: "Health & Wellness" },
    { id: "food", name: "Food & Beverage" },
    { id: "fashion", name: "Fashion & Beauty" },
    { id: "realestate", name: "Real Estate" },
    { id: "gaming", name: "Gaming" },
    { id: "ngo", name: "Non-profit & Gov" }
  ];

  const LANGUAGES = ["English", "Hindi", "Tamil", "Telugu", "Kannada", "Marathi", "Bengali", "Spanish", "French", "German", "Arabic", "Japanese"];

  /* ---------- Creators ---------- */
  const CREATORS = [
    {
      id: "c01", name: "Ananya Sharma", handle: "@ananya.cuts", hue: 262,
      title: "AI Short-Form Video Editor",
      location: "Bengaluru, IN", timezone: "IST (UTC+5:30)",
      languages: ["English", "Hindi", "Kannada"],
      rating: 4.9, reviews: 214, completedOrders: 386, responseMins: 25,
      memberSince: "2023-04", verified: true, online: true,
      priceLevel: 2, deliveryDays: 2, repeatClientRate: 0.62, onTimeRate: 0.98,
      categories: ["video", "youtube"],
      tools: ["Runway", "CapCut", "Midjourney", "ElevenLabs", "Premiere Pro", "Whisper"],
      niches: ["d2c", "fintech", "fashion"],
      bio: "I turn raw product footage and a one-line brief into vertical reels that hold attention past the third second. My workflow pairs Runway generative b-roll with hand-tuned pacing, so every cut is deliberate rather than templated. 380+ orders delivered for D2C and fintech brands.",
      portfolio: [
        { title: "Skincare launch reel series", kind: "Reels", metric: "4.1M views", hue: 262 },
        { title: "Fintech explainer shorts", kind: "Shorts", metric: "+38% CTR", hue: 190 },
        { title: "Festive drop campaign", kind: "Reels", metric: "2.6M views", hue: 320 }
      ],
      reviewList: [
        { author: "Ritika M.", company: "GlowRoute", rating: 5, when: "2026-09-18", text: "Delivered 8 reels in four days and every single one had a hook that worked. Two crossed a million views organically.", gig: "AI reels for your brand" },
        { author: "Karthik V.", company: "PaySprint", rating: 5, when: "2026-08-30", text: "Understood a complicated fintech product in one call and translated it into something a 20-year-old would actually watch.", gig: "AI reels for your brand" },
        { author: "Sana Q.", company: "Threadly", rating: 4, when: "2026-08-02", text: "Great pacing and sound design. First drafts needed caption fixes but revisions were same-day.", gig: "YouTube retention edit" }
      ]
    },
    {
      id: "c02", name: "Dev Patel", handle: "@devprompt", hue: 168,
      title: "Generative Art Director",
      location: "Ahmedabad, IN", timezone: "IST (UTC+5:30)",
      languages: ["English", "Hindi", "Gujarati"],
      rating: 4.8, reviews: 167, completedOrders: 291, responseMins: 40,
      memberSince: "2023-01", verified: true, online: true,
      priceLevel: 3, deliveryDays: 3, repeatClientRate: 0.71, onTimeRate: 0.96,
      categories: ["aiart", "brand"],
      tools: ["Midjourney", "Stable Diffusion", "Flux", "Figma", "Ideogram", "After Effects"],
      niches: ["saas", "gaming", "fashion"],
      bio: "Art direction for brands that need a consistent visual language, not ten disconnected pretty pictures. I build custom LoRA-style reference sets and prompt systems so your campaign stays on-brand across hundreds of generations.",
      portfolio: [
        { title: "SaaS product world-build", kind: "Campaign art", metric: "62 assets", hue: 168 },
        { title: "Game key art series", kind: "Key art", metric: "Launch hero", hue: 22 },
        { title: "Fashion lookbook", kind: "Editorial", metric: "18 looks", hue: 300 }
      ],
      reviewList: [
        { author: "Meera J.", company: "Northlane AI", rating: 5, when: "2026-09-25", text: "Built us a full prompt system our marketing team still uses. Consistency across 60 assets was unreal.", gig: "AI brand art system" },
        { author: "Tom B.", company: "Vector Games", rating: 5, when: "2026-09-04", text: "Genuinely operates like an art director, not a prompt jockey. Pushed back on our brief and made it better.", gig: "AI brand art system" },
        { author: "Aisha R.", company: "Moda Lane", rating: 4, when: "2026-07-19", text: "Beautiful output. Timeline slipped two days but he told us early and comped an extra revision round.", gig: "Editorial illustration pack" }
      ]
    },
    {
      id: "c03", name: "Priya Nair", handle: "@priyawrites", hue: 340,
      title: "SEO & Brand Copywriter",
      location: "Kochi, IN", timezone: "IST (UTC+5:30)",
      languages: ["English", "Malayalam", "Tamil"],
      rating: 4.9, reviews: 302, completedOrders: 517, responseMins: 18,
      memberSince: "2022-11", verified: true, online: true,
      priceLevel: 2, deliveryDays: 2, repeatClientRate: 0.78, onTimeRate: 0.99,
      categories: ["copy", "social"],
      tools: ["ChatGPT", "Claude", "Notion AI", "Google Analytics", "Jasper"],
      niches: ["saas", "health", "edtech"],
      bio: "Copy that ranks and reads like a human wrote it, because a human did. I use AI for research clustering and outline drafting, then write and edit every line myself. 500+ orders, 78% of them repeat clients.",
      portfolio: [
        { title: "SaaS blog engine", kind: "SEO", metric: "+212% traffic", hue: 340 },
        { title: "Landing page rewrite", kind: "Conversion", metric: "+41% signups", hue: 210 },
        { title: "Health series", kind: "Longform", metric: "24 articles", hue: 140 }
      ],
      reviewList: [
        { author: "Dan W.", company: "Ledgerly", rating: 5, when: "2026-09-29", text: "Nine articles, all ranking page one within six weeks. She researches properly, no AI filler.", gig: "SEO blog articles" },
        { author: "Neha S.", company: "Vitalis", rating: 5, when: "2026-09-11", text: "Handled a regulated health category with real compliance awareness. Rare.", gig: "SEO blog articles" },
        { author: "Farhan A.", company: "SkillForge", rating: 5, when: "2026-08-21", text: "Rewrote our whole landing page and signups jumped 41% in the first month.", gig: "Landing page copy" }
      ]
    },
    {
      id: "c04", name: "Arjun Reddy", handle: "@arjun.audio", hue: 28,
      title: "Multilingual AI Voice Director",
      location: "Hyderabad, IN", timezone: "IST (UTC+5:30)",
      languages: ["English", "Telugu", "Hindi", "Tamil"],
      rating: 4.7, reviews: 143, completedOrders: 268, responseMins: 55,
      memberSince: "2023-06", verified: true, online: false,
      priceLevel: 2, deliveryDays: 1, repeatClientRate: 0.55, onTimeRate: 0.97,
      categories: ["voice", "music"],
      tools: ["ElevenLabs", "Descript", "Suno", "Udio", "Premiere Pro"],
      niches: ["edtech", "d2c", "realestate"],
      bio: "Voice direction across four Indian languages plus English. I cast the right synthetic voice, direct the delivery for natural prosody, and mix to broadcast loudness standards so it never sounds like a text-to-speech demo.",
      portfolio: [
        { title: "EdTech course narration", kind: "Voiceover", metric: "42 hours", hue: 28 },
        { title: "Radio jingle package", kind: "Music", metric: "6 versions", hue: 200 },
        { title: "Retail IVR suite", kind: "Voice", metric: "4 languages", hue: 90 }
      ],
      reviewList: [
        { author: "Sruthi K.", company: "LearnLoop", rating: 5, when: "2026-09-20", text: "42 hours of narration in three languages, delivered early. Prosody direction made all the difference.", gig: "Multilingual AI voiceover" },
        { author: "Vikram T.", company: "HomeKart", rating: 4, when: "2026-08-15", text: "Good voice casting. Needed a re-take on one script but he handled it without charge.", gig: "Multilingual AI voiceover" }
      ]
    },
    {
      id: "c05", name: "Sofia Marin", handle: "@sofia.social", hue: 200,
      title: "Social Growth Strategist",
      location: "Barcelona, ES", timezone: "CET (UTC+1)",
      languages: ["English", "Spanish", "Catalan"],
      rating: 4.8, reviews: 189, completedOrders: 233, responseMins: 90,
      memberSince: "2023-02", verified: true, online: true,
      priceLevel: 3, deliveryDays: 4, repeatClientRate: 0.83, onTimeRate: 0.95,
      categories: ["social", "video"],
      tools: ["Buffer", "Canva", "CapCut", "ChatGPT", "Meta Ads Manager", "Google Analytics"],
      niches: ["food", "fashion", "d2c"],
      bio: "I run the whole content engine: strategy, calendar, production briefs, publishing and reporting. Clients hand me a product and a goal; they get back a system that compounds. Average retention on my monthly plans is eleven months.",
      portfolio: [
        { title: "Restaurant group relaunch", kind: "Strategy", metric: "+180% reach", hue: 200 },
        { title: "Fashion brand engine", kind: "Monthly", metric: "11 mo retainer", hue: 310 },
        { title: "D2C content system", kind: "Calendar", metric: "120 posts", hue: 160 }
      ],
      reviewList: [
        { author: "Lucia F.", company: "Casa Verde", rating: 5, when: "2026-09-27", text: "Took us from 2k to 34k followers in five months with actual booking conversions behind it.", gig: "Monthly social engine" },
        { author: "James O.", company: "Rue Nine", rating: 5, when: "2026-09-06", text: "The reporting alone is worth the retainer. She tells us what to stop doing, not just what worked.", gig: "Monthly social engine" }
      ]
    },
    {
      id: "c06", name: "Rahul Verma", handle: "@rahul.perf", hue: 120,
      title: "Performance Creative Specialist",
      location: "Delhi NCR, IN", timezone: "IST (UTC+5:30)",
      languages: ["English", "Hindi"],
      rating: 4.6, reviews: 128, completedOrders: 342, responseMins: 32,
      memberSince: "2023-08", verified: true, online: true,
      priceLevel: 1, deliveryDays: 2, repeatClientRate: 0.49, onTimeRate: 0.94,
      categories: ["ads", "aiart"],
      tools: ["Midjourney", "Figma", "Canva", "Meta Ads Manager", "ChatGPT", "Flux"],
      niches: ["d2c", "fintech", "edtech"],
      bio: "Volume creative for paid social. I produce test batches of 20-40 ad variants per week, tagged by hook type and visual angle, so your media buyer always has fresh inventory and clear learnings.",
      portfolio: [
        { title: "D2C ad batch", kind: "Static", metric: "40 variants", hue: 120 },
        { title: "Fintech motion ads", kind: "Motion", metric: "2.1x ROAS", hue: 240 },
        { title: "App install creative", kind: "Static", metric: "-34% CPI", hue: 12 }
      ],
      reviewList: [
        { author: "Nikhil G.", company: "BrewBox", rating: 5, when: "2026-09-22", text: "30 variants in three days, all tagged by angle. Our winning creative came from batch two.", gig: "Performance ad batch" },
        { author: "Aditi P.", company: "Credly", rating: 4, when: "2026-08-28", text: "Fast and cheap in the best way. Quality is solid for testing, escalate hero assets elsewhere.", gig: "Performance ad batch" }
      ]
    },
    {
      id: "c07", name: "Yuki Tanaka", handle: "@yuki.motion", hue: 285,
      title: "Motion Designer & AI VFX",
      location: "Tokyo, JP", timezone: "JST (UTC+9)",
      languages: ["English", "Japanese"],
      rating: 5.0, reviews: 96, completedOrders: 154, responseMins: 120,
      memberSince: "2023-03", verified: true, online: false,
      priceLevel: 3, deliveryDays: 5, repeatClientRate: 0.69, onTimeRate: 0.99,
      categories: ["video", "aiart", "music"],
      tools: ["After Effects", "Runway", "Kling", "Sora", "Cinema 4D", "Suno"],
      niches: ["gaming", "saas", "fashion"],
      bio: "High-end motion and generative VFX for launches and brand films. I combine traditional After Effects craft with AI plate generation, which cuts pre-production from weeks to days without losing authorial control.",
      portfolio: [
        { title: "Product launch film", kind: "Brand film", metric: "90 sec", hue: 285 },
        { title: "Game trailer VFX", kind: "VFX", metric: "3.4M views", hue: 10 },
        { title: "Fashion loop series", kind: "Loop", metric: "OOH screens", hue: 320 }
      ],
      reviewList: [
        { author: "Kenji S.", company: "Orbital Studios", rating: 5, when: "2026-09-30", text: "Broadcast-grade work. The AI plate generation saved us a location shoot entirely.", gig: "Brand motion film" },
        { author: "Elena V.", company: "Lumen", rating: 5, when: "2026-09-14", text: "Precise, calm, delivers exactly what was storyboarded. Worth the premium.", gig: "Brand motion film" }
      ]
    },
    {
      id: "c08", name: "Fatima Al-Sayed", handle: "@fatima.brand", hue: 12,
      title: "Brand Identity Designer",
      location: "Dubai, AE", timezone: "GST (UTC+4)",
      languages: ["English", "Arabic", "French"],
      rating: 4.9, reviews: 178, completedOrders: 246, responseMins: 70,
      memberSince: "2022-09", verified: true, online: true,
      priceLevel: 3, deliveryDays: 6, repeatClientRate: 0.64, onTimeRate: 0.97,
      categories: ["brand", "aiart"],
      tools: ["Figma", "Ideogram", "Midjourney", "After Effects"],
      niches: ["food", "realestate", "health"],
      bio: "Identity systems for MENA and South Asian markets, including bilingual Arabic-Latin logotypes. AI accelerates my exploration phase; typography, grid and colour decisions are still made by hand.",
      portfolio: [
        { title: "Bilingual logotype system", kind: "Identity", metric: "AR + EN", hue: 12 },
        { title: "Hospitality rebrand", kind: "Identity", metric: "Full book", hue: 45 },
        { title: "Wellness brand kit", kind: "Identity", metric: "42 pages", hue: 165 }
      ],
      reviewList: [
        { author: "Omar H.", company: "Saffron House", rating: 5, when: "2026-09-19", text: "The Arabic calligraphy integration was flawless. Very few designers get this right.", gig: "Full brand identity" },
        { author: "Claire D.", company: "Aster Clinic", rating: 5, when: "2026-08-25", text: "42-page brand book, delivered on time, and the team actually uses it.", gig: "Full brand identity" }
      ]
    },
    {
      id: "c09", name: "Vikram Singh", handle: "@vikram.avatar", hue: 210,
      title: "AI Avatar & UGC Producer",
      location: "Jaipur, IN", timezone: "IST (UTC+5:30)",
      languages: ["English", "Hindi", "Punjabi"],
      rating: 4.7, reviews: 112, completedOrders: 203, responseMins: 45,
      memberSince: "2024-01", verified: true, online: true,
      priceLevel: 2, deliveryDays: 2, repeatClientRate: 0.58, onTimeRate: 0.96,
      categories: ["avatar", "video", "ads"],
      tools: ["HeyGen", "D-ID", "ElevenLabs", "CapCut", "Runway"],
      niches: ["saas", "edtech", "d2c"],
      bio: "Synthetic spokesperson and UGC-style video at scale. One shoot, forty localised variants across languages and demographics. I handle consent, likeness rights and disclosure labelling so your legal team stays happy.",
      portfolio: [
        { title: "SaaS demo avatar", kind: "Avatar", metric: "12 languages", hue: 210 },
        { title: "UGC testimonial set", kind: "UGC", metric: "40 variants", hue: 340 },
        { title: "Course instructor clone", kind: "Avatar", metric: "Consent-cleared", hue: 95 }
      ],
      reviewList: [
        { author: "Harpreet K.", company: "Teachmint", rating: 5, when: "2026-09-24", text: "Localised our whole onboarding into 12 languages in a week. Lip sync is genuinely convincing.", gig: "AI avatar spokesperson" },
        { author: "Sneha R.", company: "FitMeal", rating: 4, when: "2026-08-12", text: "Strong output. One variant had a hand artefact, replaced within a day.", gig: "UGC testimonial pack" }
      ]
    },
    {
      id: "c10", name: "Lucas Ferreira", handle: "@lucas.yt", hue: 96,
      title: "YouTube Retention Editor",
      location: "Lisbon, PT", timezone: "WEST (UTC+1)",
      languages: ["English", "Portuguese", "Spanish"],
      rating: 4.8, reviews: 231, completedOrders: 402, responseMins: 60,
      memberSince: "2022-12", verified: true, online: false,
      priceLevel: 2, deliveryDays: 3, repeatClientRate: 0.74, onTimeRate: 0.98,
      categories: ["youtube", "video"],
      tools: ["Premiere Pro", "After Effects", "Descript", "Whisper", "ChatGPT"],
      niches: ["edtech", "saas", "gaming"],
      bio: "Long-form editing built around retention curves. I analyse your existing analytics, find where viewers drop, and restructure pacing, b-roll density and chapter placement to fix it. Three clients past one million subscribers.",
      portfolio: [
        { title: "Tech channel relaunch", kind: "Longform", metric: "AVD +62%", hue: 96 },
        { title: "Edu series edit", kind: "Longform", metric: "1.2M subs", hue: 210 },
        { title: "Gaming highlights", kind: "Compilation", metric: "8M views", hue: 30 }
      ],
      reviewList: [
        { author: "Marcus L.", company: "DeepDive Tech", rating: 5, when: "2026-09-28", text: "Average view duration went from 4:10 to 6:48 across eight videos. Data-driven, not vibes.", gig: "YouTube retention edit" },
        { author: "Ana P.", company: "Curso Livre", rating: 5, when: "2026-09-09", text: "Restructured our entire episode format. Subscribers grew faster than any prior quarter.", gig: "YouTube retention edit" },
        { author: "Ben T.", company: "Respawn", rating: 4, when: "2026-07-30", text: "Excellent editor. Communication is async and slow but the work speaks for itself.", gig: "Gaming highlights" }
      ]
    },
    {
      id: "c11", name: "Ishita Bose", handle: "@ishita.sound", hue: 250,
      title: "Sound Designer & AI Composer",
      location: "Kolkata, IN", timezone: "IST (UTC+5:30)",
      languages: ["English", "Hindi", "Bengali"],
      rating: 4.9, reviews: 87, completedOrders: 141, responseMins: 85,
      memberSince: "2023-09", verified: false, online: true,
      priceLevel: 2, deliveryDays: 3, repeatClientRate: 0.66, onTimeRate: 0.98,
      categories: ["music", "voice"],
      tools: ["Suno", "Udio", "Descript", "Premiere Pro", "ElevenLabs"],
      niches: ["gaming", "d2c", "ngo"],
      bio: "Original scores and sound design with clean commercial rights. I compose with AI stems, then re-arrange and mix in a DAW so you own something distinctive rather than a stock generation anyone else can produce.",
      portfolio: [
        { title: "Game soundtrack", kind: "Score", metric: "14 tracks", hue: 250 },
        { title: "Brand sonic identity", kind: "Jingle", metric: "3 sec sting", hue: 180 },
        { title: "Documentary score", kind: "Score", metric: "48 min", hue: 20 }
      ],
      reviewList: [
        { author: "Rohan D.", company: "Pixel Forge", rating: 5, when: "2026-09-16", text: "14 adaptive tracks with stems we could layer in-engine. Rights paperwork was spotless.", gig: "Original AI score" },
        { author: "Meghna C.", company: "Sewa Trust", rating: 5, when: "2026-08-08", text: "Understood the emotional register of a non-profit film without us over-explaining.", gig: "Documentary score" }
      ]
    },
    {
      id: "c12", name: "Noah Kim", handle: "@noah.content", hue: 178,
      title: "Content Ops & AI Workflow Architect",
      location: "Seoul, KR", timezone: "KST (UTC+9)",
      languages: ["English", "Korean"],
      rating: 4.7, reviews: 74, completedOrders: 118, responseMins: 110,
      memberSince: "2024-02", verified: true, online: true,
      priceLevel: 3, deliveryDays: 7, repeatClientRate: 0.81, onTimeRate: 0.95,
      categories: ["social", "copy"],
      tools: ["Notion AI", "ChatGPT", "Claude", "Buffer", "Google Analytics", "Figma"],
      niches: ["saas", "fintech", "edtech"],
      bio: "I do not just make content, I build the machine that makes it. Prompt libraries, review gates, asset taxonomies and publishing automation for teams that want AI output without AI chaos.",
      portfolio: [
        { title: "Enterprise prompt library", kind: "Ops", metric: "180 prompts", hue: 178 },
        { title: "Content pipeline build", kind: "Automation", metric: "5x throughput", hue: 260 },
        { title: "Brand safety gates", kind: "Policy", metric: "4 review tiers", hue: 40 }
      ],
      reviewList: [
        { author: "Grace Y.", company: "Fintra", rating: 5, when: "2026-09-21", text: "Our content throughput went 5x without adding headcount. The review gates were the key insight.", gig: "Content ops build" },
        { author: "Daniel K.", company: "Stackline", rating: 4, when: "2026-08-18", text: "Deep systems thinking. Needs a client who can commit to the process, not a quick fix.", gig: "Content ops build" }
      ]
    },
    {
      id: "c13", name: "Zara Khan", handle: "@zara.fashion", hue: 322,
      title: "Fashion & Beauty AI Visuals",
      location: "Mumbai, IN", timezone: "IST (UTC+5:30)",
      languages: ["English", "Hindi", "Urdu"],
      rating: 4.8, reviews: 156, completedOrders: 274, responseMins: 38,
      memberSince: "2023-05", verified: true, online: true,
      priceLevel: 2, deliveryDays: 2, repeatClientRate: 0.67, onTimeRate: 0.97,
      categories: ["aiart", "ads", "video"],
      tools: ["Midjourney", "Flux", "Stable Diffusion", "Figma", "Runway"],
      niches: ["fashion", "d2c", "food"],
      bio: "On-model fashion visuals without a shoot. I train on your actual garment photography so the AI render keeps fabric texture, drape and colour accurate enough for product pages, not just moodboards.",
      portfolio: [
        { title: "On-model SS26 lookbook", kind: "Fashion", metric: "36 looks", hue: 322 },
        { title: "Beauty macro campaign", kind: "Product", metric: "+29% CVR", hue: 350 },
        { title: "Ethnic wear festive", kind: "Fashion", metric: "24 assets", hue: 25 }
      ],
      reviewList: [
        { author: "Tanvi S.", company: "Drape Studio", rating: 5, when: "2026-09-26", text: "Fabric accuracy was the thing nobody else got right. Saved us an entire lookbook shoot.", gig: "AI fashion visuals" },
        { author: "Reema L.", company: "Petal Beauty", rating: 5, when: "2026-09-02", text: "Product page conversion up 29% after swapping to her renders.", gig: "AI fashion visuals" }
      ]
    },
    {
      id: "c14", name: "Ethan Brooks", handle: "@ethan.script", hue: 55,
      title: "Scriptwriter & Narrative Designer",
      location: "Manchester, UK", timezone: "GMT (UTC+0)",
      languages: ["English"],
      rating: 4.6, reviews: 103, completedOrders: 187, responseMins: 130,
      memberSince: "2023-07", verified: false, online: false,
      priceLevel: 2, deliveryDays: 3, repeatClientRate: 0.52, onTimeRate: 0.93,
      categories: ["copy", "youtube", "video"],
      tools: ["ChatGPT", "Claude", "Notion AI", "Descript"],
      niches: ["edtech", "gaming", "saas"],
      bio: "Scripts with actual structure. Hook, tension, payoff, retention beats timed to the second. I write for YouTube, brand films and interactive narrative, and I will tell you when your premise is the problem.",
      portfolio: [
        { title: "Docuseries scripts", kind: "Script", metric: "6 episodes", hue: 55 },
        { title: "YouTube essay series", kind: "Script", metric: "AVD 71%", hue: 200 },
        { title: "Game narrative bible", kind: "Narrative", metric: "90 pages", hue: 280 }
      ],
      reviewList: [
        { author: "Olivia N.", company: "Beacon Docs", rating: 5, when: "2026-09-13", text: "Six episode scripts, each with a real arc. He challenged our outline and improved it.", gig: "Long-form script" },
        { author: "Sam H.", company: "Quizly", rating: 4, when: "2026-08-05", text: "Strong writing. Slow to reply at weekends but deadlines were met.", gig: "YouTube script" }
      ]
    },
    {
      id: "c15", name: "Meera Iyer", handle: "@meera.edu", hue: 140,
      title: "EdTech Content Producer",
      location: "Chennai, IN", timezone: "IST (UTC+5:30)",
      languages: ["English", "Tamil", "Hindi"],
      rating: 4.9, reviews: 194, completedOrders: 328, responseMins: 28,
      memberSince: "2023-01", verified: true, online: true,
      priceLevel: 2, deliveryDays: 3, repeatClientRate: 0.76, onTimeRate: 0.99,
      categories: ["video", "copy", "avatar"],
      tools: ["HeyGen", "Canva", "Descript", "ChatGPT", "CapCut", "ElevenLabs"],
      niches: ["edtech", "health", "ngo"],
      bio: "Learning content that people actually finish. I design for cognitive load: chunked modules, consistent visual grammar, checks for understanding. Built course libraries for four platforms with over a million combined learners.",
      portfolio: [
        { title: "K-12 micro-modules", kind: "Course", metric: "120 videos", hue: 140 },
        { title: "Corporate LMS build", kind: "Course", metric: "18 hours", hue: 220 },
        { title: "Health literacy series", kind: "Explainer", metric: "1M learners", hue: 10 }
      ],
      reviewList: [
        { author: "Anand R.", company: "BrightPath", rating: 5, when: "2026-09-23", text: "Course completion went from 31% to 68%. She redesigned for cognitive load, not just looks.", gig: "Course module production" },
        { author: "Divya M.", company: "MedLearn", rating: 5, when: "2026-08-27", text: "Handled sensitive health content with real care and accuracy review.", gig: "Explainer video pack" }
      ]
    },
    {
      id: "c16", name: "Omar Haddad", handle: "@omar.realestate", hue: 195,
      title: "Real Estate Visual Specialist",
      location: "Toronto, CA", timezone: "EST (UTC-5)",
      languages: ["English", "French", "Arabic"],
      rating: 4.5, reviews: 68, completedOrders: 129, responseMins: 95,
      memberSince: "2024-03", verified: false, online: true,
      priceLevel: 1, deliveryDays: 2, repeatClientRate: 0.44, onTimeRate: 0.92,
      categories: ["aiart", "video", "avatar"],
      tools: ["Stable Diffusion", "Midjourney", "CapCut", "HeyGen", "Figma"],
      niches: ["realestate", "d2c"],
      bio: "Virtual staging, twilight renders and walkthrough videos for listings. Agents send me phone photos; they get back marketing-ready visuals in 48 hours at a fraction of a physical staging cost.",
      portfolio: [
        { title: "Luxury listing staging", kind: "Render", metric: "22 rooms", hue: 195 },
        { title: "Twilight exterior set", kind: "Render", metric: "Sold in 9 days", hue: 250 },
        { title: "Agent walkthrough", kind: "Video", metric: "Avatar-hosted", hue: 30 }
      ],
      reviewList: [
        { author: "Nadia B.", company: "Skyline Realty", rating: 5, when: "2026-09-15", text: "22 rooms staged in two days. Listing sold in nine. Obvious ROI for us.", gig: "Virtual staging pack" },
        { author: "Peter G.", company: "Homes First", rating: 4, when: "2026-08-01", text: "Good value. One render had a furniture scale issue, fixed quickly.", gig: "Virtual staging pack" }
      ]
    },
    {
      id: "c17", name: "Kavya Menon", handle: "@kavya.growth", hue: 8,
      title: "D2C Growth Content Lead",
      location: "Pune, IN", timezone: "IST (UTC+5:30)",
      languages: ["English", "Malayalam", "Hindi", "Marathi"],
      rating: 4.8, reviews: 141, completedOrders: 259, responseMins: 22,
      memberSince: "2023-10", verified: true, online: true,
      priceLevel: 2, deliveryDays: 2, repeatClientRate: 0.72, onTimeRate: 0.98,
      categories: ["ads", "video", "social", "copy"],
      tools: ["CapCut", "Meta Ads Manager", "ChatGPT", "Canva", "Google Analytics", "Runway"],
      niches: ["d2c", "food", "fashion"],
      bio: "Full-funnel D2C content: hook research, creative production, landing copy and post-launch analysis in one loop. I report on creative-level ROAS, not impressions, so every rupee of production spend is accountable.",
      portfolio: [
        { title: "Beverage launch funnel", kind: "Campaign", metric: "3.4x ROAS", hue: 8 },
        { title: "Skincare always-on", kind: "Monthly", metric: "-28% CPA", hue: 300 },
        { title: "Festive sale creative", kind: "Campaign", metric: "₹2.1Cr GMV", hue: 45 }
      ],
      reviewList: [
        { author: "Shreya A.", company: "Sip Society", rating: 5, when: "2026-09-29", text: "3.4x ROAS on a cold launch. Her hook research doc was worth the fee alone.", gig: "D2C launch campaign" },
        { author: "Kunal J.", company: "PureSkin", rating: 5, when: "2026-09-07", text: "Cut our CPA 28% while increasing spend. She kills losing creative fast.", gig: "Always-on creative" },
        { author: "Riya T.", company: "Nest & Co", rating: 4, when: "2026-07-22", text: "Very sharp strategically. Bandwidth fills up quickly so book ahead.", gig: "D2C launch campaign" }
      ]
    },
    {
      id: "c18", name: "Liam O'Connor", handle: "@liam.prompt", hue: 232,
      title: "Prompt Engineer & AI Trainer",
      location: "Dublin, IE", timezone: "GMT (UTC+0)",
      languages: ["English", "Irish"],
      rating: 4.7, reviews: 82, completedOrders: 136, responseMins: 65,
      memberSince: "2024-04", verified: true, online: false,
      priceLevel: 3, deliveryDays: 4, repeatClientRate: 0.77, onTimeRate: 0.96,
      categories: ["copy", "social", "aiart"],
      tools: ["ChatGPT", "Claude", "Gemini", "Midjourney", "Notion AI", "Whisper"],
      niches: ["saas", "fintech", "health"],
      bio: "I train your team to get reliable output from AI instead of lucky output. Custom prompt systems, evaluation rubrics, failure-mode catalogues and hands-on workshops. Regulated industries are my speciality.",
      portfolio: [
        { title: "Bank prompt governance", kind: "Training", metric: "340 staff", hue: 232 },
        { title: "Eval rubric system", kind: "QA", metric: "12 criteria", hue: 150 },
        { title: "Agency workshop", kind: "Training", metric: "4 sessions", hue: 20 }
      ],
      reviewList: [
        { author: "Siobhan D.", company: "Hibernia Bank", rating: 5, when: "2026-09-17", text: "Trained 340 staff with measurable output quality gains. The eval rubric is now our standard.", gig: "Team AI training" },
        { author: "Raj N.", company: "Clerkly", rating: 4, when: "2026-08-09", text: "Deep expertise. Workshop pacing was dense, ask for a follow-up session.", gig: "Team AI training" }
      ]
    }
  ];

  /* ---------- Gigs ---------- */
  const GIGS = [
    {
      id: "g01", creatorId: "c01", category: "video", trending: true, queue: 4, views: 8930, orders: 412, rating: 4.9, reviews: 128,
      title: "Produce scroll-stopping AI reels for your brand",
      tags: ["reels", "shorts", "hook", "captions", "b-roll", "ugc", "product-demo"],
      summary: "Vertical reels with generative b-roll, tested hooks and burned captions, delivered ready to post.",
      deliverables: ["9:16 master files (1080x1920)", "3 hook variants per reel", "Burned captions + clean SRT", "Trending audio selection", "Posting notes per platform"],
      packages: {
        basic: { name: "Starter", price: 4999, deliveryDays: 3, revisions: 1, units: "2 reels", includes: ["2 finished reels", "1 hook variant each", "Burned captions", "1 revision round"] },
        standard: { name: "Growth", price: 11999, deliveryDays: 5, revisions: 2, units: "5 reels", includes: ["5 finished reels", "3 hook variants each", "AI b-roll generation", "Caption + SRT files", "Trending audio curation", "2 revision rounds"] },
        premium: { name: "Scale", price: 24999, deliveryDays: 8, revisions: 4, units: "12 reels + strategy", includes: ["12 finished reels", "Content strategy doc", "Hook research report", "Full asset source files", "Thumbnail variants", "Priority queue", "4 revision rounds"] }
      },
      addons: [{ name: "24-hour rush", price: 3500, deliveryDays: 1 }, { name: "Extra reel", price: 2200, deliveryDays: 1 }, { name: "Horizontal 16:9 cutdown", price: 1200, deliveryDays: 1 }]
    },
    {
      id: "g02", creatorId: "c01", category: "youtube", trending: false, queue: 2, views: 3120, orders: 96, rating: 4.8, reviews: 41,
      title: "Edit your YouTube video for maximum retention",
      tags: ["youtube", "retention", "longform", "b-roll", "chapters", "analytics"],
      summary: "Analytics-driven long-form editing: restructured pacing, b-roll density and chapter placement.",
      deliverables: ["Edited master video", "Retention analysis report", "Chapter markers", "Thumbnail concepts (3)", "Cliffhanger end-screen cut"],
      packages: {
        basic: { name: "Short cut", price: 3999, deliveryDays: 3, revisions: 1, units: "Up to 8 min", includes: ["Edit up to 8 minutes", "Basic colour + audio", "Captions", "1 revision round"] },
        standard: { name: "Standard", price: 8999, deliveryDays: 5, revisions: 2, units: "Up to 20 min", includes: ["Edit up to 20 minutes", "Motion graphics + b-roll", "Retention restructure", "Chapters + thumbnails", "2 revision rounds"] },
        premium: { name: "Channel partner", price: 34999, deliveryDays: 14, revisions: 5, units: "4 videos / month", includes: ["4 videos per month", "Channel analytics review", "Format strategy session", "Dedicated Slack channel", "5 revision rounds"] }
      },
      addons: [{ name: "Reel cutdowns (3)", price: 2500, deliveryDays: 2 }, { name: "Custom motion intro", price: 4500, deliveryDays: 3 }]
    },
    {
      id: "g03", creatorId: "c02", category: "aiart", trending: true, queue: 6, views: 12400, orders: 231, rating: 4.9, reviews: 88,
      title: "Build a consistent AI art system for your brand",
      tags: ["brand-art", "midjourney", "prompt-system", "campaign", "consistency", "style-guide"],
      summary: "A reusable prompt and reference system so hundreds of generations stay visually on-brand.",
      deliverables: ["Brand style reference set", "Master prompt library", "Generation guidelines doc", "Asset batch (agreed count)", "Editable source prompts"],
      packages: {
        basic: { name: "Explore", price: 7999, deliveryDays: 4, revisions: 2, units: "10 assets", includes: ["10 curated assets", "Base prompt set", "Style direction board", "2 revision rounds"] },
        standard: { name: "System", price: 22999, deliveryDays: 8, revisions: 3, units: "30 assets + prompt system", includes: ["30 curated assets", "Full prompt library", "Style reference training set", "Usage guidelines", "3 revision rounds"] },
        premium: { name: "Studio", price: 54999, deliveryDays: 15, revisions: 5, units: "80 assets + team handoff", includes: ["80 curated assets", "Documented prompt system", "Team training call", "Quarterly refresh licence", "Source files + seeds", "5 revision rounds"] }
      },
      addons: [{ name: "Extra 10 assets", price: 5500, deliveryDays: 2 }, { name: "Team training call", price: 8000, deliveryDays: 3 }, { name: "Animated asset set", price: 14000, deliveryDays: 5 }]
    },
    {
      id: "g04", creatorId: "c02", category: "aiart", trending: false, queue: 3, views: 4210, orders: 74, rating: 4.7, reviews: 29,
      title: "Create editorial illustration for your article or deck",
      tags: ["illustration", "editorial", "blog", "deck", "concept-art"],
      summary: "Bespoke illustrations that match a publication's existing visual tone.",
      deliverables: ["High-res PNG + SVG where applicable", "Two size crops", "Colour variants", "Usage licence"],
      packages: {
        basic: { name: "Single", price: 2499, deliveryDays: 2, revisions: 1, units: "1 illustration", includes: ["1 illustration", "Web + print resolution", "1 revision"] },
        standard: { name: "Set of 4", price: 8499, deliveryDays: 5, revisions: 2, units: "4 illustrations", includes: ["4 cohesive illustrations", "Shared style reference", "Multiple crops", "2 revisions"] },
        premium: { name: "Series of 10", price: 18999, deliveryDays: 10, revisions: 3, units: "10 illustrations", includes: ["10 illustrations", "Full style guide", "Source files", "Extended licence", "3 revisions"] }
      },
      addons: [{ name: "Rush 24h", price: 1800, deliveryDays: 1 }, { name: "Animated loop", price: 3200, deliveryDays: 2 }]
    },
    {
      id: "g05", creatorId: "c03", category: "copy", trending: true, queue: 5, views: 15200, orders: 389, rating: 4.9, reviews: 176,
      title: "Write SEO blog articles that actually rank",
      tags: ["seo", "blog", "longform", "keyword-research", "content-marketing"],
      summary: "Researched, human-written longform optimised for search intent and internal linking.",
      deliverables: ["Keyword + intent research", "Article in Google Docs/Notion", "Meta title & description", "Internal link suggestions", "Schema markup snippet"],
      packages: {
        basic: { name: "1 article", price: 2999, deliveryDays: 3, revisions: 1, units: "1200 words", includes: ["1 article up to 1200 words", "Keyword research", "Meta tags", "1 revision"] },
        standard: { name: "4 articles", price: 10499, deliveryDays: 8, revisions: 2, units: "4 x 1500 words", includes: ["4 articles up to 1500 words", "Topic cluster strategy", "Internal linking map", "Meta tags each", "2 revisions"] },
        premium: { name: "12 article engine", price: 27999, deliveryDays: 20, revisions: 3, units: "12 x 1800 words", includes: ["12 articles up to 1800 words", "Full content calendar", "Competitor gap analysis", "CMS upload", "Performance review at day 30", "3 revisions"] }
      },
      addons: [{ name: "CMS upload + formatting", price: 800, deliveryDays: 1 }, { name: "Extra article", price: 2600, deliveryDays: 2 }, { name: "Social promotion copy", price: 1400, deliveryDays: 1 }]
    },
    {
      id: "g06", creatorId: "c03", category: "copy", trending: false, queue: 2, views: 6780, orders: 143, rating: 4.8, reviews: 62,
      title: "Rewrite your landing page for higher conversion",
      tags: ["landing-page", "conversion", "copywriting", "saas", "ab-test"],
      summary: "Conversion-focused rewrite with a message-match framework and A/B variants.",
      deliverables: ["Full page copy doc", "Headline variants (10)", "A/B test plan", "Objection-handling FAQ", "CTA copy matrix"],
      packages: {
        basic: { name: "Hero refresh", price: 3999, deliveryDays: 3, revisions: 1, units: "Above the fold", includes: ["Hero + first section rewrite", "10 headline variants", "CTA options", "1 revision"] },
        standard: { name: "Full page", price: 12999, deliveryDays: 6, revisions: 2, units: "Whole landing page", includes: ["Complete page copy", "Message-match audit", "Objection FAQ", "A/B test plan", "2 revisions"] },
        premium: { name: "Funnel", price: 29999, deliveryDays: 12, revisions: 3, units: "Landing + 5 emails", includes: ["Landing page copy", "5-email nurture sequence", "Ad copy variants", "Analytics event spec", "30-day performance review", "3 revisions"] }
      },
      addons: [{ name: "Competitor teardown", price: 4500, deliveryDays: 2 }, { name: "Stakeholder workshop", price: 9000, deliveryDays: 3 }]
    },
    {
      id: "g07", creatorId: "c04", category: "voice", trending: false, queue: 3, views: 5340, orders: 187, rating: 4.7, reviews: 71,
      title: "Deliver multilingual AI voiceover with real direction",
      tags: ["voiceover", "multilingual", "dubbing", "hindi", "telugu", "tamil", "elearning"],
      summary: "Directed synthetic voice in four Indian languages plus English, mixed to broadcast loudness.",
      deliverables: ["WAV + MP3 masters", "Broadcast loudness mix (-16 LUFS)", "Timed script with cues", "Alternate takes", "Commercial usage licence"],
      packages: {
        basic: { name: "Up to 2 min", price: 1999, deliveryDays: 2, revisions: 1, units: "1 language", includes: ["Up to 2 minutes", "1 language", "WAV + MP3", "1 revision"] },
        standard: { name: "Up to 10 min", price: 6499, deliveryDays: 3, revisions: 2, units: "2 languages", includes: ["Up to 10 minutes", "2 languages", "Loudness mastering", "Timed script", "2 revisions"] },
        premium: { name: "Course pack", price: 18999, deliveryDays: 7, revisions: 3, units: "Up to 60 min, 4 languages", includes: ["Up to 60 minutes", "4 languages", "Character voices", "Chapter splitting", "Full rights transfer", "3 revisions"] }
      },
      addons: [{ name: "Extra language", price: 3200, deliveryDays: 1 }, { name: "24h rush", price: 1500, deliveryDays: 1 }]
    },
    {
      id: "g08", creatorId: "c05", category: "social", trending: true, queue: 8, views: 9870, orders: 156, rating: 4.8, reviews: 94,
      title: "Run your entire monthly social content engine",
      tags: ["social-media", "calendar", "strategy", "community", "reporting", "retainer"],
      summary: "Strategy, calendar, production briefs, publishing and reporting handled end to end.",
      deliverables: ["Monthly content calendar", "Produced assets", "Publishing + community replies", "Performance report", "Next-month recommendations"],
      packages: {
        basic: { name: "1 platform", price: 34999, deliveryDays: 7, revisions: 2, units: "12 posts / month", includes: ["12 posts per month", "1 platform", "Calendar + captions", "Monthly report"] },
        standard: { name: "3 platforms", price: 74999, deliveryDays: 7, revisions: 3, units: "30 posts / month", includes: ["30 posts per month", "3 platforms", "Short-form video (6)", "Community management", "Monthly strategy call"] },
        premium: { name: "Full stack", price: 149999, deliveryDays: 7, revisions: 4, units: "60 posts / month", includes: ["60 posts per month", "All platforms", "Paid creative support", "Influencer coordination", "Weekly reporting", "Dedicated Slack"] }
      },
      addons: [{ name: "Paid ads management", price: 25000, deliveryDays: 3 }, { name: "Influencer outreach", price: 18000, deliveryDays: 5 }]
    },
    {
      id: "g09", creatorId: "c06", category: "ads", trending: true, queue: 7, views: 11300, orders: 298, rating: 4.6, reviews: 104,
      title: "Produce a test batch of performance ad creatives",
      tags: ["ads", "creative-testing", "meta", "roas", "variants", "static", "motion"],
      summary: "20-40 tagged ad variants per week so your media buyer always has fresh inventory.",
      deliverables: ["Static + motion variants", "Hook/angle tagging sheet", "Platform-sized exports", "Test plan recommendation"],
      packages: {
        basic: { name: "10 statics", price: 3999, deliveryDays: 2, revisions: 1, units: "10 creatives", includes: ["10 static creatives", "3 platform sizes", "Angle tags", "1 revision"] },
        standard: { name: "25 mixed", price: 9499, deliveryDays: 4, revisions: 2, units: "25 creatives", includes: ["18 static + 7 motion", "All platform sizes", "Hook tagging sheet", "Test plan", "2 revisions"] },
        premium: { name: "50 scale batch", price: 17999, deliveryDays: 7, revisions: 3, units: "50 creatives", includes: ["50 mixed creatives", "Copy variants per creative", "Full test matrix", "Weekly refresh cadence", "3 revisions"] }
      },
      addons: [{ name: "Extra 10 statics", price: 2800, deliveryDays: 1 }, { name: "Motion upgrade (5)", price: 4500, deliveryDays: 2 }]
    },
    {
      id: "g10", creatorId: "c07", category: "video", trending: true, queue: 5, views: 14700, orders: 121, rating: 5.0, reviews: 58,
      title: "Direct a broadcast-grade AI brand film",
      tags: ["brand-film", "motion", "vfx", "launch", "cinematic", "after-effects"],
      summary: "Generative plates plus traditional motion craft for launches and brand films.",
      deliverables: ["Master film (agreed runtime)", "Storyboard + animatic", "AI plate sources", "Sound design mix", "Social cutdowns"],
      packages: {
        basic: { name: "15 sec", price: 44999, deliveryDays: 8, revisions: 2, units: "15 second film", includes: ["15 second film", "Storyboard", "Sound design", "2 revisions"] },
        standard: { name: "45 sec", price: 119999, deliveryDays: 14, revisions: 3, units: "45 second film", includes: ["45 second film", "Animatic approval stage", "Original score", "3 social cutdowns", "3 revisions"] },
        premium: { name: "90 sec launch", price: 249999, deliveryDays: 24, revisions: 5, units: "90 second film", includes: ["90 second film", "Full pre-production", "Original score + mix", "Vertical + horizontal masters", "On-set direction call", "5 revisions"] }
      },
      addons: [{ name: "Extra cutdown", price: 12000, deliveryDays: 3 }, { name: "Rush timeline", price: 35000, deliveryDays: 0 }]
    },
    {
      id: "g11", creatorId: "c08", category: "brand", trending: false, queue: 4, views: 7620, orders: 134, rating: 4.9, reviews: 77,
      title: "Design a complete bilingual brand identity",
      tags: ["logo", "identity", "brand-book", "arabic", "typography", "rebrand"],
      summary: "Identity systems including Arabic-Latin logotypes, grids, palette and a full brand book.",
      deliverables: ["Primary + secondary logos", "Colour + type system", "Brand book (PDF)", "Source files (AI/Figma)", "Social avatar + banner kit"],
      packages: {
        basic: { name: "Logo only", price: 14999, deliveryDays: 5, revisions: 2, units: "1 logo system", includes: ["Primary logo + 2 alternates", "Colour palette", "Source files", "2 revisions"] },
        standard: { name: "Identity", price: 44999, deliveryDays: 12, revisions: 3, units: "Full identity", includes: ["Logo system", "Typography + colour", "20-page brand book", "Stationery + social kit", "3 revisions"] },
        premium: { name: "Bilingual system", price: 94999, deliveryDays: 20, revisions: 4, units: "AR + EN identity", includes: ["Arabic-Latin logotype pair", "Complete identity system", "48-page brand book", "Motion logo", "Packaging direction", "4 revisions"] }
      },
      addons: [{ name: "Packaging design", price: 22000, deliveryDays: 6 }, { name: "Motion logo", price: 12000, deliveryDays: 4 }]
    },
    {
      id: "g12", creatorId: "c09", category: "avatar", trending: true, queue: 6, views: 10200, orders: 178, rating: 4.7, reviews: 69,
      title: "Create an AI avatar spokesperson for your product",
      tags: ["avatar", "spokesperson", "heygen", "localisation", "ugc", "demo"],
      summary: "A synthetic presenter, consent-cleared, localised across languages and demographics.",
      deliverables: ["Avatar master video", "Localised language variants", "Consent + rights documentation", "Disclosure labels", "Source scripts"],
      packages: {
        basic: { name: "Single video", price: 5999, deliveryDays: 3, revisions: 1, units: "1 language, 60 sec", includes: ["60 second avatar video", "1 language", "Stock presenter", "Disclosure label"] },
        standard: { name: "Localised set", price: 16999, deliveryDays: 6, revisions: 2, units: "5 languages", includes: ["60 second master", "5 language variants", "Custom presenter build", "Rights documentation", "2 revisions"] },
        premium: { name: "UGC campaign", price: 39999, deliveryDays: 10, revisions: 3, units: "12 videos", includes: ["12 UGC-style videos", "6 presenter personas", "8 languages", "Full consent pack", "Ad-ready exports", "3 revisions"] }
      },
      addons: [{ name: "Extra language", price: 2800, deliveryDays: 1 }, { name: "Custom presenter build", price: 9000, deliveryDays: 4 }]
    },
    {
      id: "g13", creatorId: "c10", category: "youtube", trending: false, queue: 3, views: 8340, orders: 212, rating: 4.8, reviews: 96,
      title: "Restructure your YouTube format around retention data",
      tags: ["retention", "analytics", "youtube", "format", "pacing", "growth"],
      summary: "A data-led format rebuild: drop-off analysis, pacing map and eight edited videos.",
      deliverables: ["Retention audit report", "New format spec", "8 edited videos", "Thumbnail system", "Title testing plan"],
      packages: {
        basic: { name: "Audit", price: 9999, deliveryDays: 5, revisions: 1, units: "Report only", includes: ["Channel retention audit", "Drop-off analysis", "Recommendation doc", "1 strategy call"] },
        standard: { name: "Rebuild", price: 34999, deliveryDays: 14, revisions: 2, units: "Audit + 4 videos", includes: ["Full audit", "New format spec", "4 edited videos", "Thumbnail system", "2 revisions"] },
        premium: { name: "Growth partner", price: 89999, deliveryDays: 30, revisions: 4, units: "Audit + 8 videos", includes: ["Full audit + rebuild", "8 edited videos", "A/B title testing", "Monthly analytics review", "Dedicated Slack", "4 revisions"] }
      },
      addons: [{ name: "Extra video", price: 7500, deliveryDays: 4 }, { name: "Thumbnail pack (10)", price: 5500, deliveryDays: 2 }]
    },
    {
      id: "g14", creatorId: "c11", category: "music", trending: false, queue: 2, views: 4980, orders: 88, rating: 4.9, reviews: 44,
      title: "Compose an original AI score with clean rights",
      tags: ["music", "score", "soundtrack", "jingle", "sonic-branding", "stems"],
      summary: "Original composition using AI stems, re-arranged and mixed so you own something distinctive.",
      deliverables: ["Full mix master", "Individual stems", "Loopable versions", "Rights transfer document", "30/60 sec edits"],
      packages: {
        basic: { name: "Single track", price: 6999, deliveryDays: 4, revisions: 2, units: "1 track up to 3 min", includes: ["1 original track", "Full mix + stems", "30 sec edit", "2 revisions"] },
        standard: { name: "EP pack", price: 19999, deliveryDays: 9, revisions: 3, units: "4 tracks", includes: ["4 original tracks", "Stems for each", "Loop versions", "Rights transfer", "3 revisions"] },
        premium: { name: "Sonic identity", price: 54999, deliveryDays: 18, revisions: 4, units: "Full audio brand", includes: ["8 tracks + 3 sec sting", "Adaptive game-ready layers", "Audio brand guidelines", "Full buyout rights", "4 revisions"] }
      },
      addons: [{ name: "Extra track", price: 5500, deliveryDays: 3 }, { name: "Sound design pass", price: 8000, deliveryDays: 3 }]
    },
    {
      id: "g15", creatorId: "c12", category: "social", trending: false, queue: 3, views: 3870, orders: 62, rating: 4.7, reviews: 31,
      title: "Build your team's AI content operations pipeline",
      tags: ["content-ops", "prompt-library", "automation", "workflow", "governance"],
      summary: "Prompt libraries, review gates, asset taxonomy and publishing automation for teams.",
      deliverables: ["Content ops playbook", "Prompt library", "Review gate definitions", "Asset taxonomy", "Automation setup doc"],
      packages: {
        basic: { name: "Audit", price: 24999, deliveryDays: 7, revisions: 1, units: "Assessment", includes: ["Current-state audit", "Opportunity map", "Tooling recommendation", "1 workshop"] },
        standard: { name: "Build", price: 74999, deliveryDays: 21, revisions: 2, units: "Full pipeline", includes: ["Prompt library (100+)", "Review gates", "Asset taxonomy", "Automation setup", "Team onboarding"] },
        premium: { name: "Build + embed", price: 174999, deliveryDays: 45, revisions: 3, units: "Pipeline + 3 months support", includes: ["Everything in Build", "3 months embedded support", "Eval rubrics", "Quarterly optimisation", "Leadership reporting pack"] }
      },
      addons: [{ name: "Extra workshop", price: 15000, deliveryDays: 2 }, { name: "Eval rubric set", price: 22000, deliveryDays: 5 }]
    },
    {
      id: "g16", creatorId: "c13", category: "aiart", trending: true, queue: 5, views: 9430, orders: 167, rating: 4.8, reviews: 73,
      title: "Generate on-model fashion visuals from your garment photos",
      tags: ["fashion", "lookbook", "product", "on-model", "e-commerce", "virtual-photoshoot"],
      summary: "AI renders trained on your real garments so fabric, drape and colour stay accurate.",
      deliverables: ["On-model image set", "E-commerce white background cuts", "Lifestyle scene variants", "Retouched masters", "Usage licence"],
      packages: {
        basic: { name: "5 looks", price: 8999, deliveryDays: 4, revisions: 2, units: "5 outfits", includes: ["5 on-model looks", "1 scene each", "Web resolution", "2 revisions"] },
        standard: { name: "15 looks", price: 22999, deliveryDays: 8, revisions: 3, units: "15 outfits", includes: ["15 on-model looks", "2 scenes each", "White background cuts", "Retouched masters", "3 revisions"] },
        premium: { name: "Full lookbook", price: 54999, deliveryDays: 15, revisions: 4, units: "40 outfits", includes: ["40 on-model looks", "Art-directed campaign set", "Print resolution", "Model consistency across set", "Extended licence", "4 revisions"] }
      },
      addons: [{ name: "Extra 5 looks", price: 7000, deliveryDays: 2 }, { name: "Motion lookbook video", price: 16000, deliveryDays: 5 }]
    },
    {
      id: "g17", creatorId: "c14", category: "copy", trending: false, queue: 2, views: 4120, orders: 79, rating: 4.6, reviews: 38,
      title: "Write a long-form script with real narrative structure",
      tags: ["script", "youtube", "documentary", "storytelling", "narrative"],
      summary: "Scripts with hook, tension and payoff, timed to the second for retention.",
      deliverables: ["Full script with timecodes", "Beat sheet", "Hook alternatives (5)", "B-roll direction notes", "Title + thumbnail concepts"],
      packages: {
        basic: { name: "Short script", price: 4999, deliveryDays: 3, revisions: 2, units: "Up to 8 min", includes: ["Script up to 8 minutes", "Beat sheet", "3 hook options", "2 revisions"] },
        standard: { name: "Feature script", price: 13999, deliveryDays: 7, revisions: 3, units: "Up to 25 min", includes: ["Script up to 25 minutes", "Timecoded beats", "B-roll direction", "5 hook options", "3 revisions"] },
        premium: { name: "Series bible", price: 39999, deliveryDays: 18, revisions: 4, units: "6 episode scripts", includes: ["6 episode scripts", "Series narrative arc", "Character/format bible", "Production notes", "4 revisions"] }
      },
      addons: [{ name: "Extra episode", price: 6500, deliveryDays: 3 }, { name: "Table read recording", price: 3500, deliveryDays: 1 }]
    },
    {
      id: "g18", creatorId: "c15", category: "video", trending: true, queue: 4, views: 7890, orders: 143, rating: 4.9, reviews: 82,
      title: "Produce course modules designed for completion",
      tags: ["elearning", "course", "edtech", "modules", "instructional-design", "avatar"],
      summary: "Chunked learning modules with consistent visual grammar and checks for understanding.",
      deliverables: ["Module videos", "Lesson scripts", "Knowledge checks", "Visual asset pack", "LMS-ready exports"],
      packages: {
        basic: { name: "5 micro-lessons", price: 14999, deliveryDays: 7, revisions: 2, units: "5 x 3 min", includes: ["5 micro-lessons", "Scripts + visuals", "Knowledge checks", "2 revisions"] },
        standard: { name: "Full module", price: 44999, deliveryDays: 16, revisions: 3, units: "12 lessons", includes: ["12 lessons", "Instructional design doc", "Assessment bank", "LMS-ready SCORM", "3 revisions"] },
        premium: { name: "Course library", price: 129999, deliveryDays: 40, revisions: 4, units: "40 lessons", includes: ["40 lessons across 4 modules", "Learner journey map", "Full assessment system", "Avatar presenter build", "Analytics spec", "4 revisions"] }
      },
      addons: [{ name: "Extra lesson", price: 3200, deliveryDays: 2 }, { name: "Multilingual dubbing", price: 18000, deliveryDays: 6 }]
    },
    {
      id: "g19", creatorId: "c16", category: "aiart", trending: false, queue: 2, views: 3240, orders: 91, rating: 4.5, reviews: 34,
      title: "Virtually stage your property listing in 48 hours",
      tags: ["real-estate", "virtual-staging", "render", "listing", "twilight"],
      summary: "Phone photos in, marketing-ready staged visuals out, at a fraction of physical staging cost.",
      deliverables: ["Staged high-res images", "Twilight exterior variants", "Before/after comparison set", "MLS-ready sizing"],
      packages: {
        basic: { name: "5 rooms", price: 4999, deliveryDays: 2, revisions: 1, units: "5 images", includes: ["5 staged rooms", "Daylight lighting", "MLS sizing", "1 revision"] },
        standard: { name: "12 rooms", price: 10999, deliveryDays: 3, revisions: 2, units: "12 images", includes: ["12 staged rooms", "2 twilight exteriors", "Before/after set", "2 revisions"] },
        premium: { name: "Full listing kit", price: 22999, deliveryDays: 5, revisions: 3, units: "25 images + video", includes: ["25 staged images", "Twilight set", "Walkthrough video", "Floor plan render", "Agent social pack", "3 revisions"] }
      },
      addons: [{ name: "Extra 5 rooms", price: 3800, deliveryDays: 1 }, { name: "Lawn/sky replacement", price: 2200, deliveryDays: 1 }]
    },
    {
      id: "g20", creatorId: "c17", category: "ads", trending: true, queue: 6, views: 8760, orders: 152, rating: 4.8, reviews: 67,
      title: "Launch a full-funnel D2C campaign with creative-level ROAS",
      tags: ["d2c", "campaign", "roas", "funnel", "meta-ads", "growth", "hook-research"],
      summary: "Hook research, creative production, landing copy and post-launch analysis in one loop.",
      deliverables: ["Hook research report", "Creative batch", "Landing page copy", "Media plan", "Creative-level ROAS dashboard"],
      packages: {
        basic: { name: "Creative sprint", price: 19999, deliveryDays: 7, revisions: 2, units: "15 creatives", includes: ["Hook research", "15 creatives", "Copy variants", "2 revisions"] },
        standard: { name: "Launch", price: 54999, deliveryDays: 14, revisions: 3, units: "40 creatives + plan", includes: ["40 creatives", "Landing page copy", "Media plan", "Audience structure", "Launch support", "3 revisions"] },
        premium: { name: "Growth partner", price: 124999, deliveryDays: 30, revisions: 4, units: "Monthly retainer", includes: ["Unlimited creative refresh", "Weekly ROAS review", "Landing page CRO", "Creative-level attribution", "Dedicated Slack", "4 revisions"] }
      },
      addons: [{ name: "Influencer seeding plan", price: 15000, deliveryDays: 4 }, { name: "Email flow build", price: 22000, deliveryDays: 6 }]
    },
    {
      id: "g21", creatorId: "c18", category: "copy", trending: false, queue: 3, views: 5430, orders: 71, rating: 4.7, reviews: 36,
      title: "Train your team to get reliable AI output",
      tags: ["training", "prompt-engineering", "workshop", "governance", "evaluation"],
      summary: "Custom prompt systems, evaluation rubrics and hands-on workshops for regulated teams.",
      deliverables: ["Custom prompt system", "Evaluation rubric", "Failure-mode catalogue", "Workshop recording", "Reference handbook"],
      packages: {
        basic: { name: "Half-day workshop", price: 34999, deliveryDays: 5, revisions: 1, units: "Up to 20 people", includes: ["4-hour live workshop", "Prompt starter pack", "Recording", "Handout"] },
        standard: { name: "Team programme", price: 94999, deliveryDays: 14, revisions: 2, units: "Up to 100 people", includes: ["4 sessions", "Custom prompt library", "Eval rubric", "Role-specific tracks", "Handbook"] },
        premium: { name: "Enterprise governance", price: 249999, deliveryDays: 35, revisions: 3, units: "Unlimited seats", includes: ["Full programme", "Governance framework", "Failure-mode catalogue", "Compliance review pack", "3 months support", "Certification track"] }
      },
      addons: [{ name: "Extra session", price: 28000, deliveryDays: 2 }, { name: "Exec briefing", price: 45000, deliveryDays: 3 }]
    },
    {
      id: "g22", creatorId: "c05", category: "video", trending: false, queue: 4, views: 6120, orders: 84, rating: 4.7, reviews: 39,
      title: "Turn one idea into a week of short-form content",
      tags: ["repurposing", "reels", "shorts", "batch", "social"],
      summary: "Batch production that multiplies one long asset into a week of vertical content.",
      deliverables: ["7 vertical clips", "Hook + caption set", "Cover frames", "Posting schedule"],
      packages: {
        basic: { name: "3 clips", price: 6999, deliveryDays: 3, revisions: 1, units: "3 clips", includes: ["3 vertical clips", "Captions", "1 revision"] },
        standard: { name: "7 clips", price: 14999, deliveryDays: 5, revisions: 2, units: "7 clips", includes: ["7 vertical clips", "Hook variants", "Cover frames", "Posting schedule", "2 revisions"] },
        premium: { name: "14 clips + calendar", price: 27999, deliveryDays: 9, revisions: 3, units: "14 clips", includes: ["14 vertical clips", "Full month calendar", "Trend research", "Platform-native variants", "3 revisions"] }
      },
      addons: [{ name: "Extra clip", price: 2400, deliveryDays: 1 }]
    },
    {
      id: "g23", creatorId: "c09", category: "ads", trending: false, queue: 3, views: 4560, orders: 97, rating: 4.6, reviews: 42,
      title: "Produce a UGC-style testimonial pack for paid social",
      tags: ["ugc", "testimonial", "ads", "social-proof", "variants"],
      summary: "Synthetic UGC testimonials across personas, labelled and rights-cleared.",
      deliverables: ["UGC-style videos", "Persona sheet", "Disclosure labels", "Ad-ready crops", "Rights documentation"],
      packages: {
        basic: { name: "4 videos", price: 9999, deliveryDays: 4, revisions: 1, units: "4 videos", includes: ["4 UGC videos", "2 personas", "Disclosure labels", "1 revision"] },
        standard: { name: "10 videos", price: 21999, deliveryDays: 7, revisions: 2, units: "10 videos", includes: ["10 UGC videos", "5 personas", "Objection-based scripts", "All ad crops", "2 revisions"] },
        premium: { name: "24 video library", price: 47999, deliveryDays: 14, revisions: 3, units: "24 videos", includes: ["24 UGC videos", "10 personas", "Funnel-stage scripts", "Localisation to 6 languages", "Rights pack", "3 revisions"] }
      },
      addons: [{ name: "Extra persona", price: 4500, deliveryDays: 2 }, { name: "Script strategy call", price: 6000, deliveryDays: 1 }]
    },
    {
      id: "g24", creatorId: "c13", category: "ads", trending: false, queue: 4, views: 5230, orders: 88, rating: 4.7, reviews: 37,
      title: "Design product ad creatives that stop the scroll",
      tags: ["product-ads", "static", "e-commerce", "creative", "meta"],
      summary: "Static ad creatives with product-accurate AI renders and tested layout patterns.",
      deliverables: ["Ad creative set", "Multiple aspect ratios", "Copy overlay variants", "Source files"],
      packages: {
        basic: { name: "8 creatives", price: 5999, deliveryDays: 3, revisions: 2, units: "8 creatives", includes: ["8 static creatives", "3 aspect ratios", "1 revision set"] },
        standard: { name: "20 creatives", price: 13999, deliveryDays: 6, revisions: 3, units: "20 creatives", includes: ["20 static creatives", "All placements", "Copy overlay variants", "Source files", "3 revisions"] },
        premium: { name: "45 + motion", price: 32999, deliveryDays: 12, revisions: 4, units: "45 static + 10 motion", includes: ["45 statics + 10 motion", "Full placement matrix", "Seasonal variants", "Brand template handoff", "4 revisions"] }
      },
      addons: [{ name: "Motion upgrade (5)", price: 6500, deliveryDays: 2 }]
    },
    {
      id: "g25", creatorId: "c15", category: "avatar", trending: false, queue: 2, views: 3980, orders: 64, rating: 4.8, reviews: 28,
      title: "Build a consent-cleared AI instructor for your course",
      tags: ["avatar", "instructor", "course", "elearning", "localisation"],
      summary: "A persistent synthetic instructor that keeps visual identity across a whole course.",
      deliverables: ["Instructor avatar build", "Style guide", "Sample lessons", "Consent documentation", "Regeneration prompts"],
      packages: {
        basic: { name: "Avatar build", price: 18999, deliveryDays: 6, revisions: 2, units: "1 presenter", includes: ["Custom presenter build", "3 sample clips", "Style guide", "Consent docs"] },
        standard: { name: "Build + 10 lessons", price: 54999, deliveryDays: 16, revisions: 3, units: "10 lessons", includes: ["Presenter build", "10 produced lessons", "Script writing", "Slides + b-roll", "3 revisions"] },
        premium: { name: "Full course", price: 139999, deliveryDays: 35, revisions: 4, units: "30 lessons", includes: ["30 lessons", "Multilingual variants (4)", "Assessment integration", "LMS packaging", "Regeneration licence", "4 revisions"] }
      },
      addons: [{ name: "Extra lesson", price: 4800, deliveryDays: 2 }, { name: "Extra language", price: 24000, deliveryDays: 8 }]
    },
    {
      id: "g26", creatorId: "c06", category: "aiart", trending: false, queue: 5, views: 4670, orders: 103, rating: 4.5, reviews: 31,
      title: "Generate a month of social visuals in one batch",
      tags: ["social", "batch", "visuals", "canva", "template"],
      summary: "30 template-based social visuals produced in a single efficient batch.",
      deliverables: ["30 social visuals", "Editable templates", "Caption suggestions", "Size variants"],
      packages: {
        basic: { name: "10 visuals", price: 2999, deliveryDays: 2, revisions: 1, units: "10 visuals", includes: ["10 visuals", "2 sizes", "Captions"] },
        standard: { name: "30 visuals", price: 7499, deliveryDays: 5, revisions: 2, units: "30 visuals", includes: ["30 visuals", "Editable templates", "All sizes", "Caption set", "2 revisions"] },
        premium: { name: "90 + system", price: 17999, deliveryDays: 12, revisions: 3, units: "90 visuals", includes: ["90 visuals (3 months)", "Template system handoff", "Brand guidelines", "Team training", "3 revisions"] }
      },
      addons: [{ name: "Extra 10 visuals", price: 2400, deliveryDays: 1 }]
    },
    {
      id: "g27", creatorId: "c17", category: "social", trending: false, queue: 3, views: 5890, orders: 76, rating: 4.8, reviews: 33,
      title: "Audit and fix your underperforming content funnel",
      tags: ["audit", "funnel", "cro", "analytics", "d2c", "strategy"],
      summary: "A diagnostic pass across creative, landing and email with a prioritised fix list.",
      deliverables: ["Funnel diagnostic report", "Prioritised fix backlog", "Creative gap analysis", "Benchmark comparison", "Implementation roadmap"],
      packages: {
        basic: { name: "Creative audit", price: 12999, deliveryDays: 5, revisions: 1, units: "Creative only", includes: ["Ad creative audit", "Hook performance analysis", "Gap list", "1 call"] },
        standard: { name: "Full funnel", price: 34999, deliveryDays: 10, revisions: 2, units: "Creative + landing + email", includes: ["Full funnel diagnostic", "Benchmark comparison", "Prioritised backlog", "Roadmap", "2 calls"] },
        premium: { name: "Fix + implement", price: 89999, deliveryDays: 25, revisions: 3, units: "Audit + execution", includes: ["Full audit", "Top 10 fixes implemented", "New creative batch", "30-day performance tracking", "3 calls"] }
      },
      addons: [{ name: "Extra strategy call", price: 6000, deliveryDays: 1 }]
    },
    {
      id: "g28", creatorId: "c11", category: "voice", trending: false, queue: 2, views: 2870, orders: 47, rating: 4.8, reviews: 21,
      title: "Design the sound for your app, game or film",
      tags: ["sound-design", "sfx", "game-audio", "foley", "mix"],
      summary: "Custom sound effects and ambience designed and mixed for your medium.",
      deliverables: ["Sound effect library", "Ambience beds", "Implementation notes", "Stem separation", "Usage licence"],
      packages: {
        basic: { name: "10 SFX", price: 5999, deliveryDays: 4, revisions: 2, units: "10 effects", includes: ["10 custom SFX", "WAV masters", "Implementation notes"] },
        standard: { name: "30 SFX + ambience", price: 16999, deliveryDays: 9, revisions: 3, units: "30 effects", includes: ["30 custom SFX", "5 ambience beds", "Game-ready naming", "3 revisions"] },
        premium: { name: "Full audio package", price: 44999, deliveryDays: 18, revisions: 4, units: "80 effects + score", includes: ["80 SFX", "Adaptive ambience", "UI sound system", "Original score elements", "Engine integration guide", "4 revisions"] }
      },
      addons: [{ name: "Extra 10 SFX", price: 4800, deliveryDays: 3 }]
    },
    {
      id: "g29", creatorId: "c18", category: "social", trending: false, queue: 2, views: 3410, orders: 39, rating: 4.6, reviews: 17,
      title: "Write your AI usage and disclosure policy",
      tags: ["policy", "governance", "compliance", "disclosure", "ai-ethics"],
      summary: "A practical AI content policy covering disclosure, rights, safety and review.",
      deliverables: ["Policy document", "Disclosure label templates", "Review workflow", "Risk register", "Team FAQ"],
      packages: {
        basic: { name: "Starter policy", price: 19999, deliveryDays: 7, revisions: 2, units: "1 document", includes: ["Core AI content policy", "Disclosure templates", "Team FAQ"] },
        standard: { name: "Policy + workflow", price: 54999, deliveryDays: 14, revisions: 3, units: "Policy + process", includes: ["Full policy suite", "Review workflow design", "Risk register", "Rollout plan", "Leadership briefing"] },
        premium: { name: "Regulated programme", price: 139999, deliveryDays: 30, revisions: 4, units: "Enterprise", includes: ["Everything in Standard", "Legal/compliance review pack", "Vendor assessment framework", "Audit trail design", "6 months advisory"] }
      },
      addons: [{ name: "Legal review session", price: 25000, deliveryDays: 2 }]
    },
    {
      id: "g30", creatorId: "c10", category: "video", trending: true, queue: 5, views: 7240, orders: 118, rating: 4.9, reviews: 54,
      title: "Repurpose your podcast into clips that perform",
      tags: ["podcast", "clips", "repurposing", "shorts", "reels"],
      summary: "Episode-to-clip pipeline with moment detection, captioning and platform formatting.",
      deliverables: ["10 clips per episode", "Caption files", "Cover frames", "Highlight timestamps", "Show notes draft"],
      packages: {
        basic: { name: "5 clips", price: 5499, deliveryDays: 3, revisions: 1, units: "1 episode", includes: ["5 clips", "Captions", "Cover frames", "1 revision"] },
        standard: { name: "12 clips", price: 12999, deliveryDays: 5, revisions: 2, units: "1 episode", includes: ["12 clips", "Moment detection report", "Show notes draft", "All platform crops", "2 revisions"] },
        premium: { name: "Monthly (4 eps)", price: 42999, deliveryDays: 20, revisions: 3, units: "4 episodes", includes: ["48 clips per month", "Full repurposing pipeline", "Newsletter draft", "Performance review", "3 revisions"] }
      },
      addons: [{ name: "Extra episode", price: 9500, deliveryDays: 3 }, { name: "YouTube chapter edit", price: 6500, deliveryDays: 2 }]
    },
    {
      id: "g31", creatorId: "c12", category: "copy", trending: false, queue: 2, views: 2960, orders: 44, rating: 4.7, reviews: 19,
      title: "Create a prompt library for your marketing team",
      tags: ["prompt-library", "templates", "efficiency", "documentation"],
      summary: "A tested, documented prompt library matched to your team's actual recurring tasks.",
      deliverables: ["Prompt library (100+)", "Task mapping doc", "Quality checklist", "Team handbook", "Live walkthrough"],
      packages: {
        basic: { name: "25 prompts", price: 14999, deliveryDays: 6, revisions: 2, units: "25 prompts", includes: ["25 tested prompts", "Usage notes", "1 walkthrough call"] },
        standard: { name: "100 prompts", price: 39999, deliveryDays: 14, revisions: 3, units: "100 prompts", includes: ["100 prompts by role", "Task mapping", "Quality checklist", "Handbook", "2 walkthroughs"] },
        premium: { name: "Library + maintenance", price: 94999, deliveryDays: 28, revisions: 4, units: "250 prompts + 3 months", includes: ["250 prompts", "Versioned library in Notion", "3 months updates", "Eval rubric", "Team certification"] }
      },
      addons: [{ name: "Extra walkthrough", price: 8000, deliveryDays: 1 }]
    },
    {
      id: "g32", creatorId: "c04", category: "music", trending: false, queue: 3, views: 3540, orders: 58, rating: 4.6, reviews: 24,
      title: "Produce a brand jingle and sonic logo",
      tags: ["jingle", "sonic-branding", "audio-logo", "radio", "sting"],
      summary: "A memorable audio identity with full stem delivery for every placement.",
      deliverables: ["3-5 sec sonic logo", "30 sec jingle", "Full stems", "Radio-ready master", "Usage licence"],
      packages: {
        basic: { name: "Sonic logo", price: 8999, deliveryDays: 5, revisions: 2, units: "1 logo", includes: ["3-5 sec sonic logo", "2 alternate versions", "Master + stems"] },
        standard: { name: "Logo + jingle", price: 22999, deliveryDays: 10, revisions: 3, units: "Logo + 30 sec", includes: ["Sonic logo", "30 sec jingle", "Radio master", "Full stems", "3 revisions"] },
        premium: { name: "Audio identity", price: 59999, deliveryDays: 18, revisions: 4, units: "Full system", includes: ["Complete audio identity", "UI sound set", "Ad lengths (15/30/60)", "Audio guidelines doc", "Full buyout", "4 revisions"] }
      },
      addons: [{ name: "Extra ad length", price: 6000, deliveryDays: 2 }]
    },
    {
      id: "g33", creatorId: "c08", category: "aiart", trending: false, queue: 3, views: 4890, orders: 67, rating: 4.8, reviews: 29,
      title: "Illustrate your pitch deck with custom AI visuals",
      tags: ["pitch-deck", "investor", "illustration", "diagrams", "startup"],
      summary: "Custom visuals and diagrams that make a pitch deck read like a designed product.",
      deliverables: ["Custom illustration set", "Diagram designs", "Icon system", "Editable Figma file"],
      packages: {
        basic: { name: "5 visuals", price: 6999, deliveryDays: 4, revisions: 2, units: "5 visuals", includes: ["5 custom visuals", "Consistent style", "PNG + SVG"] },
        standard: { name: "Full deck", price: 19999, deliveryDays: 9, revisions: 3, units: "15 visuals + icons", includes: ["15 visuals", "Diagram set", "Icon system", "Editable Figma", "3 revisions"] },
        premium: { name: "Deck + brand", price: 49999, deliveryDays: 16, revisions: 4, units: "Full design system", includes: ["Complete deck design", "Visual system", "Brand basics", "Investor one-pager", "Source files", "4 revisions"] }
      },
      addons: [{ name: "Extra visual", price: 1800, deliveryDays: 1 }, { name: "Animated slides", price: 12000, deliveryDays: 4 }]
    },
    {
      id: "g34", creatorId: "c16", category: "avatar", trending: false, queue: 2, views: 2410, orders: 38, rating: 4.4, reviews: 15,
      title: "Create an AI-hosted property walkthrough video",
      tags: ["real-estate", "walkthrough", "avatar", "listing-video", "tour"],
      summary: "An avatar-hosted listing walkthrough assembled from your photos and floor plan.",
      deliverables: ["Walkthrough video", "Avatar host", "Voiceover", "Social cutdowns", "Caption file"],
      packages: {
        basic: { name: "60 sec tour", price: 6999, deliveryDays: 3, revisions: 1, units: "60 sec", includes: ["60 second tour", "Stock avatar host", "Voiceover", "Caption file"] },
        standard: { name: "2 min tour", price: 14999, deliveryDays: 5, revisions: 2, units: "2 min", includes: ["2 minute tour", "Custom-branded avatar", "3 social cutdowns", "Feature callouts", "2 revisions"] },
        premium: { name: "Listing campaign", price: 32999, deliveryDays: 9, revisions: 3, units: "Tour + ad set", includes: ["Full tour", "6 ad cutdowns", "Agent intro segment", "Multilingual VO (2)", "Portal-ready exports", "3 revisions"] }
      },
      addons: [{ name: "Extra language", price: 4500, deliveryDays: 2 }, { name: "Drone footage edit", price: 8000, deliveryDays: 3 }]
    }
  ];

  /* ---------- Sample open briefs from brands ---------- */
  const SEED_BRIEFS = [
    {
      id: "b01", brand: "Sip Society", brandType: "D2C Beverage", postedAt: "2026-10-04", status: "open",
      title: "Launch creative for a new cold-brew range",
      category: "ads", budgetMin: 40000, budgetMax: 90000, deadlineDays: 14,
      language: "English", quantity: 24, complexity: "high",
      description: "We are launching three cold-brew SKUs in metro cities next month. Need a full creative batch for Meta and Instagram, plus landing page copy. Previous campaigns plateaued at 1.8x ROAS and we need to break 3x. Target audience is 22-32 urban professionals.",
      deliverables: ["24 ad creatives", "Hook research report", "Landing page copy", "Media plan"],
      tools: ["Meta Ads Manager", "Midjourney", "CapCut"],
      niches: ["d2c", "food"], applicants: 7
    },
    {
      id: "b02", brand: "BrightPath Learning", brandType: "EdTech", postedAt: "2026-10-05", status: "open",
      title: "Convert our K-12 science syllabus into micro-modules",
      category: "video", budgetMin: 120000, budgetMax: 250000, deadlineDays: 45,
      language: "English", quantity: 60, complexity: "high",
      description: "We have 60 lessons of written curriculum that need to become 3-minute video micro-modules with knowledge checks. Completion rate on our current content is 31% and we want to double it. Must work for learners in Hindi and English medium.",
      deliverables: ["60 micro-module videos", "Knowledge check bank", "LMS-ready exports", "Scripts"],
      tools: ["HeyGen", "Descript", "Canva"],
      niches: ["edtech"], applicants: 11
    },
    {
      id: "b03", brand: "Hibernia Bank", brandType: "Financial Services", postedAt: "2026-10-03", status: "open",
      title: "AI content governance and team training programme",
      category: "copy", budgetMin: 200000, budgetMax: 400000, deadlineDays: 60,
      language: "English", quantity: 1, complexity: "high",
      description: "Marketing team of 340 across four offices is using AI tools without any standard. We need a governance framework, disclosure policy and a tiered training programme. Regulated environment, so audit trails and compliance review are mandatory.",
      deliverables: ["Governance framework", "Disclosure policy", "Training programme", "Eval rubrics", "Compliance pack"],
      tools: ["ChatGPT", "Claude", "Notion AI"],
      niches: ["fintech", "saas"], applicants: 4
    },
    {
      id: "b04", brand: "Drape Studio", brandType: "Fashion", postedAt: "2026-10-06", status: "open",
      title: "SS26 lookbook without a physical photoshoot",
      category: "aiart", budgetMin: 50000, budgetMax: 120000, deadlineDays: 21,
      language: "English", quantity: 36, complexity: "medium",
      description: "We have flat-lay photography of 36 garments and want an on-model lookbook. Fabric texture and colour accuracy are non-negotiable because returns spike when the product looks different online. Need e-commerce white background cuts too.",
      deliverables: ["36 on-model looks", "White background cuts", "2 lifestyle scenes each", "Print resolution files"],
      tools: ["Midjourney", "Flux", "Stable Diffusion"],
      niches: ["fashion", "d2c"], applicants: 9
    },
    {
      id: "b05", brand: "DeepDive Tech", brandType: "Media / YouTube", postedAt: "2026-10-02", status: "in-review",
      title: "Fix retention on our 400k-subscriber tech channel",
      category: "youtube", budgetMin: 80000, budgetMax: 150000, deadlineDays: 30,
      language: "English", quantity: 8, complexity: "medium",
      description: "Average view duration dropped from 6:30 to 4:10 over two quarters. We need someone who reads analytics, not just cuts footage. Eight videos to start, with a format rebuild we can keep using.",
      deliverables: ["Retention audit", "New format spec", "8 edited videos", "Thumbnail system"],
      tools: ["Premiere Pro", "After Effects", "Google Analytics"],
      niches: ["saas", "edtech"], applicants: 6
    },
    {
      id: "b06", brand: "Saffron House", brandType: "Restaurant Group", postedAt: "2026-10-01", status: "filled",
      title: "Bilingual Arabic-English identity for three locations",
      category: "brand", budgetMin: 90000, budgetMax: 180000, deadlineDays: 40,
      language: "Arabic", quantity: 1, complexity: "high",
      description: "Expanding to three locations and the current identity does not work in Arabic. Need a proper bilingual logotype, not a translation bolted on. Full brand book and packaging direction for our retail line.",
      deliverables: ["Bilingual logo system", "48-page brand book", "Packaging direction", "Signage spec"],
      tools: ["Figma", "Ideogram"],
      niches: ["food"], applicants: 14
    }
  ];

  /* ---------- Derived helpers ---------- */
  const byId = {
    creator: Object.fromEntries(CREATORS.map((c) => [c.id, c])),
    gig: Object.fromEntries(GIGS.map((g) => [g.id, g])),
    category: Object.fromEntries(CATEGORIES.map((c) => [c.id, c]))
  };

  const gigsOf = (creatorId) => GIGS.filter((g) => g.creatorId === creatorId);
  const creatorOf = (gigId) => byId.creator[byId.gig[gigId]?.creatorId];

  const LOWEST = (gig) => Math.min(...Object.values(gig.packages).map((p) => p.price));

  return { CATEGORIES, TOOLS, NICHES, LANGUAGES, CREATORS, GIGS, SEED_BRIEFS, byId, gigsOf, creatorOf, LOWEST };
})();
