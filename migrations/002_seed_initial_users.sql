-- Seed initial users for Cozyartz Media Group
-- Andrea Cozart-Lundin as Owner and Amy Cozart-Lundin as Admin

-- Insert Andrea as Owner
INSERT INTO users (id, email, name, avatar_url, provider, provider_id, created_at, updated_at) 
VALUES (
    'user_andrea_cozyartz',
    'cozyartz@cozyartzmedia.com',
    'Andrea Cozart-Lundin',
    'https://github.com/cozyartz.png',
    'github',
    'cozyartz',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Insert Amy as Admin  
INSERT INTO users (id, email, name, avatar_url, provider, provider_id, created_at, updated_at)
VALUES (
    'user_amy_grammar_nerd',
    'amy@cozyartzmedia.com',
    'Amy Cozart-Lundin', 
    'https://github.com/grammar-nerd.png',
    'github',
    'grammar-nerd',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Create default client organization for Cozyartz Media Group
INSERT INTO clients (id, name, domain, owner_id, subscription_tier, ai_calls_limit, ai_calls_used, billing_cycle_start, status, created_at, updated_at)
VALUES (
    'client_cozyartz_media_group',
    'Cozyartz Media Group',
    'cozyartzmedia.com',
    'user_andrea_cozyartz',
    'enterprise',
    500,
    0,
    date('now'),
    'active',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Add Andrea as Owner to the client organization
INSERT INTO client_users (client_id, user_id, role, created_at)
VALUES (
    'client_cozyartz_media_group',
    'user_andrea_cozyartz',
    'owner',
    CURRENT_TIMESTAMP
);

-- Add Amy as Admin to the client organization  
INSERT INTO client_users (client_id, user_id, role, created_at)
VALUES (
    'client_cozyartz_media_group',
    'user_amy_grammar_nerd', 
    'admin',
    CURRENT_TIMESTAMP
);