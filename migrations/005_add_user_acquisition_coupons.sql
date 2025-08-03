-- General user acquisition coupons for new competitive pricing structure

-- Launch campaign coupon (50% off first 3 months)
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
    'coupon_launch_50',
    'LAUNCH50',
    50, -- 50% off
    'percentage',
    3, -- First 3 months
    1000, -- High usage limit for acquisition
    NULL, -- Available to anyone
    'Launch special: 50% off your first 3 months',
    'active'
);

-- First month free coupon
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
    'coupon_first_month_free_starter',
    'FIRSTMONTHFREE',
    2900, -- $29 (starter tier price)
    'fixed',
    1, -- First month only
    500, -- Moderate usage limit
    NULL, -- Available to anyone
    'Get your first month free - Starter tier',
    'active'
);

-- Student discount (25% off ongoing)
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
    'coupon_student_25',
    'STUDENT25',
    25, -- 25% off
    'percentage',
    12, -- Full year
    200, -- Limited for verification
    NULL, -- Available to verified students
    'Student discount: 25% off for verified students',
    'active'
);

-- Nonprofit discount (50% off ongoing)
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
    'coupon_nonprofit_50',
    'NONPROFIT50',
    50, -- 50% off (as specified by user)
    'percentage',
    12, -- Full year, renewable
    100, -- Limited for verification
    NULL, -- Available to verified nonprofits
    '50% off ongoing for verified nonprofits',
    'active'
);

-- Small business discount (30% off first 6 months)
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
    'coupon_small_biz_30',
    'SMALLBIZ30',
    30, -- 30% off
    'percentage',
    6, -- First 6 months
    300, -- Moderate usage limit
    NULL, -- Available to small businesses
    'Small business special: 30% off first 6 months',
    'active'
);