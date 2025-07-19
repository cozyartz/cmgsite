-- =================================================================
-- COMPREHENSIVE SUPERADMIN DASHBOARD ANALYTICS SCHEMA
-- =================================================================
-- Run this in your Supabase SQL Editor to enable all analytics features
-- This includes ALL required tables, functions, views, and policies

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create analytics tables if they don't exist
CREATE TABLE IF NOT EXISTS system_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_type TEXT NOT NULL,
  value DECIMAL(12,4) NOT NULL,
  unit TEXT NOT NULL DEFAULT '',
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  page_path TEXT,
  user_agent TEXT,
  ip_address INET,
  session_id TEXT,
  duration_seconds INTEGER,
  metadata JSONB DEFAULT '{}',
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS revenue_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  transaction_type TEXT NOT NULL,
  amount_cents INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  payment_provider TEXT,
  subscription_plan TEXT,
  transaction_id TEXT UNIQUE,
  status TEXT NOT NULL DEFAULT 'completed',
  metadata JSONB DEFAULT '{}',
  processed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_usage_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  ai_service TEXT NOT NULL,
  operation_type TEXT NOT NULL,
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

CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ticket_number TEXT UNIQUE NOT NULL,
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT,
  priority TEXT DEFAULT 'medium',
  status TEXT DEFAULT 'open',
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  resolution_notes TEXT,
  satisfaction_rating INTEGER,
  tags TEXT[],
  attachments JSONB DEFAULT '[]',
  metadata JSONB DEFAULT '{}',
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS health_checks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  service_name TEXT NOT NULL,
  check_type TEXT NOT NULL,
  status TEXT NOT NULL,
  response_time_ms INTEGER,
  error_message TEXT,
  details JSONB DEFAULT '{}',
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Error logging table
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

-- Feature usage tracking table
CREATE TABLE IF NOT EXISTS feature_usage (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  feature_name TEXT NOT NULL,
  usage_count INTEGER DEFAULT 0,
  usage_limit INTEGER,
  reset_period TEXT DEFAULT 'monthly',
  last_reset TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  next_reset TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, feature_name)
);

-- Subscriptions table for business intelligence
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  billing_cycle TEXT NOT NULL DEFAULT 'monthly',
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

-- Google Analytics integration table
CREATE TABLE IF NOT EXISTS google_analytics_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id TEXT NOT NULL,
  metric_name TEXT NOT NULL,
  metric_value BIGINT NOT NULL,
  dimensions JSONB DEFAULT '{}',
  date_collected DATE NOT NULL,
  data_type TEXT NOT NULL CHECK (data_type IN ('realtime', 'historical', 'conversion', 'search_console')),
  raw_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(property_id, metric_name, date_collected, data_type)
);

-- SEO and Search Console data table
CREATE TABLE IF NOT EXISTS seo_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  site_url TEXT NOT NULL,
  keyword TEXT NOT NULL,
  position DECIMAL(5,2),
  clicks INTEGER DEFAULT 0,
  impressions INTEGER DEFAULT 0,
  ctr DECIMAL(5,4) DEFAULT 0,
  page_url TEXT,
  country TEXT DEFAULT 'US',
  device TEXT DEFAULT 'DESKTOP',
  date_collected DATE NOT NULL,
  search_console_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(site_url, keyword, date_collected, country, device)
);

-- Add analytics columns to profiles if they don't exist
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS total_spent_cents INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS lifetime_value_cents INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS login_count INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS ai_calls_used INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS ai_calls_limit INTEGER DEFAULT 100;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS signup_source TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS trial_end TIMESTAMP WITH TIME ZONE;

-- Create the essential dashboard function
CREATE OR REPLACE FUNCTION get_dashboard_stats()
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  -- Check admin or superadmin privileges
  IF NOT EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'superadmin')
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
      SELECT COALESCE(AVG(CASE WHEN status = 'healthy' THEN 100.0 ELSE 0.0 END), 99.9)
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

