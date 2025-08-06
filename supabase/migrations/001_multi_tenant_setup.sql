-- Multi-tenant database setup for Workers for Platforms
-- This migration adds tenant isolation using Row Level Security (RLS)

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create tenants table to manage all tenants
CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id TEXT UNIQUE NOT NULL, -- e.g., 'cmg-default', 'partner-001'
    name TEXT NOT NULL,
    domain TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('primary', 'partner-subdomain', 'custom-domain')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'inactive')),
    
    -- Whitelabel configuration
    whitelabel_config JSONB NOT NULL DEFAULT '{}',
    
    -- Tenant-specific settings
    settings JSONB NOT NULL DEFAULT '{}',
    
    -- Billing and limits
    subscription_tier TEXT DEFAULT 'starter',
    monthly_ai_limit INTEGER DEFAULT 100,
    domain_limit INTEGER DEFAULT 1,
    
    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_by UUID,
    
    -- Tenant isolation metadata
    isolation_level TEXT DEFAULT 'rls' CHECK (isolation_level IN ('database', 'schema', 'rls')),
    
    -- Security and compliance
    data_region TEXT DEFAULT 'us-east-1',
    encryption_key_id TEXT,
    
    CONSTRAINT valid_tenant_id CHECK (tenant_id ~ '^[a-z0-9-]+$'),
    CONSTRAINT valid_domain CHECK (domain ~ '^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')
);

-- Enable RLS on tenants table
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for tenants (super admins only)
CREATE POLICY tenant_access ON tenants 
    FOR ALL 
    USING (
        -- Only super admins can access tenant records
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND role = 'super_admin'
        )
    );

-- Update profiles table for multi-tenant support
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS tenant_id TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS tenant_role TEXT DEFAULT 'client';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS tenant_permissions JSONB DEFAULT '{}';

-- Create foreign key constraint
ALTER TABLE profiles 
ADD CONSTRAINT fk_profiles_tenant 
FOREIGN KEY (tenant_id) 
REFERENCES tenants(tenant_id) 
ON DELETE CASCADE;

-- Create index for tenant queries
CREATE INDEX IF NOT EXISTS idx_profiles_tenant_id ON profiles(tenant_id);
CREATE INDEX IF NOT EXISTS idx_profiles_tenant_role ON profiles(tenant_id, tenant_role);

-- Enable RLS on profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies and recreate for multi-tenant
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Multi-tenant RLS policies for profiles
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT
    USING (
        auth.uid() = id 
        OR 
        -- Super admins can view all profiles
        EXISTS (
            SELECT 1 FROM profiles p
            WHERE p.id = auth.uid() 
            AND p.role = 'super_admin'
        )
        OR
        -- Tenant admins can view profiles in their tenant
        EXISTS (
            SELECT 1 FROM profiles p
            WHERE p.id = auth.uid()
            AND p.tenant_id = profiles.tenant_id
            AND p.tenant_role = 'admin'
        )
    );

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE
    USING (
        auth.uid() = id
        OR
        -- Super admins can update any profile
        EXISTS (
            SELECT 1 FROM profiles p
            WHERE p.id = auth.uid() 
            AND p.role = 'super_admin'
        )
    );

CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT
    WITH CHECK (
        auth.uid() = id
        AND
        -- Ensure tenant_id is provided and valid
        tenant_id IS NOT NULL
        AND
        EXISTS (
            SELECT 1 FROM tenants t 
            WHERE t.tenant_id = profiles.tenant_id 
            AND t.status = 'active'
        )
    );

-- Create tenant_usage table for tracking AI calls, domains, etc.
CREATE TABLE IF NOT EXISTS tenant_usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id TEXT NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    usage_type TEXT NOT NULL, -- 'ai_calls', 'domains', 'storage', etc.
    usage_count INTEGER NOT NULL DEFAULT 0,
    usage_limit INTEGER NOT NULL DEFAULT 0,
    reset_period TEXT NOT NULL DEFAULT 'monthly', -- 'daily', 'weekly', 'monthly'
    last_reset TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    
    UNIQUE(tenant_id, usage_type, reset_period)
);

-- Enable RLS on tenant_usage
ALTER TABLE tenant_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tenant usage access" ON tenant_usage
    FOR ALL
    USING (
        -- Users can only see their own tenant's usage
        EXISTS (
            SELECT 1 FROM profiles p
            WHERE p.id = auth.uid()
            AND p.tenant_id = tenant_usage.tenant_id
        )
        OR
        -- Super admins can see all usage
        EXISTS (
            SELECT 1 FROM profiles p
            WHERE p.id = auth.uid() 
            AND p.role = 'super_admin'
        )
    );

