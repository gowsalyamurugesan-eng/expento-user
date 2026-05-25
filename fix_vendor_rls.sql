-- Enable RLS
ALTER TABLE vendor_orders ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to insert
CREATE POLICY "Allow user checkout vendor orders"
ON vendor_orders
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Also allow users to select their own vendor orders (needed for "My Orders" page)
CREATE POLICY "Allow user select own vendor orders"
ON vendor_orders
FOR SELECT
TO authenticated
USING (
    order_id IN (
        SELECT id FROM orders WHERE user_id = auth.uid()
    )
);
