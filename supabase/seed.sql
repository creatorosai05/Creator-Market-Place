-- CreatorOS AI — Seed Data for Hackcelerate Marketplace
-- Apply after 20261009_init.sql

BEGIN;

INSERT INTO public.profiles (
    id, role, name, handle, title, bio, location, categories, tools, languages, niches,
    verified, verification_status, quality_score, rating, reviews_count, completed_orders, response_mins, ontime_rate
  ) VALUES (
    '00000000-0000-0000-0000-000000000001', 'creator', 'Ananya Sharma', '@ananya.cuts', 'AI Short-Form Video Editor', 'I turn raw product footage and a one-line brief into vertical reels that hold attention past the third second. My workflow pairs Runway generative b-roll with hand-tuned pacing, so every cut is deliberate rather than templated. 380+ orders delivered for D2C and fintech brands.', 'Bengaluru, IN',
    '{"video","youtube"}'::text[], '{"Runway","CapCut","Midjourney","ElevenLabs","Premiere Pro","Whisper"}'::text[], '{"English","Hindi","Kannada"}'::text[], '{"d2c","fintech","fashion"}'::text[],
    true, 'verified', 92, 4.9,
    214, 386, 25, 0.98
  ) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name, handle = EXCLUDED.handle, title = EXCLUDED.title, bio = EXCLUDED.bio;

INSERT INTO public.portfolio_items (
        creator_id, title, kind, metric, commercial_rights, tools_used, is_published
      ) VALUES (
        '00000000-0000-0000-0000-000000000001', 'Skincare launch reel series', 'Reels', '4.1M views',
        'Full commercial license included', '{"Runway","CapCut","Midjourney"}'::text[], true
      );
INSERT INTO public.portfolio_items (
        creator_id, title, kind, metric, commercial_rights, tools_used, is_published
      ) VALUES (
        '00000000-0000-0000-0000-000000000001', 'Fintech explainer shorts', 'Shorts', '+38% CTR',
        'Full commercial license included', '{"Runway","CapCut","Midjourney"}'::text[], true
      );
INSERT INTO public.portfolio_items (
        creator_id, title, kind, metric, commercial_rights, tools_used, is_published
      ) VALUES (
        '00000000-0000-0000-0000-000000000001', 'Festive drop campaign', 'Reels', '2.6M views',
        'Full commercial license included', '{"Runway","CapCut","Midjourney"}'::text[], true
      );
INSERT INTO public.profiles (
    id, role, name, handle, title, bio, location, categories, tools, languages, niches,
    verified, verification_status, quality_score, rating, reviews_count, completed_orders, response_mins, ontime_rate
  ) VALUES (
    '00000000-0000-0000-0000-000000000002', 'creator', 'Dev Patel', '@devprompt', 'Generative Art Director', 'Art direction for brands that need a consistent visual language, not ten disconnected pretty pictures. I build custom LoRA-style reference sets and prompt systems so your campaign stays on-brand across hundreds of generations.', 'Ahmedabad, IN',
    '{"aiart","brand"}'::text[], '{"Midjourney","Stable Diffusion","Flux","Figma","Ideogram","After Effects"}'::text[], '{"English","Hindi","Gujarati"}'::text[], '{"saas","gaming","fashion"}'::text[],
    true, 'verified', 92, 4.8,
    167, 291, 40, 0.96
  ) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name, handle = EXCLUDED.handle, title = EXCLUDED.title, bio = EXCLUDED.bio;

INSERT INTO public.portfolio_items (
        creator_id, title, kind, metric, commercial_rights, tools_used, is_published
      ) VALUES (
        '00000000-0000-0000-0000-000000000002', 'SaaS product world-build', 'Campaign art', '62 assets',
        'Full commercial license included', '{"Midjourney","Stable Diffusion","Flux"}'::text[], true
      );
INSERT INTO public.portfolio_items (
        creator_id, title, kind, metric, commercial_rights, tools_used, is_published
      ) VALUES (
        '00000000-0000-0000-0000-000000000002', 'Game key art series', 'Key art', 'Launch hero',
        'Full commercial license included', '{"Midjourney","Stable Diffusion","Flux"}'::text[], true
      );
INSERT INTO public.portfolio_items (
        creator_id, title, kind, metric, commercial_rights, tools_used, is_published
      ) VALUES (
        '00000000-0000-0000-0000-000000000002', 'Fashion lookbook', 'Editorial', '18 looks',
        'Full commercial license included', '{"Midjourney","Stable Diffusion","Flux"}'::text[], true
      );
INSERT INTO public.profiles (
    id, role, name, handle, title, bio, location, categories, tools, languages, niches,
    verified, verification_status, quality_score, rating, reviews_count, completed_orders, response_mins, ontime_rate
  ) VALUES (
    '00000000-0000-0000-0000-000000000003', 'creator', 'Priya Nair', '@priyawrites', 'SEO & Brand Copywriter', 'Copy that ranks and reads like a human wrote it, because a human did. I use AI for research clustering and outline drafting, then write and edit every line myself. 500+ orders, 78% of them repeat clients.', 'Kochi, IN',
    '{"copy","social"}'::text[], '{"ChatGPT","Claude","Notion AI","Google Analytics","Jasper"}'::text[], '{"English","Malayalam","Tamil"}'::text[], '{"saas","health","edtech"}'::text[],
    true, 'verified', 92, 4.9,
    302, 517, 18, 0.99
  ) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name, handle = EXCLUDED.handle, title = EXCLUDED.title, bio = EXCLUDED.bio;

INSERT INTO public.portfolio_items (
        creator_id, title, kind, metric, commercial_rights, tools_used, is_published
      ) VALUES (
        '00000000-0000-0000-0000-000000000003', 'SaaS blog engine', 'SEO', '+212% traffic',
        'Full commercial license included', '{"ChatGPT","Claude","Notion AI"}'::text[], true
      );
INSERT INTO public.portfolio_items (
        creator_id, title, kind, metric, commercial_rights, tools_used, is_published
      ) VALUES (
        '00000000-0000-0000-0000-000000000003', 'Landing page rewrite', 'Conversion', '+41% signups',
        'Full commercial license included', '{"ChatGPT","Claude","Notion AI"}'::text[], true
      );
INSERT INTO public.portfolio_items (
        creator_id, title, kind, metric, commercial_rights, tools_used, is_published
      ) VALUES (
        '00000000-0000-0000-0000-000000000003', 'Health series', 'Longform', '24 articles',
        'Full commercial license included', '{"ChatGPT","Claude","Notion AI"}'::text[], true
      );
INSERT INTO public.profiles (
    id, role, name, handle, title, bio, location, categories, tools, languages, niches,
    verified, verification_status, quality_score, rating, reviews_count, completed_orders, response_mins, ontime_rate
  ) VALUES (
    '00000000-0000-0000-0000-000000000004', 'creator', 'Arjun Reddy', '@arjun.audio', 'Multilingual AI Voice Director', 'Voice direction across four Indian languages plus English. I cast the right synthetic voice, direct the delivery for natural prosody, and mix to broadcast loudness standards so it never sounds like a text-to-speech demo.', 'Hyderabad, IN',
    '{"voice","music"}'::text[], '{"ElevenLabs","Descript","Suno","Udio","Premiere Pro"}'::text[], '{"English","Telugu","Hindi","Tamil"}'::text[], '{"edtech","d2c","realestate"}'::text[],
    true, 'verified', 92, 4.7,
    143, 268, 55, 0.97
  ) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name, handle = EXCLUDED.handle, title = EXCLUDED.title, bio = EXCLUDED.bio;

INSERT INTO public.portfolio_items (
        creator_id, title, kind, metric, commercial_rights, tools_used, is_published
      ) VALUES (
        '00000000-0000-0000-0000-000000000004', 'EdTech course narration', 'Voiceover', '42 hours',
        'Full commercial license included', '{"ElevenLabs","Descript","Suno"}'::text[], true
      );
INSERT INTO public.portfolio_items (
        creator_id, title, kind, metric, commercial_rights, tools_used, is_published
      ) VALUES (
        '00000000-0000-0000-0000-000000000004', 'Radio jingle package', 'Music', '6 versions',
        'Full commercial license included', '{"ElevenLabs","Descript","Suno"}'::text[], true
      );
INSERT INTO public.portfolio_items (
        creator_id, title, kind, metric, commercial_rights, tools_used, is_published
      ) VALUES (
        '00000000-0000-0000-0000-000000000004', 'Retail IVR suite', 'Voice', '4 languages',
        'Full commercial license included', '{"ElevenLabs","Descript","Suno"}'::text[], true
      );
INSERT INTO public.profiles (
    id, role, name, handle, title, bio, location, categories, tools, languages, niches,
    verified, verification_status, quality_score, rating, reviews_count, completed_orders, response_mins, ontime_rate
  ) VALUES (
    '00000000-0000-0000-0000-000000000005', 'creator', 'Sofia Marin', '@sofia.social', 'Social Growth Strategist', 'I run the whole content engine: strategy, calendar, production briefs, publishing and reporting. Clients hand me a product and a goal; they get back a system that compounds. Average retention on my monthly plans is eleven months.', 'Barcelona, ES',
    '{"social","video"}'::text[], '{"Buffer","Canva","CapCut","ChatGPT","Meta Ads Manager","Google Analytics"}'::text[], '{"English","Spanish","Catalan"}'::text[], '{"food","fashion","d2c"}'::text[],
    true, 'verified', 92, 4.8,
    189, 233, 90, 0.95
  ) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name, handle = EXCLUDED.handle, title = EXCLUDED.title, bio = EXCLUDED.bio;

