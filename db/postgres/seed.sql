-- vibeGov Seed Data
-- This file contains initial data to populate the database on first startup

-- Insert default roles
INSERT INTO roles (name, description) VALUES 
  ('ADMIN', 'System administrator with full access to all features'),
  ('DATA_STEWARD', 'Data steward responsible for data governance and quality'),
  ('DATA_ENGINEER', 'Data engineer with access to lineage and technical metadata'),
  ('ANALYST', 'Data analyst with read access to lineage and catalog'),
  ('VIEWER', 'Read-only access to lineage and catalog for stakeholders'),
  ('COMPLIANCE_OFFICER', 'Compliance officer with access to audit logs and governance')
ON CONFLICT (name) DO NOTHING;

-- Insert default users
INSERT INTO users (external_id, email, display_name) VALUES 
  ('admin-001', 'admin@lineage.com', 'System Administrator'),
  ('steward-001', 'steward@lineage.com', 'Data Steward'),
  ('engineer-001', 'engineer@lineage.com', 'Data Engineer'),
  ('analyst-001', 'analyst@lineage.com', 'Business Analyst'),
  ('viewer-001', 'viewer@lineage.com', 'Stakeholder Viewer'),
  ('compliance-001', 'compliance@lineage.com', 'Compliance Officer')
ON CONFLICT (external_id) DO NOTHING;

-- Assign roles to users
INSERT INTO user_roles (user_id, role_id) VALUES 
  ((SELECT id FROM users WHERE email = 'admin@lineage.com'), (SELECT id FROM roles WHERE name = 'ADMIN')),
  ((SELECT id FROM users WHERE email = 'steward@lineage.com'), (SELECT id FROM roles WHERE name = 'DATA_STEWARD')),
  ((SELECT id FROM users WHERE email = 'engineer@lineage.com'), (SELECT id FROM roles WHERE name = 'DATA_ENGINEER')),
  ((SELECT id FROM users WHERE email = 'analyst@lineage.com'), (SELECT id FROM roles WHERE name = 'ANALYST')),
  ((SELECT id FROM users WHERE email = 'viewer@lineage.com'), (SELECT id FROM roles WHERE name = 'VIEWER')),
  ((SELECT id FROM users WHERE email = 'compliance@lineage.com'), (SELECT id FROM roles WHERE name = 'COMPLIANCE_OFFICER'))
ON CONFLICT DO NOTHING;

-- Insert data classifications
INSERT INTO classifications (key, label, description) VALUES 
  ('PII', 'Personally Identifiable Information', 'Data that can identify a specific individual'),
  ('PHI', 'Protected Health Information', 'Health information that can identify an individual'),
  ('FINANCIAL', 'Financial Data', 'Sensitive financial information including transactions and balances'),
  ('CONFIDENTIAL', 'Confidential Business Data', 'Internal business information not meant for public disclosure'),
  ('PUBLIC', 'Public Data', 'Information that can be freely shared'),
  ('SENSITIVE', 'Sensitive Data', 'Data requiring special handling but not classified as PII/PHI'),
  ('INTERNAL', 'Internal Use Only', 'Data intended for internal company use only'),
  ('RESTRICTED', 'Restricted Data', 'Highly sensitive data with strict access controls')
ON CONFLICT (key) DO NOTHING;

