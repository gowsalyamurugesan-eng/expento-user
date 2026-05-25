-- Fix for Cart Items Table
-- Run this in your Supabase SQL Editor

-- 1. Add user_id column if missing
ALTER TABLE cart_items 
ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);

-- 2. Enable RLS
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- 3. Add Policy
CREATE POLICY "User can manage their own cart"
ON cart_items
FOR ALL
USING (auth.uid() = user_id);

-- 4. Verify profiles table exists (optional based on error)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name text,
  email text,
  phone text
);