-- Create tenant_domains table for domain management
CREATE TABLE IF NOT EXISTS tenant_domains (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id TEXT NOT NULL REFERENCES tenants(tenant_id) ON DELETE CASCADE,
    domain TEXT NOT NULL,
    domain_type TEXT NOT NULL CHECK (domain_type IN ('primary', 'custom', 'subdomain')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'pending', 'inactive')),
    ssl_status TEXT DEFAULT 'pending' CHECK (ssl_status IN ('pending', 'active', 'failed')),
    dns_configured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    
    UNIQUE(domain)
);

-- Enable RLS on tenant_domains
ALTER TABLE tenant_domains ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tenant domain access" ON tenant_domains
    FOR ALL
    USING (
        -- Users can only manage their own tenant's domains
        EXISTS (
            SELECT 1 FROM profiles p
            WHERE p.id = auth.uid()
            AND p.tenant_id = tenant_domains.tenant_id
        )
        OR
        -- Super admins can manage all domains
        EXISTS (
            SELECT 1 FROM profiles p
            WHERE p.id = auth.uid() 
            AND p.role = 'super_admin'
        )
    );

-- Create function to get current user's tenant_id
CREATE OR REPLACE FUNCTION get_current_tenant_id()
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
AS $$
    SELECT tenant_id FROM profiles WHERE id = auth.uid();
$$;

-- Create function to check if user has tenant permission
CREATE OR REPLACE FUNCTION has_tenant_permission(permission_name TEXT)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
AS $$
    SELECT COALESCE(
        (profiles.tenant_permissions->>permission_name)::boolean,
        false
    )
    FROM profiles 
    WHERE id = auth.uid();
$$;

-- Create function to update tenant usage
CREATE OR REPLACE FUNCTION increment_tenant_usage(
    p_tenant_id TEXT,
    p_usage_type TEXT,
    p_increment INTEGER DEFAULT 1
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    current_usage INTEGER;
    usage_limit INTEGER;
BEGIN
    -- Get current usage and limit
    SELECT usage_count, usage_limit
    INTO current_usage, usage_limit
    FROM tenant_usage
    WHERE tenant_id = p_tenant_id 
    AND usage_type = p_usage_type;
    
    -- Check if usage record exists
    IF NOT FOUND THEN
        -- Create initial usage record
        INSERT INTO tenant_usage (tenant_id, usage_type, usage_count, usage_limit)
        VALUES (p_tenant_id, p_usage_type, p_increment, 
                CASE p_usage_type
                    WHEN 'ai_calls' THEN 100
                    WHEN 'domains' THEN 1
                    ELSE 0
                END);
        RETURN true;
    END IF;
    
    -- Check if increment would exceed limit
    IF (current_usage + p_increment) > usage_limit THEN
        RETURN false;
    END IF;
    
    -- Increment usage
    UPDATE tenant_usage
    SET usage_count = usage_count + p_increment,
        updated_at = now()
    WHERE tenant_id = p_tenant_id 
    AND usage_type = p_usage_type;
    
    RETURN true;
END;
$$;

-- Insert default tenant (Cozyartz Media Group)
INSERT INTO tenants (
    tenant_id,
    name,
    domain,
    type,
    whitelabel_config,
    subscription_tier,
    monthly_ai_limit,
    domain_limit
) VALUES (
    'cmg-default',
    'Cozyartz Media Group',
    'cozyartzmedia.com',
    'primary',
    '{
        "brandName": "COZYARTZ",
        "companyName": "Cozyartz Media Group",
        "primaryColor": "#14b8a6",
        "features": {
            "whitelabel": true,
            "multiTenant": true,
            "clientPortal": true
        }
    }',
    'enterprisePlus',
    1000,
    50
) ON CONFLICT (tenant_id) DO NOTHING;

-- Insert initial usage records for default tenant
INSERT INTO tenant_usage (tenant_id, usage_type, usage_limit)
VALUES 
    ('cmg-default', 'ai_calls', 1000),
    ('cmg-default', 'domains', 50)
ON CONFLICT (tenant_id, usage_type, reset_period) DO NOTHING;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_tenants_status ON tenants(status);
CREATE INDEX IF NOT EXISTS idx_tenants_type ON tenants(type);
CREATE INDEX IF NOT EXISTS idx_tenant_usage_tenant_type ON tenant_usage(tenant_id, usage_type);
CREATE INDEX IF NOT EXISTS idx_tenant_domains_tenant ON tenant_domains(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_domains_domain ON tenant_domains(domain);

-- Update trigger for tenants table
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tenants_updated_at 
    BEFORE UPDATE ON tenants 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tenant_usage_updated_at 
    BEFORE UPDATE ON tenant_usage 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tenant_domains_updated_at 
    BEFORE UPDATE ON tenant_domains 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();