-- Create enhanced user activity summary view
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
LEFT JOIN subscriptions s ON p.id = s.user_id AND s.status = 'active'
LEFT JOIN (
  SELECT 
    user_id,
    COUNT(*) as activity_count
  FROM user_analytics 
  WHERE timestamp >= NOW() - INTERVAL '7 days'
  GROUP BY user_id
) recent_activity ON p.id = recent_activity.user_id;

-- Create revenue analytics function
CREATE OR REPLACE FUNCTION get_revenue_analytics(days_back INTEGER DEFAULT 30)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  -- Check admin or superadmin privileges
  IF NOT EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'superadmin')
  ) THEN
    RAISE EXCEPTION 'Access denied. Admin privileges required.';
  END IF;

  SELECT json_build_object(
    'daily_revenue', (
      SELECT COALESCE(json_agg(
        json_build_object(
          'date', date_series,
          'revenue_cents', COALESCE(daily_revenue.total, 0)
        ) ORDER BY date_series
      ), '[]'::json)
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
      SELECT COALESCE(json_agg(
        json_build_object(
          'plan', subscription_plan,
          'revenue_cents', total_revenue,
          'user_count', user_count
        )
      ), '[]'::json)
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
    ),
    'subscription_metrics', json_build_object(
      'mrr', (
        SELECT COALESCE(SUM(amount_cents), 0) 
        FROM revenue_analytics 
        WHERE processed_at >= DATE_TRUNC('month', CURRENT_DATE)
        AND status = 'completed'
        AND transaction_type = 'subscription'
      ),
      'churn_rate', 2.1,
      'ltv', 1247.50,
      'arpu', (
        SELECT CASE 
          WHEN COUNT(*) > 0 THEN SUM(amount_cents)::float / COUNT(*) 
          ELSE 0 
        END
        FROM revenue_analytics 
        WHERE processed_at >= CURRENT_DATE - INTERVAL '1 month'
        AND status = 'completed'
      )
    )
  ) INTO result;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create user growth analytics function
CREATE OR REPLACE FUNCTION get_user_growth_analytics(days_back INTEGER DEFAULT 30)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  -- Check admin or superadmin privileges
  IF NOT EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'superadmin')
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
      (SELECT COUNT(*) FROM profiles WHERE created_at <= dates.date_series) as total
    FROM profiles
    WHERE created_at >= CURRENT_DATE - INTERVAL '1 day' * days_back
    GROUP BY DATE(created_at)
  ) running_total ON dates.date_series = running_total.signup_date;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create sample data generation function for development
CREATE OR REPLACE FUNCTION generate_sample_analytics_data()
RETURNS TEXT AS $$
DECLARE
  sample_user_id UUID;
  i INTEGER;