INSERT INTO public.portfolio_items (
        creator_id, title, kind, metric, commercial_rights, tools_used, is_published
      ) VALUES (
        '00000000-0000-0000-0000-000000000005', 'Restaurant group relaunch', 'Strategy', '+180% reach',
        'Full commercial license included', '{"Buffer","Canva","CapCut"}'::text[], true
      );
INSERT INTO public.portfolio_items (
        creator_id, title, kind, metric, commercial_rights, tools_used, is_published
      ) VALUES (
        '00000000-0000-0000-0000-000000000005', 'Fashion brand engine', 'Monthly', '11 mo retainer',
        'Full commercial license included', '{"Buffer","Canva","CapCut"}'::text[], true
      );
INSERT INTO public.portfolio_items (
        creator_id, title, kind, metric, commercial_rights, tools_used, is_published
      ) VALUES (
        '00000000-0000-0000-0000-000000000005', 'D2C content system', 'Calendar', '120 posts',
        'Full commercial license included', '{"Buffer","Canva","CapCut"}'::text[], true
      );
INSERT INTO public.profiles (
    id, role, name, handle, title, bio, location, categories, tools, languages, niches,
    verified, verification_status, quality_score, rating, reviews_count, completed_orders, response_mins, ontime_rate
  ) VALUES (
    '00000000-0000-0000-0000-000000000006', 'creator', 'Rahul Verma', '@rahul.perf', 'Performance Creative Specialist', 'Volume creative for paid social. I produce test batches of 20-40 ad variants per week, tagged by hook type and visual angle, so your media buyer always has fresh inventory and clear learnings.', 'Delhi NCR, IN',
    '{"ads","aiart"}'::text[], '{"Midjourney","Figma","Canva","Meta Ads Manager","ChatGPT","Flux"}'::text[], '{"English","Hindi"}'::text[], '{"d2c","fintech","edtech"}'::text[],
    true, 'verified', 92, 4.6,
    128, 342, 32, 0.94
  ) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name, handle = EXCLUDED.handle, title = EXCLUDED.title, bio = EXCLUDED.bio;

INSERT INTO public.portfolio_items (
        creator_id, title, kind, metric, commercial_rights, tools_used, is_published
      ) VALUES (
        '00000000-0000-0000-0000-000000000006', 'D2C ad batch', 'Static', '40 variants',
        'Full commercial license included', '{"Midjourney","Figma","Canva"}'::text[], true
      );
INSERT INTO public.portfolio_items (
        creator_id, title, kind, metric, commercial_rights, tools_used, is_published
      ) VALUES (
        '00000000-0000-0000-0000-000000000006', 'Fintech motion ads', 'Motion', '2.1x ROAS',
        'Full commercial license included', '{"Midjourney","Figma","Canva"}'::text[], true
      );
INSERT INTO public.portfolio_items (
        creator_id, title, kind, metric, commercial_rights, tools_used, is_published
      ) VALUES (
        '00000000-0000-0000-0000-000000000006', 'App install creative', 'Static', '-34% CPI',
        'Full commercial license included', '{"Midjourney","Figma","Canva"}'::text[], true
      );
INSERT INTO public.profiles (
    id, role, name, handle, title, bio, location, categories, tools, languages, niches,
    verified, verification_status, quality_score, rating, reviews_count, completed_orders, response_mins, ontime_rate
  ) VALUES (
    '00000000-0000-0000-0000-000000000007', 'creator', 'Yuki Tanaka', '@yuki.motion', 'Motion Designer & AI VFX', 'High-end motion and generative VFX for launches and brand films. I combine traditional After Effects craft with AI plate generation, which cuts pre-production from weeks to days without losing authorial control.', 'Tokyo, JP',
    '{"video","aiart","music"}'::text[], '{"After Effects","Runway","Kling","Sora","Cinema 4D","Suno"}'::text[], '{"English","Japanese"}'::text[], '{"gaming","saas","fashion"}'::text[],
    true, 'verified', 92, 5,
    96, 154, 120, 0.99
  ) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name, handle = EXCLUDED.handle, title = EXCLUDED.title, bio = EXCLUDED.bio;

INSERT INTO public.portfolio_items (
        creator_id, title, kind, metric, commercial_rights, tools_used, is_published
      ) VALUES (
        '00000000-0000-0000-0000-000000000007', 'Product launch film', 'Brand film', '90 sec',
        'Full commercial license included', '{"After Effects","Runway","Kling"}'::text[], true
      );
INSERT INTO public.portfolio_items (
        creator_id, title, kind, metric, commercial_rights, tools_used, is_published
      ) VALUES (
        '00000000-0000-0000-0000-000000000007', 'Game trailer VFX', 'VFX', '3.4M views',
        'Full commercial license included', '{"After Effects","Runway","Kling"}'::text[], true
      );
INSERT INTO public.portfolio_items (
        creator_id, title, kind, metric, commercial_rights, tools_used, is_published
      ) VALUES (
        '00000000-0000-0000-0000-000000000007', 'Fashion loop series', 'Loop', 'OOH screens',
        'Full commercial license included', '{"After Effects","Runway","Kling"}'::text[], true
      );
INSERT INTO public.profiles (
    id, role, name, handle, title, bio, location, categories, tools, languages, niches,
    verified, verification_status, quality_score, rating, reviews_count, completed_orders, response_mins, ontime_rate
  ) VALUES (
    '00000000-0000-0000-0000-000000000008', 'creator', 'Fatima Al-Sayed', '@fatima.brand', 'Brand Identity Designer', 'Identity systems for MENA and South Asian markets, including bilingual Arabic-Latin logotypes. AI accelerates my exploration phase; typography, grid and colour decisions are still made by hand.', 'Dubai, AE',
    '{"brand","aiart"}'::text[], '{"Figma","Ideogram","Midjourney","After Effects"}'::text[], '{"English","Arabic","French"}'::text[], '{"food","realestate","health"}'::text[],
    true, 'verified', 92, 4.9,
    178, 246, 70, 0.97
  ) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name, handle = EXCLUDED.handle, title = EXCLUDED.title, bio = EXCLUDED.bio;

INSERT INTO public.portfolio_items (
        creator_id, title, kind, metric, commercial_rights, tools_used, is_published
      ) VALUES (
        '00000000-0000-0000-0000-000000000008', 'Bilingual logotype system', 'Identity', 'AR + EN',
        'Full commercial license included', '{"Figma","Ideogram","Midjourney"}'::text[], true
      );
INSERT INTO public.portfolio_items (
        creator_id, title, kind, metric, commercial_rights, tools_used, is_published
      ) VALUES (
        '00000000-0000-0000-0000-000000000008', 'Hospitality rebrand', 'Identity', 'Full book',
        'Full commercial license included', '{"Figma","Ideogram","Midjourney"}'::text[], true
      );
INSERT INTO public.portfolio_items (
        creator_id, title, kind, metric, commercial_rights, tools_used, is_published
      ) VALUES (
        '00000000-0000-0000-0000-000000000008', 'Wellness brand kit', 'Identity', '42 pages',
        'Full commercial license included', '{"Figma","Ideogram","Midjourney"}'::text[], true
      );
INSERT INTO public.profiles (
    id, role, name, handle, title, bio, location, categories, tools, languages, niches,
    verified, verification_status, quality_score, rating, reviews_count, completed_orders, response_mins, ontime_rate
  ) VALUES (
    '00000000-0000-0000-0000-000000000009', 'creator', 'Vikram Singh', '@vikram.avatar', 'AI Avatar & UGC Producer', 'Synthetic spokesperson and UGC-style video at scale. One shoot, forty localised variants across languages and demographics. I handle consent, likeness rights and disclosure labelling so your legal team stays happy.', 'Jaipur, IN',
    '{"avatar","video","ads"}'::text[], '{"HeyGen","D-ID","ElevenLabs","CapCut","Runway"}'::text[], '{"English","Hindi","Punjabi"}'::text[], '{"saas","edtech","d2c"}'::text[],
    true, 'verified', 92, 4.7,
    112, 203, 45, 0.96
  ) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name, handle = EXCLUDED.handle, title = EXCLUDED.title, bio = EXCLUDED.bio;

INSERT INTO public.portfolio_items (
        creator_id, title, kind, metric, commercial_rights, tools_used, is_published
      ) VALUES (
        '00000000-0000-0000-0000-000000000009', 'SaaS demo avatar', 'Avatar', '12 languages',
        'Full commercial license included', '{"HeyGen","D-ID","ElevenLabs"}'::text[], true
      );
INSERT INTO public.portfolio_items (
        creator_id, title, kind, metric, commercial_rights, tools_used, is_published
      ) VALUES (
        '00000000-0000-0000-0000-000000000009', 'UGC testimonial set', 'UGC', '40 variants',
        'Full commercial license included', '{"HeyGen","D-ID","ElevenLabs"}'::text[], true
      );
INSERT INTO public.portfolio_items (
        creator_id, title, kind, metric, commercial_rights, tools_used, is_published
      ) VALUES (
        '00000000-0000-0000-0000-000000000009', 'Course instructor clone', 'Avatar', 'Consent-cleared',
        'Full commercial license included', '{"HeyGen","D-ID","ElevenLabs"}'::text[], true
      );
INSERT INTO public.profiles (
    id, role, name, handle, title, bio, location, categories, tools, languages, niches,
    verified, verification_status, quality_score, rating, reviews_count, completed_orders, response_mins, ontime_rate
  ) VALUES (
    '00000000-0000-0000-0000-00000000000a', 'creator', 'Lucas Ferreira', '@lucas.yt', 'YouTube Retention Editor', 'Long-form editing built around retention curves. I analyse your existing analytics, find where viewers drop, and restructure pacing, b-roll density and chapter placement to fix it. Three clients past one million subscribers.', 'Lisbon, PT',
    '{"youtube","video"}'::text[], '{"Premiere Pro","After Effects","Descript","Whisper","ChatGPT"}'::text[], '{"English","Portuguese","Spanish"}'::text[], '{"edtech","saas","gaming"}'::text[],
    true, 'verified', 92, 4.8,
    231, 402, 60, 0.98
  ) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name, handle = EXCLUDED.handle, title = EXCLUDED.title, bio = EXCLUDED.bio;

