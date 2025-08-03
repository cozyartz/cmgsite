-- Insert Amy Cozart-Lundin's free testing coupon (matching Amy Tipton's package)
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
    'coupon_amy_cozart_free',
    'AMYCOZARTFREE',
    2900, -- $29 in cents (full starter price under new pricing)
    'fixed',
    6, -- 6 months free for personal testing
    1,
    'amy@cozyartzmedia.com',
    'Free 6-month testing access for Amy Cozart-Lundin - Starter tier',
    'active'
);

-- Insert Amy Cozart-Lundin's company discount coupon (40% off any tier for first year)
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
    'coupon_amy_cozart_company_40',
    'AMYCOZARTCOMPANY40',
    40, -- 40% stored as the percentage value
    'percentage',
    12, -- 12 months (first year)
    10, -- Allow multiple team members from her company
    'amy@cozyartzmedia.com',
    '40% discount for Amy Cozart-Lundin company team - First year only',
    'active'
);