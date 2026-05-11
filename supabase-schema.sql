-- ═══════════════════════════════════════════════════════
-- Sovereign Grooming — Supabase Database Schema
-- ═══════════════════════════════════════════════════════

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── User Profiles ───
-- Mirrors auth.users with extra columns for name and phone.
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create a profile row whenever a new auth user signs up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, email, phone)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.email,
    NEW.raw_user_meta_data->>'phone'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE handle_new_user();

-- ─── Services ───
CREATE TABLE IF NOT EXISTS services (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC,
  price_display TEXT NOT NULL,
  duration TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('hair', 'waxing', 'lashes', 'facials')),
  description TEXT DEFAULT '',
  image_url TEXT,
  active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Bookings ───
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  services JSONB NOT NULL DEFAULT '[]',
  date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  total_price NUMERIC DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Offers ───
CREATE TABLE IF NOT EXISTS offers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed', 'bundle')),
  discount_value NUMERIC DEFAULT 0,
  code TEXT UNIQUE,
  active BOOLEAN DEFAULT true,
  valid_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Employees ───
CREATE TABLE IF NOT EXISTS employees (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  image_url TEXT,
  bio TEXT DEFAULT '',
  available_hours JSONB DEFAULT '{}',
  services TEXT[] DEFAULT '{}',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Contact Messages ───
CREATE TABLE IF NOT EXISTS contacts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ═══════════════════════════════════════════════════════
-- Seed Data: Services
-- ═══════════════════════════════════════════════════════

INSERT INTO services (name, price, price_display, duration, duration_minutes, category, description, display_order) VALUES
  ('Wash & Blowout', 65, '$65', '45 min', 45, 'hair', 'A revitalizing cleanse followed by a precision blowout that leaves you feeling polished and renewed.', 1),
  ('Hair Balayage', 265, '$265', '3 hr 15 min', 195, 'hair', 'Hand-painted, sun-kissed highlights that blend seamlessly for a natural, dimensional look.', 2),
  ('Full Hair Highlights', 265, '$265', '3 hr 40 min', 220, 'hair', 'Expertly placed foils for all-over luminosity and depth.', 3),
  ('Eyebrow Threading', 14, '$14', '15 min', 15, 'waxing', 'Precise threading for perfectly shaped brows.', 4),
  ('Eyebrow Waxing', 14, '$14', '15 min', 15, 'waxing', 'Quick, clean waxing for defined eyebrows.', 5),
  ('Brazilian Waxing (Hard Wax)', 60, '$60', '25 min', 25, 'waxing', 'Smooth results with premium hard wax for maximum comfort.', 6),
  ('Brazilian Waxing (Chocolate Wax)', 55, '$55', '25 min', 25, 'waxing', 'Gentle chocolate wax for sensitive skin.', 7),
  ('Full-Body Waxing', NULL, 'Price varies', '1 hr', 60, 'waxing', 'Head-to-toe smoothness with our premium wax.', 8),
  ('Eyebrow + Upper Lip + Chin', 26, '$26', '30 min', 30, 'waxing', 'Complete facial trio for a flawless finish.', 9),
  ('Full Face', 40, '$40', '45 min', 45, 'waxing', 'Complete facial hair removal using our gentlest techniques.', 10),
  ('Lash Lift + Tint', 85, '$85', '1 hr 15 min', 75, 'lashes', 'Semi-permanent lift and customized tint for effortless beauty.', 11),
  ('Lash Tint', 25, '$25', '15 min', 15, 'lashes', 'A subtle tint to define and darken your natural lashes.', 12),
  ('Full Leg + Full Arms + Underarm Package', 115, '$115', '1 hr 15 min', 75, 'waxing', 'Complete package for silky smooth limbs.', 13),
  ('Full Back Waxing', 50, '$50', '20 min', 20, 'waxing', 'Clean, thorough back waxing for a smooth finish.', 14),
  ('Bikini Wax', 35, '$35', '15 min', 15, 'waxing', 'Precise bikini line waxing for clean results.', 15),
  ('Stomach Wax', 35, '$35', '20 min', 20, 'waxing', 'Smooth stomach with gentle waxing techniques.', 16)
ON CONFLICT DO NOTHING;

-- ═══════════════════════════════════════════════════════
-- Seed Data: Offers
-- ═══════════════════════════════════════════════════════

INSERT INTO offers (title, description, discount_type, discount_value, code, active) VALUES
  ('First Visit — 15% Off', 'Welcome to Sovereign Grooming. Enjoy 15% off your first service.', 'percentage', 15, 'WELCOME15', true),
  ('Buy 3 Waxing, Get 1 Free', 'Book three waxing sessions and receive your fourth complimentary.', 'bundle', 0, 'WAX4FREE', true),
  ('Monthly Membership — $99', 'Enjoy 2 services per month, priority booking, and exclusive member pricing.', 'fixed', 99, 'SOVEREIGN99', true)
ON CONFLICT DO NOTHING;

-- ═══════════════════════════════════════════════════════
-- Row Level Security (enable for production)
-- ═══════════════════════════════════════════════════════

ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Public read access for services and offers
CREATE POLICY "Public read services" ON services FOR SELECT USING (true);
CREATE POLICY "Public read offers" ON offers FOR SELECT USING (true);

-- Public insert for bookings and contacts
CREATE POLICY "Public insert bookings" ON bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read bookings" ON bookings FOR SELECT USING (true);
CREATE POLICY "Public insert contacts" ON contacts FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read contacts" ON contacts FOR SELECT USING (true);
CREATE POLICY "Public read employees" ON employees FOR SELECT USING (true);

-- Profiles: users can read and update only their own row
CREATE POLICY "Users read own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

