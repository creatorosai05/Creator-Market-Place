-- ====================================================================
-- CreatorOS AI (GrowthOS Market) — Supabase Database & Auth Schema
-- Production-Ready Migration with Explicit Type Casts & Safe Migrations
-- ====================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE (Linked with Supabase Auth users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'brand',
  name text,
  full_name text,
  avatar_url text,
  company_name text,
  bio text,
  ai_tools text[] DEFAULT '{}',
  categories text[] DEFAULT '{}',
  rating numeric(3,2) DEFAULT 5.0,
  orders_completed integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Ensure both name and full_name columns exist on existing profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS full_name text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS name text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS ai_tools text[] DEFAULT '{}';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS categories text[] DEFAULT '{}';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS company_name text;

-- 2. BRIEFS TABLE
CREATE TABLE IF NOT EXISTS public.briefs (
  id text PRIMARY KEY DEFAULT ('b-' || substr(md5(random()::text), 1, 8)),
  brand_id text,
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
  ai_confidence integer DEFAULT 85,
  edit_key uuid DEFAULT gen_random_uuid(),
  status text DEFAULT 'open',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 3. PROPOSALS TABLE
CREATE TABLE IF NOT EXISTS public.proposals (
  id text PRIMARY KEY DEFAULT ('p-' || substr(md5(random()::text), 1, 8)),
  brief_id text NOT NULL,
  creator_id text,
  creator_name text,
  price integer DEFAULT 250,
  delivery_days integer DEFAULT 7,
  note text NOT NULL,
  status text DEFAULT 'sent',
  created_at timestamptz DEFAULT now()
);

-- 4. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
  id text PRIMARY KEY DEFAULT ('ord-' || substr(md5(random()::text), 1, 8)),
  brief_id text,
  gig_id text,
  creator_id text,
  brand_id text,
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
  status text DEFAULT 'placed',
  payment_id text,
  razorpay_order_id text,
  deliverables_url text,
  escrow boolean DEFAULT true,
  timeline jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_id text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS razorpay_order_id text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS deliverables_url text;

-- 5. FEEDBACKS TABLE
CREATE TABLE IF NOT EXISTS public.feedbacks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_by text,
  created_at timestamptz DEFAULT now()
);

-- 6. INDEXES FOR HIGH PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_briefs_status ON public.briefs(status);
CREATE INDEX IF NOT EXISTS idx_briefs_category ON public.briefs(category);
CREATE INDEX IF NOT EXISTS idx_briefs_brand ON public.briefs(brand_id);
CREATE INDEX IF NOT EXISTS idx_proposals_brief ON public.proposals(brief_id);
CREATE INDEX IF NOT EXISTS idx_proposals_creator ON public.proposals(creator_id);
CREATE INDEX IF NOT EXISTS idx_orders_creator ON public.orders(creator_id);
CREATE INDEX IF NOT EXISTS idx_orders_brand ON public.orders(brand_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_feedbacks_order ON public.feedbacks(order_id);

-- 7. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.briefs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedbacks ENABLE ROW LEVEL SECURITY;

-- 8. RLS POLICIES (With explicit ::text casts to avoid PostgreSQL type mismatches)

-- Profiles Policies
DROP POLICY IF EXISTS "Public can view profiles" ON public.profiles;
CREATE POLICY "Public can view profiles" ON public.profiles
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid()::text = id::text);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid()::text = id::text);

-- Briefs Policies
DROP POLICY IF EXISTS "Public can read non-deleted briefs" ON public.briefs;
CREATE POLICY "Public can read non-deleted briefs" ON public.briefs
  FOR SELECT USING (status != 'deleted');

DROP POLICY IF EXISTS "Authenticated users or guest can create briefs" ON public.briefs;
CREATE POLICY "Authenticated users or guest can create briefs" ON public.briefs
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Brands can update their own briefs" ON public.briefs;
CREATE POLICY "Brands can update their own briefs" ON public.briefs
  FOR UPDATE USING (
    (auth.uid() IS NOT NULL AND auth.uid()::text = brand_id::text) OR
    edit_key IS NOT NULL
  );

-- Proposals Policies
DROP POLICY IF EXISTS "View proposals" ON public.proposals;
CREATE POLICY "View proposals" ON public.proposals
  FOR SELECT USING (
    auth.uid()::text = creator_id::text OR
    EXISTS (SELECT 1 FROM public.briefs WHERE briefs.id = proposals.brief_id AND briefs.brand_id::text = auth.uid()::text) OR
    auth.uid() IS NULL
  );

DROP POLICY IF EXISTS "Creators can submit proposals" ON public.proposals;
CREATE POLICY "Creators can submit proposals" ON public.proposals
  FOR INSERT WITH CHECK (true);

-- Orders Policies
DROP POLICY IF EXISTS "Parties can read orders" ON public.orders;
CREATE POLICY "Parties can read orders" ON public.orders
  FOR SELECT USING (
    auth.uid()::text = creator_id::text OR
    auth.uid()::text = brand_id::text OR
    edit_key IS NOT NULL
  );

DROP POLICY IF EXISTS "Anyone can create order" ON public.orders;
CREATE POLICY "Anyone can create order" ON public.orders
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Parties can update order" ON public.orders;
CREATE POLICY "Parties can update order" ON public.orders
  FOR UPDATE USING (
    auth.uid()::text = creator_id::text OR
    auth.uid()::text = brand_id::text OR
    edit_key IS NOT NULL
  );

-- Feedbacks Policies
DROP POLICY IF EXISTS "Public can read feedbacks" ON public.feedbacks;
CREATE POLICY "Public can read feedbacks" ON public.feedbacks
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can submit feedback" ON public.feedbacks;
CREATE POLICY "Authenticated users can submit feedback" ON public.feedbacks
  FOR INSERT WITH CHECK (
    auth.uid()::text = created_by::text OR
    created_by IS NULL
  );

-- 9. AUTH SIGNUP TRIGGER: Automatically create profile upon signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_role text;
  v_name text;
BEGIN
  v_role := COALESCE(new.raw_user_meta_data->>'role', 'brand');
  v_name := COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1));

  INSERT INTO public.profiles (id, full_name, name, role)
  VALUES (
    new.id,
    v_name,
    v_name,
    v_role
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    name = EXCLUDED.name,
    role = EXCLUDED.role;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
