-- Insert Jon Werbeck's client discount coupon ($250/month off for 3 months)
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
    'coupon_jon_250',
    'JON250',
    25000, -- $250 in cents
    'fixed',
    3,
    1,
    'jon@jwpartnership.com',
    'Client discount pricing for Jon Werbeck - $250 off monthly for 3 months',
    'active'
);

-- Insert Amy Tipton's free testing coupon (100% off starter tier for 6 months)
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
    'amy.tipton@company.com',
    'Free 6-month testing access for Amy Tipton - StarterPlus tier',
    'active'
);

-- Insert Amy Tipton's company discount coupon (40% off any tier for first year)
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
    40, -- 40% stored as the percentage value
    'percentage',
    12, -- 12 months (first year)
    10, -- Allow multiple team members from her company
    'amy.tipton@company.com',
    '40% discount for Amy Tipton company team - First year only',
    'active'
);