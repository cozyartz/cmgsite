-- =================================================================
-- COZYARTZ MEDIA GROUP - COMPREHENSIVE SUPERADMIN DATABASE SCHEMA
-- =================================================================
-- This schema provides real-time analytics and business intelligence
-- for the SuperAdmin dashboard with proper RLS and security

-- =================================================================
-- 📊 ANALYTICS & METRICS TABLES
-- =================================================================

-- System metrics tracking
CREATE TABLE IF NOT EXISTS system_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_type TEXT NOT NULL CHECK (metric_type IN (
    'api_calls', 'uptime', 'response_time', 'error_rate', 
    'database_connections', 'memory_usage', 'cpu_usage'
  )),
  value DECIMAL(12,4) NOT NULL,
  unit TEXT NOT NULL DEFAULT '',
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User analytics and behavior tracking
CREATE TABLE IF NOT EXISTS user_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN (
    'login', 'logout', 'page_view', 'feature_usage', 
    'api_call', 'subscription_change', 'payment'
  )),
  page_path TEXT,
  user_agent TEXT,
  ip_address INET,
  session_id TEXT,
  duration_seconds INTEGER,
  metadata JSONB DEFAULT '{}',
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Revenue and financial tracking
CREATE TABLE IF NOT EXISTS revenue_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN (
    'subscription', 'one_time', 'upgrade', 'downgrade', 'refund'
  )),
  amount_cents INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  payment_provider TEXT CHECK (payment_provider IN ('stripe', 'paypal', 'square')),
  subscription_plan TEXT CHECK (subscription_plan IN ('starter', 'growth', 'enterprise')),
  transaction_id TEXT UNIQUE,
  status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN (
    'pending', 'completed', 'failed', 'refunded', 'cancelled'
  )),
  metadata JSONB DEFAULT '{}',
  processed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI usage tracking
CREATE TABLE IF NOT EXISTS ai_usage_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  ai_service TEXT NOT NULL CHECK (ai_service IN (
    'openai_gpt4', 'anthropic_claude', 'cloudflare_ai', 'custom_ai'
  )),
  operation_type TEXT NOT NULL CHECK (operation_type IN (
    'text_generation', 'image_generation', 'analysis', 'translation', 'summarization'
  )),
  tokens_used INTEGER DEFAULT 0,
  cost_cents INTEGER DEFAULT 0,
  request_metadata JSONB DEFAULT '{}',
  response_metadata JSONB DEFAULT '{}',
  success BOOLEAN DEFAULT true,
  error_message TEXT,
  processing_time_ms INTEGER,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =================================================================
-- 💰 BUSINESS INTELLIGENCE TABLES
-- =================================================================

-- Subscription management
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_type TEXT NOT NULL CHECK (plan_type IN ('starter', 'growth', 'enterprise')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN (
    'active', 'cancelled', 'expired', 'suspended', 'pending'
  )),
  billing_cycle TEXT NOT NULL DEFAULT 'monthly' CHECK (billing_cycle IN (
    'monthly', 'yearly', 'one_time'
  )),
  amount_cents INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  stripe_subscription_id TEXT UNIQUE,
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  trial_end TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  features JSONB DEFAULT '{}',
  usage_limits JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Feature usage limits and tracking
CREATE TABLE IF NOT EXISTS feature_usage (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  feature_name TEXT NOT NULL,
  usage_count INTEGER DEFAULT 0,
  usage_limit INTEGER,
  reset_period TEXT DEFAULT 'monthly' CHECK (reset_period IN (
    'daily', 'weekly', 'monthly', 'yearly', 'never'
  )),
  last_reset TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  next_reset TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, feature_name)
);

