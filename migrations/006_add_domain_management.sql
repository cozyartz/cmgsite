-- Migration 006: Domain Management System
-- Add tables for Cloudflare Registrar integration and domain revenue tracking

-- Domains table for tracking client domain management
CREATE TABLE IF NOT EXISTS domains (
  id TEXT PRIMARY KEY,
  client_id TEXT NOT NULL,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- active, pending, expired, transferring
  registrar TEXT NOT NULL DEFAULT 'Cloudflare',
  expires_at TEXT,
  auto_renew BOOLEAN DEFAULT TRUE,
  dns_provider TEXT DEFAULT 'Cloudflare',
  ssl_status TEXT DEFAULT 'pending', -- active, pending, expired
  package_type TEXT NOT NULL DEFAULT 'basic', -- basic, pro, enterprise
  monthly_fee REAL DEFAULT 25.00,
  setup_fee REAL DEFAULT 75.00,
  seo_score INTEGER DEFAULT 50,
  zone_id TEXT, -- Cloudflare Zone ID
  nameservers TEXT, -- JSON array of nameservers
  last_updated TEXT DEFAULT CURRENT_TIMESTAMP,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);

-- Domain revenue tracking for service fees and commissions
CREATE TABLE IF NOT EXISTS domain_revenue (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  domain_name TEXT NOT NULL,
  client_id TEXT NOT NULL,
  package_type TEXT NOT NULL,
  amount REAL NOT NULL,
  type TEXT NOT NULL, -- setup, monthly, transfer, renewal
  billing_cycle TEXT, -- monthly, annually
  payment_status TEXT DEFAULT 'pending', -- pending, paid, failed
  transaction_id TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);

-- Domain searches tracking for analytics
CREATE TABLE IF NOT EXISTS domain_searches (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  search_term TEXT NOT NULL,
  tlds TEXT, -- JSON array of TLDs searched
  results_count INTEGER DEFAULT 0,
  user_id TEXT,
  ip_address TEXT,
  user_agent TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Domain packages and pricing configuration
CREATE TABLE IF NOT EXISTS domain_packages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- basic, pro, enterprise
  setup_fee REAL NOT NULL,
  monthly_fee REAL NOT NULL,
  features TEXT, -- JSON array of features
  active BOOLEAN DEFAULT TRUE,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- DNS records management
CREATE TABLE IF NOT EXISTS dns_records (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  domain_id TEXT NOT NULL,
  zone_id TEXT NOT NULL,
  cloudflare_record_id TEXT,
  type TEXT NOT NULL, -- A, AAAA, CNAME, MX, TXT, etc.
  name TEXT NOT NULL,
  content TEXT NOT NULL,
  ttl INTEGER DEFAULT 3600,
  priority INTEGER,
  comment TEXT,
  proxied BOOLEAN DEFAULT FALSE,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (domain_id) REFERENCES domains(id) ON DELETE CASCADE
);

-- Domain transfer requests
CREATE TABLE IF NOT EXISTS domain_transfers (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  domain_name TEXT NOT NULL,
  client_id TEXT NOT NULL,
  transfer_type TEXT NOT NULL, -- in, out
  status TEXT DEFAULT 'pending', -- pending, approved, rejected, completed
  auth_code TEXT,
  new_registrar TEXT,
  old_registrar TEXT,
  transfer_fee REAL DEFAULT 35.00,
  requested_at TEXT DEFAULT CURRENT_TIMESTAMP,
  completed_at TEXT,
  notes TEXT,
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
);

-- Domain renewal reminders
CREATE TABLE IF NOT EXISTS domain_renewals (
  id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  domain_id TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  renewal_cost REAL NOT NULL,
  reminder_sent BOOLEAN DEFAULT FALSE,
  renewal_completed BOOLEAN DEFAULT FALSE,
  auto_renew BOOLEAN DEFAULT TRUE,
  reminder_date TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (domain_id) REFERENCES domains(id) ON DELETE CASCADE
);

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_domains_client_id ON domains(client_id);
CREATE INDEX IF NOT EXISTS idx_domains_status ON domains(status);
CREATE INDEX IF NOT EXISTS idx_domains_expires_at ON domains(expires_at);
CREATE INDEX IF NOT EXISTS idx_domain_revenue_client_id ON domain_revenue(client_id);
CREATE INDEX IF NOT EXISTS idx_domain_revenue_type ON domain_revenue(type);
CREATE INDEX IF NOT EXISTS idx_domain_revenue_created_at ON domain_revenue(created_at);
CREATE INDEX IF NOT EXISTS idx_domain_searches_created_at ON domain_searches(created_at);
CREATE INDEX IF NOT EXISTS idx_dns_records_domain_id ON dns_records(domain_id);
CREATE INDEX IF NOT EXISTS idx_domain_transfers_client_id ON domain_transfers(client_id);
CREATE INDEX IF NOT EXISTS idx_domain_renewals_expires_at ON domain_renewals(expires_at);

-- Insert default domain packages
INSERT OR REPLACE INTO domain_packages (id, name, type, setup_fee, monthly_fee, features) VALUES
('pkg_basic', 'Basic Domain Setup', 'basic', 75.00, 10.00, '["Domain registration", "Basic DNS setup", "Email forwarding", "SSL certificate"]'),
('pkg_pro', 'Pro SEO Domain Package', 'pro', 150.00, 25.00, '["SEO-optimized setup", "Advanced DNS", "Email hosting", "SSL management", "CDN setup", "Monthly reporting"]'),
('pkg_enterprise', 'Enterprise Domain Management', 'enterprise', 250.00, 50.00, '["Full management", "Priority support", "Advanced security", "DDoS protection", "Daily monitoring", "Dedicated support"]');

-- Add domain-related columns to clients table if they don't exist
ALTER TABLE clients ADD COLUMN domain_limit INTEGER DEFAULT 1;
ALTER TABLE clients ADD COLUMN domains_managed INTEGER DEFAULT 0;
ALTER TABLE clients ADD COLUMN domain_package TEXT DEFAULT 'basic';

-- Update existing clients with default domain settings
UPDATE clients SET 
  domain_limit = CASE subscription_tier
    WHEN 'starter' THEN 1
    WHEN 'starterPlus' THEN 2  
    WHEN 'growth' THEN 5
    WHEN 'growthPlus' THEN 10
    WHEN 'enterprise' THEN 25
    WHEN 'enterprisePlus' THEN 50
    ELSE 1
  END,
  domain_package = 'basic'
WHERE domain_limit IS NULL;