-- Insert sample data assets
INSERT INTO data_assets (id, name, namespace, source_system, asset_type, schema, owners) VALUES 
  -- PostgreSQL Tables
  ('pg.public.users', 'users', 'public', 'postgres', 'TABLE', 
   '{"columns": [{"name": "id", "dataType": "uuid", "classification": "PII"}, {"name": "email", "dataType": "varchar(255)", "classification": "PII"}, {"name": "first_name", "dataType": "varchar(100)", "classification": "PII"}, {"name": "last_name", "dataType": "varchar(100)", "classification": "PII"}, {"name": "created_at", "dataType": "timestamp", "classification": "PUBLIC"}]}',
   '["admin@lineage.com", "steward@lineage.com"]'),
   
  ('pg.public.orders', 'orders', 'public', 'postgres', 'TABLE',
   '{"columns": [{"name": "id", "dataType": "uuid", "classification": "PUBLIC"}, {"name": "user_id", "dataType": "uuid", "classification": "PII"}, {"name": "order_date", "dataType": "date", "classification": "PUBLIC"}, {"name": "total_amount", "dataType": "decimal(10,2)", "classification": "FINANCIAL"}, {"name": "status", "dataType": "varchar(50)", "classification": "PUBLIC"}]}',
   '["admin@lineage.com", "engineer@lineage.com"]'),
   
  ('pg.public.products', 'products', 'public', 'postgres', 'TABLE',
   '{"columns": [{"name": "id", "dataType": "uuid", "classification": "PUBLIC"}, {"name": "name", "dataType": "varchar(255)", "classification": "PUBLIC"}, {"name": "description", "dataType": "text", "classification": "PUBLIC"}, {"name": "price", "dataType": "decimal(10,2)", "classification": "FINANCIAL"}, {"name": "category", "dataType": "varchar(100)", "classification": "PUBLIC"}]}',
   '["admin@lineage.com", "engineer@lineage.com"]'),
   
  ('pg.public.order_items', 'order_items', 'public', 'postgres', 'TABLE',
   '{"columns": [{"name": "id", "dataType": "uuid", "classification": "PUBLIC"}, {"name": "order_id", "dataType": "uuid", "classification": "PUBLIC"}, {"name": "product_id", "dataType": "uuid", "classification": "PUBLIC"}, {"name": "quantity", "dataType": "integer", "classification": "PUBLIC"}, {"name": "unit_price", "dataType": "decimal(10,2)", "classification": "FINANCIAL"}]}',
   '["admin@lineage.com", "engineer@lineage.com"]'),
   
  -- PostgreSQL Views
  ('pg.public.user_summary', 'user_summary', 'public', 'postgres', 'VIEW',
   '{"columns": [{"name": "user_id", "dataType": "uuid", "classification": "PII"}, {"name": "total_orders", "dataType": "integer", "classification": "PUBLIC"}, {"name": "total_spent", "dataType": "decimal(12,2)", "classification": "FINANCIAL"}, {"name": "last_order_date", "dataType": "date", "classification": "PUBLIC"}]}',
   '["admin@lineage.com", "analyst@lineage.com"]'),
   
  ('pg.public.product_performance', 'product_performance', 'public', 'postgres', 'VIEW',
   '{"columns": [{"name": "product_id", "dataType": "uuid", "classification": "PUBLIC"}, {"name": "product_name", "dataType": "varchar(255)", "classification": "PUBLIC"}, {"name": "total_sales", "dataType": "decimal(12,2)", "classification": "FINANCIAL"}, {"name": "units_sold", "dataType": "integer", "classification": "PUBLIC"}]}',
   '["admin@lineage.com", "analyst@lineage.com"]'),
   
  -- MySQL Tables (simulated)
  ('mysql.sales.customers', 'customers', 'sales', 'mysql', 'TABLE',
   '{"columns": [{"name": "customer_id", "dataType": "int", "classification": "PII"}, {"name": "first_name", "dataType": "varchar(50)", "classification": "PII"}, {"name": "last_name", "dataType": "varchar(50)", "classification": "PII"}, {"name": "email", "dataType": "varchar(100)", "classification": "PII"}, {"name": "phone", "dataType": "varchar(20)", "classification": "PII"}, {"name": "address", "dataType": "text", "classification": "PII"}, {"name": "created_at", "dataType": "timestamp", "classification": "PUBLIC"}]}',
   '["steward@lineage.com", "engineer@lineage.com"]'),
   
  ('mysql.sales.orders', 'orders', 'sales', 'mysql', 'TABLE',
   '{"columns": [{"name": "order_id", "dataType": "int", "classification": "PUBLIC"}, {"name": "customer_id", "dataType": "int", "classification": "PII"}, {"name": "order_date", "dataType": "date", "classification": "PUBLIC"}, {"name": "total_amount", "dataType": "decimal(10,2)", "classification": "FINANCIAL"}, {"name": "status", "dataType": "varchar(50)", "classification": "PUBLIC"}, {"name": "shipping_address", "dataType": "text", "classification": "PII"}]}',
   '["steward@lineage.com", "engineer@lineage.com"]'),
   
  ('mysql.sales.order_items', 'order_items', 'sales', 'mysql', 'TABLE',
   '{"columns": [{"name": "order_item_id", "dataType": "int", "classification": "PUBLIC"}, {"name": "order_id", "dataType": "int", "classification": "PUBLIC"}, {"name": "product_id", "dataType": "int", "classification": "PUBLIC"}, {"name": "quantity", "dataType": "int", "classification": "PUBLIC"}, {"name": "unit_price", "dataType": "decimal(10,2)", "classification": "FINANCIAL"}, {"name": "total_price", "dataType": "decimal(10,2)", "classification": "FINANCIAL"}]}',
   '["steward@lineage.com", "engineer@lineage.com"]'),
   
  ('mysql.inventory.products', 'products', 'inventory', 'mysql', 'TABLE',
   '{"columns": [{"name": "product_id", "dataType": "int", "classification": "PUBLIC"}, {"name": "product_name", "dataType": "varchar(100)", "classification": "PUBLIC"}, {"name": "category", "dataType": "varchar(50)", "classification": "PUBLIC"}, {"name": "price", "dataType": "decimal(10,2)", "classification": "FINANCIAL"}, {"name": "stock_quantity", "dataType": "int", "classification": "INTERNAL"}, {"name": "supplier_id", "dataType": "int", "classification": "INTERNAL"}, {"name": "created_at", "dataType": "timestamp", "classification": "PUBLIC"}]}',
   '["steward@lineage.com", "engineer@lineage.com"]'),
   
  ('mysql.inventory.suppliers', 'suppliers', 'inventory', 'mysql', 'TABLE',
   '{"columns": [{"name": "supplier_id", "dataType": "int", "classification": "PUBLIC"}, {"name": "supplier_name", "dataType": "varchar(100)", "classification": "PUBLIC"}, {"name": "contact_person", "dataType": "varchar(100)", "classification": "PII"}, {"name": "email", "dataType": "varchar(100)", "classification": "PII"}, {"name": "phone", "dataType": "varchar(20)", "classification": "PII"}, {"name": "address", "dataType": "text", "classification": "PUBLIC"}]}',
   '["steward@lineage.com", "engineer@lineage.com"]'),
   
  ('mysql.finance.transactions', 'transactions', 'finance', 'mysql', 'TABLE',
   '{"columns": [{"name": "transaction_id", "dataType": "int", "classification": "PUBLIC"}, {"name": "order_id", "dataType": "int", "classification": "PUBLIC"}, {"name": "amount", "dataType": "decimal(10,2)", "classification": "FINANCIAL"}, {"name": "payment_method", "dataType": "varchar(50)", "classification": "PUBLIC"}, {"name": "transaction_date", "dataType": "timestamp", "classification": "PUBLIC"}, {"name": "status", "dataType": "varchar(50)", "classification": "PUBLIC"}]}',
   '["steward@lineage.com", "compliance@lineage.com"]'),
   
  ('mysql.sales.customer_summary', 'customer_summary', 'sales', 'mysql', 'VIEW',
   '{"columns": [{"name": "customer_id", "dataType": "int", "classification": "PII"}, {"name": "customer_name", "dataType": "varchar(100)", "classification": "PII"}, {"name": "total_orders", "dataType": "int", "classification": "PUBLIC"}, {"name": "total_spent", "dataType": "decimal(12,2)", "classification": "FINANCIAL"}, {"name": "last_order_date", "dataType": "date", "classification": "PUBLIC"}]}',
   '["steward@lineage.com", "analyst@lineage.com"]'),
   
  ('mysql.inventory.stock_alerts', 'stock_alerts', 'inventory', 'mysql', 'VIEW',
   '{"columns": [{"name": "product_id", "dataType": "int", "classification": "PUBLIC"}, {"name": "product_name", "dataType": "varchar(100)", "classification": "PUBLIC"}, {"name": "current_stock", "dataType": "int", "classification": "INTERNAL"}, {"name": "reorder_level", "dataType": "int", "classification": "INTERNAL"}, {"name": "days_until_stockout", "dataType": "int", "classification": "INTERNAL"}]}',
   '["steward@lineage.com", "engineer@lineage.com"]'),
   
  -- Tableau Reports
  ('tableau.sales.customer_dashboard', 'Customer Dashboard', 'sales', 'tableau', 'REPORT',
   '{"columns": [{"name": "customer_count", "dataType": "number", "classification": "PUBLIC"}, {"name": "total_revenue", "dataType": "currency", "classification": "FINANCIAL"}, {"name": "avg_order_value", "dataType": "currency", "classification": "FINANCIAL"}]}',
   '["analyst@lineage.com", "steward@lineage.com"]'),
   
  ('tableau.finance.revenue_analysis', 'Revenue Analysis', 'finance', 'tableau', 'REPORT',
   '{"columns": [{"name": "month", "dataType": "date", "classification": "PUBLIC"}, {"name": "revenue", "dataType": "currency", "classification": "FINANCIAL"}, {"name": "growth_rate", "dataType": "percentage", "classification": "PUBLIC"}]}',
   '["analyst@lineage.com", "compliance@lineage.com"]'),
   
  ('tableau.inventory.stock_monitoring', 'Stock Monitoring', 'inventory', 'tableau', 'REPORT',
   '{"columns": [{"name": "product_name", "dataType": "string", "classification": "PUBLIC"}, {"name": "current_stock", "dataType": "number", "classification": "INTERNAL"}, {"name": "reorder_level", "dataType": "number", "classification": "INTERNAL"}]}',
   '["analyst@lineage.com", "engineer@lineage.com"]')