INSERT INTO public.portfolio_items (
        creator_id, title, kind, metric, commercial_rights, tools_used, is_published
      ) VALUES (
        '00000000-0000-0000-0000-00000000000a', 'Tech channel relaunch', 'Longform', 'AVD +62%',
        'Full commercial license included', '{"Premiere Pro","After Effects","Descript"}'::text[], true
      );
INSERT INTO public.portfolio_items (
        creator_id, title, kind, metric, commercial_rights, tools_used, is_published
      ) VALUES (
        '00000000-0000-0000-0000-00000000000a', 'Edu series edit', 'Longform', '1.2M subs',
        'Full commercial license included', '{"Premiere Pro","After Effects","Descript"}'::text[], true
      );
INSERT INTO public.portfolio_items (
        creator_id, title, kind, metric, commercial_rights, tools_used, is_published
      ) VALUES (
        '00000000-0000-0000-0000-00000000000a', 'Gaming highlights', 'Compilation', '8M views',
        'Full commercial license included', '{"Premiere Pro","After Effects","Descript"}'::text[], true
      );
INSERT INTO public.profiles (
    id, role, name, handle, title, bio, location, categories, tools, languages, niches,
    verified, verification_status, quality_score, rating, reviews_count, completed_orders, response_mins, ontime_rate
  ) VALUES (
    '00000000-0000-0000-0000-00000000000b', 'creator', 'Ishita Bose', '@ishita.sound', 'Sound Designer & AI Composer', 'Original scores and sound design with clean commercial rights. I compose with AI stems, then re-arrange and mix in a DAW so you own something distinctive rather than a stock generation anyone else can produce.', 'Kolkata, IN',
    '{"music","voice"}'::text[], '{"Suno","Udio","Descript","Premiere Pro","ElevenLabs"}'::text[], '{"English","Hindi","Bengali"}'::text[], '{"gaming","d2c","ngo"}'::text[],
    false, 'unverified', 92, 4.9,
    87, 141, 85, 0.98
  ) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name, handle = EXCLUDED.handle, title = EXCLUDED.title, bio = EXCLUDED.bio;

INSERT INTO public.portfolio_items (
        creator_id, title, kind, metric, commercial_rights, tools_used, is_published
      ) VALUES (
        '00000000-0000-0000-0000-00000000000b', 'Game soundtrack', 'Score', '14 tracks',
        'Full commercial license included', '{"Suno","Udio","Descript"}'::text[], true
      );
INSERT INTO public.portfolio_items (
        creator_id, title, kind, metric, commercial_rights, tools_used, is_published
      ) VALUES (
        '00000000-0000-0000-0000-00000000000b', 'Brand sonic identity', 'Jingle', '3 sec sting',
        'Full commercial license included', '{"Suno","Udio","Descript"}'::text[], true
      );
INSERT INTO public.portfolio_items (
        creator_id, title, kind, metric, commercial_rights, tools_used, is_published
      ) VALUES (
        '00000000-0000-0000-0000-00000000000b', 'Documentary score', 'Score', '48 min',
        'Full commercial license included', '{"Suno","Udio","Descript"}'::text[], true
      );
INSERT INTO public.profiles (
    id, role, name, handle, title, bio, location, categories, tools, languages, niches,
    verified, verification_status, quality_score, rating, reviews_count, completed_orders, response_mins, ontime_rate
  ) VALUES (
    '00000000-0000-0000-0000-00000000000c', 'creator', 'Noah Kim', '@noah.content', 'Content Ops & AI Workflow Architect', 'I do not just make content, I build the machine that makes it. Prompt libraries, review gates, asset taxonomies and publishing automation for teams that want AI output without AI chaos.', 'Seoul, KR',
    '{"social","copy"}'::text[], '{"Notion AI","ChatGPT","Claude","Buffer","Google Analytics","Figma"}'::text[], '{"English","Korean"}'::text[], '{"saas","fintech","edtech"}'::text[],
    true, 'verified', 92, 4.7,
    74, 118, 110, 0.95
  ) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name, handle = EXCLUDED.handle, title = EXCLUDED.title, bio = EXCLUDED.bio;

INSERT INTO public.portfolio_items (
        creator_id, title, kind, metric, commercial_rights, tools_used, is_published
      ) VALUES (
        '00000000-0000-0000-0000-00000000000c', 'Enterprise prompt library', 'Ops', '180 prompts',
        'Full commercial license included', '{"Notion AI","ChatGPT","Claude"}'::text[], true
      );
INSERT INTO public.portfolio_items (
        creator_id, title, kind, metric, commercial_rights, tools_used, is_published
      ) VALUES (
        '00000000-0000-0000-0000-00000000000c', 'Content pipeline build', 'Automation', '5x throughput',
        'Full commercial license included', '{"Notion AI","ChatGPT","Claude"}'::text[], true
      );
INSERT INTO public.portfolio_items (
        creator_id, title, kind, metric, commercial_rights, tools_used, is_published
      ) VALUES (
        '00000000-0000-0000-0000-00000000000c', 'Brand safety gates', 'Policy', '4 review tiers',
        'Full commercial license included', '{"Notion AI","ChatGPT","Claude"}'::text[], true
      );
INSERT INTO public.profiles (
    id, role, name, handle, title, bio, location, categories, tools, languages, niches,
    verified, verification_status, quality_score, rating, reviews_count, completed_orders, response_mins, ontime_rate
  ) VALUES (
    '00000000-0000-0000-0000-00000000000d', 'creator', 'Zara Khan', '@zara.fashion', 'Fashion & Beauty AI Visuals', 'On-model fashion visuals without a shoot. I train on your actual garment photography so the AI render keeps fabric texture, drape and colour accurate enough for product pages, not just moodboards.', 'Mumbai, IN',
    '{"aiart","ads","video"}'::text[], '{"Midjourney","Flux","Stable Diffusion","Figma","Runway"}'::text[], '{"English","Hindi","Urdu"}'::text[], '{"fashion","d2c","food"}'::text[],
    true, 'verified', 92, 4.8,
    156, 274, 38, 0.97
  ) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name, handle = EXCLUDED.handle, title = EXCLUDED.title, bio = EXCLUDED.bio;

INSERT INTO public.portfolio_items (
        creator_id, title, kind, metric, commercial_rights, tools_used, is_published
      ) VALUES (
        '00000000-0000-0000-0000-00000000000d', 'On-model SS26 lookbook', 'Fashion', '36 looks',
        'Full commercial license included', '{"Midjourney","Flux","Stable Diffusion"}'::text[], true
      );
INSERT INTO public.portfolio_items (
        creator_id, title, kind, metric, commercial_rights, tools_used, is_published
      ) VALUES (
        '00000000-0000-0000-0000-00000000000d', 'Beauty macro campaign', 'Product', '+29% CVR',
        'Full commercial license included', '{"Midjourney","Flux","Stable Diffusion"}'::text[], true
      );
INSERT INTO public.portfolio_items (
        creator_id, title, kind, metric, commercial_rights, tools_used, is_published
      ) VALUES (
        '00000000-0000-0000-0000-00000000000d', 'Ethnic wear festive', 'Fashion', '24 assets',
        'Full commercial license included', '{"Midjourney","Flux","Stable Diffusion"}'::text[], true
      );
INSERT INTO public.profiles (
    id, role, name, handle, title, bio, location, categories, tools, languages, niches,
    verified, verification_status, quality_score, rating, reviews_count, completed_orders, response_mins, ontime_rate
  ) VALUES (
    '00000000-0000-0000-0000-00000000000e', 'creator', 'Ethan Brooks', '@ethan.script', 'Scriptwriter & Narrative Designer', 'Scripts with actual structure. Hook, tension, payoff, retention beats timed to the second. I write for YouTube, brand films and interactive narrative, and I will tell you when your premise is the problem.', 'Manchester, UK',
    '{"copy","youtube","video"}'::text[], '{"ChatGPT","Claude","Notion AI","Descript"}'::text[], '{"English"}'::text[], '{"edtech","gaming","saas"}'::text[],
    false, 'unverified', 92, 4.6,
    103, 187, 130, 0.93
  ) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name, handle = EXCLUDED.handle, title = EXCLUDED.title, bio = EXCLUDED.bio;

INSERT INTO public.portfolio_items (
        creator_id, title, kind, metric, commercial_rights, tools_used, is_published
      ) VALUES (
        '00000000-0000-0000-0000-00000000000e', 'Docuseries scripts', 'Script', '6 episodes',
        'Full commercial license included', '{"ChatGPT","Claude","Notion AI"}'::text[], true
      );
INSERT INTO public.portfolio_items (
        creator_id, title, kind, metric, commercial_rights, tools_used, is_published
      ) VALUES (
        '00000000-0000-0000-0000-00000000000e', 'YouTube essay series', 'Script', 'AVD 71%',
        'Full commercial license included', '{"ChatGPT","Claude","Notion AI"}'::text[], true
      );
INSERT INTO public.portfolio_items (
        creator_id, title, kind, metric, commercial_rights, tools_used, is_published
      ) VALUES (
        '00000000-0000-0000-0000-00000000000e', 'Game narrative bible', 'Narrative', '90 pages',
        'Full commercial license included', '{"ChatGPT","Claude","Notion AI"}'::text[], true
      );
