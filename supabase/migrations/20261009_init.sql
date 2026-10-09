-- CreatorOS AI — Database Schema Migration
-- HacXLerate AI Content Creator Marketplace (Challenge #02)

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS & DOMAINS
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('brand', 'creator', 'admin');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE verification_state AS ENUM ('unverified', 'pending', 'verified', 'rejected');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE brief_status_type AS ENUM ('open', 'in-review', 'filled', 'closed', 'deleted');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE order_status_type AS ENUM ('placed', 'in-progress', 'review', 'delivered', 'cancelled');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 3. PROFILES TABLE (Linked with Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'brand',
  name text NOT NULL,
  handle text UNIQUE,
  title text,
  bio text,
  location text,
  avatar_url text,
  categories text[] DEFAULT '{}',
  tools text[] DEFAULT '{}',
  languages text[] DEFAULT '{}',
  niches text[] DEFAULT '{}',
  verified boolean DEFAULT false,
  verification_status verification_state DEFAULT 'unverified',
  quality_score integer DEFAULT 85,
  rating numeric(3,2) DEFAULT 5.0,
  reviews_count integer DEFAULT 0,
  completed_orders integer DEFAULT 0,
  response_mins integer DEFAULT 25,
  ontime_rate numeric(3,2) DEFAULT 0.98,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 4. PORTFOLIO ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.portfolio_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  kind text NOT NULL,
  metric text,
  commercial_rights text DEFAULT 'Full commercial use permitted',
  tools_used text[] DEFAULT '{}',
  workflow_notes text,
  media_url text,
  is_published boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- 5. GIGS / LISTINGS TABLE
CREATE TABLE IF NOT EXISTS public.gigs (
  id text PRIMARY KEY,
  creator_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  category text NOT NULL,
  description text,
  tools text[] DEFAULT '{}',
  packages jsonb NOT NULL DEFAULT '{}',
  views integer DEFAULT 0,
  orders integer DEFAULT 0,
  queue integer DEFAULT 0,
  rating numeric(3,2) DEFAULT 5.0,
  trending boolean DEFAULT false,
  is_published boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- 6. BRIEFS TABLE
CREATE TABLE IF NOT EXISTS public.briefs (
  id text PRIMARY KEY,
  brand_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  title text NOT NULL,
  brand text NOT NULL DEFAULT 'Your Brand',
  category text NOT NULL,
  language text DEFAULT 'english',
  quantity integer DEFAULT 1,
  deadline_days integer DEFAULT 14,
  budget_min integer,
  budget_max integer,
  description text,
  deliverables jsonb DEFAULT '[]',
  commercial_use boolean DEFAULT true,
  signals jsonb DEFAULT '{}',
  ai_confidence integer DEFAULT 0,
  edit_key uuid DEFAULT gen_random_uuid(),
  status brief_status_type DEFAULT 'open',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 7. PROPOSALS TABLE
CREATE TABLE IF NOT EXISTS public.proposals (
  id text PRIMARY KEY DEFAULT ('p-' || substr(md5(random()::text), 1, 8)),
  brief_id text NOT NULL REFERENCES public.briefs(id) ON DELETE CASCADE,
  creator_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  creator_name text,
  note text NOT NULL,
  status text DEFAULT 'sent',
  created_at timestamptz DEFAULT now()
);

-- 8. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
  id text PRIMARY KEY,
  brief_id text REFERENCES public.briefs(id) ON DELETE SET NULL,
  gig_id text REFERENCES public.gigs(id) ON DELETE SET NULL,
  creator_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  brand_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  package_key text DEFAULT 'standard',
  package_name text DEFAULT 'Standard',
  brand text NOT NULL DEFAULT 'Your Brand',
  brief_text text,
  subtotal integer DEFAULT 0,
  fee integer DEFAULT 0,
  total integer DEFAULT 0,
  due_days integer DEFAULT 7,
  addons jsonb DEFAULT '[]',
  edit_key uuid DEFAULT gen_random_uuid(),
  status order_status_type DEFAULT 'placed',
  escrow boolean DEFAULT true,
  timeline jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 9. VERIFICATION CLAIMS & AUDIT TABLE
CREATE TABLE IF NOT EXISTS public.verification_claims (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  claim_type text NOT NULL,
  evidence_text text,
  evidence_url text,
  status verification_state DEFAULT 'pending',
  review_notes text,
  reviewed_by uuid REFERENCES public.profiles(id),
  created_at timestamptz DEFAULT now(),
  reviewed_at timestamptz
);

-- 10. INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_verified ON public.profiles(verified);
CREATE INDEX IF NOT EXISTS idx_portfolio_creator ON public.portfolio_items(creator_id);
CREATE INDEX IF NOT EXISTS idx_gigs_category ON public.gigs(category);
CREATE INDEX IF NOT EXISTS idx_briefs_status ON public.briefs(status);
CREATE INDEX IF NOT EXISTS idx_briefs_category ON public.briefs(category);
CREATE INDEX IF NOT EXISTS idx_orders_creator ON public.orders(creator_id);
CREATE INDEX IF NOT EXISTS idx_orders_edit_key ON public.orders(edit_key);
CREATE INDEX IF NOT EXISTS idx_proposals_brief ON public.proposals(brief_id);

-- 11. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gigs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.briefs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_claims ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
DROP POLICY IF EXISTS "Public can view profiles" ON public.profiles;
CREATE POLICY "Public can view profiles" ON public.profiles
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile except role" ON public.profiles;
CREATE POLICY "Users can update own profile except role" ON public.profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id AND (
      role = (SELECT role FROM public.profiles WHERE id = auth.uid()) OR
      EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    )
  );

-- Portfolio Items Policies
DROP POLICY IF EXISTS "Public can view published portfolio" ON public.portfolio_items;
CREATE POLICY "Public can view published portfolio" ON public.portfolio_items
  FOR SELECT USING (is_published = true OR auth.uid() = creator_id);

DROP POLICY IF EXISTS "Creators can manage own portfolio" ON public.portfolio_items;
CREATE POLICY "Creators can manage own portfolio" ON public.portfolio_items
  FOR ALL USING (auth.uid() = creator_id);

-- Gigs Policies
DROP POLICY IF EXISTS "Public can view published gigs" ON public.gigs;
CREATE POLICY "Public can view published gigs" ON public.gigs
  FOR SELECT USING (is_published = true);

DROP POLICY IF EXISTS "Creators can manage own gigs" ON public.gigs;
CREATE POLICY "Creators can manage own gigs" ON public.gigs
  FOR ALL USING (auth.uid() = creator_id);

-- Briefs Policies
DROP POLICY IF EXISTS "Public can read non-deleted briefs" ON public.briefs;
CREATE POLICY "Public can read non-deleted briefs" ON public.briefs
  FOR SELECT USING (status != 'deleted');

DROP POLICY IF EXISTS "Anyone can create brief" ON public.briefs;
CREATE POLICY "Anyone can create brief" ON public.briefs
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Owners can update brief" ON public.briefs;
CREATE POLICY "Owners can update brief" ON public.briefs
  FOR UPDATE USING (
    auth.uid() = brand_id OR
    edit_key IS NOT NULL
  );

-- Proposals Policies
DROP POLICY IF EXISTS "Public can read proposals for brief" ON public.proposals;
CREATE POLICY "Public can read proposals for brief" ON public.proposals
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Creators can create proposals" ON public.proposals;
CREATE POLICY "Creators can create proposals" ON public.proposals
  FOR INSERT WITH CHECK (true);

-- Orders Policies
DROP POLICY IF EXISTS "Parties can read orders" ON public.orders;
CREATE POLICY "Parties can read orders" ON public.orders
  FOR SELECT USING (
    auth.uid() = creator_id OR
    auth.uid() = brand_id OR
    edit_key IS NOT NULL
  );

DROP POLICY IF EXISTS "Anyone can place order" ON public.orders;
CREATE POLICY "Anyone can place order" ON public.orders
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Parties can update order" ON public.orders;
CREATE POLICY "Parties can update order" ON public.orders
  FOR UPDATE USING (
    auth.uid() = creator_id OR
    auth.uid() = brand_id OR
    edit_key IS NOT NULL
  );

-- Verification Claims Policies
DROP POLICY IF EXISTS "Users can view own verification claims" ON public.verification_claims;
CREATE POLICY "Users can view own verification claims" ON public.verification_claims
  FOR SELECT USING (
    auth.uid() = creator_id OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

DROP POLICY IF EXISTS "Creators can submit claims" ON public.verification_claims;
CREATE POLICY "Creators can submit claims" ON public.verification_claims
  FOR INSERT WITH CHECK (auth.uid() = creator_id);

DROP POLICY IF EXISTS "Admins can review claims" ON public.verification_claims;
CREATE POLICY "Admins can review claims" ON public.verification_claims
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 12. AUTOMATIC PROFILE CREATION TRIGGER ON AUTH.SIGNUP
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    COALESCE((new.raw_user_meta_data->>'role')::user_role, 'brand')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