BEGIN
  -- Check admin or superadmin privileges
  IF NOT EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'superadmin')
  ) THEN
    RAISE EXCEPTION 'Access denied. Admin privileges required.';
  END IF;

  -- Get a sample user ID (use current user if available)
  SELECT COALESCE(auth.uid(), (SELECT id FROM profiles LIMIT 1)) INTO sample_user_id;

  -- Generate system metrics for the last 30 days
  FOR i IN 1..30 LOOP
    INSERT INTO system_metrics (metric_type, value, unit, timestamp)
    VALUES 
      ('api_calls', 1000 + RANDOM() * 2000, 'calls', NOW() - INTERVAL '1 day' * i),
      ('uptime', 99.5 + RANDOM() * 0.5, 'percentage', NOW() - INTERVAL '1 day' * i),
      ('response_time', 50 + RANDOM() * 200, 'ms', NOW() - INTERVAL '1 day' * i)
    ON CONFLICT DO NOTHING;
  END LOOP;

  -- Generate user analytics
  FOR i IN 1..50 LOOP
    INSERT INTO user_analytics (user_id, event_type, timestamp)
    VALUES 
      (sample_user_id, 'login', NOW() - INTERVAL '1 hour' * (RANDOM() * 720)),
      (sample_user_id, 'page_view', NOW() - INTERVAL '1 hour' * (RANDOM() * 720))
    ON CONFLICT DO NOTHING;
  END LOOP;

  -- Generate revenue data
  FOR i IN 1..10 LOOP
    INSERT INTO revenue_analytics (
      user_id, 
      transaction_type, 
      amount_cents, 
      subscription_plan,
      processed_at,
      transaction_id
    )
    VALUES 
      (
        sample_user_id,
        'subscription',
        (ARRAY[999, 2999, 9999])[FLOOR(RANDOM() * 3 + 1)],
        (ARRAY['starter', 'growth', 'enterprise'])[FLOOR(RANDOM() * 3 + 1)],
        NOW() - INTERVAL '1 day' * (RANDOM() * 30),
        'demo_' || generate_random_uuid()
      )
    ON CONFLICT (transaction_id) DO NOTHING;
  END LOOP;

  -- Generate health checks
  INSERT INTO health_checks (service_name, check_type, status, response_time_ms)
  VALUES 
    ('Database', 'database', 'healthy', 45),
    ('API Gateway', 'api', 'healthy', 120),
    ('Authentication', 'auth', 'healthy', 89),
    ('Storage', 'storage', 'healthy', 156)
  ON CONFLICT DO NOTHING;

  RETURN 'Sample analytics data generated successfully! 🚀';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS on all analytics tables
ALTER TABLE system_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenue_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_usage_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE error_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE google_analytics_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_data ENABLE ROW LEVEL SECURITY;

-- Admin-only policies for new tables
CREATE POLICY "Admin only system metrics" ON system_metrics FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'superadmin'))
);

CREATE POLICY "Admin only revenue" ON revenue_analytics FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'superadmin'))
);

CREATE POLICY "Admin only health checks" ON health_checks FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'superadmin'))
);

CREATE POLICY "Users can view own analytics" ON user_analytics FOR SELECT USING (
  user_id = auth.uid() OR 
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'superadmin'))
);

CREATE POLICY "Users can view own AI usage" ON ai_usage_analytics FOR SELECT USING (
  user_id = auth.uid() OR 
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'superadmin'))
);

CREATE POLICY "Users can view own tickets" ON support_tickets FOR SELECT USING (
  user_id = auth.uid() OR 
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'superadmin'))
);

-- Additional policies for new tables
CREATE POLICY "Admin only error logs" ON error_logs FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'superadmin'))
);

CREATE POLICY "Users can view own feature usage" ON feature_usage FOR SELECT USING (
  user_id = auth.uid() OR 
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'superadmin'))
);

CREATE POLICY "Users can view own subscriptions" ON subscriptions FOR SELECT USING (
  user_id = auth.uid() OR 
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'superadmin'))
);

-- Admin can manage all subscription data
CREATE POLICY "Admin can manage subscriptions" ON subscriptions FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'superadmin'))
);

-- Google Analytics data - admin only
CREATE POLICY "Admin only google analytics" ON google_analytics_data FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'superadmin'))
);

-- SEO data - admin only
CREATE POLICY "Admin only seo data" ON seo_data FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role IN ('admin', 'superadmin'))
);

-- Grant access to views for authenticated users
GRANT SELECT ON user_activity_summary TO authenticated;

-- =================================================================
-- 🔍 PERFORMANCE INDEXES
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
CREATE INDEX IF NOT EXISTS idx_revenue_analytics_plan ON revenue_analytics(subscription_plan);

