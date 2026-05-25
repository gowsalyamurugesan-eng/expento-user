-- Use these commands in your Supabase SQL Editor to create the required tables

-- Create services table
create table services (
  id uuid primary key default uuid_generate_v4(),
  name text,
  is_active boolean default true,
  created_at timestamp default now()
);

-- Create service_locations table
create table service_locations (
  id uuid primary key default uuid_generate_v4(),
  service_id uuid references services(id),
  state text,
  district text,
  city text,
  pincode text,
  is_active boolean default true,
  created_at timestamp default now()
);

-- Enable RLS (or disable temporarily as needed)
alter table services enable row level security;
alter table service_locations enable row level security;

-- Add "Allow all" policy for select
create policy "Allow all"
on service_locations
for select
using (true);

create policy "Allow all services"
on services
for select
using (true);

-- Create user_addresses table
create table user_addresses (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid, -- Reference to auth.users if using real auth
  flat_no text,
  area text,
  city text,
  district text,
  state text,
  pincode text,
  is_default boolean default false,
  type text check (type in ('home', 'work', 'other')),
  full_address text,
  address_line text,
  created_at timestamp default now()
);

-- Enable RLS for user_addresses
ALTER TABLE user_addresses ENABLE ROW LEVEL SECURITY;

-- Cleanup existing policies
DROP POLICY IF EXISTS "Allow insert addresses" ON user_addresses;
DROP POLICY IF EXISTS "Users insert own address" ON user_addresses;
DROP POLICY IF EXISTS "Allow read addresses" ON user_addresses;
DROP POLICY IF EXISTS "Allow insert for all" ON user_addresses;
DROP POLICY IF EXISTS "Allow select for all" ON user_addresses;

-- Ensure user_id is nullable for guests and remove foreign key constraint
ALTER TABLE user_addresses ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE user_addresses DROP CONSTRAINT IF EXISTS user_addresses_user_id_fkey;

-- Permissive policy for guest address saving
CREATE POLICY "Allow guest insert"
ON user_addresses
FOR INSERT
WITH CHECK (true);

-- Allow reading own or guest addresses
CREATE POLICY "Allow read addresses"
ON user_addresses
FOR SELECT
USING (true);

-- Ensure user_id is nullable for guests
ALTER TABLE user_addresses ALTER COLUMN user_id DROP NOT NULL;


-- Create home_banners table
CREATE TABLE home_banners (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title text,
  subtitle text,
  image_url text,
  cta_text text DEFAULT 'Order Now',
  is_active boolean DEFAULT true,
  sort_order int DEFAULT 0,
  created_at timestamp DEFAULT now()
);

-- Enable RLS for home_banners
ALTER TABLE home_banners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read banners" ON home_banners FOR SELECT USING (true);

-- Create categories table
CREATE TABLE categories (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text,
  image_url text,
  layout_order int DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp DEFAULT now()
);

-- Enable RLS for categories
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read categories" ON categories FOR SELECT USING (true);

-- Create subcategories table
CREATE TABLE subcategories (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id uuid REFERENCES categories(id),
  name text,
  image_url text,
  is_active boolean DEFAULT true,
  created_at timestamp DEFAULT now()
);

-- Enable RLS for subcategories
ALTER TABLE subcategories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read subcategories" ON subcategories FOR SELECT USING (true);

-- Create home_trending_subcategories table (for trending section)
CREATE TABLE home_trending_subcategories (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  subcategory_id uuid REFERENCES subcategories(id),
  order_index int DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp DEFAULT now()
);

-- Enable RLS for trending subcategories
-- FORCE FIX for cart_items table
CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid, -- Keeping it for future use but making it nullable
  cart_id text, -- Tracking guest carts via localStorage (Force as text)
  product_id uuid REFERENCES products(id),
  quantity int DEFAULT 1,
  created_at timestamp DEFAULT now()
);

-- Force column types fix
ALTER TABLE public.cart_items ALTER COLUMN cart_id TYPE text USING cart_id::text;
ALTER TABLE public.cart_items ALTER COLUMN product_id TYPE uuid USING product_id::uuid;

-- Drop foreign key to auth.users if it exists
ALTER TABLE cart_items DROP CONSTRAINT IF EXISTS cart_items_user_id_fkey;

-- Disable RLS for testing/guest mode stability
ALTER TABLE cart_items DISABLE ROW LEVEL SECURITY;-- FINAL FIX for orders table (Using UUID)
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid, -- Nullable for guests
  guest_id text, -- Persistent tracking for guests
  items jsonb, -- Store product details directly
  total_amount decimal,
  payment_status text DEFAULT 'pending',
  status text DEFAULT 'confirmed',
  address_snapshot jsonb,
  created_at timestamp DEFAULT now()
);

ALTER TABLE orders DISABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS coupons (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  coupon_code text UNIQUE NOT NULL,
  discount_type text CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value decimal NOT NULL,
  min_order_value decimal DEFAULT 0,
  expiry_date timestamp NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamp DEFAULT now()
);

ALTER TABLE coupons DISABLE ROW LEVEL SECURITY;
