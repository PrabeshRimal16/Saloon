-- ══════════════════════════════════════════════════════════════════════════════
-- Luxe Salon — Supabase Database Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ══════════════════════════════════════════════════════════════════════════════


-- ── 1. USERS (public profile, extends auth.users) ─────────────────────────────

CREATE TABLE IF NOT EXISTS public.users (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT NOT NULL UNIQUE,
  role        TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  full_name   TEXT,
  phone       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Users can read/update their own row
CREATE POLICY "Users can view own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- Admins can read all profiles
CREATE POLICY "Admins can view all profiles"
  ON public.users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Allow insert from authenticated users (for registration upsert)
CREATE POLICY "Authenticated users can insert own profile"
  ON public.users FOR INSERT
  WITH CHECK (auth.uid() = id);


-- ── 2. AUTO-CREATE USER PROFILE TRIGGER ──────────────────────────────────────
-- When a new user signs up via Supabase Auth, automatically insert a row
-- in public.users using the metadata passed in signUp({ data: {...} }).

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, phone, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'phone',
    'customer'   -- every self-registered user gets 'customer' role
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Attach trigger to auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- ── 3. BOOKINGS ───────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.bookings (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  service     TEXT NOT NULL,
  date        DATE NOT NULL,
  time        TIME NOT NULL,
  status      TEXT NOT NULL DEFAULT 'pending'
              CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  notes       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast user bookings lookup
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_date    ON public.bookings(date);

-- Enable Row Level Security
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Customers see only their own bookings
CREATE POLICY "Customers can view own bookings"
  ON public.bookings FOR SELECT
  USING (auth.uid() = user_id);

-- Customers can insert their own bookings
CREATE POLICY "Customers can create bookings"
  ON public.bookings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Customers can only cancel (update status) their own bookings
CREATE POLICY "Customers can cancel own bookings"
  ON public.bookings FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Customers can delete their own bookings
CREATE POLICY "Customers can delete own bookings"
  ON public.bookings FOR DELETE
  USING (auth.uid() = user_id);

-- Admins can do everything on bookings
CREATE POLICY "Admins have full access to bookings"
  ON public.bookings
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );


-- ══════════════════════════════════════════════════════════════════════════════
-- INITIAL ADMIN USER
-- ══════════════════════════════════════════════════════════════════════════════
-- Instructions:
--   1. Register normally via the app at /register with your admin email.
--   2. Then run the UPDATE below to promote the account to admin.
--   3. Replace 'admin@luxesalon.com' with your actual email.

UPDATE public.users
  SET role = 'admin'
WHERE email = 'admin@luxesalon.com';

-- ── Optional: verify it worked ────────────────────────────────────────────────
-- SELECT id, email, role FROM public.users WHERE role = 'admin';