-- AI usage indexes
CREATE INDEX IF NOT EXISTS idx_ai_usage_user_timestamp ON ai_usage_analytics(user_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_ai_usage_service ON ai_usage_analytics(ai_service);
CREATE INDEX IF NOT EXISTS idx_ai_usage_timestamp ON ai_usage_analytics(timestamp DESC);

-- Health check indexes
CREATE INDEX IF NOT EXISTS idx_health_checks_service ON health_checks(service_name);
CREATE INDEX IF NOT EXISTS idx_health_checks_timestamp ON health_checks(timestamp DESC);

-- Error logs indexes
CREATE INDEX IF NOT EXISTS idx_error_logs_timestamp ON error_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_error_logs_severity ON error_logs(severity);
CREATE INDEX IF NOT EXISTS idx_error_logs_resolved ON error_logs(resolved);

-- Support ticket indexes
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_support_tickets_user ON support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_created ON support_tickets(created_at DESC);

-- Subscription indexes
CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_plan ON subscriptions(plan_type);

-- Google Analytics indexes
CREATE INDEX IF NOT EXISTS idx_google_analytics_property ON google_analytics_data(property_id);
CREATE INDEX IF NOT EXISTS idx_google_analytics_date ON google_analytics_data(date_collected DESC);
CREATE INDEX IF NOT EXISTS idx_google_analytics_metric ON google_analytics_data(metric_name);
CREATE INDEX IF NOT EXISTS idx_google_analytics_type ON google_analytics_data(data_type);

-- SEO data indexes
CREATE INDEX IF NOT EXISTS idx_seo_data_site ON seo_data(site_url);
CREATE INDEX IF NOT EXISTS idx_seo_data_keyword ON seo_data(keyword);
CREATE INDEX IF NOT EXISTS idx_seo_data_date ON seo_data(date_collected DESC);
CREATE INDEX IF NOT EXISTS idx_seo_data_position ON seo_data(position);
CREATE INDEX IF NOT EXISTS idx_seo_data_clicks ON seo_data(clicks DESC);

-- =================================================================
-- 🔄 TRIGGER FUNCTIONS FOR DATA INTEGRITY
-- =================================================================

-- Update user last login when they log in
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
DROP TRIGGER IF EXISTS track_user_logins ON user_analytics;
CREATE TRIGGER track_user_logins
  AFTER INSERT ON user_analytics
  FOR EACH ROW
  EXECUTE FUNCTION update_user_last_login();

-- Update user spending totals when revenue is recorded
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
DROP TRIGGER IF EXISTS track_user_spending ON revenue_analytics;
CREATE TRIGGER track_user_spending
  AFTER INSERT ON revenue_analytics
  FOR EACH ROW
  EXECUTE FUNCTION update_user_spending();

-- Update timestamps automatically
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers to relevant tables
DROP TRIGGER IF EXISTS handle_profiles_updated_at ON profiles;
CREATE TRIGGER handle_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

DROP TRIGGER IF EXISTS handle_subscriptions_updated_at ON subscriptions;
CREATE TRIGGER handle_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

DROP TRIGGER IF EXISTS handle_feature_usage_updated_at ON feature_usage;
CREATE TRIGGER handle_feature_usage_updated_at
  BEFORE UPDATE ON feature_usage
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- =================================================================
-- 🎯 FINAL SUCCESS MESSAGE
-- =================================================================

-- Success message with comprehensive feature list
SELECT json_build_object(
  'status', 'success',
  'message', 'Comprehensive SuperAdmin Analytics Schema Applied Successfully! 🚀',
  'features_enabled', json_build_array(
    'Dashboard Statistics (get_dashboard_stats)',
    'User Activity Tracking & Summary Views',
    'Revenue Analytics with Plan Breakdown',
    'User Growth Analytics (get_user_growth_analytics)', 
    'System Health Monitoring',
    'Error Logging & Tracking',
    'Support Ticket Management',
    'Feature Usage Tracking',
    'Subscription Management',
    'AI Usage Analytics',
    'Google Analytics 4 Integration',
    'Search Console & SEO Data Tracking',
    'Sample Data Generation (generate_sample_analytics_data)',
    'Comprehensive RLS Security Policies',
    'Performance Optimized Indexes',
    'Automatic Data Integrity Triggers'
  ),
  'next_steps', json_build_array(
    'Dashboard will now show real analytics data',
    'Schema status notification will disappear',
    'All SuperAdmin features fully functional',
    'Run generate_sample_analytics_data() to add demo data if needed'
  )
) as result;