ON CONFLICT (id) DO NOTHING;

-- Insert masking rules
INSERT INTO masking_rules (name, classification_key, role_id, masking_type, masking_config, enabled) VALUES 
  ('PII Redaction for Viewers', 'PII', (SELECT id FROM roles WHERE name = 'VIEWER'), 'REDACT', '{}', true),
  ('PII Hashing for Analysts', 'PII', (SELECT id FROM roles WHERE name = 'ANALYST'), 'HASH', '{}', true),
  ('Financial Data Partial Masking', 'FINANCIAL', (SELECT id FROM roles WHERE name = 'VIEWER'), 'PARTIAL', '{"showFirst": 2, "showLast": 2, "maskChar": "*"}', true),
  ('PHI Full Redaction', 'PHI', (SELECT id FROM roles WHERE name = 'VIEWER'), 'REDACT', '{}', true),
  ('Confidential Data Custom Masking', 'CONFIDENTIAL', (SELECT id FROM roles WHERE name = 'ANALYST'), 'CUSTOM', '{"pattern": "\\b\\w{3,}\\b", "replacement": "***"}', true)
ON CONFLICT DO NOTHING;

-- Insert asset classifications
INSERT INTO asset_classifications (asset_id, classification_key, assigned_by) VALUES 
  -- PostgreSQL assets
  ('pg.public.users', 'PII', (SELECT id FROM users WHERE email = 'steward@lineage.com')),
  ('pg.public.users', 'SENSITIVE', (SELECT id FROM users WHERE email = 'steward@lineage.com')),
  ('pg.public.orders', 'FINANCIAL', (SELECT id FROM users WHERE email = 'steward@lineage.com')),
  ('pg.public.orders', 'INTERNAL', (SELECT id FROM users WHERE email = 'steward@lineage.com')),
  ('pg.public.products', 'PUBLIC', (SELECT id FROM users WHERE email = 'steward@lineage.com')),
  ('pg.public.order_items', 'FINANCIAL', (SELECT id FROM users WHERE email = 'steward@lineage.com')),
  ('pg.public.user_summary', 'FINANCIAL', (SELECT id FROM users WHERE email = 'steward@lineage.com')),
  ('pg.public.user_summary', 'INTERNAL', (SELECT id FROM users WHERE email = 'steward@lineage.com')),
  
  -- MySQL assets
  ('mysql.sales.customers', 'PII', (SELECT id FROM users WHERE email = 'steward@lineage.com')),
  ('mysql.sales.customers', 'SENSITIVE', (SELECT id FROM users WHERE email = 'steward@lineage.com')),
  ('mysql.sales.orders', 'FINANCIAL', (SELECT id FROM users WHERE email = 'steward@lineage.com')),
  ('mysql.sales.orders', 'INTERNAL', (SELECT id FROM users WHERE email = 'steward@lineage.com')),
  ('mysql.sales.order_items', 'FINANCIAL', (SELECT id FROM users WHERE email = 'steward@lineage.com')),
  ('mysql.inventory.products', 'FINANCIAL', (SELECT id FROM users WHERE email = 'steward@lineage.com')),
  ('mysql.inventory.products', 'INTERNAL', (SELECT id FROM users WHERE email = 'steward@lineage.com')),
  ('mysql.inventory.suppliers', 'PII', (SELECT id FROM users WHERE email = 'steward@lineage.com')),
  ('mysql.inventory.suppliers', 'SENSITIVE', (SELECT id FROM users WHERE email = 'steward@lineage.com')),
  ('mysql.finance.transactions', 'FINANCIAL', (SELECT id FROM users WHERE email = 'steward@lineage.com')),
  ('mysql.finance.transactions', 'RESTRICTED', (SELECT id FROM users WHERE email = 'steward@lineage.com')),
  ('mysql.sales.customer_summary', 'FINANCIAL', (SELECT id FROM users WHERE email = 'steward@lineage.com')),
  ('mysql.sales.customer_summary', 'INTERNAL', (SELECT id FROM users WHERE email = 'steward@lineage.com')),
  ('mysql.inventory.stock_alerts', 'INTERNAL', (SELECT id FROM users WHERE email = 'steward@lineage.com')),
  
  -- Tableau assets
  ('tableau.sales.customer_dashboard', 'FINANCIAL', (SELECT id FROM users WHERE email = 'steward@lineage.com')),
  ('tableau.finance.revenue_analysis', 'FINANCIAL', (SELECT id FROM users WHERE email = 'steward@lineage.com')),
  ('tableau.finance.revenue_analysis', 'RESTRICTED', (SELECT id FROM users WHERE email = 'steward@lineage.com')),
  ('tableau.inventory.stock_monitoring', 'INTERNAL', (SELECT id FROM users WHERE email = 'steward@lineage.com'))