-- Customer support tickets
CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ticket_number TEXT UNIQUE NOT NULL,
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT CHECK (category IN (
    'technical', 'billing', 'feature_request', 'bug_report', 'general'
  )),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT DEFAULT 'open' CHECK (status IN (
    'open', 'in_progress', 'waiting_customer', 'resolved', 'closed'
  )),
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  resolution_notes TEXT,
  satisfaction_rating INTEGER CHECK (satisfaction_rating BETWEEN 1 AND 5),
  tags TEXT[],
  attachments JSONB DEFAULT '[]',
  metadata JSONB DEFAULT '{}',
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =================================================================
-- 🔧 SYSTEM HEALTH & MONITORING
-- =================================================================

-- System health checks
CREATE TABLE IF NOT EXISTS health_checks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  service_name TEXT NOT NULL,
  check_type TEXT NOT NULL CHECK (check_type IN (
    'database', 'api', 'external_service', 'storage', 'auth'
  )),
  status TEXT NOT NULL CHECK (status IN ('healthy', 'degraded', 'unhealthy')),
  response_time_ms INTEGER,
  error_message TEXT,
  details JSONB DEFAULT '{}',
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Error logging
CREATE TABLE IF NOT EXISTS error_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  error_type TEXT NOT NULL,
  error_message TEXT NOT NULL,
  stack_trace TEXT,
  url_path TEXT,
  user_agent TEXT,
  ip_address INET,
  severity TEXT DEFAULT 'error' CHECK (severity IN ('debug', 'info', 'warning', 'error', 'critical')),
  resolved BOOLEAN DEFAULT false,
  resolution_notes TEXT,
  metadata JSONB DEFAULT '{}',
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =================================================================
-- 📈 ENHANCED USER PROFILES
-- =================================================================

-- Extend the existing profiles table with business intelligence
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_id UUID REFERENCES subscriptions(id);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS total_spent_cents INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS lifetime_value_cents INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS login_count INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS ai_calls_used INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS ai_calls_limit INTEGER DEFAULT 100;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN (
  'active', 'suspended', 'pending', 'cancelled', 'churned'
));
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS signup_source TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS trial_end TIMESTAMP WITH TIME ZONE;

-- =================================================================
-- 🔍 INDEXES FOR PERFORMANCE
-- =================================================================

