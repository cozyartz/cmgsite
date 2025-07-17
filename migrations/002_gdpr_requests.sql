-- GDPR data subject requests
CREATE TABLE gdpr_requests (
    id TEXT PRIMARY KEY,
    request_type TEXT NOT NULL, -- 'access', 'deletion', 'portability', 'rectification', 'restriction', 'objection'
    email TEXT NOT NULL,
    full_name TEXT NOT NULL,
    details TEXT,
    status TEXT DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'rejected'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    processed_at DATETIME,
    notes TEXT
);

-- Index for GDPR requests
CREATE INDEX idx_gdpr_requests_email ON gdpr_requests(email);
CREATE INDEX idx_gdpr_requests_status ON gdpr_requests(status);
CREATE INDEX idx_gdpr_requests_created ON gdpr_requests(created_at);