ON CONFLICT DO NOTHING;

-- Insert sample audit events
INSERT INTO audit_logs_enhanced (actor_user_id, action, entity_type, entity_id, resource_type, resource_id, old_values, new_values, ip_address, user_agent, metadata) VALUES 
  -- System initialization events
  ((SELECT id FROM users WHERE email = 'admin@lineage.com'), 'SYSTEM_INITIALIZED', 'SYSTEM', 'startup', 'SYSTEM', 'initialization', '{}', '{"version": "1.0.0", "timestamp": "2025-01-15T00:00:00Z"}', '127.0.0.1', 'vibeGov/1.0.0', '{"component": "database", "action": "seed_data_inserted"}'),
  
  -- User creation events
  ((SELECT id FROM users WHERE email = 'admin@lineage.com'), 'CREATE_USER', 'USER', 'steward-001', 'USER', 'steward@lineage.com', '{}', '{"email": "steward@lineage.com", "displayName": "Data Steward", "role": "DATA_STEWARD"}', '127.0.0.1', 'vibeGov/1.0.0', '{"source": "seed_data"}'),
  ((SELECT id FROM users WHERE email = 'admin@lineage.com'), 'CREATE_USER', 'USER', 'engineer-001', 'USER', 'engineer@lineage.com', '{}', '{"email": "engineer@lineage.com", "displayName": "Data Engineer", "role": "DATA_ENGINEER"}', '127.0.0.1', 'vibeGov/1.0.0', '{"source": "seed_data"}'),
  
  -- Classification events
  ((SELECT id FROM users WHERE email = 'steward@lineage.com'), 'CREATE_CLASSIFICATION', 'CLASSIFICATION', 'PII', 'CLASSIFICATION', 'PII', '{}', '{"key": "PII", "label": "Personally Identifiable Information", "description": "Data that can identify a specific individual"}', '127.0.0.1', 'vibeGov/1.0.0', '{"source": "seed_data"}'),
  ((SELECT id FROM users WHERE email = 'steward@lineage.com'), 'CREATE_CLASSIFICATION', 'CLASSIFICATION', 'FINANCIAL', 'CLASSIFICATION', 'FINANCIAL', '{}', '{"key": "FINANCIAL", "label": "Financial Data", "description": "Sensitive financial information including transactions and balances"}', '127.0.0.1', 'vibeGov/1.0.0', '{"source": "seed_data"}'),
  
  -- Asset classification events
  ((SELECT id FROM users WHERE email = 'steward@lineage.com'), 'ASSIGN_CLASSIFICATION', 'ASSET', 'pg.public.users', 'CLASSIFICATION', 'PII', '{}', '{"classificationKey": "PII", "assetId": "pg.public.users"}', '127.0.0.1', 'vibeGov/1.0.0', '{"source": "seed_data"}'),
  ((SELECT id FROM users WHERE email = 'steward@lineage.com'), 'ASSIGN_CLASSIFICATION', 'ASSET', 'pg.public.orders', 'CLASSIFICATION', 'FINANCIAL', '{}', '{"classificationKey": "FINANCIAL", "assetId": "pg.public.orders"}', '127.0.0.1', 'vibeGov/1.0.0', '{"source": "seed_data"}'),
  
  -- Masking rule events
  ((SELECT id FROM users WHERE email = 'admin@lineage.com'), 'CREATE_MASKING_RULE', 'MASKING_RULE', '1', 'MASKING_RULE', 'PII Redaction for Viewers', '{}', '{"name": "PII Redaction for Viewers", "classificationKey": "PII", "roleId": 5, "maskingType": "REDACT"}', '127.0.0.1', 'vibeGov/1.0.0', '{"source": "seed_data"}'),
  ((SELECT id FROM users WHERE email = 'admin@lineage.com'), 'CREATE_MASKING_RULE', 'MASKING_RULE', '2', 'MASKING_RULE', 'PII Hashing for Analysts', '{}', '{"name": "PII Hashing for Analysts", "classificationKey": "PII", "roleId": 4, "maskingType": "HASH"}', '127.0.0.1', 'vibeGov/1.0.0', '{"source": "seed_data"}'),
  
  -- Data asset events
  ((SELECT id FROM users WHERE email = 'admin@lineage.com'), 'CREATE_ASSET', 'DATA_ASSET', 'pg.public.users', 'DATA_ASSET', 'pg.public.users', '{}', '{"id": "pg.public.users", "name": "users", "namespace": "public", "sourceSystem": "postgres", "assetType": "TABLE"}', '127.0.0.1', 'vibeGov/1.0.0', '{"source": "seed_data"}'),
  ((SELECT id FROM users WHERE email = 'admin@lineage.com'), 'CREATE_ASSET', 'DATA_ASSET', 'pg.public.orders', 'DATA_ASSET', 'pg.public.orders', '{}', '{"id": "pg.public.orders", "name": "orders", "namespace": "public", "sourceSystem": "postgres", "assetType": "TABLE"}', '127.0.0.1', 'vibeGov/1.0.0', '{"source": "seed_data"}'),
  
  -- Login events
  ((SELECT id FROM users WHERE email = 'admin@lineage.com'), 'USER_LOGIN', 'USER', 'admin-001', 'USER', 'admin@lineage.com', '{}', '{"timestamp": "2025-01-15T00:00:00Z", "ip": "127.0.0.1"}', '127.0.0.1', 'vibeGov/1.0.0', '{"source": "seed_data", "session_id": "seed-session-001"}'),
  ((SELECT id FROM users WHERE email = 'steward@lineage.com'), 'USER_LOGIN', 'USER', 'steward-001', 'USER', 'steward@lineage.com', '{}', '{"timestamp": "2025-01-15T00:00:00Z", "ip": "127.0.0.1"}', '127.0.0.1', 'vibeGov/1.0.0', '{"source": "seed_data", "session_id": "seed-session-002"}')
