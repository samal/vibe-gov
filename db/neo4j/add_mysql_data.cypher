// Add missing MySQL data to existing Neo4j instance
// This script adds only the new MySQL assets that don't already exist

// Add missing MySQL assets
CREATE (mysqlSuppliers:DataAsset {
  id: 'mysql.inventory.suppliers',
  name: 'suppliers',
  namespace: 'inventory',
  sourceSystem: 'mysql',
  assetType: 'TABLE',
  description: 'Supplier information and contact details',
  createdAt: datetime('2025-01-15T00:00:00Z'),
  updatedAt: datetime('2025-01-15T00:00:00Z')
});

CREATE (mysqlTransactions:DataAsset {
  id: 'mysql.finance.transactions',
  name: 'transactions',
  namespace: 'finance',
  sourceSystem: 'mysql',
  assetType: 'TABLE',
  description: 'Financial transaction records',
  createdAt: datetime('2025-01-15T00:00:00Z'),
  updatedAt: datetime('2025-01-15T00:00:00Z')
});

CREATE (mysqlStockAlerts:DataAsset {
  id: 'mysql.inventory.stock_alerts',
  name: 'stock_alerts',
  namespace: 'inventory',
  sourceSystem: 'mysql',
  assetType: 'VIEW',
  description: 'Stock level alerts and reorder recommendations',
  createdAt: datetime('2025-01-15T00:00:00Z'),
  updatedAt: datetime('2025-01-15T00:00:00Z')
});

// Add missing MySQL column-level assets
CREATE (mysqlCustomerId:DataAsset {
  id: 'mysql.sales.customers.customer_id',
  name: 'customer_id',
  namespace: 'sales',
  sourceSystem: 'mysql',
  assetType: 'COLUMN',
  description: 'Customer unique identifier',
  parentAsset: 'mysql.sales.customers',
  dataType: 'int',
  classification: 'PII',
  createdAt: datetime('2025-01-15T00:00:00Z'),
  updatedAt: datetime('2025-01-15T00:00:00Z')
});

CREATE (mysqlCustomerEmail:DataAsset {
  id: 'mysql.sales.customers.email',
  name: 'email',
  namespace: 'sales',
  sourceSystem: 'mysql',
  assetType: 'COLUMN',
  description: 'Customer email address',
  parentAsset: 'mysql.sales.customers',
  dataType: 'varchar(100)',
  classification: 'PII',
  createdAt: datetime('2025-01-15T00:00:00Z'),
  updatedAt: datetime('2025-01-15T00:00:00Z')
});

CREATE (mysqlOrderAmount:DataAsset {
  id: 'mysql.sales.orders.total_amount',
  name: 'total_amount',
  namespace: 'sales',
  sourceSystem: 'mysql',
  assetType: 'COLUMN',
  description: 'Total order amount from MySQL',
  parentAsset: 'mysql.sales.orders',
  dataType: 'decimal(10,2)',
  classification: 'FINANCIAL',
  createdAt: datetime('2025-01-15T00:00:00Z'),
  updatedAt: datetime('2025-01-15T00:00:00Z')
});

CREATE (mysqlProductPrice:DataAsset {
  id: 'mysql.inventory.products.price',
  name: 'price',
  namespace: 'inventory',
  sourceSystem: 'mysql',
  assetType: 'COLUMN',
  description: 'Product price from MySQL inventory',
  parentAsset: 'mysql.inventory.products',
  dataType: 'decimal(10,2)',
  classification: 'FINANCIAL',
  createdAt: datetime('2025-01-15T00:00:00Z'),
  updatedAt: datetime('2025-01-15T00:00:00Z')
});

CREATE (mysqlTransactionAmount:DataAsset {
  id: 'mysql.finance.transactions.amount',
  name: 'amount',
  namespace: 'finance',
  sourceSystem: 'mysql',
  assetType: 'COLUMN',
  description: 'Transaction amount from MySQL finance',
  parentAsset: 'mysql.finance.transactions',
  dataType: 'decimal(10,2)',
  classification: 'FINANCIAL',
  createdAt: datetime('2025-01-15T00:00:00Z'),
  updatedAt: datetime('2025-01-15T00:00:00Z')
});

// Add missing MySQL lineage relationships
CREATE (mysqlSuppliers)-[:FLOWS_TO {type: 'JOIN', description: 'MySQL suppliers joined with products', createdAt: datetime('2025-01-15T00:00:00Z')}]->(mysqlInventoryProducts);
CREATE (mysqlOrders)-[:FLOWS_TO {type: 'JOIN', description: 'MySQL orders joined with transactions', createdAt: datetime('2025-01-15T00:00:00Z')}]->(mysqlTransactions);
CREATE (mysqlInventoryProducts)-[:FLOWS_TO {type: 'VIEW', description: 'MySQL products data flows to stock alerts view', createdAt: datetime('2025-01-15T00:00:00Z')}]->(mysqlStockAlerts);

// Add missing MySQL view-to-report relationships
CREATE (mysqlTransactions)-[:FLOWS_TO {type: 'TABLEAU_EXTRACT', description: 'MySQL transactions data extracted to revenue analysis', createdAt: datetime('2025-01-15T00:00:00Z')}]->(revenueAnalysis);
CREATE (mysqlStockAlerts)-[:FLOWS_TO {type: 'TABLEAU_EXTRACT', description: 'MySQL stock alerts data extracted to stock monitoring', createdAt: datetime('2025-01-15T00:00:00Z')}]->(stockMonitoring);

