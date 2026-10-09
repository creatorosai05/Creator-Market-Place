# CreatorOS AI — AI Content Creator Marketplace

[![Build & Test](https://img.shields.io/badge/Build%20%26%20Test-Passing-mint?style=flat-square)](#testing)
[![HacXLerate](https://img.shields.io/badge/Challenge-02%20AI%20Creator%20Marketplace-violet?style=flat-square)](https://hacxlerate.com)
[![Supabase](https://img.shields.io/badge/Database-Supabase%20PostgreSQL-3ECF8E?style=flat-square&logo=supabase)](#supabase-integration)
[![Deploy](https://img.shields.io/badge/Deploy-Vercel-black?style=flat-square&logo=vercel)](#deployment)

**CreatorOS AI** connects brands with AI-native creators (video, art, copy, voice, 3D, and workflow engineers) through an **explainable matching engine**, AI-assisted brief structuring, and transparent commercial-rights verification.

---

## 🌟 Key Capabilities

1. **AI-Assisted Brief Builder (`brief.html`)**:
   - Transforms rough natural-language project descriptions into structured briefs with deliverable counts, platform targets, and complexity ratings.
   - Dynamic market price estimator benchmarked against comparable marketplace listings.
   - Trust and risk assessment flagging tight turnaround, commercial rights ambiguities, and prompt reproducibility.
   - Enforces commercial license requirements (Full Commercial, Buyout, Digital Only).

2. **Explainable Matching Engine**:
   - Deconstructs match scores across 7 weighted dimensions: Category Alignment (26%), Industry Niche (8%), Keyword Relevance (8%), AI Toolchain Match (12%), Budget Clearance (18%), Creator Reputation (14%), and Real-Time Queue Capacity (8%).
   - Transparent written justification for every candidate.

3. **Creator Studio & Seller OS (`creator-dashboard.html`)**:
   - Order pipeline with escrow milestone tracking.
   - AI Pricing Advisor comparing listing standard tiers against peer category medians.
   - Portfolio & Verification management: Add/edit/remove portfolio items, commercial-use metadata, and toolchains.
   - Submit identity, toolchain proficiency, and commercial license verification evidence to Supabase Storage.

4. **Multi-Parameter Discovery (`creators.html`)**:
   - Real-time combinatorial filtering by Category, AI Tools (Midjourney, Runway, Kling, ElevenLabs, ComfyUI, etc.), Budget ceiling, Turnaround time, Buyer rating, and Verification status.
   - Dynamic sorting by AI Quality Score, Rating, Price, and Relevance.

5. **Security & Data Isolation**:
   - Supabase Auth supporting Email/Password, sessions, and role checks (`brand`, `creator`, `admin`).
   - PostgreSQL Row Level Security (RLS) preventing role self-escalation and securing draft projects.
   - Multi-bucket Supabase Storage policies (`creator-media` public, `verification-docs` restricted).

---

## 🚀 Quick Start

### 1. Installation
Ensure Node.js 20+ is installed:
```bash
npm install
```

### 2. Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Configure your credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
AI_PROVIDER_API_KEY=your_ai_key_here
AI_MODEL=gpt-4o-mini
```

### 3. Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗄️ Supabase Integration & Database Setup

### Schema Migration
The complete PostgreSQL schema is in [`supabase/migrations/20261009_init.sql`](supabase/migrations/20261009_init.sql).

To apply via the **Supabase Dashboard**:
1. Open your Supabase Project -> **SQL Editor**.
2. Create a new query, paste the contents of `supabase/migrations/20261009_init.sql`, and click **Run**.
3. Next, paste the contents of [`supabase/seed.sql`](supabase/seed.sql) to populate the 18 verified creator profiles, 34 gig listings, and benchmark briefs.

### Storage Buckets
The application configures two storage buckets:
- `creator-media`: Public bucket for creator portfolio images and showcase videos (50MB limit).
- `verification-docs`: Private bucket for creator identity documents and commercial license certificates (10MB limit).

---

## 🧪 Testing & Code Quality

Run the complete test suite:
```bash
# Automated Unit Tests (Catalog, Quality Scores, Matching Engine, Pricing, Roles)
npm test

# Type Checking
npm run typecheck

# Code Quality & Secret Exposure Scanner
npm run lint

# Production Build
npm run build
```

---

## ☁️ Vercel Deployment

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "feat: complete CreatorOS AI full-stack marketplace"
   git push origin main
   ```

2. **Deploy on Vercel**:
   - Import the repository on [Vercel](https://vercel.com).
   - Framework Preset: **Other** (Root Directory: `./`).
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Environment Variables:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
     - `SUPABASE_SERVICE_ROLE_KEY`
     - `AI_PROVIDER_API_KEY`
     - `AI_MODEL`

3. **Configure Auth Redirects in Supabase**:
   - In Supabase Dashboard -> **Authentication** -> **URL Configuration**:
   - Set Site URL to your Vercel deployment URL (e.g. `https://creatoros-ai.vercel.app`).
   - Add `https://creatoros-ai.vercel.app/**` to Redirect URLs.

---

## 📜 License
Built for the HacXLerate AI Content Creator Marketplace Hackathon. Sample personas and reviews are fictional demonstration data.
