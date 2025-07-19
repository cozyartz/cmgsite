-- =================================================================
-- QUICK FIX FOR SUPERADMIN DASHBOARD ANALYTICS
-- =================================================================
-- Run this in your Supabase SQL Editor to fix the missing functions
-- This is a minimal version that creates the essential functions

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

-- Create user activity summary view
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
  null as subscription_plan,
  null as subscription_status,
  0 as recent_activity_count
FROM profiles p;

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
    'revenue_by_plan', '[]'::json
  ) INTO result;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS on new tables (basic security)
ALTER TABLE system_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenue_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_usage_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_checks ENABLE ROW LEVEL SECURITY;

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

-- Grant access to views for authenticated users
GRANT SELECT ON user_activity_summary TO authenticated;

-- Success message
SELECT 'SuperAdmin Analytics Quick Fix Applied! 🚀 The dashboard should now work properly.' as status;