// Add missing MySQL column-level lineage relationships
CREATE (mysqlCustomerId)-[:FLOWS_TO {type: 'COLUMN_MAPPING', description: 'MySQL customer ID flows to orders', createdAt: datetime('2025-01-15T00:00:00Z')}]->(mysqlOrders);
CREATE (mysqlCustomerEmail)-[:FLOWS_TO {type: 'COLUMN_MAPPING', description: 'MySQL customer email flows to customer dashboard', createdAt: datetime('2025-01-15T00:00:00Z')}]->(customerDashboard);
CREATE (mysqlOrderAmount)-[:FLOWS_TO {type: 'COLUMN_MAPPING', description: 'MySQL order amount flows to revenue analysis', createdAt: datetime('2025-01-15T00:00:00Z')}]->(revenueAnalysis);
CREATE (mysqlProductPrice)-[:FLOWS_TO {type: 'COLUMN_MAPPING', description: 'MySQL product price flows to stock monitoring', createdAt: datetime('2025-01-15T00:00:00Z')}]->(stockMonitoring);
CREATE (mysqlTransactionAmount)-[:FLOWS_TO {type: 'COLUMN_MAPPING', description: 'MySQL transaction amount flows to revenue analysis', createdAt: datetime('2025-01-15T00:00:00Z')}]->(revenueAnalysis);

// Add missing MySQL data quality and governance
CREATE (mysqlDataQuality:DataQuality {
  id: 'dq.mysql.customers.email_validation',
  name: 'MySQL Email Validation',
  description: 'Validates email format in MySQL customers table',
  status: 'ACTIVE',
  severity: 'MEDIUM',
  createdAt: datetime('2025-01-15T00:00:00Z')
});

CREATE (mysqlDataQuality)-[:MONITORS {createdAt: datetime('2025-01-15T00:00:00Z')}]->(mysqlCustomerEmail);

CREATE (mysqlGovernance:DataGovernance {
  id: 'gov.mysql.pii.masking',
  name: 'MySQL PII Data Masking',
  description: 'Applies masking rules to PII data in MySQL',
  status: 'ACTIVE',
  createdAt: datetime('2025-01-15T00:00:00Z')
});

CREATE (mysqlGovernance)-[:GOVERNES {createdAt: datetime('2025-01-15T00:00:00Z')}]->(mysqlCustomers);
CREATE (mysqlGovernance)-[:GOVERNES {createdAt: datetime('2025-01-15T00:00:00Z')}]->(mysqlCustomerEmail);

// Add missing MySQL transformation nodes
CREATE (mysqlCustomerSummaryTransform:Transformation {
  id: 'transform.mysql.customer_summary',
  name: 'MySQL Customer Summary View Transformation',
  description: 'SQL view that aggregates customer order data from MySQL',
  type: 'SQL_VIEW',
  sql: 'CREATE VIEW customer_summary AS SELECT customer_id, CONCAT(first_name, " ", last_name) as customer_name, COUNT(*) as total_orders, SUM(total_amount) as total_spent, MAX(order_date) as last_order_date FROM orders GROUP BY customer_id',
  createdAt: datetime('2025-01-15T00:00:00Z')
});

CREATE (mysqlStockAlertsTransform:Transformation {
  id: 'transform.mysql.stock_alerts',
  name: 'MySQL Stock Alerts View Transformation',
  description: 'SQL view that calculates stock alerts and reorder recommendations',
  type: 'SQL_VIEW',
  sql: 'CREATE VIEW stock_alerts AS SELECT product_id, product_name, stock_quantity, reorder_level, CASE WHEN stock_quantity <= reorder_level THEN 0 ELSE FLOOR((stock_quantity - reorder_level) / 10) END as days_until_stockout FROM products',
  createdAt: datetime('2025-01-15T00:00:00Z')
});

CREATE (mysqlCustomerSummaryTransform)-[:TRANSFORMS {createdAt: datetime('2025-01-15T00:00:00Z')}]->(mysqlCustomers);
CREATE (mysqlCustomerSummaryTransform)-[:TRANSFORMS {createdAt: datetime('2025-01-15T00:00:00Z')}]->(mysqlOrders);
CREATE (mysqlCustomerSummaryTransform)-[:PRODUCES {createdAt: datetime('2025-01-15T00:00:00Z')}]->(mysqlCustomerSummary);

CREATE (mysqlStockAlertsTransform)-[:TRANSFORMS {createdAt: datetime('2025-01-15T00:00:00Z')}]->(mysqlInventoryProducts);
CREATE (mysqlStockAlertsTransform)-[:PRODUCES {createdAt: datetime('2025-01-15T00:00:00Z')}]->(mysqlStockAlerts);

// Add missing MySQL metadata nodes
CREATE (mysqlMetadata:Metadata {
  id: 'meta.mysql.customers.schema',
  name: 'MySQL Customers Table Schema',
  description: 'Schema definition for MySQL customers table',
  version: '1.0',
  createdAt: datetime('2025-01-15T00:00:00Z')
});

CREATE (mysqlMetadata)-[:DESCRIBES {createdAt: datetime('2025-01-15T00:00:00Z')}]->(mysqlCustomers);

CREATE (mysqlInventoryMetadata:Metadata {
  id: 'meta.mysql.inventory.schema',
  name: 'MySQL Inventory Schema',
  description: 'Schema definition for MySQL inventory tables',
  version: '1.0',
  createdAt: datetime('2025-01-15T00:00:00Z')
});

CREATE (mysqlInventoryMetadata)-[:DESCRIBES {createdAt: datetime('2025-01-15T00:00:00Z')}]->(mysqlInventoryProducts);
CREATE (mysqlInventoryMetadata)-[:DESCRIBES {createdAt: datetime('2025-01-15T00:00:00Z')}]->(mysqlSuppliers);

// Return summary of added data
MATCH (n:DataAsset {sourceSystem: 'mysql'}) 
RETURN 'MySQL Assets' as category, count(n) as count;