-- System metrics indexes
CREATE INDEX IF NOT EXISTS idx_system_metrics_type_timestamp ON system_metrics(metric_type, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_system_metrics_timestamp ON system_metrics(timestamp DESC);

-- User analytics indexes
CREATE INDEX IF NOT EXISTS idx_user_analytics_user_timestamp ON user_analytics(user_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_user_analytics_event_timestamp ON user_analytics(event_type, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_user_analytics_timestamp ON user_analytics(timestamp DESC);

-- Revenue analytics indexes
CREATE INDEX IF NOT EXISTS idx_revenue_analytics_user ON revenue_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_revenue_analytics_date ON revenue_analytics(processed_at DESC);
CREATE INDEX IF NOT EXISTS idx_revenue_analytics_type ON revenue_analytics(transaction_type);

-- AI usage indexes
CREATE INDEX IF NOT EXISTS idx_ai_usage_user_timestamp ON ai_usage_analytics(user_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_ai_usage_service ON ai_usage_analytics(ai_service);
CREATE INDEX IF NOT EXISTS idx_ai_usage_timestamp ON ai_usage_analytics(timestamp DESC);

-- Subscription indexes
CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_plan ON subscriptions(plan_type);

-- =================================================================
-- 🛡️ ROW LEVEL SECURITY POLICIES
-- =================================================================

-- Enable RLS on all new tables
ALTER TABLE system_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenue_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_usage_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE error_logs ENABLE ROW LEVEL SECURITY;

-- Admin-only policies for system tables
CREATE POLICY "Admin only system metrics" ON system_metrics FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

CREATE POLICY "Admin only health checks" ON health_checks FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

CREATE POLICY "Admin only error logs" ON error_logs FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- User analytics - admins see all, users see own
CREATE POLICY "Users can view own analytics" ON user_analytics FOR SELECT USING (
  user_id = auth.uid() OR 
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

CREATE POLICY "Admin can insert analytics" ON user_analytics FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- Revenue analytics - admin only
CREATE POLICY "Admin only revenue" ON revenue_analytics FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- AI usage - users see own, admins see all
CREATE POLICY "Users can view own AI usage" ON ai_usage_analytics FOR SELECT USING (
  user_id = auth.uid() OR 
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- Subscriptions - users see own, admins see all
CREATE POLICY "Users can view own subscriptions" ON subscriptions FOR SELECT USING (
  user_id = auth.uid() OR 
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- Feature usage - users see own, admins see all
CREATE POLICY "Users can view own feature usage" ON feature_usage FOR SELECT USING (
  user_id = auth.uid() OR 
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- Support tickets - users see own, admins see all
CREATE POLICY "Users can view own tickets" ON support_tickets FOR SELECT USING (
  user_id = auth.uid() OR 
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- =================================================================
-- 📊 ANALYTICS FUNCTIONS
-- =================================================================

-- Function to get real-time dashboard stats
CREATE OR REPLACE FUNCTION get_dashboard_stats()
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  -- Check admin privileges
  IF NOT EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Access denied. Admin privileges required.';
  END IF;

  SELECT json_build_object(
    'total_users', (SELECT COUNT(*) FROM profiles),
    'active_users', (SELECT COUNT(*) FROM profiles WHERE status = 'active'),
    'monthly_revenue_cents', (
      SELECT COALESCE(SUM(amount_cents), 0) 
      FROM revenue_analytics 
      WHERE processed_at >= DATE_TRUNC('month', CURRENT_DATE)
      AND status = 'completed'
    ),
    'total_revenue_cents', (
      SELECT COALESCE(SUM(amount_cents), 0) 
      FROM revenue_analytics 
      WHERE status = 'completed'
    ),
    'api_calls_today', (
      SELECT COUNT(*) 
      FROM ai_usage_analytics 
      WHERE DATE(timestamp) = CURRENT_DATE
    ),
    'system_uptime', (
      SELECT COALESCE(AVG(CASE WHEN status = 'healthy' THEN 100.0 ELSE 0.0 END), 0)
      FROM health_checks 
      WHERE timestamp >= NOW() - INTERVAL '24 hours'
    ),
    'new_signups_today', (
      SELECT COUNT(*) 
      FROM profiles 
      WHERE DATE(created_at) = CURRENT_DATE
    ),
    'support_tickets_open', (
      SELECT COUNT(*) 
      FROM support_tickets 
      WHERE status IN ('open', 'in_progress')
    )
  ) INTO result;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user growth analytics
CREATE OR REPLACE FUNCTION get_user_growth_analytics(days_back INTEGER DEFAULT 30)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  -- Check admin privileges
  IF NOT EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Access denied. Admin privileges required.';
  END IF;

  SELECT json_agg(
    json_build_object(
      'date', date_series,
      'new_users', COALESCE(daily_signups.count, 0),
      'total_users', COALESCE(running_total.total, 0)
    ) ORDER BY date_series
  ) INTO result
  FROM (
    SELECT generate_series(
      CURRENT_DATE - INTERVAL '1 day' * days_back,
      CURRENT_DATE,
      INTERVAL '1 day'
    )::date AS date_series
  ) AS dates
  LEFT JOIN (
    SELECT DATE(created_at) as signup_date, COUNT(*) as count
    FROM profiles
    WHERE created_at >= CURRENT_DATE - INTERVAL '1 day' * days_back
    GROUP BY DATE(created_at)
  ) daily_signups ON dates.date_series = daily_signups.signup_date
  LEFT JOIN (
    SELECT 
      DATE(created_at) as signup_date,
      COUNT(*) OVER (ORDER BY DATE(created_at)) as total
    FROM profiles
    WHERE created_at >= CURRENT_DATE - INTERVAL '1 day' * days_back
    GROUP BY DATE(created_at)
  ) running_total ON dates.date_series = running_total.signup_date;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get revenue analytics
CREATE OR REPLACE FUNCTION get_revenue_analytics(days_back INTEGER DEFAULT 30)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  -- Check admin privileges
  IF NOT EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Access denied. Admin privileges required.';
  END IF;

  SELECT json_build_object(
    'daily_revenue', (
      SELECT json_agg(
        json_build_object(
          'date', date_series,
          'revenue_cents', COALESCE(daily_revenue.total, 0)
        ) ORDER BY date_series
      )
      FROM (
        SELECT generate_series(
          CURRENT_DATE - INTERVAL '1 day' * days_back,
          CURRENT_DATE,
          INTERVAL '1 day'
        )::date AS date_series
      ) AS dates
      LEFT JOIN (
        SELECT DATE(processed_at) as revenue_date, SUM(amount_cents) as total
        FROM revenue_analytics
        WHERE processed_at >= CURRENT_DATE - INTERVAL '1 day' * days_back
        AND status = 'completed'
        GROUP BY DATE(processed_at)
      ) daily_revenue ON dates.date_series = daily_revenue.revenue_date
    ),
    'revenue_by_plan', (
      SELECT json_agg(
        json_build_object(
          'plan', subscription_plan,
          'revenue_cents', total_revenue,
          'user_count', user_count
        )
      )
      FROM (
        SELECT 
          subscription_plan,
          SUM(amount_cents) as total_revenue,
          COUNT(DISTINCT user_id) as user_count
        FROM revenue_analytics
        WHERE processed_at >= CURRENT_DATE - INTERVAL '1 day' * days_back
        AND status = 'completed'
        AND subscription_plan IS NOT NULL
        GROUP BY subscription_plan
      ) plan_revenue
    )
  ) INTO result;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =================================================================
-- 🔄 TRIGGER FUNCTIONS
-- =================================================================

-- Update user last login
CREATE OR REPLACE FUNCTION update_user_last_login()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.event_type = 'login' THEN
    UPDATE profiles 
    SET 
      last_login = NEW.timestamp,
      login_count = COALESCE(login_count, 0) + 1,
      updated_at = NOW()
    WHERE id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for login tracking
CREATE OR REPLACE TRIGGER track_user_logins
  AFTER INSERT ON user_analytics
  FOR EACH ROW
  EXECUTE FUNCTION update_user_last_login();

-- Update user spending totals
CREATE OR REPLACE FUNCTION update_user_spending()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND NEW.user_id IS NOT NULL THEN
    UPDATE profiles 
    SET 
      total_spent_cents = COALESCE(total_spent_cents, 0) + NEW.amount_cents,
      lifetime_value_cents = COALESCE(lifetime_value_cents, 0) + NEW.amount_cents,
      updated_at = NOW()
    WHERE id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for revenue tracking
CREATE OR REPLACE TRIGGER track_user_spending
  AFTER INSERT ON revenue_analytics
  FOR EACH ROW
  EXECUTE FUNCTION update_user_spending();

-- =================================================================
-- 📝 SAMPLE DATA FUNCTIONS
-- =================================================================

-- Function to generate sample analytics data (for development)
CREATE OR REPLACE FUNCTION generate_sample_analytics_data()
RETURNS TEXT AS $$
DECLARE
  sample_user_id UUID;
  i INTEGER;
BEGIN
  -- Check admin privileges
  IF NOT EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Access denied. Admin privileges required.';
  END IF;

  -- Get a sample user ID
  SELECT id INTO sample_user_id FROM profiles LIMIT 1;

  -- Generate system metrics for the last 30 days
  FOR i IN 1..30 LOOP
    INSERT INTO system_metrics (metric_type, value, unit, timestamp)
    VALUES 
      ('api_calls', 1000 + RANDOM() * 2000, 'calls', NOW() - INTERVAL '1 day' * i),
      ('uptime', 99.5 + RANDOM() * 0.5, 'percentage', NOW() - INTERVAL '1 day' * i),
      ('response_time', 50 + RANDOM() * 200, 'ms', NOW() - INTERVAL '1 day' * i);
  END LOOP;

  -- Generate user analytics
  FOR i IN 1..100 LOOP
    INSERT INTO user_analytics (user_id, event_type, timestamp)
    VALUES 
      (sample_user_id, 'login', NOW() - INTERVAL '1 hour' * (RANDOM() * 720)),
      (sample_user_id, 'page_view', NOW() - INTERVAL '1 hour' * (RANDOM() * 720));
  END LOOP;

  -- Generate revenue data
  FOR i IN 1..20 LOOP
    INSERT INTO revenue_analytics (
      user_id, 
      transaction_type, 
      amount_cents, 
      subscription_plan,
      processed_at
    )
    VALUES 
      (
        sample_user_id,
        'subscription',
        (ARRAY[999, 2999, 9999])[FLOOR(RANDOM() * 3 + 1)],
        (ARRAY['starter', 'growth', 'enterprise'])[FLOOR(RANDOM() * 3 + 1)],
        NOW() - INTERVAL '1 day' * (RANDOM() * 30)
      );
  END LOOP;

  RETURN 'Sample analytics data generated successfully!';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =================================================================
-- 📊 VIEWS FOR EASY DATA ACCESS
-- =================================================================

-- Dashboard overview view
CREATE OR REPLACE VIEW dashboard_overview AS
SELECT 
  'users' as metric,
  COUNT(*)::text as value,
  'Total Users' as label
FROM profiles
UNION ALL
SELECT 
  'revenue' as metric,
  (COALESCE(SUM(amount_cents), 0) / 100)::text as value,
  'Total Revenue ($)' as label
FROM revenue_analytics 
WHERE status = 'completed'
UNION ALL
SELECT 
  'api_calls' as metric,
  COUNT(*)::text as value,
  'Total AI Calls' as label
FROM ai_usage_analytics;

-- User activity summary view
CREATE OR REPLACE VIEW user_activity_summary AS
SELECT 
  p.id,
  p.email,
  p.full_name,
  p.role,
  p.status,
  p.total_spent_cents,
  p.last_login,
  p.login_count,
  p.ai_calls_used,
  p.ai_calls_limit,
  s.plan_type as subscription_plan,
  s.status as subscription_status,
  COALESCE(recent_activity.activity_count, 0) as recent_activity_count
FROM profiles p
LEFT JOIN subscriptions s ON p.subscription_id = s.id
LEFT JOIN (
  SELECT 
    user_id,
    COUNT(*) as activity_count
  FROM user_analytics 
  WHERE timestamp >= NOW() - INTERVAL '7 days'
  GROUP BY user_id
) recent_activity ON p.id = recent_activity.user_id;

-- Grant access to views for admins
GRANT SELECT ON dashboard_overview TO authenticated;
GRANT SELECT ON user_activity_summary TO authenticated;

-- =================================================================
-- 🎯 FINAL SETUP COMMENTS
-- =================================================================

COMMENT ON SCHEMA public IS 'Cozyartz Media Group - Comprehensive SuperAdmin Analytics Schema';
COMMENT ON TABLE system_metrics IS 'Real-time system performance and health metrics';
COMMENT ON TABLE user_analytics IS 'User behavior and interaction tracking';
COMMENT ON TABLE revenue_analytics IS 'Financial transactions and revenue tracking';
COMMENT ON TABLE ai_usage_analytics IS 'AI service usage and cost tracking';
COMMENT ON TABLE subscriptions IS 'User subscription management and billing';
COMMENT ON TABLE feature_usage IS 'Feature usage limits and consumption tracking';
COMMENT ON TABLE support_tickets IS 'Customer support ticket management';
COMMENT ON TABLE health_checks IS 'System health monitoring and alerts';
COMMENT ON TABLE error_logs IS 'Application error tracking and debugging';

-- Success message
SELECT 'Cozyartz SuperAdmin Analytics Schema installed successfully! 🚀' as status;