-- Coupons system for promotional pricing
CREATE TABLE coupons (
    id TEXT PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    discount_amount_cents INTEGER NOT NULL,
    discount_type TEXT DEFAULT 'fixed', -- 'fixed' or 'percentage'
    duration_months INTEGER NOT NULL,
    max_uses INTEGER DEFAULT 1,
    expires_at DATETIME,
    created_for_email TEXT,
    description TEXT,
    status TEXT DEFAULT 'active', -- 'active', 'disabled', 'expired'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Track coupon usage and expiration
CREATE TABLE coupon_usage (
    id TEXT PRIMARY KEY,
    coupon_id TEXT NOT NULL,
    client_id TEXT NOT NULL,
    redeemed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME NOT NULL,
    months_remaining INTEGER NOT NULL,
    discount_applied_cents INTEGER NOT NULL,
    status TEXT DEFAULT 'active', -- 'active', 'expired', 'used_up'
    FOREIGN KEY (coupon_id) REFERENCES coupons(id),
    FOREIGN KEY (client_id) REFERENCES clients(id)
);

-- Prepayment tracking for 3-month advance payments
CREATE TABLE prepayments (
    id TEXT PRIMARY KEY,
    client_id TEXT NOT NULL,
    months_paid INTEGER NOT NULL,
    base_amount_cents INTEGER NOT NULL, -- Amount before discount
    discount_percentage INTEGER DEFAULT 10, -- 10% discount for prepayment
    amount_paid_cents INTEGER NOT NULL, -- Actual amount charged
    amount_saved_cents INTEGER NOT NULL, -- Total savings from prepayment
    starts_at DATE NOT NULL,
    ends_at DATE NOT NULL,
    square_payment_id TEXT,
    status TEXT DEFAULT 'active', -- 'active', 'used', 'refunded'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(id)
);

-- Domain management for subscription limits
CREATE TABLE client_domains (
    id TEXT PRIMARY KEY,
    client_id TEXT NOT NULL,
    domain TEXT NOT NULL,
    verified BOOLEAN DEFAULT FALSE,
    added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    verified_at DATETIME,
    status TEXT DEFAULT 'active', -- 'active', 'suspended', 'removed'
    FOREIGN KEY (client_id) REFERENCES clients(id)
);

-- Update clients table with new fields
ALTER TABLE clients ADD COLUMN domain_limit INTEGER DEFAULT 1;
ALTER TABLE clients ADD COLUMN domains_used INTEGER DEFAULT 0;
ALTER TABLE clients ADD COLUMN active_coupon_id TEXT;
ALTER TABLE clients ADD COLUMN active_prepayment_id TEXT;
ALTER TABLE clients ADD COLUMN tier_override TEXT; -- For special pricing like Jon's $1000 starter

-- Create indexes for performance
CREATE INDEX idx_coupons_code ON coupons(code);
CREATE INDEX idx_coupons_status ON coupons(status);
CREATE INDEX idx_coupon_usage_client ON coupon_usage(client_id);
CREATE INDEX idx_coupon_usage_status ON coupon_usage(status);
CREATE INDEX idx_coupon_usage_expires ON coupon_usage(expires_at);
CREATE INDEX idx_prepayments_client ON prepayments(client_id);
CREATE INDEX idx_prepayments_status ON prepayments(status);
CREATE INDEX idx_prepayments_dates ON prepayments(starts_at, ends_at);
CREATE INDEX idx_client_domains_client ON client_domains(client_id);
CREATE INDEX idx_client_domains_domain ON client_domains(domain);
CREATE INDEX idx_client_domains_status ON client_domains(status);

-- Insert Amy Tipton's free testing coupon (100% off starter tier)
INSERT INTO coupons (
    id,
    code,
    discount_amount_cents,
    discount_type,
    duration_months,
    max_uses,
    created_for_email,
    description,
    status
) VALUES (
    'coupon_amy_free',
    'AMYFREE',
    125000, -- $1,250 in cents (full starterPlus price)
    'fixed',
    6, -- 6 months free for personal testing
    1,
    'amy.tipton@company.com', -- Amy's email (update as needed)
    'Free 6-month testing access for Amy Tipton - StarterPlus tier',
    'active'
);

-- Insert Amy's company discount coupon (40% off any tier for first year)
INSERT INTO coupons (
    id,
    code,
    discount_amount_cents,
    discount_type,
    duration_months,
    max_uses,
    created_for_email,
    description,
    status
) VALUES (
    'coupon_amy_company_40',
    'AMYCOMPANY40',
    0, -- Will be calculated as 40% of tier price
    'percentage',
    12, -- 12 months (first year)
    10, -- Allow multiple team members
    'amy.tipton@company.com',
    '40% discount for Amy Tipton company - First year only',
    'active'
);

-- Create a universal introductory prepayment offer (this could be a feature flag later)
INSERT INTO coupons (
    id,
    code,
    discount_amount_cents,
    discount_type,
    duration_months,
    max_uses,
    description,
    status
) VALUES (
    'coupon_intro_prepay',
    'INTRO3MONTH',
    0, -- This is handled by prepayment logic, not coupon discount
    'percentage',
    3,
    999999, -- Allow many uses for general promotion
    'Introductory 3-month prepayment offer - 10% discount when paying in advance',
    'active'
);