INSERT INTO public.profiles (
    id, role, name, handle, title, bio, location, categories, tools, languages, niches,
    verified, verification_status, quality_score, rating, reviews_count, completed_orders, response_mins, ontime_rate
  ) VALUES (
    '00000000-0000-0000-0000-00000000000f', 'creator', 'Meera Iyer', '@meera.edu', 'EdTech Content Producer', 'Learning content that people actually finish. I design for cognitive load: chunked modules, consistent visual grammar, checks for understanding. Built course libraries for four platforms with over a million combined learners.', 'Chennai, IN',
    '{"video","copy","avatar"}'::text[], '{"HeyGen","Canva","Descript","ChatGPT","CapCut","ElevenLabs"}'::text[], '{"English","Tamil","Hindi"}'::text[], '{"edtech","health","ngo"}'::text[],
    true, 'verified', 92, 4.9,
    194, 328, 28, 0.99
  ) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name, handle = EXCLUDED.handle, title = EXCLUDED.title, bio = EXCLUDED.bio;

INSERT INTO public.portfolio_items (
        creator_id, title, kind, metric, commercial_rights, tools_used, is_published
      ) VALUES (
        '00000000-0000-0000-0000-00000000000f', 'K-12 micro-modules', 'Course', '120 videos',
        'Full commercial license included', '{"HeyGen","Canva","Descript"}'::text[], true
      );
INSERT INTO public.portfolio_items (
        creator_id, title, kind, metric, commercial_rights, tools_used, is_published
      ) VALUES (
        '00000000-0000-0000-0000-00000000000f', 'Corporate LMS build', 'Course', '18 hours',
        'Full commercial license included', '{"HeyGen","Canva","Descript"}'::text[], true
      );
INSERT INTO public.portfolio_items (
        creator_id, title, kind, metric, commercial_rights, tools_used, is_published
      ) VALUES (
        '00000000-0000-0000-0000-00000000000f', 'Health literacy series', 'Explainer', '1M learners',
        'Full commercial license included', '{"HeyGen","Canva","Descript"}'::text[], true
      );
INSERT INTO public.profiles (
    id, role, name, handle, title, bio, location, categories, tools, languages, niches,
    verified, verification_status, quality_score, rating, reviews_count, completed_orders, response_mins, ontime_rate
  ) VALUES (
    '00000000-0000-0000-0000-000000000010', 'creator', 'Omar Haddad', '@omar.realestate', 'Real Estate Visual Specialist', 'Virtual staging, twilight renders and walkthrough videos for listings. Agents send me phone photos; they get back marketing-ready visuals in 48 hours at a fraction of a physical staging cost.', 'Toronto, CA',
    '{"aiart","video","avatar"}'::text[], '{"Stable Diffusion","Midjourney","CapCut","HeyGen","Figma"}'::text[], '{"English","French","Arabic"}'::text[], '{"realestate","d2c"}'::text[],
    false, 'unverified', 92, 4.5,
    68, 129, 95, 0.92
  ) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name, handle = EXCLUDED.handle, title = EXCLUDED.title, bio = EXCLUDED.bio;

INSERT INTO public.portfolio_items (
        creator_id, title, kind, metric, commercial_rights, tools_used, is_published
      ) VALUES (
        '00000000-0000-0000-0000-000000000010', 'Luxury listing staging', 'Render', '22 rooms',
        'Full commercial license included', '{"Stable Diffusion","Midjourney","CapCut"}'::text[], true
      );
INSERT INTO public.portfolio_items (
        creator_id, title, kind, metric, commercial_rights, tools_used, is_published
      ) VALUES (
        '00000000-0000-0000-0000-000000000010', 'Twilight exterior set', 'Render', 'Sold in 9 days',
        'Full commercial license included', '{"Stable Diffusion","Midjourney","CapCut"}'::text[], true
      );
INSERT INTO public.portfolio_items (
        creator_id, title, kind, metric, commercial_rights, tools_used, is_published
      ) VALUES (
        '00000000-0000-0000-0000-000000000010', 'Agent walkthrough', 'Video', 'Avatar-hosted',
        'Full commercial license included', '{"Stable Diffusion","Midjourney","CapCut"}'::text[], true
      );
INSERT INTO public.profiles (
    id, role, name, handle, title, bio, location, categories, tools, languages, niches,
    verified, verification_status, quality_score, rating, reviews_count, completed_orders, response_mins, ontime_rate
  ) VALUES (
    '00000000-0000-0000-0000-000000000011', 'creator', 'Kavya Menon', '@kavya.growth', 'D2C Growth Content Lead', 'Full-funnel D2C content: hook research, creative production, landing copy and post-launch analysis in one loop. I report on creative-level ROAS, not impressions, so every rupee of production spend is accountable.', 'Pune, IN',
    '{"ads","video","social","copy"}'::text[], '{"CapCut","Meta Ads Manager","ChatGPT","Canva","Google Analytics","Runway"}'::text[], '{"English","Malayalam","Hindi","Marathi"}'::text[], '{"d2c","food","fashion"}'::text[],
    true, 'verified', 92, 4.8,
    141, 259, 22, 0.98
  ) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name, handle = EXCLUDED.handle, title = EXCLUDED.title, bio = EXCLUDED.bio;

INSERT INTO public.portfolio_items (
        creator_id, title, kind, metric, commercial_rights, tools_used, is_published
      ) VALUES (
        '00000000-0000-0000-0000-000000000011', 'Beverage launch funnel', 'Campaign', '3.4x ROAS',
        'Full commercial license included', '{"CapCut","Meta Ads Manager","ChatGPT"}'::text[], true
      );
INSERT INTO public.portfolio_items (
        creator_id, title, kind, metric, commercial_rights, tools_used, is_published
      ) VALUES (
        '00000000-0000-0000-0000-000000000011', 'Skincare always-on', 'Monthly', '-28% CPA',
        'Full commercial license included', '{"CapCut","Meta Ads Manager","ChatGPT"}'::text[], true
      );
INSERT INTO public.portfolio_items (
        creator_id, title, kind, metric, commercial_rights, tools_used, is_published
      ) VALUES (
        '00000000-0000-0000-0000-000000000011', 'Festive sale creative', 'Campaign', '₹2.1Cr GMV',
        'Full commercial license included', '{"CapCut","Meta Ads Manager","ChatGPT"}'::text[], true
      );
INSERT INTO public.profiles (
    id, role, name, handle, title, bio, location, categories, tools, languages, niches,
    verified, verification_status, quality_score, rating, reviews_count, completed_orders, response_mins, ontime_rate
  ) VALUES (
    '00000000-0000-0000-0000-000000000012', 'creator', 'Liam O''Connor', '@liam.prompt', 'Prompt Engineer & AI Trainer', 'I train your team to get reliable output from AI instead of lucky output. Custom prompt systems, evaluation rubrics, failure-mode catalogues and hands-on workshops. Regulated industries are my speciality.', 'Dublin, IE',
    '{"copy","social","aiart"}'::text[], '{"ChatGPT","Claude","Gemini","Midjourney","Notion AI","Whisper"}'::text[], '{"English","Irish"}'::text[], '{"saas","fintech","health"}'::text[],
    true, 'verified', 92, 4.7,
    82, 136, 65, 0.96
  ) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name, handle = EXCLUDED.handle, title = EXCLUDED.title, bio = EXCLUDED.bio;

INSERT INTO public.portfolio_items (
        creator_id, title, kind, metric, commercial_rights, tools_used, is_published
      ) VALUES (
        '00000000-0000-0000-0000-000000000012', 'Bank prompt governance', 'Training', '340 staff',
        'Full commercial license included', '{"ChatGPT","Claude","Gemini"}'::text[], true
      );
INSERT INTO public.portfolio_items (
        creator_id, title, kind, metric, commercial_rights, tools_used, is_published
      ) VALUES (
        '00000000-0000-0000-0000-000000000012', 'Eval rubric system', 'QA', '12 criteria',
        'Full commercial license included', '{"ChatGPT","Claude","Gemini"}'::text[], true
      );
INSERT INTO public.portfolio_items (
        creator_id, title, kind, metric, commercial_rights, tools_used, is_published
      ) VALUES (
        '00000000-0000-0000-0000-000000000012', 'Agency workshop', 'Training', '4 sessions',
        'Full commercial license included', '{"ChatGPT","Claude","Gemini"}'::text[], true
      );
