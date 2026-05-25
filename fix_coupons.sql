-- Rename code to coupon_code if it exists as code
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'coupons' AND column_name = 'code') THEN
    ALTER TABLE coupons RENAME COLUMN code TO coupon_code;
  END IF;
END $$;

-- Ensure RLS is enabled
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

-- Add public read policy
DROP POLICY IF EXISTS "Allow public read coupons" ON coupons;
CREATE POLICY "Allow public read coupons"
ON coupons
FOR SELECT
USING (true);

-- Normalize existing coupons (Optional but recommended)
-- UPDATE coupons SET coupon_code = REPLACE(coupon_code, ' ', '') WHERE coupon_code LIKE '% %';
