-- Update payments table to use PayPal instead of Square
ALTER TABLE payments ADD COLUMN paypal_order_id TEXT;
ALTER TABLE payments ADD COLUMN paypal_capture_id TEXT;

-- Update prepayments table to use PayPal instead of Square
ALTER TABLE prepayments ADD COLUMN paypal_order_id TEXT;
ALTER TABLE prepayments ADD COLUMN paypal_capture_id TEXT;

-- Add indexes for PayPal order lookup
CREATE INDEX idx_payments_paypal_order_id ON payments(paypal_order_id);
CREATE INDEX idx_prepayments_paypal_order_id ON prepayments(paypal_order_id);

-- Add updated_at columns for better tracking
ALTER TABLE payments ADD COLUMN updated_at TEXT;
ALTER TABLE prepayments ADD COLUMN updated_at TEXT;

-- Note: square_payment_id columns are kept for data migration compatibility
-- They can be dropped after full migration to PayPal is confirmed