INSERT INTO public.gigs (
    id, creator_id, title, category, description, tools, packages, views, orders, queue, rating, trending, is_published
  ) VALUES (
    'g01', '00000000-0000-0000-0000-000000000001', 'Produce scroll-stopping AI reels for your brand', 'video', 'Produce scroll-stopping AI reels for your brand',
    '{}'::text[], '{"basic":{"name":"Starter","price":4999,"deliveryDays":3,"revisions":1,"units":"2 reels","includes":["2 finished reels","1 hook variant each","Burned captions","1 revision round"]},"standard":{"name":"Growth","price":11999,"deliveryDays":5,"revisions":2,"units":"5 reels","includes":["5 finished reels","3 hook variants each","AI b-roll generation","Caption + SRT files","Trending audio curation","2 revision rounds"]},"premium":{"name":"Scale","price":24999,"deliveryDays":8,"revisions":4,"units":"12 reels + strategy","includes":["12 finished reels","Content strategy doc","Hook research report","Full asset source files","Thumbnail variants","Priority queue","4 revision rounds"]}}'::jsonb, 8930, 412,
    4, 4.9, true, true
  ) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.gigs (
    id, creator_id, title, category, description, tools, packages, views, orders, queue, rating, trending, is_published
  ) VALUES (
    'g02', '00000000-0000-0000-0000-000000000001', 'Edit your YouTube video for maximum retention', 'youtube', 'Edit your YouTube video for maximum retention',
    '{}'::text[], '{"basic":{"name":"Short cut","price":3999,"deliveryDays":3,"revisions":1,"units":"Up to 8 min","includes":["Edit up to 8 minutes","Basic colour + audio","Captions","1 revision round"]},"standard":{"name":"Standard","price":8999,"deliveryDays":5,"revisions":2,"units":"Up to 20 min","includes":["Edit up to 20 minutes","Motion graphics + b-roll","Retention restructure","Chapters + thumbnails","2 revision rounds"]},"premium":{"name":"Channel partner","price":34999,"deliveryDays":14,"revisions":5,"units":"4 videos / month","includes":["4 videos per month","Channel analytics review","Format strategy session","Dedicated Slack channel","5 revision rounds"]}}'::jsonb, 3120, 96,
    2, 4.8, false, true
  ) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.gigs (
    id, creator_id, title, category, description, tools, packages, views, orders, queue, rating, trending, is_published
  ) VALUES (
    'g03', '00000000-0000-0000-0000-000000000002', 'Build a consistent AI art system for your brand', 'aiart', 'Build a consistent AI art system for your brand',
    '{}'::text[], '{"basic":{"name":"Explore","price":7999,"deliveryDays":4,"revisions":2,"units":"10 assets","includes":["10 curated assets","Base prompt set","Style direction board","2 revision rounds"]},"standard":{"name":"System","price":22999,"deliveryDays":8,"revisions":3,"units":"30 assets + prompt system","includes":["30 curated assets","Full prompt library","Style reference training set","Usage guidelines","3 revision rounds"]},"premium":{"name":"Studio","price":54999,"deliveryDays":15,"revisions":5,"units":"80 assets + team handoff","includes":["80 curated assets","Documented prompt system","Team training call","Quarterly refresh licence","Source files + seeds","5 revision rounds"]}}'::jsonb, 12400, 231,
    6, 4.9, true, true
  ) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.gigs (
    id, creator_id, title, category, description, tools, packages, views, orders, queue, rating, trending, is_published
  ) VALUES (
    'g04', '00000000-0000-0000-0000-000000000002', 'Create editorial illustration for your article or deck', 'aiart', 'Create editorial illustration for your article or deck',
    '{}'::text[], '{"basic":{"name":"Single","price":2499,"deliveryDays":2,"revisions":1,"units":"1 illustration","includes":["1 illustration","Web + print resolution","1 revision"]},"standard":{"name":"Set of 4","price":8499,"deliveryDays":5,"revisions":2,"units":"4 illustrations","includes":["4 cohesive illustrations","Shared style reference","Multiple crops","2 revisions"]},"premium":{"name":"Series of 10","price":18999,"deliveryDays":10,"revisions":3,"units":"10 illustrations","includes":["10 illustrations","Full style guide","Source files","Extended licence","3 revisions"]}}'::jsonb, 4210, 74,
    3, 4.7, false, true
  ) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.gigs (
    id, creator_id, title, category, description, tools, packages, views, orders, queue, rating, trending, is_published
  ) VALUES (
    'g05', '00000000-0000-0000-0000-000000000003', 'Write SEO blog articles that actually rank', 'copy', 'Write SEO blog articles that actually rank',
    '{}'::text[], '{"basic":{"name":"1 article","price":2999,"deliveryDays":3,"revisions":1,"units":"1200 words","includes":["1 article up to 1200 words","Keyword research","Meta tags","1 revision"]},"standard":{"name":"4 articles","price":10499,"deliveryDays":8,"revisions":2,"units":"4 x 1500 words","includes":["4 articles up to 1500 words","Topic cluster strategy","Internal linking map","Meta tags each","2 revisions"]},"premium":{"name":"12 article engine","price":27999,"deliveryDays":20,"revisions":3,"units":"12 x 1800 words","includes":["12 articles up to 1800 words","Full content calendar","Competitor gap analysis","CMS upload","Performance review at day 30","3 revisions"]}}'::jsonb, 15200, 389,
    5, 4.9, true, true
  ) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.gigs (
    id, creator_id, title, category, description, tools, packages, views, orders, queue, rating, trending, is_published
  ) VALUES (
    'g06', '00000000-0000-0000-0000-000000000003', 'Rewrite your landing page for higher conversion', 'copy', 'Rewrite your landing page for higher conversion',
    '{}'::text[], '{"basic":{"name":"Hero refresh","price":3999,"deliveryDays":3,"revisions":1,"units":"Above the fold","includes":["Hero + first section rewrite","10 headline variants","CTA options","1 revision"]},"standard":{"name":"Full page","price":12999,"deliveryDays":6,"revisions":2,"units":"Whole landing page","includes":["Complete page copy","Message-match audit","Objection FAQ","A/B test plan","2 revisions"]},"premium":{"name":"Funnel","price":29999,"deliveryDays":12,"revisions":3,"units":"Landing + 5 emails","includes":["Landing page copy","5-email nurture sequence","Ad copy variants","Analytics event spec","30-day performance review","3 revisions"]}}'::jsonb, 6780, 143,
    2, 4.8, false, true
  ) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.gigs (
    id, creator_id, title, category, description, tools, packages, views, orders, queue, rating, trending, is_published
  ) VALUES (
    'g07', '00000000-0000-0000-0000-000000000004', 'Deliver multilingual AI voiceover with real direction', 'voice', 'Deliver multilingual AI voiceover with real direction',
    '{}'::text[], '{"basic":{"name":"Up to 2 min","price":1999,"deliveryDays":2,"revisions":1,"units":"1 language","includes":["Up to 2 minutes","1 language","WAV + MP3","1 revision"]},"standard":{"name":"Up to 10 min","price":6499,"deliveryDays":3,"revisions":2,"units":"2 languages","includes":["Up to 10 minutes","2 languages","Loudness mastering","Timed script","2 revisions"]},"premium":{"name":"Course pack","price":18999,"deliveryDays":7,"revisions":3,"units":"Up to 60 min, 4 languages","includes":["Up to 60 minutes","4 languages","Character voices","Chapter splitting","Full rights transfer","3 revisions"]}}'::jsonb, 5340, 187,
    3, 4.7, false, true
  ) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.gigs (
    id, creator_id, title, category, description, tools, packages, views, orders, queue, rating, trending, is_published
  ) VALUES (
    'g08', '00000000-0000-0000-0000-000000000005', 'Run your entire monthly social content engine', 'social', 'Run your entire monthly social content engine',
    '{}'::text[], '{"basic":{"name":"1 platform","price":34999,"deliveryDays":7,"revisions":2,"units":"12 posts / month","includes":["12 posts per month","1 platform","Calendar + captions","Monthly report"]},"standard":{"name":"3 platforms","price":74999,"deliveryDays":7,"revisions":3,"units":"30 posts / month","includes":["30 posts per month","3 platforms","Short-form video (6)","Community management","Monthly strategy call"]},"premium":{"name":"Full stack","price":149999,"deliveryDays":7,"revisions":4,"units":"60 posts / month","includes":["60 posts per month","All platforms","Paid creative support","Influencer coordination","Weekly reporting","Dedicated Slack"]}}'::jsonb, 9870, 156,
    8, 4.8, true, true
  ) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.gigs (
    id, creator_id, title, category, description, tools, packages, views, orders, queue, rating, trending, is_published
  ) VALUES (
    'g09', '00000000-0000-0000-0000-000000000006', 'Produce a test batch of performance ad creatives', 'ads', 'Produce a test batch of performance ad creatives',
    '{}'::text[], '{"basic":{"name":"10 statics","price":3999,"deliveryDays":2,"revisions":1,"units":"10 creatives","includes":["10 static creatives","3 platform sizes","Angle tags","1 revision"]},"standard":{"name":"25 mixed","price":9499,"deliveryDays":4,"revisions":2,"units":"25 creatives","includes":["18 static + 7 motion","All platform sizes","Hook tagging sheet","Test plan","2 revisions"]},"premium":{"name":"50 scale batch","price":17999,"deliveryDays":7,"revisions":3,"units":"50 creatives","includes":["50 mixed creatives","Copy variants per creative","Full test matrix","Weekly refresh cadence","3 revisions"]}}'::jsonb, 11300, 298,
    7, 4.6, true, true
  ) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.gigs (
    id, creator_id, title, category, description, tools, packages, views, orders, queue, rating, trending, is_published
  ) VALUES (
    'g10', '00000000-0000-0000-0000-000000000007', 'Direct a broadcast-grade AI brand film', 'video', 'Direct a broadcast-grade AI brand film',
    '{}'::text[], '{"basic":{"name":"15 sec","price":44999,"deliveryDays":8,"revisions":2,"units":"15 second film","includes":["15 second film","Storyboard","Sound design","2 revisions"]},"standard":{"name":"45 sec","price":119999,"deliveryDays":14,"revisions":3,"units":"45 second film","includes":["45 second film","Animatic approval stage","Original score","3 social cutdowns","3 revisions"]},"premium":{"name":"90 sec launch","price":249999,"deliveryDays":24,"revisions":5,"units":"90 second film","includes":["90 second film","Full pre-production","Original score + mix","Vertical + horizontal masters","On-set direction call","5 revisions"]}}'::jsonb, 14700, 121,
    5, 5, true, true
  ) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.gigs (
    id, creator_id, title, category, description, tools, packages, views, orders, queue, rating, trending, is_published
  ) VALUES (
    'g11', '00000000-0000-0000-0000-000000000008', 'Design a complete bilingual brand identity', 'brand', 'Design a complete bilingual brand identity',
    '{}'::text[], '{"basic":{"name":"Logo only","price":14999,"deliveryDays":5,"revisions":2,"units":"1 logo system","includes":["Primary logo + 2 alternates","Colour palette","Source files","2 revisions"]},"standard":{"name":"Identity","price":44999,"deliveryDays":12,"revisions":3,"units":"Full identity","includes":["Logo system","Typography + colour","20-page brand book","Stationery + social kit","3 revisions"]},"premium":{"name":"Bilingual system","price":94999,"deliveryDays":20,"revisions":4,"units":"AR + EN identity","includes":["Arabic-Latin logotype pair","Complete identity system","48-page brand book","Motion logo","Packaging direction","4 revisions"]}}'::jsonb, 7620, 134,
    4, 4.9, false, true
  ) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.gigs (
    id, creator_id, title, category, description, tools, packages, views, orders, queue, rating, trending, is_published
  ) VALUES (
    'g12', '00000000-0000-0000-0000-000000000009', 'Create an AI avatar spokesperson for your product', 'avatar', 'Create an AI avatar spokesperson for your product',
    '{}'::text[], '{"basic":{"name":"Single video","price":5999,"deliveryDays":3,"revisions":1,"units":"1 language, 60 sec","includes":["60 second avatar video","1 language","Stock presenter","Disclosure label"]},"standard":{"name":"Localised set","price":16999,"deliveryDays":6,"revisions":2,"units":"5 languages","includes":["60 second master","5 language variants","Custom presenter build","Rights documentation","2 revisions"]},"premium":{"name":"UGC campaign","price":39999,"deliveryDays":10,"revisions":3,"units":"12 videos","includes":["12 UGC-style videos","6 presenter personas","8 languages","Full consent pack","Ad-ready exports","3 revisions"]}}'::jsonb, 10200, 178,
    6, 4.7, true, true
  ) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.gigs (
    id, creator_id, title, category, description, tools, packages, views, orders, queue, rating, trending, is_published
  ) VALUES (
    'g13', '00000000-0000-0000-0000-00000000000a', 'Restructure your YouTube format around retention data', 'youtube', 'Restructure your YouTube format around retention data',
    '{}'::text[], '{"basic":{"name":"Audit","price":9999,"deliveryDays":5,"revisions":1,"units":"Report only","includes":["Channel retention audit","Drop-off analysis","Recommendation doc","1 strategy call"]},"standard":{"name":"Rebuild","price":34999,"deliveryDays":14,"revisions":2,"units":"Audit + 4 videos","includes":["Full audit","New format spec","4 edited videos","Thumbnail system","2 revisions"]},"premium":{"name":"Growth partner","price":89999,"deliveryDays":30,"revisions":4,"units":"Audit + 8 videos","includes":["Full audit + rebuild","8 edited videos","A/B title testing","Monthly analytics review","Dedicated Slack","4 revisions"]}}'::jsonb, 8340, 212,
    3, 4.8, false, true
  ) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.gigs (
    id, creator_id, title, category, description, tools, packages, views, orders, queue, rating, trending, is_published
  ) VALUES (
    'g14', '00000000-0000-0000-0000-00000000000b', 'Compose an original AI score with clean rights', 'music', 'Compose an original AI score with clean rights',
    '{}'::text[], '{"basic":{"name":"Single track","price":6999,"deliveryDays":4,"revisions":2,"units":"1 track up to 3 min","includes":["1 original track","Full mix + stems","30 sec edit","2 revisions"]},"standard":{"name":"EP pack","price":19999,"deliveryDays":9,"revisions":3,"units":"4 tracks","includes":["4 original tracks","Stems for each","Loop versions","Rights transfer","3 revisions"]},"premium":{"name":"Sonic identity","price":54999,"deliveryDays":18,"revisions":4,"units":"Full audio brand","includes":["8 tracks + 3 sec sting","Adaptive game-ready layers","Audio brand guidelines","Full buyout rights","4 revisions"]}}'::jsonb, 4980, 88,
    2, 4.9, false, true
  ) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.gigs (
    id, creator_id, title, category, description, tools, packages, views, orders, queue, rating, trending, is_published
  ) VALUES (
    'g15', '00000000-0000-0000-0000-00000000000c', 'Build your team''s AI content operations pipeline', 'social', 'Build your team''s AI content operations pipeline',
    '{}'::text[], '{"basic":{"name":"Audit","price":24999,"deliveryDays":7,"revisions":1,"units":"Assessment","includes":["Current-state audit","Opportunity map","Tooling recommendation","1 workshop"]},"standard":{"name":"Build","price":74999,"deliveryDays":21,"revisions":2,"units":"Full pipeline","includes":["Prompt library (100+)","Review gates","Asset taxonomy","Automation setup","Team onboarding"]},"premium":{"name":"Build + embed","price":174999,"deliveryDays":45,"revisions":3,"units":"Pipeline + 3 months support","includes":["Everything in Build","3 months embedded support","Eval rubrics","Quarterly optimisation","Leadership reporting pack"]}}'::jsonb, 3870, 62,
    3, 4.7, false, true
  ) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.gigs (
    id, creator_id, title, category, description, tools, packages, views, orders, queue, rating, trending, is_published
  ) VALUES (
    'g16', '00000000-0000-0000-0000-00000000000d', 'Generate on-model fashion visuals from your garment photos', 'aiart', 'Generate on-model fashion visuals from your garment photos',
    '{}'::text[], '{"basic":{"name":"5 looks","price":8999,"deliveryDays":4,"revisions":2,"units":"5 outfits","includes":["5 on-model looks","1 scene each","Web resolution","2 revisions"]},"standard":{"name":"15 looks","price":22999,"deliveryDays":8,"revisions":3,"units":"15 outfits","includes":["15 on-model looks","2 scenes each","White background cuts","Retouched masters","3 revisions"]},"premium":{"name":"Full lookbook","price":54999,"deliveryDays":15,"revisions":4,"units":"40 outfits","includes":["40 on-model looks","Art-directed campaign set","Print resolution","Model consistency across set","Extended licence","4 revisions"]}}'::jsonb, 9430, 167,
    5, 4.8, true, true
  ) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.gigs (
    id, creator_id, title, category, description, tools, packages, views, orders, queue, rating, trending, is_published
  ) VALUES (
    'g17', '00000000-0000-0000-0000-00000000000e', 'Write a long-form script with real narrative structure', 'copy', 'Write a long-form script with real narrative structure',
    '{}'::text[], '{"basic":{"name":"Short script","price":4999,"deliveryDays":3,"revisions":2,"units":"Up to 8 min","includes":["Script up to 8 minutes","Beat sheet","3 hook options","2 revisions"]},"standard":{"name":"Feature script","price":13999,"deliveryDays":7,"revisions":3,"units":"Up to 25 min","includes":["Script up to 25 minutes","Timecoded beats","B-roll direction","5 hook options","3 revisions"]},"premium":{"name":"Series bible","price":39999,"deliveryDays":18,"revisions":4,"units":"6 episode scripts","includes":["6 episode scripts","Series narrative arc","Character/format bible","Production notes","4 revisions"]}}'::jsonb, 4120, 79,
    2, 4.6, false, true
  ) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.gigs (
    id, creator_id, title, category, description, tools, packages, views, orders, queue, rating, trending, is_published
  ) VALUES (
    'g18', '00000000-0000-0000-0000-00000000000f', 'Produce course modules designed for completion', 'video', 'Produce course modules designed for completion',
    '{}'::text[], '{"basic":{"name":"5 micro-lessons","price":14999,"deliveryDays":7,"revisions":2,"units":"5 x 3 min","includes":["5 micro-lessons","Scripts + visuals","Knowledge checks","2 revisions"]},"standard":{"name":"Full module","price":44999,"deliveryDays":16,"revisions":3,"units":"12 lessons","includes":["12 lessons","Instructional design doc","Assessment bank","LMS-ready SCORM","3 revisions"]},"premium":{"name":"Course library","price":129999,"deliveryDays":40,"revisions":4,"units":"40 lessons","includes":["40 lessons across 4 modules","Learner journey map","Full assessment system","Avatar presenter build","Analytics spec","4 revisions"]}}'::jsonb, 7890, 143,
    4, 4.9, true, true
  ) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.gigs (
    id, creator_id, title, category, description, tools, packages, views, orders, queue, rating, trending, is_published
  ) VALUES (
    'g19', '00000000-0000-0000-0000-000000000010', 'Virtually stage your property listing in 48 hours', 'aiart', 'Virtually stage your property listing in 48 hours',
    '{}'::text[], '{"basic":{"name":"5 rooms","price":4999,"deliveryDays":2,"revisions":1,"units":"5 images","includes":["5 staged rooms","Daylight lighting","MLS sizing","1 revision"]},"standard":{"name":"12 rooms","price":10999,"deliveryDays":3,"revisions":2,"units":"12 images","includes":["12 staged rooms","2 twilight exteriors","Before/after set","2 revisions"]},"premium":{"name":"Full listing kit","price":22999,"deliveryDays":5,"revisions":3,"units":"25 images + video","includes":["25 staged images","Twilight set","Walkthrough video","Floor plan render","Agent social pack","3 revisions"]}}'::jsonb, 3240, 91,
    2, 4.5, false, true
  ) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.gigs (
    id, creator_id, title, category, description, tools, packages, views, orders, queue, rating, trending, is_published
  ) VALUES (
    'g20', '00000000-0000-0000-0000-000000000011', 'Launch a full-funnel D2C campaign with creative-level ROAS', 'ads', 'Launch a full-funnel D2C campaign with creative-level ROAS',
    '{}'::text[], '{"basic":{"name":"Creative sprint","price":19999,"deliveryDays":7,"revisions":2,"units":"15 creatives","includes":["Hook research","15 creatives","Copy variants","2 revisions"]},"standard":{"name":"Launch","price":54999,"deliveryDays":14,"revisions":3,"units":"40 creatives + plan","includes":["40 creatives","Landing page copy","Media plan","Audience structure","Launch support","3 revisions"]},"premium":{"name":"Growth partner","price":124999,"deliveryDays":30,"revisions":4,"units":"Monthly retainer","includes":["Unlimited creative refresh","Weekly ROAS review","Landing page CRO","Creative-level attribution","Dedicated Slack","4 revisions"]}}'::jsonb, 8760, 152,
    6, 4.8, true, true
  ) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.gigs (
    id, creator_id, title, category, description, tools, packages, views, orders, queue, rating, trending, is_published
  ) VALUES (
    'g21', '00000000-0000-0000-0000-000000000012', 'Train your team to get reliable AI output', 'copy', 'Train your team to get reliable AI output',
    '{}'::text[], '{"basic":{"name":"Half-day workshop","price":34999,"deliveryDays":5,"revisions":1,"units":"Up to 20 people","includes":["4-hour live workshop","Prompt starter pack","Recording","Handout"]},"standard":{"name":"Team programme","price":94999,"deliveryDays":14,"revisions":2,"units":"Up to 100 people","includes":["4 sessions","Custom prompt library","Eval rubric","Role-specific tracks","Handbook"]},"premium":{"name":"Enterprise governance","price":249999,"deliveryDays":35,"revisions":3,"units":"Unlimited seats","includes":["Full programme","Governance framework","Failure-mode catalogue","Compliance review pack","3 months support","Certification track"]}}'::jsonb, 5430, 71,
    3, 4.7, false, true
  ) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.gigs (
    id, creator_id, title, category, description, tools, packages, views, orders, queue, rating, trending, is_published
  ) VALUES (
    'g22', '00000000-0000-0000-0000-000000000005', 'Turn one idea into a week of short-form content', 'video', 'Turn one idea into a week of short-form content',
    '{}'::text[], '{"basic":{"name":"3 clips","price":6999,"deliveryDays":3,"revisions":1,"units":"3 clips","includes":["3 vertical clips","Captions","1 revision"]},"standard":{"name":"7 clips","price":14999,"deliveryDays":5,"revisions":2,"units":"7 clips","includes":["7 vertical clips","Hook variants","Cover frames","Posting schedule","2 revisions"]},"premium":{"name":"14 clips + calendar","price":27999,"deliveryDays":9,"revisions":3,"units":"14 clips","includes":["14 vertical clips","Full month calendar","Trend research","Platform-native variants","3 revisions"]}}'::jsonb, 6120, 84,
    4, 4.7, false, true
  ) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.gigs (
    id, creator_id, title, category, description, tools, packages, views, orders, queue, rating, trending, is_published
  ) VALUES (
    'g23', '00000000-0000-0000-0000-000000000009', 'Produce a UGC-style testimonial pack for paid social', 'ads', 'Produce a UGC-style testimonial pack for paid social',
    '{}'::text[], '{"basic":{"name":"4 videos","price":9999,"deliveryDays":4,"revisions":1,"units":"4 videos","includes":["4 UGC videos","2 personas","Disclosure labels","1 revision"]},"standard":{"name":"10 videos","price":21999,"deliveryDays":7,"revisions":2,"units":"10 videos","includes":["10 UGC videos","5 personas","Objection-based scripts","All ad crops","2 revisions"]},"premium":{"name":"24 video library","price":47999,"deliveryDays":14,"revisions":3,"units":"24 videos","includes":["24 UGC videos","10 personas","Funnel-stage scripts","Localisation to 6 languages","Rights pack","3 revisions"]}}'::jsonb, 4560, 97,
    3, 4.6, false, true
  ) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.gigs (
    id, creator_id, title, category, description, tools, packages, views, orders, queue, rating, trending, is_published
  ) VALUES (
    'g24', '00000000-0000-0000-0000-00000000000d', 'Design product ad creatives that stop the scroll', 'ads', 'Design product ad creatives that stop the scroll',
    '{}'::text[], '{"basic":{"name":"8 creatives","price":5999,"deliveryDays":3,"revisions":2,"units":"8 creatives","includes":["8 static creatives","3 aspect ratios","1 revision set"]},"standard":{"name":"20 creatives","price":13999,"deliveryDays":6,"revisions":3,"units":"20 creatives","includes":["20 static creatives","All placements","Copy overlay variants","Source files","3 revisions"]},"premium":{"name":"45 + motion","price":32999,"deliveryDays":12,"revisions":4,"units":"45 static + 10 motion","includes":["45 statics + 10 motion","Full placement matrix","Seasonal variants","Brand template handoff","4 revisions"]}}'::jsonb, 5230, 88,
    4, 4.7, false, true
  ) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.gigs (
    id, creator_id, title, category, description, tools, packages, views, orders, queue, rating, trending, is_published
  ) VALUES (
    'g25', '00000000-0000-0000-0000-00000000000f', 'Build a consent-cleared AI instructor for your course', 'avatar', 'Build a consent-cleared AI instructor for your course',
    '{}'::text[], '{"basic":{"name":"Avatar build","price":18999,"deliveryDays":6,"revisions":2,"units":"1 presenter","includes":["Custom presenter build","3 sample clips","Style guide","Consent docs"]},"standard":{"name":"Build + 10 lessons","price":54999,"deliveryDays":16,"revisions":3,"units":"10 lessons","includes":["Presenter build","10 produced lessons","Script writing","Slides + b-roll","3 revisions"]},"premium":{"name":"Full course","price":139999,"deliveryDays":35,"revisions":4,"units":"30 lessons","includes":["30 lessons","Multilingual variants (4)","Assessment integration","LMS packaging","Regeneration licence","4 revisions"]}}'::jsonb, 3980, 64,
    2, 4.8, false, true
  ) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.gigs (
    id, creator_id, title, category, description, tools, packages, views, orders, queue, rating, trending, is_published
  ) VALUES (
    'g26', '00000000-0000-0000-0000-000000000006', 'Generate a month of social visuals in one batch', 'aiart', 'Generate a month of social visuals in one batch',
    '{}'::text[], '{"basic":{"name":"10 visuals","price":2999,"deliveryDays":2,"revisions":1,"units":"10 visuals","includes":["10 visuals","2 sizes","Captions"]},"standard":{"name":"30 visuals","price":7499,"deliveryDays":5,"revisions":2,"units":"30 visuals","includes":["30 visuals","Editable templates","All sizes","Caption set","2 revisions"]},"premium":{"name":"90 + system","price":17999,"deliveryDays":12,"revisions":3,"units":"90 visuals","includes":["90 visuals (3 months)","Template system handoff","Brand guidelines","Team training","3 revisions"]}}'::jsonb, 4670, 103,
    5, 4.5, false, true
  ) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.gigs (
    id, creator_id, title, category, description, tools, packages, views, orders, queue, rating, trending, is_published
  ) VALUES (
    'g27', '00000000-0000-0000-0000-000000000011', 'Audit and fix your underperforming content funnel', 'social', 'Audit and fix your underperforming content funnel',
    '{}'::text[], '{"basic":{"name":"Creative audit","price":12999,"deliveryDays":5,"revisions":1,"units":"Creative only","includes":["Ad creative audit","Hook performance analysis","Gap list","1 call"]},"standard":{"name":"Full funnel","price":34999,"deliveryDays":10,"revisions":2,"units":"Creative + landing + email","includes":["Full funnel diagnostic","Benchmark comparison","Prioritised backlog","Roadmap","2 calls"]},"premium":{"name":"Fix + implement","price":89999,"deliveryDays":25,"revisions":3,"units":"Audit + execution","includes":["Full audit","Top 10 fixes implemented","New creative batch","30-day performance tracking","3 calls"]}}'::jsonb, 5890, 76,
    3, 4.8, false, true
  ) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.gigs (
    id, creator_id, title, category, description, tools, packages, views, orders, queue, rating, trending, is_published
  ) VALUES (
    'g28', '00000000-0000-0000-0000-00000000000b', 'Design the sound for your app, game or film', 'voice', 'Design the sound for your app, game or film',
    '{}'::text[], '{"basic":{"name":"10 SFX","price":5999,"deliveryDays":4,"revisions":2,"units":"10 effects","includes":["10 custom SFX","WAV masters","Implementation notes"]},"standard":{"name":"30 SFX + ambience","price":16999,"deliveryDays":9,"revisions":3,"units":"30 effects","includes":["30 custom SFX","5 ambience beds","Game-ready naming","3 revisions"]},"premium":{"name":"Full audio package","price":44999,"deliveryDays":18,"revisions":4,"units":"80 effects + score","includes":["80 SFX","Adaptive ambience","UI sound system","Original score elements","Engine integration guide","4 revisions"]}}'::jsonb, 2870, 47,
    2, 4.8, false, true
  ) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.gigs (
    id, creator_id, title, category, description, tools, packages, views, orders, queue, rating, trending, is_published
  ) VALUES (
    'g29', '00000000-0000-0000-0000-000000000012', 'Write your AI usage and disclosure policy', 'social', 'Write your AI usage and disclosure policy',
    '{}'::text[], '{"basic":{"name":"Starter policy","price":19999,"deliveryDays":7,"revisions":2,"units":"1 document","includes":["Core AI content policy","Disclosure templates","Team FAQ"]},"standard":{"name":"Policy + workflow","price":54999,"deliveryDays":14,"revisions":3,"units":"Policy + process","includes":["Full policy suite","Review workflow design","Risk register","Rollout plan","Leadership briefing"]},"premium":{"name":"Regulated programme","price":139999,"deliveryDays":30,"revisions":4,"units":"Enterprise","includes":["Everything in Standard","Legal/compliance review pack","Vendor assessment framework","Audit trail design","6 months advisory"]}}'::jsonb, 3410, 39,
    2, 4.6, false, true
  ) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.gigs (
    id, creator_id, title, category, description, tools, packages, views, orders, queue, rating, trending, is_published
  ) VALUES (
    'g30', '00000000-0000-0000-0000-00000000000a', 'Repurpose your podcast into clips that perform', 'video', 'Repurpose your podcast into clips that perform',
    '{}'::text[], '{"basic":{"name":"5 clips","price":5499,"deliveryDays":3,"revisions":1,"units":"1 episode","includes":["5 clips","Captions","Cover frames","1 revision"]},"standard":{"name":"12 clips","price":12999,"deliveryDays":5,"revisions":2,"units":"1 episode","includes":["12 clips","Moment detection report","Show notes draft","All platform crops","2 revisions"]},"premium":{"name":"Monthly (4 eps)","price":42999,"deliveryDays":20,"revisions":3,"units":"4 episodes","includes":["48 clips per month","Full repurposing pipeline","Newsletter draft","Performance review","3 revisions"]}}'::jsonb, 7240, 118,
    5, 4.9, true, true
  ) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.gigs (
    id, creator_id, title, category, description, tools, packages, views, orders, queue, rating, trending, is_published
  ) VALUES (
    'g31', '00000000-0000-0000-0000-00000000000c', 'Create a prompt library for your marketing team', 'copy', 'Create a prompt library for your marketing team',
    '{}'::text[], '{"basic":{"name":"25 prompts","price":14999,"deliveryDays":6,"revisions":2,"units":"25 prompts","includes":["25 tested prompts","Usage notes","1 walkthrough call"]},"standard":{"name":"100 prompts","price":39999,"deliveryDays":14,"revisions":3,"units":"100 prompts","includes":["100 prompts by role","Task mapping","Quality checklist","Handbook","2 walkthroughs"]},"premium":{"name":"Library + maintenance","price":94999,"deliveryDays":28,"revisions":4,"units":"250 prompts + 3 months","includes":["250 prompts","Versioned library in Notion","3 months updates","Eval rubric","Team certification"]}}'::jsonb, 2960, 44,
    2, 4.7, false, true
  ) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.gigs (
    id, creator_id, title, category, description, tools, packages, views, orders, queue, rating, trending, is_published
  ) VALUES (
    'g32', '00000000-0000-0000-0000-000000000004', 'Produce a brand jingle and sonic logo', 'music', 'Produce a brand jingle and sonic logo',
    '{}'::text[], '{"basic":{"name":"Sonic logo","price":8999,"deliveryDays":5,"revisions":2,"units":"1 logo","includes":["3-5 sec sonic logo","2 alternate versions","Master + stems"]},"standard":{"name":"Logo + jingle","price":22999,"deliveryDays":10,"revisions":3,"units":"Logo + 30 sec","includes":["Sonic logo","30 sec jingle","Radio master","Full stems","3 revisions"]},"premium":{"name":"Audio identity","price":59999,"deliveryDays":18,"revisions":4,"units":"Full system","includes":["Complete audio identity","UI sound set","Ad lengths (15/30/60)","Audio guidelines doc","Full buyout","4 revisions"]}}'::jsonb, 3540, 58,
    3, 4.6, false, true
  ) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.gigs (
    id, creator_id, title, category, description, tools, packages, views, orders, queue, rating, trending, is_published
  ) VALUES (
    'g33', '00000000-0000-0000-0000-000000000008', 'Illustrate your pitch deck with custom AI visuals', 'aiart', 'Illustrate your pitch deck with custom AI visuals',
    '{}'::text[], '{"basic":{"name":"5 visuals","price":6999,"deliveryDays":4,"revisions":2,"units":"5 visuals","includes":["5 custom visuals","Consistent style","PNG + SVG"]},"standard":{"name":"Full deck","price":19999,"deliveryDays":9,"revisions":3,"units":"15 visuals + icons","includes":["15 visuals","Diagram set","Icon system","Editable Figma","3 revisions"]},"premium":{"name":"Deck + brand","price":49999,"deliveryDays":16,"revisions":4,"units":"Full design system","includes":["Complete deck design","Visual system","Brand basics","Investor one-pager","Source files","4 revisions"]}}'::jsonb, 4890, 67,
    3, 4.8, false, true
  ) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.gigs (
    id, creator_id, title, category, description, tools, packages, views, orders, queue, rating, trending, is_published
  ) VALUES (
    'g34', '00000000-0000-0000-0000-000000000010', 'Create an AI-hosted property walkthrough video', 'avatar', 'Create an AI-hosted property walkthrough video',
    '{}'::text[], '{"basic":{"name":"60 sec tour","price":6999,"deliveryDays":3,"revisions":1,"units":"60 sec","includes":["60 second tour","Stock avatar host","Voiceover","Caption file"]},"standard":{"name":"2 min tour","price":14999,"deliveryDays":5,"revisions":2,"units":"2 min","includes":["2 minute tour","Custom-branded avatar","3 social cutdowns","Feature callouts","2 revisions"]},"premium":{"name":"Listing campaign","price":32999,"deliveryDays":9,"revisions":3,"units":"Tour + ad set","includes":["Full tour","6 ad cutdowns","Agent intro segment","Multilingual VO (2)","Portal-ready exports","3 revisions"]}}'::jsonb, 2410, 38,
    2, 4.4, false, true
  ) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.briefs (
    id, title, brand, category, language, quantity, deadline_days, budget_min, budget_max,
    description, deliverables, signals, status
  ) VALUES (
    'b01', 'Launch creative for a new cold-brew range', 'Sip Society', 'ads', 'English',
    24, 14, 40000, 90000,
    'We are launching three cold-brew SKUs in metro cities next month. Need a full creative batch for Meta and Instagram, plus landing page copy. Previous campaigns plateaued at 1.8x ROAS and we need to break 3x. Target audience is 22-32 urban professionals.', '["24 ad creatives","Hook research report","Landing page copy","Media plan"]'::jsonb,
    '{"tools":["Meta Ads Manager","Midjourney","CapCut"],"niches":["d2c","food"]}'::jsonb, 'open'
  ) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.briefs (
    id, title, brand, category, language, quantity, deadline_days, budget_min, budget_max,
    description, deliverables, signals, status
  ) VALUES (
    'b02', 'Convert our K-12 science syllabus into micro-modules', 'BrightPath Learning', 'video', 'English',
    60, 45, 120000, 250000,
    'We have 60 lessons of written curriculum that need to become 3-minute video micro-modules with knowledge checks. Completion rate on our current content is 31% and we want to double it. Must work for learners in Hindi and English medium.', '["60 micro-module videos","Knowledge check bank","LMS-ready exports","Scripts"]'::jsonb,
    '{"tools":["HeyGen","Descript","Canva"],"niches":["edtech"]}'::jsonb, 'open'
  ) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.briefs (
    id, title, brand, category, language, quantity, deadline_days, budget_min, budget_max,
    description, deliverables, signals, status
  ) VALUES (
    'b03', 'AI content governance and team training programme', 'Hibernia Bank', 'copy', 'English',
    1, 60, 200000, 400000,
    'Marketing team of 340 across four offices is using AI tools without any standard. We need a governance framework, disclosure policy and a tiered training programme. Regulated environment, so audit trails and compliance review are mandatory.', '["Governance framework","Disclosure policy","Training programme","Eval rubrics","Compliance pack"]'::jsonb,
    '{"tools":["ChatGPT","Claude","Notion AI"],"niches":["fintech","saas"]}'::jsonb, 'open'
  ) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.briefs (
    id, title, brand, category, language, quantity, deadline_days, budget_min, budget_max,
    description, deliverables, signals, status
  ) VALUES (
    'b04', 'SS26 lookbook without a physical photoshoot', 'Drape Studio', 'aiart', 'English',
    36, 21, 50000, 120000,
    'We have flat-lay photography of 36 garments and want an on-model lookbook. Fabric texture and colour accuracy are non-negotiable because returns spike when the product looks different online. Need e-commerce white background cuts too.', '["36 on-model looks","White background cuts","2 lifestyle scenes each","Print resolution files"]'::jsonb,
    '{"tools":["Midjourney","Flux","Stable Diffusion"],"niches":["fashion","d2c"]}'::jsonb, 'open'
  ) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.briefs (
    id, title, brand, category, language, quantity, deadline_days, budget_min, budget_max,
    description, deliverables, signals, status
  ) VALUES (
    'b05', 'Fix retention on our 400k-subscriber tech channel', 'DeepDive Tech', 'youtube', 'English',
    8, 30, 80000, 150000,
    'Average view duration dropped from 6:30 to 4:10 over two quarters. We need someone who reads analytics, not just cuts footage. Eight videos to start, with a format rebuild we can keep using.', '["Retention audit","New format spec","8 edited videos","Thumbnail system"]'::jsonb,
    '{"tools":["Premiere Pro","After Effects","Google Analytics"],"niches":["saas","edtech"]}'::jsonb, 'open'
  ) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.briefs (
    id, title, brand, category, language, quantity, deadline_days, budget_min, budget_max,
    description, deliverables, signals, status
  ) VALUES (
    'b06', 'Bilingual Arabic-English identity for three locations', 'Saffron House', 'brand', 'Arabic',
    1, 40, 90000, 180000,
    'Expanding to three locations and the current identity does not work in Arabic. Need a proper bilingual logotype, not a translation bolted on. Full brand book and packaging direction for our retail line.', '["Bilingual logo system","48-page brand book","Packaging direction","Signage spec"]'::jsonb,
    '{"tools":["Figma","Ideogram"],"niches":["food"]}'::jsonb, 'open'
  ) ON CONFLICT (id) DO NOTHING;

COMMIT;