ON CONFLICT DO NOTHING;

-- Create indexes for better performance (if they don't exist)
CREATE INDEX IF NOT EXISTS idx_data_assets_source_system ON data_assets(source_system);
CREATE INDEX IF NOT EXISTS idx_data_assets_asset_type ON data_assets(asset_type);
CREATE INDEX IF NOT EXISTS idx_data_assets_namespace ON data_assets(namespace);
CREATE INDEX IF NOT EXISTS idx_asset_classifications_asset_id ON asset_classifications(asset_id);
CREATE INDEX IF NOT EXISTS idx_asset_classifications_classification_key ON asset_classifications(classification_key);
CREATE INDEX IF NOT EXISTS idx_masking_rules_classification_role ON masking_rules(classification_key, role_id);

-- Insert sample lineage relationships (these would normally come from the lineage API)
-- For demo purposes, we'll create some basic relationships
INSERT INTO audit_logs_enhanced (actor_user_id, action, entity_type, entity_id, resource_type, resource_id, old_values, new_values, ip_address, user_agent, metadata) VALUES 
  ((SELECT id FROM users WHERE email = 'engineer@lineage.com'), 'CREATE_LINEAGE', 'LINEAGE', 'pg.public.users->pg.public.orders', 'LINEAGE', 'FLOWS_TO', '{}', '{"upstream": "pg.public.users", "downstream": "pg.public.orders", "transformation": "JOIN"}', '127.0.0.1', 'vibeGov/1.0.0', '{"source": "seed_data", "lineage_type": "table_to_table"}'),
  ((SELECT id FROM users WHERE email = 'engineer@lineage.com'), 'CREATE_LINEAGE', 'LINEAGE', 'pg.public.orders->pg.public.order_items', 'LINEAGE', 'FLOWS_TO', '{}', '{"upstream": "pg.public.orders", "downstream": "pg.public.order_items", "transformation": "JOIN"}', '127.0.0.1', 'vibeGov/1.0.0', '{"source": "seed_data", "lineage_type": "table_to_table"}'),
  ((SELECT id FROM users WHERE email = 'engineer@lineage.com'), 'CREATE_LINEAGE', 'LINEAGE', 'pg.public.products->pg.public.order_items', 'LINEAGE', 'FLOWS_TO', '{}', '{"upstream": "pg.public.products", "downstream": "pg.public.order_items", "transformation": "JOIN"}', '127.0.0.1', 'vibeGov/1.0.0', '{"source": "seed_data", "lineage_type": "table_to_table"}'),
  ((SELECT id FROM users WHERE email = 'engineer@lineage.com'), 'CREATE_LINEAGE', 'LINEAGE', 'pg.public.users+pg.public.orders->pg.public.user_summary', 'LINEAGE', 'FLOWS_TO', '{}', '{"upstream": ["pg.public.users", "pg.public.orders"], "downstream": "pg.public.user_summary", "transformation": "VIEW"}', '127.0.0.1', 'vibeGov/1.0.0', '{"source": "seed_data", "lineage_type": "table_to_view"}'),
  ((SELECT id FROM users WHERE email = 'engineer@lineage.com'), 'CREATE_LINEAGE', 'LINEAGE', 'pg.public.orders+pg.public.order_items+pg.public.products->pg.public.product_performance', 'LINEAGE', 'FLOWS_TO', '{}', '{"upstream": ["pg.public.orders", "pg.public.order_items", "pg.public.products"], "downstream": "pg.public.product_performance", "transformation": "VIEW"}', '127.0.0.1', 'vibeGov/1.0.0', '{"source": "seed_data", "lineage_type": "table_to_view"}'),
  ((SELECT id FROM users WHERE email = 'engineer@lineage.com'), 'CREATE_LINEAGE', 'LINEAGE', 'pg.public.user_summary->tableau.sales.customer_dashboard', 'LINEAGE', 'FLOWS_TO', '{}', '{"upstream": "pg.public.user_summary", "downstream": "tableau.sales.customer_dashboard", "transformation": "TABLEAU_EXTRACT"}', '127.0.0.1', 'vibeGov/1.0.0', '{"source": "seed_data", "lineage_type": "view_to_report"}'),
  ((SELECT id FROM users WHERE email = 'engineer@lineage.com'), 'CREATE_LINEAGE', 'LINEAGE', 'pg.public.orders->tableau.finance.revenue_analysis', 'LINEAGE', 'FLOWS_TO', '{}', '{"upstream": "pg.public.orders", "downstream": "tableau.finance.revenue_analysis", "transformation": "TABLEAU_EXTRACT"}', '127.0.0.1', 'vibeGov/1.0.0', '{"source": "seed_data", "lineage_type": "table_to_report"}'),
  ((SELECT id FROM users WHERE email = 'engineer@lineage.com'), 'CREATE_LINEAGE', 'LINEAGE', 'pg.public.products->tableau.inventory.stock_monitoring', 'LINEAGE', 'FLOWS_TO', '{}', '{"upstream": "pg.public.products", "downstream": "tableau.inventory.stock_monitoring", "transformation": "TABLEAU_EXTRACT"}', '127.0.0.1', 'vibeGov/1.0.0', '{"source": "seed_data", "lineage_type": "table_to_report"}'),
  
  -- MySQL lineage relationships
  ((SELECT id FROM users WHERE email = 'engineer@lineage.com'), 'CREATE_LINEAGE', 'LINEAGE', 'mysql.sales.customers->mysql.sales.orders', 'LINEAGE', 'FLOWS_TO', '{}', '{"upstream": "mysql.sales.customers", "downstream": "mysql.sales.orders", "transformation": "JOIN"}', '127.0.0.1', 'vibeGov/1.0.0', '{"source": "seed_data", "lineage_type": "table_to_table"}'),
  ((SELECT id FROM users WHERE email = 'engineer@lineage.com'), 'CREATE_LINEAGE', 'LINEAGE', 'mysql.sales.orders->mysql.sales.order_items', 'LINEAGE', 'FLOWS_TO', '{}', '{"upstream": "mysql.sales.orders", "downstream": "mysql.sales.order_items", "transformation": "JOIN"}', '127.0.0.1', 'vibeGov/1.0.0', '{"source": "seed_data", "lineage_type": "table_to_table"}'),
  ((SELECT id FROM users WHERE email = 'engineer@lineage.com'), 'CREATE_LINEAGE', 'LINEAGE', 'mysql.inventory.products->mysql.sales.order_items', 'LINEAGE', 'FLOWS_TO', '{}', '{"upstream": "mysql.inventory.products", "downstream": "mysql.sales.order_items", "transformation": "JOIN"}', '127.0.0.1', 'vibeGov/1.0.0', '{"source": "seed_data", "lineage_type": "table_to_table"}'),
  ((SELECT id FROM users WHERE email = 'engineer@lineage.com'), 'CREATE_LINEAGE', 'LINEAGE', 'mysql.inventory.suppliers->mysql.inventory.products', 'LINEAGE', 'FLOWS_TO', '{}', '{"upstream": "mysql.inventory.suppliers", "downstream": "mysql.inventory.products", "transformation": "JOIN"}', '127.0.0.1', 'vibeGov/1.0.0', '{"source": "seed_data", "lineage_type": "table_to_table"}'),
  ((SELECT id FROM users WHERE email = 'engineer@lineage.com'), 'CREATE_LINEAGE', 'LINEAGE', 'mysql.sales.orders->mysql.finance.transactions', 'LINEAGE', 'FLOWS_TO', '{}', '{"upstream": "mysql.sales.orders", "downstream": "mysql.finance.transactions", "transformation": "JOIN"}', '127.0.0.1', 'vibeGov/1.0.0', '{"source": "seed_data", "lineage_type": "table_to_table"}'),
  ((SELECT id FROM users WHERE email = 'engineer@lineage.com'), 'CREATE_LINEAGE', 'LINEAGE', 'mysql.sales.customers+mysql.sales.orders->mysql.sales.customer_summary', 'LINEAGE', 'FLOWS_TO', '{}', '{"upstream": ["mysql.sales.customers", "mysql.sales.orders"], "downstream": "mysql.sales.customer_summary", "transformation": "VIEW"}', '127.0.0.1', 'vibeGov/1.0.0', '{"source": "seed_data", "lineage_type": "table_to_view"}'),
  ((SELECT id FROM users WHERE email = 'engineer@lineage.com'), 'CREATE_LINEAGE', 'LINEAGE', 'mysql.inventory.products->mysql.inventory.stock_alerts', 'LINEAGE', 'FLOWS_TO', '{}', '{"upstream": "mysql.inventory.products", "downstream": "mysql.inventory.stock_alerts", "transformation": "VIEW"}', '127.0.0.1', 'vibeGov/1.0.0', '{"source": "seed_data", "lineage_type": "table_to_view"}'),
  ((SELECT id FROM users WHERE email = 'engineer@lineage.com'), 'CREATE_LINEAGE', 'LINEAGE', 'mysql.sales.customer_summary->tableau.sales.customer_dashboard', 'LINEAGE', 'FLOWS_TO', '{}', '{"upstream": "mysql.sales.customer_summary", "downstream": "tableau.sales.customer_dashboard", "transformation": "TABLEAU_EXTRACT"}', '127.0.0.1', 'vibeGov/1.0.0', '{"source": "seed_data", "lineage_type": "view_to_report"}'),
  ((SELECT id FROM users WHERE email = 'engineer@lineage.com'), 'CREATE_LINEAGE', 'LINEAGE', 'mysql.finance.transactions->tableau.finance.revenue_analysis', 'LINEAGE', 'FLOWS_TO', '{}', '{"upstream": "mysql.finance.transactions", "downstream": "tableau.finance.revenue_analysis", "transformation": "TABLEAU_EXTRACT"}', '127.0.0.1', 'vibeGov/1.0.0', '{"source": "seed_data", "lineage_type": "table_to_report"}'),
  ((SELECT id FROM users WHERE email = 'engineer@lineage.com'), 'CREATE_LINEAGE', 'LINEAGE', 'mysql.inventory.stock_alerts->tableau.inventory.stock_monitoring', 'LINEAGE', 'FLOWS_TO', '{}', '{"upstream": "mysql.inventory.stock_alerts", "downstream": "tableau.inventory.stock_monitoring", "transformation": "TABLEAU_EXTRACT"}', '127.0.0.1', 'vibeGov/1.0.0', '{"source": "seed_data", "lineage_type": "view_to_report"}')
ON CONFLICT DO NOTHING;

-- Log completion of seed data insertion
INSERT INTO audit_logs_enhanced (actor_user_id, action, entity_type, entity_id, resource_type, resource_id, old_values, new_values, ip_address, user_agent, metadata) VALUES 
  ((SELECT id FROM users WHERE email = 'admin@lineage.com'), 'SEED_DATA_COMPLETED', 'SYSTEM', 'database', 'SYSTEM', 'seed_data', '{}', '{"status": "completed", "timestamp": "2025-01-15T00:00:00Z", "records_inserted": "seed_data_complete"}', '127.0.0.1', 'vibeGov/1.0.0', '{"component": "database", "action": "seed_data_completed", "summary": "All seed data successfully inserted"}');

-- Display summary of inserted data
DO $$
DECLARE
    user_count INTEGER;
    role_count INTEGER;
    asset_count INTEGER;
    classification_count INTEGER;
    masking_rule_count INTEGER;
    audit_event_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO user_count FROM users;
    SELECT COUNT(*) INTO role_count FROM roles;
    SELECT COUNT(*) INTO asset_count FROM data_assets;
    SELECT COUNT(*) INTO classification_count FROM classifications;
    SELECT COUNT(*) INTO masking_rule_count FROM masking_rules;
    SELECT COUNT(*) INTO audit_event_count FROM audit_logs_enhanced;
    
    RAISE NOTICE 'Seed data insertion completed successfully:';
    RAISE NOTICE '- Users: %', user_count;
    RAISE NOTICE '- Roles: %', role_count;
    RAISE NOTICE '- Data Assets: %', asset_count;
    RAISE NOTICE '- Classifications: %', classification_count;
    RAISE NOTICE '- Masking Rules: %', masking_rule_count;
    RAISE NOTICE '- Audit Events: %', audit_event_count;
    RAISE NOTICE '';
    RAISE NOTICE 'Default login credentials:';
    RAISE NOTICE '- Admin: admin@lineage.com (any password)';
    RAISE NOTICE '- Data Steward: steward@lineage.com (any password)';
    RAISE NOTICE '- Data Engineer: engineer@lineage.com (any password)';
    RAISE NOTICE '- Analyst: analyst@lineage.com (any password)';
    RAISE NOTICE '- Viewer: viewer@lineage.com (any password)';
    RAISE NOTICE '- Compliance: compliance@lineage.com (any password)';
END $$;
