-- AI Analytics and Usage Tracking Tables
-- Supports advanced AI assistant features

-- AI Usage Logs Table
CREATE TABLE IF NOT EXISTS ai_usage_logs (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    session_id TEXT NOT NULL,
    user_id TEXT,
    model_used TEXT NOT NULL,
    tokens_used INTEGER DEFAULT 0,
    cost_estimate REAL DEFAULT 0.0,
    intent TEXT,
    lead_score INTEGER DEFAULT 0,
    context TEXT, -- sales, technical, billing, etc.
    request_message TEXT,
    response_message TEXT,
    confidence REAL,
    sentiment TEXT,
    fallback_used BOOLEAN DEFAULT FALSE,
    timestamp TEXT DEFAULT (datetime('now')),
    created_at TEXT DEFAULT (datetime('now'))
);

-- Conversation Memory Table (for session persistence)
CREATE TABLE IF NOT EXISTS conversation_memory (
    session_id TEXT PRIMARY KEY,
    user_id TEXT,
    lead_data TEXT, -- JSON blob
    conversation_history TEXT, -- JSON array of messages
    lead_score INTEGER DEFAULT 0,
    intent TEXT,
    sentiment TEXT,
    last_active TEXT DEFAULT (datetime('now')),
    expires_at TEXT DEFAULT (datetime('now', '+24 hours')),
    created_at TEXT DEFAULT (datetime('now'))
);

-- AI Model Performance Metrics
CREATE TABLE IF NOT EXISTS ai_model_metrics (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    model_name TEXT NOT NULL,
    date TEXT NOT NULL, -- YYYY-MM-DD format
    total_requests INTEGER DEFAULT 0,
    total_tokens INTEGER DEFAULT 0,
    total_cost REAL DEFAULT 0.0,
    avg_response_time REAL DEFAULT 0.0,
    success_rate REAL DEFAULT 0.0,
    fallback_count INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    UNIQUE(model_name, date)
);

-- Lead Conversion Analytics
CREATE TABLE IF NOT EXISTS lead_conversion_analytics (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    session_id TEXT NOT NULL,
    initial_lead_score INTEGER DEFAULT 0,
    final_lead_score INTEGER DEFAULT 0,
    conversation_length INTEGER DEFAULT 0,
    intent_classification TEXT,
    sentiment_analysis TEXT,
    converted_to_lead BOOLEAN DEFAULT FALSE,
    lead_id TEXT, -- Reference to Breakcold CRM lead
    conversion_timestamp TEXT,
    total_ai_cost REAL DEFAULT 0.0,
    created_at TEXT DEFAULT (datetime('now'))
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_ai_usage_logs_session ON ai_usage_logs(session_id);
CREATE INDEX IF NOT EXISTS idx_ai_usage_logs_timestamp ON ai_usage_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_ai_usage_logs_model ON ai_usage_logs(model_used);
CREATE INDEX IF NOT EXISTS idx_ai_usage_logs_intent ON ai_usage_logs(intent);

CREATE INDEX IF NOT EXISTS idx_conversation_memory_user ON conversation_memory(user_id);
CREATE INDEX IF NOT EXISTS idx_conversation_memory_expires ON conversation_memory(expires_at);

CREATE INDEX IF NOT EXISTS idx_ai_model_metrics_date ON ai_model_metrics(date);
CREATE INDEX IF NOT EXISTS idx_ai_model_metrics_model ON ai_model_metrics(model_name);

CREATE INDEX IF NOT EXISTS idx_lead_conversion_session ON lead_conversion_analytics(session_id);
CREATE INDEX IF NOT EXISTS idx_lead_conversion_date ON lead_conversion_analytics(created_at);

-- Sample data for testing
INSERT OR IGNORE INTO ai_model_metrics (model_name, date, total_requests, total_tokens, total_cost, success_rate) VALUES
('@cf/meta/llama-3.1-8b-instruct', date('now'), 0, 0, 0.0, 100.0),
('@cf/meta/llama-3.3-70b-instruct', date('now'), 0, 0, 0.0, 100.0);

-- Cleanup trigger for expired conversation memory
CREATE TRIGGER IF NOT EXISTS cleanup_expired_conversations
AFTER INSERT ON conversation_memory
BEGIN
    DELETE FROM conversation_memory 
    WHERE expires_at < datetime('now');
END;