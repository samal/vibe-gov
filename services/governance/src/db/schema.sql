-- Additional governance schema for LineageNexus

-- Masking rules table
CREATE TABLE IF NOT EXISTS masking_rules (
  id SERIAL PRIMARY KEY,
  name VARCHAR(128) NOT NULL,
  classification_key VARCHAR(64) NOT NULL REFERENCES classifications(key),
  role_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  masking_type VARCHAR(32) NOT NULL CHECK (masking_type IN ('REDACT', 'HASH', 'PARTIAL', 'CUSTOM')),
  masking_config JSONB NOT NULL DEFAULT '{}',
  enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Asset classifications (many-to-many)
CREATE TABLE IF NOT EXISTS asset_classifications (
  asset_id VARCHAR(256) NOT NULL,
  classification_key VARCHAR(64) NOT NULL REFERENCES classifications(key),
  assigned_by INTEGER REFERENCES users(id),
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (asset_id, classification_key)
);

-- Enhanced audit logs with more structure
CREATE TABLE IF NOT EXISTS audit_logs_enhanced (
  id BIGSERIAL PRIMARY KEY,
  actor_user_id INTEGER REFERENCES users(id),
  action VARCHAR(128) NOT NULL,
  entity_type VARCHAR(64) NOT NULL,
  entity_id VARCHAR(256) NOT NULL,
  resource_type VARCHAR(64),
  resource_id VARCHAR(256),
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_masking_rules_classification ON masking_rules(classification_key);
CREATE INDEX IF NOT EXISTS idx_masking_rules_role ON masking_rules(role_id);
CREATE INDEX IF NOT EXISTS idx_asset_classifications_asset ON asset_classifications(asset_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_enhanced_entity ON audit_logs_enhanced(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_enhanced_actor ON audit_logs_enhanced(actor_user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_enhanced_created ON audit_logs_enhanced(created_at);

-- Insert default classifications
INSERT INTO classifications (key, label) VALUES 
  ('PII', 'Personally Identifiable Information'),
  ('PHI', 'Protected Health Information'),
  ('FINANCIAL', 'Financial Data'),
  ('CONFIDENTIAL', 'Confidential Business Data'),
  ('PUBLIC', 'Public Data')
ON CONFLICT (key) DO NOTHING;

-- Insert default roles
INSERT INTO roles (name, description) VALUES 
  ('ADMIN', 'System administrator with full access'),
  ('DATA_STEWARD', 'Data steward with governance permissions'),
  ('ANALYST', 'Data analyst with read access'),
  ('VIEWER', 'Read-only access to lineage and catalog')
ON CONFLICT (name) DO NOTHING;
