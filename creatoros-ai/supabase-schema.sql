-- ====================================================================
-- CreatorOS AI (GrowthOS Market) — Supabase Database & Auth Schema
-- MVP Launch: Profiles, Briefs, Proposals, Orders, Feedbacks + RLS
-- ====================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE (Linked with Supabase Auth users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('brand', 'creator', 'admin')) DEFAULT 'brand',
  full_name text NOT NULL,
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

-- 2. BRIEFS TABLE
CREATE TABLE IF NOT EXISTS public.briefs (
  id text PRIMARY KEY DEFAULT ('b-' || substr(md5(random()::text), 1, 8)),
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
  ai_confidence integer DEFAULT 85,
  edit_key uuid DEFAULT gen_random_uuid(),
  status text DEFAULT 'open' CHECK (status IN ('open', 'in-review', 'filled', 'closed', 'deleted')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 3. PROPOSALS TABLE
CREATE TABLE IF NOT EXISTS public.proposals (
  id text PRIMARY KEY DEFAULT ('p-' || substr(md5(random()::text), 1, 8)),
  brief_id text NOT NULL REFERENCES public.briefs(id) ON DELETE CASCADE,
  creator_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  creator_name text,
  price integer DEFAULT 250,
  delivery_days integer DEFAULT 7,
  note text NOT NULL,
  status text DEFAULT 'sent' CHECK (status IN ('sent', 'accepted', 'rejected', 'withdrawn')),
  created_at timestamptz DEFAULT now()
);

-- 4. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
  id text PRIMARY KEY DEFAULT ('ord-' || substr(md5(random()::text), 1, 8)),
  brief_id text REFERENCES public.briefs(id) ON DELETE SET NULL,
  gig_id text,
  creator_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
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
  status text DEFAULT 'placed' CHECK (status IN ('placed', 'in-progress', 'review', 'delivered', 'paid', 'cancelled')),
  payment_id text,
  razorpay_order_id text,
  deliverables_url text,
  escrow boolean DEFAULT true,
  timeline jsonb DEFAULT '[]',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 5. FEEDBACKS TABLE
CREATE TABLE IF NOT EXISTS public.feedbacks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id text NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- 6. INDEXES
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

-- 8. RLS POLICIES

-- Profiles
DROP POLICY IF EXISTS "Public can view profiles" ON public.profiles;
CREATE POLICY "Public can view profiles" ON public.profiles
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Briefs
DROP POLICY IF EXISTS "Public can read non-deleted briefs" ON public.briefs;
CREATE POLICY "Public can read non-deleted briefs" ON public.briefs
  FOR SELECT USING (status != 'deleted');

DROP POLICY IF EXISTS "Authenticated users or guest can create briefs" ON public.briefs;
CREATE POLICY "Authenticated users or guest can create briefs" ON public.briefs
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Brands can update their own briefs" ON public.briefs;
CREATE POLICY "Brands can update their own briefs" ON public.briefs
  FOR UPDATE USING (
    (auth.uid() IS NOT NULL AND auth.uid() = brand_id) OR
    edit_key IS NOT NULL
  );

-- Proposals
DROP POLICY IF EXISTS "Creators and brief owners can view proposals" ON public.briefs;
CREATE POLICY "View proposals" ON public.proposals
  FOR SELECT USING (
    auth.uid() = creator_id OR
    EXISTS (SELECT 1 FROM public.briefs WHERE briefs.id = proposals.brief_id AND briefs.brand_id = auth.uid()) OR
    auth.uid() IS NULL -- allows public review if not logged in
  );

DROP POLICY IF EXISTS "Creators can submit proposals" ON public.proposals;
CREATE POLICY "Creators can submit proposals" ON public.proposals
  FOR INSERT WITH CHECK (true);

-- Orders
DROP POLICY IF EXISTS "Parties can read orders" ON public.orders;
CREATE POLICY "Parties can read orders" ON public.orders
  FOR SELECT USING (
    auth.uid() = creator_id OR
    auth.uid() = brand_id OR
    edit_key IS NOT NULL
  );

DROP POLICY IF EXISTS "Anyone can create order" ON public.orders;
CREATE POLICY "Anyone can create order" ON public.orders
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Parties can update order" ON public.orders;
CREATE POLICY "Parties can update order" ON public.orders
  FOR UPDATE USING (
    auth.uid() = creator_id OR
    auth.uid() = brand_id OR
    edit_key IS NOT NULL
  );

-- Feedbacks
DROP POLICY IF EXISTS "Public can read feedbacks" ON public.feedbacks;
CREATE POLICY "Public can read feedbacks" ON public.feedbacks
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can submit feedback" ON public.feedbacks;
CREATE POLICY "Authenticated users can submit feedback" ON public.feedbacks
  FOR INSERT WITH CHECK (
    auth.uid() = created_by OR
    created_by IS NULL
  );

-- 9. AUTH SIGNUP TRIGGER: Automatically create profile upon signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'role', 'brand')
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
