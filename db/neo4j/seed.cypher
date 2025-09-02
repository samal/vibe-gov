// vibeGov Neo4j Seed Data
// This file contains initial data to populate the Neo4j graph database on first startup

// Clear existing data (optional - uncomment if you want to start fresh)
// MATCH (n) DETACH DELETE n;

// Create data assets as nodes
CREATE (users:DataAsset {
  id: 'pg.public.users',
  name: 'users',
  namespace: 'public',
  sourceSystem: 'postgres',
  assetType: 'TABLE',
  description: 'User accounts and profile information',
  createdAt: datetime('2025-01-15T00:00:00Z'),
  updatedAt: datetime('2025-01-15T00:00:00Z')
})

CREATE (orders:DataAsset {
  id: 'pg.public.orders',
  name: 'orders',
  namespace: 'public',
  sourceSystem: 'postgres',
  assetType: 'TABLE',
  description: 'Customer order records',
  createdAt: datetime('2025-01-15T00:00:00Z'),
  updatedAt: datetime('2025-01-15T00:00:00Z')
})

CREATE (products:DataAsset {
  id: 'pg.public.products',
  name: 'products',
  namespace: 'public',
  sourceSystem: 'postgres',
  assetType: 'TABLE',
  description: 'Product catalog and pricing',
  createdAt: datetime('2025-01-15T00:00:00Z'),
  updatedAt: datetime('2025-01-15T00:00:00Z')
})

CREATE (orderItems:DataAsset {
  id: 'pg.public.order_items',
  name: 'order_items',
  namespace: 'public',
  sourceSystem: 'postgres',
  assetType: 'TABLE',
  description: 'Individual items within orders',
  createdAt: datetime('2025-01-15T00:00:00Z'),
  updatedAt: datetime('2025-01-15T00:00:00Z')
})

CREATE (userSummary:DataAsset {
  id: 'pg.public.user_summary',
  name: 'user_summary',
  namespace: 'public',
  sourceSystem: 'postgres',
  assetType: 'VIEW',
  description: 'Aggregated user order statistics',
  createdAt: datetime('2025-01-15T00:00:00Z'),
  updatedAt: datetime('2025-01-15T00:00:00Z')
})

CREATE (productPerformance:DataAsset {
  id: 'pg.public.product_performance',
  name: 'product_performance',
  namespace: 'public',
  sourceSystem: 'postgres',
  assetType: 'VIEW',
  description: 'Product sales performance metrics',
  createdAt: datetime('2025-01-15T00:00:00Z'),
  updatedAt: datetime('2025-01-15T00:00:00Z')
})

CREATE (mysqlCustomers:DataAsset {
  id: 'mysql.sales.customers',
  name: 'customers',
  namespace: 'sales',
  sourceSystem: 'mysql',
  assetType: 'TABLE',
  description: 'Customer information from sales system',
  createdAt: datetime('2025-01-15T00:00:00Z'),
  updatedAt: datetime('2025-01-15T00:00:00Z')
})

CREATE (mysqlOrders:DataAsset {
  id: 'mysql.sales.orders',
  name: 'orders',
  namespace: 'sales',
  sourceSystem: 'mysql',
  assetType: 'TABLE',
  description: 'Order records from sales system',
  createdAt: datetime('2025-01-15T00:00:00Z'),
  updatedAt: datetime('2025-01-15T00:00:00Z')
})

CREATE (mysqlOrderItems:DataAsset {
  id: 'mysql.sales.order_items',
  name: 'order_items',
  namespace: 'sales',
  sourceSystem: 'mysql',
  assetType: 'TABLE',
  description: 'Individual items within orders from sales system',
  createdAt: datetime('2025-01-15T00:00:00Z'),
  updatedAt: datetime('2025-01-15T00:00:00Z')
})

CREATE (mysqlInventoryProducts:DataAsset {
  id: 'mysql.inventory.products',
  name: 'products',
  namespace: 'inventory',
  sourceSystem: 'mysql',
  assetType: 'TABLE',
  description: 'Product catalog and inventory from MySQL system',
  createdAt: datetime('2025-01-15T00:00:00Z'),
  updatedAt: datetime('2025-01-15T00:00:00Z')
})

CREATE (mysqlSuppliers:DataAsset {
  id: 'mysql.inventory.suppliers',
  name: 'suppliers',
  namespace: 'inventory',
  sourceSystem: 'mysql',
  assetType: 'TABLE',
  description: 'Supplier information and contact details',
  createdAt: datetime('2025-01-15T00:00:00Z'),
  updatedAt: datetime('2025-01-15T00:00:00Z')
})

CREATE (mysqlTransactions:DataAsset {
  id: 'mysql.finance.transactions',
  name: 'transactions',
  namespace: 'finance',
  sourceSystem: 'mysql',
  assetType: 'TABLE',
  description: 'Financial transaction records',
  createdAt: datetime('2025-01-15T00:00:00Z'),
  updatedAt: datetime('2025-01-15T00:00:00Z')
})

CREATE (mysqlCustomerSummary:DataAsset {
  id: 'mysql.sales.customer_summary',
  name: 'customer_summary',
  namespace: 'sales',
  sourceSystem: 'mysql',
  assetType: 'VIEW',
  description: 'Aggregated customer order statistics from MySQL',
  createdAt: datetime('2025-01-15T00:00:00Z'),
  updatedAt: datetime('2025-01-15T00:00:00Z')
})

CREATE (mysqlStockAlerts:DataAsset {
  id: 'mysql.inventory.stock_alerts',
  name: 'stock_alerts',
  namespace: 'inventory',
  sourceSystem: 'mysql',
  assetType: 'VIEW',
  description: 'Stock level alerts and reorder recommendations',
  createdAt: datetime('2025-01-15T00:00:00Z'),
  updatedAt: datetime('2025-01-15T00:00:00Z')
})

CREATE (customerDashboard:DataAsset {
  id: 'tableau.sales.customer_dashboard',
  name: 'Customer Dashboard',
  namespace: 'sales',
  sourceSystem: 'tableau',
  assetType: 'REPORT',
  description: 'Customer analytics dashboard',
  createdAt: datetime('2025-01-15T00:00:00Z'),
  updatedAt: datetime('2025-01-15T00:00:00Z')
})

CREATE (revenueAnalysis:DataAsset {
  id: 'tableau.finance.revenue_analysis',
  name: 'Revenue Analysis',
  namespace: 'finance',
  sourceSystem: 'tableau',
  assetType: 'REPORT',
  description: 'Financial revenue analysis report',
  createdAt: datetime('2025-01-15T00:00:00Z'),
  updatedAt: datetime('2025-01-15T00:00:00Z')
})

CREATE (stockMonitoring:DataAsset {
  id: 'tableau.inventory.stock_monitoring',
  name: 'Stock Monitoring',
  namespace: 'inventory',
  sourceSystem: 'tableau',
  assetType: 'REPORT',
  description: 'Inventory stock monitoring dashboard',
  createdAt: datetime('2025-01-15T00:00:00Z'),
  updatedAt: datetime('2025-01-15T00:00:00Z')
})

// Create column-level assets for detailed lineage
CREATE (userId:DataAsset {
  id: 'pg.public.users.id',
  name: 'id',
  namespace: 'public',
  sourceSystem: 'postgres',
  assetType: 'COLUMN',
  description: 'User unique identifier',
  parentAsset: 'pg.public.users',
  dataType: 'uuid',
  classification: 'PII',
  createdAt: datetime('2025-01-15T00:00:00Z'),
  updatedAt: datetime('2025-01-15T00:00:00Z')
})

CREATE (userEmail:DataAsset {
  id: 'pg.public.users.email',
  name: 'email',
  namespace: 'public',
  sourceSystem: 'postgres',
  assetType: 'COLUMN',
  description: 'User email address',
  parentAsset: 'pg.public.users',
  dataType: 'varchar(255)',
  classification: 'PII',
  createdAt: datetime('2025-01-15T00:00:00Z'),
  updatedAt: datetime('2025-01-15T00:00:00Z')
})

CREATE (orderAmount:DataAsset {
  id: 'pg.public.orders.total_amount',
  name: 'total_amount',
  namespace: 'public',
  sourceSystem: 'postgres',
  assetType: 'COLUMN',
  description: 'Total order amount',
  parentAsset: 'pg.public.orders',
  dataType: 'decimal(10,2)',
  classification: 'FINANCIAL',
  createdAt: datetime('2025-01-15T00:00:00Z'),
  updatedAt: datetime('2025-01-15T00:00:00Z')
})

CREATE (productPrice:DataAsset {
  id: 'pg.public.products.price',
  name: 'price',
  namespace: 'public',
  sourceSystem: 'postgres',
  assetType: 'COLUMN',
  description: 'Product price',
  parentAsset: 'pg.public.products',
  dataType: 'decimal(10,2)',
  classification: 'FINANCIAL',
  createdAt: datetime('2025-01-15T00:00:00Z'),
  updatedAt: datetime('2025-01-15T00:00:00Z')
})

// MySQL Column-level assets
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
})

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
})

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
})

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
})

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
})

// Create lineage relationships
// Table-to-table relationships
CREATE (users)-[:FLOWS_TO {type: 'JOIN', description: 'Users joined with orders', createdAt: datetime('2025-01-15T00:00:00Z')}]->(orders)
CREATE (orders)-[:FLOWS_TO {type: 'JOIN', description: 'Orders joined with order items', createdAt: datetime('2025-01-15T00:00:00Z')}]->(orderItems)
CREATE (products)-[:FLOWS_TO {type: 'JOIN', description: 'Products joined with order items', createdAt: datetime('2025-01-15T00:00:00Z')}]->(orderItems)

// Table-to-view relationships
CREATE (users)-[:FLOWS_TO {type: 'VIEW', description: 'Users data flows to user summary view', createdAt: datetime('2025-01-15T00:00:00Z')}]->(userSummary)
CREATE (orders)-[:FLOWS_TO {type: 'VIEW', description: 'Orders data flows to user summary view', createdAt: datetime('2025-01-15T00:00:00Z')}]->(userSummary)

CREATE (orders)-[:FLOWS_TO {type: 'VIEW', description: 'Orders data flows to product performance view', createdAt: datetime('2025-01-15T00:00:00Z')}]->(productPerformance)
CREATE (orderItems)-[:FLOWS_TO {type: 'VIEW', description: 'Order items data flows to product performance view', createdAt: datetime('2025-01-15T00:00:00Z')}]->(productPerformance)
CREATE (products)-[:FLOWS_TO {type: 'VIEW', description: 'Products data flows to product performance view', createdAt: datetime('2025-01-15T00:00:00Z')}]->(productPerformance)

// View-to-report relationships
CREATE (userSummary)-[:FLOWS_TO {type: 'TABLEAU_EXTRACT', description: 'User summary data extracted to customer dashboard', createdAt: datetime('2025-01-15T00:00:00Z')}]->(customerDashboard)
CREATE (orders)-[:FLOWS_TO {type: 'TABLEAU_EXTRACT', description: 'Orders data extracted to revenue analysis', createdAt: datetime('2025-01-15T00:00:00Z')}]->(revenueAnalysis)
CREATE (products)-[:FLOWS_TO {type: 'TABLEAU_EXTRACT', description: 'Products data extracted to stock monitoring', createdAt: datetime('2025-01-15T00:00:00Z')}]->(stockMonitoring)

// Column-level lineage relationships
CREATE (userId)-[:FLOWS_TO {type: 'COLUMN_MAPPING', description: 'User ID flows to orders user_id', createdAt: datetime('2025-01-15T00:00:00Z')}]->(orders)
CREATE (userEmail)-[:FLOWS_TO {type: 'COLUMN_MAPPING', description: 'User email flows to customer dashboard', createdAt: datetime('2025-01-15T00:00:00Z')}]->(customerDashboard)
CREATE (orderAmount)-[:FLOWS_TO {type: 'COLUMN_MAPPING', description: 'Order amount flows to revenue analysis', createdAt: datetime('2025-01-15T00:00:00Z')}]->(revenueAnalysis)
CREATE (productPrice)-[:FLOWS_TO {type: 'COLUMN_MAPPING', description: 'Product price flows to stock monitoring', createdAt: datetime('2025-01-15T00:00:00Z')}]->(stockMonitoring)

// MySQL column-level lineage relationships
CREATE (mysqlCustomerId)-[:FLOWS_TO {type: 'COLUMN_MAPPING', description: 'MySQL customer ID flows to orders', createdAt: datetime('2025-01-15T00:00:00Z')}]->(mysqlOrders)
CREATE (mysqlCustomerEmail)-[:FLOWS_TO {type: 'COLUMN_MAPPING', description: 'MySQL customer email flows to customer dashboard', createdAt: datetime('2025-01-15T00:00:00Z')}]->(customerDashboard)
CREATE (mysqlOrderAmount)-[:FLOWS_TO {type: 'COLUMN_MAPPING', description: 'MySQL order amount flows to revenue analysis', createdAt: datetime('2025-01-15T00:00:00Z')}]->(revenueAnalysis)
CREATE (mysqlProductPrice)-[:FLOWS_TO {type: 'COLUMN_MAPPING', description: 'MySQL product price flows to stock monitoring', createdAt: datetime('2025-01-15T00:00:00Z')}]->(stockMonitoring)
CREATE (mysqlTransactionAmount)-[:FLOWS_TO {type: 'COLUMN_MAPPING', description: 'MySQL transaction amount flows to revenue analysis', createdAt: datetime('2025-01-15T00:00:00Z')}]->(revenueAnalysis)

// MySQL internal lineage relationships
CREATE (mysqlCustomers)-[:FLOWS_TO {type: 'JOIN', description: 'MySQL customers joined with orders', createdAt: datetime('2025-01-15T00:00:00Z')}]->(mysqlOrders)
CREATE (mysqlOrders)-[:FLOWS_TO {type: 'JOIN', description: 'MySQL orders joined with order items', createdAt: datetime('2025-01-15T00:00:00Z')}]->(mysqlOrderItems)
CREATE (mysqlInventoryProducts)-[:FLOWS_TO {type: 'JOIN', description: 'MySQL products joined with order items', createdAt: datetime('2025-01-15T00:00:00Z')}]->(mysqlOrderItems)
CREATE (mysqlSuppliers)-[:FLOWS_TO {type: 'JOIN', description: 'MySQL suppliers joined with products', createdAt: datetime('2025-01-15T00:00:00Z')}]->(mysqlInventoryProducts)
CREATE (mysqlOrders)-[:FLOWS_TO {type: 'JOIN', description: 'MySQL orders joined with transactions', createdAt: datetime('2025-01-15T00:00:00Z')}]->(mysqlTransactions)

// MySQL table-to-view relationships
CREATE (mysqlCustomers)-[:FLOWS_TO {type: 'VIEW', description: 'MySQL customers data flows to customer summary view', createdAt: datetime('2025-01-15T00:00:00Z')}]->(mysqlCustomerSummary)
CREATE (mysqlOrders)-[:FLOWS_TO {type: 'VIEW', description: 'MySQL orders data flows to customer summary view', createdAt: datetime('2025-01-15T00:00:00Z')}]->(mysqlCustomerSummary)
CREATE (mysqlInventoryProducts)-[:FLOWS_TO {type: 'VIEW', description: 'MySQL products data flows to stock alerts view', createdAt: datetime('2025-01-15T00:00:00Z')}]->(mysqlStockAlerts)

// MySQL view-to-report relationships
CREATE (mysqlCustomerSummary)-[:FLOWS_TO {type: 'TABLEAU_EXTRACT', description: 'MySQL customer summary data extracted to customer dashboard', createdAt: datetime('2025-01-15T00:00:00Z')}]->(customerDashboard)
CREATE (mysqlTransactions)-[:FLOWS_TO {type: 'TABLEAU_EXTRACT', description: 'MySQL transactions data extracted to revenue analysis', createdAt: datetime('2025-01-15T00:00:00Z')}]->(revenueAnalysis)
CREATE (mysqlStockAlerts)-[:FLOWS_TO {type: 'TABLEAU_EXTRACT', description: 'MySQL stock alerts data extracted to stock monitoring', createdAt: datetime('2025-01-15T00:00:00Z')}]->(stockMonitoring)

// Cross-system relationships (MySQL to PostgreSQL)
CREATE (mysqlCustomers)-[:FLOWS_TO {type: 'ETL', description: 'MySQL customers data flows to PostgreSQL users via ETL', createdAt: datetime('2025-01-15T00:00:00Z')}]->(users)
CREATE (mysqlOrders)-[:FLOWS_TO {type: 'ETL', description: 'MySQL orders data flows to PostgreSQL orders via ETL', createdAt: datetime('2025-01-15T00:00:00Z')}]->(orders)

// Create data quality nodes and relationships
CREATE (dataQuality:DataQuality {
  id: 'dq.users.email_validation',
  name: 'Email Validation',
  description: 'Validates email format in users table',
  status: 'ACTIVE',
  severity: 'MEDIUM',
  createdAt: datetime('2025-01-15T00:00:00Z')
})

CREATE (dataQuality)-[:MONITORS {createdAt: datetime('2025-01-15T00:00:00Z')}]->(userEmail)

// Create data governance nodes
CREATE (governance:DataGovernance {
  id: 'gov.pii.masking',
  name: 'PII Data Masking',
  description: 'Applies masking rules to PII data',
  status: 'ACTIVE',
  createdAt: datetime('2025-01-15T00:00:00Z')
})

CREATE (governance)-[:GOVERNES {createdAt: datetime('2025-01-15T00:00:00Z')}]->(users)
CREATE (governance)-[:GOVERNES {createdAt: datetime('2025-01-15T00:00:00Z')}]->(userEmail)

// MySQL data quality and governance
CREATE (mysqlDataQuality:DataQuality {
  id: 'dq.mysql.customers.email_validation',
  name: 'MySQL Email Validation',
  description: 'Validates email format in MySQL customers table',
  status: 'ACTIVE',
  severity: 'MEDIUM',
  createdAt: datetime('2025-01-15T00:00:00Z')
})

CREATE (mysqlDataQuality)-[:MONITORS {createdAt: datetime('2025-01-15T00:00:00Z')}]->(mysqlCustomerEmail)

CREATE (mysqlGovernance:DataGovernance {
  id: 'gov.mysql.pii.masking',
  name: 'MySQL PII Data Masking',
  description: 'Applies masking rules to PII data in MySQL',
  status: 'ACTIVE',
  createdAt: datetime('2025-01-15T00:00:00Z')
})

CREATE (mysqlGovernance)-[:GOVERNES {createdAt: datetime('2025-01-15T00:00:00Z')}]->(mysqlCustomers)
CREATE (mysqlGovernance)-[:GOVERNES {createdAt: datetime('2025-01-15T00:00:00Z')}]->(mysqlCustomerEmail)

// Create transformation nodes
CREATE (userSummaryTransform:Transformation {
  id: 'transform.user_summary',
  name: 'User Summary View Transformation',
  description: 'SQL view that aggregates user order data',
  type: 'SQL_VIEW',
  sql: 'CREATE VIEW user_summary AS SELECT user_id, COUNT(*) as total_orders, SUM(total_amount) as total_spent, MAX(order_date) as last_order_date FROM orders GROUP BY user_id',
  createdAt: datetime('2025-01-15T00:00:00Z')
})

CREATE (userSummaryTransform)-[:TRANSFORMS {createdAt: datetime('2025-01-15T00:00:00Z')}]->(users)
CREATE (userSummaryTransform)-[:TRANSFORMS {createdAt: datetime('2025-01-15T00:00:00Z')}]->(orders)
CREATE (userSummaryTransform)-[:PRODUCES {createdAt: datetime('2025-01-15T00:00:00Z')}]->(userSummary)

// MySQL transformation nodes
CREATE (mysqlCustomerSummaryTransform:Transformation {
  id: 'transform.mysql.customer_summary',
  name: 'MySQL Customer Summary View Transformation',
  description: 'SQL view that aggregates customer order data from MySQL',
  type: 'SQL_VIEW',
  sql: 'CREATE VIEW customer_summary AS SELECT customer_id, CONCAT(first_name, " ", last_name) as customer_name, COUNT(*) as total_orders, SUM(total_amount) as total_spent, MAX(order_date) as last_order_date FROM orders GROUP BY customer_id',
  createdAt: datetime('2025-01-15T00:00:00Z')
})

CREATE (mysqlStockAlertsTransform:Transformation {
  id: 'transform.mysql.stock_alerts',
  name: 'MySQL Stock Alerts View Transformation',
  description: 'SQL view that calculates stock alerts and reorder recommendations',
  type: 'SQL_VIEW',
  sql: 'CREATE VIEW stock_alerts AS SELECT product_id, product_name, stock_quantity, reorder_level, CASE WHEN stock_quantity <= reorder_level THEN 0 ELSE FLOOR((stock_quantity - reorder_level) / 10) END as days_until_stockout FROM products',
  createdAt: datetime('2025-01-15T00:00:00Z')
})

CREATE (mysqlCustomerSummaryTransform)-[:TRANSFORMS {createdAt: datetime('2025-01-15T00:00:00Z')}]->(mysqlCustomers)
CREATE (mysqlCustomerSummaryTransform)-[:TRANSFORMS {createdAt: datetime('2025-01-15T00:00:00Z')}]->(mysqlOrders)
CREATE (mysqlCustomerSummaryTransform)-[:PRODUCES {createdAt: datetime('2025-01-15T00:00:00Z')}]->(mysqlCustomerSummary)

CREATE (mysqlStockAlertsTransform)-[:TRANSFORMS {createdAt: datetime('2025-01-15T00:00:00Z')}]->(mysqlInventoryProducts)
CREATE (mysqlStockAlertsTransform)-[:PRODUCES {createdAt: datetime('2025-01-15T00:00:00Z')}]->(mysqlStockAlerts)

// Create metadata nodes
CREATE (metadata:Metadata {
  id: 'meta.users.schema',
  name: 'Users Table Schema',
  description: 'Schema definition for users table',
  version: '1.0',
  createdAt: datetime('2025-01-15T00:00:00Z')
})

CREATE (metadata)-[:DESCRIBES {createdAt: datetime('2025-01-15T00:00:00Z')}]->(users)

// MySQL metadata nodes
CREATE (mysqlMetadata:Metadata {
  id: 'meta.mysql.customers.schema',
  name: 'MySQL Customers Table Schema',
  description: 'Schema definition for MySQL customers table',
  version: '1.0',
  createdAt: datetime('2025-01-15T00:00:00Z')
})

CREATE (mysqlMetadata)-[:DESCRIBES {createdAt: datetime('2025-01-15T00:00:00Z')}]->(mysqlCustomers)

CREATE (mysqlInventoryMetadata:Metadata {
  id: 'meta.mysql.inventory.schema',
  name: 'MySQL Inventory Schema',
  description: 'Schema definition for MySQL inventory tables',
  version: '1.0',
  createdAt: datetime('2025-01-15T00:00:00Z')
})

CREATE (mysqlInventoryMetadata)-[:DESCRIBES {createdAt: datetime('2025-01-15T00:00:00Z')}]->(mysqlInventoryProducts);
CREATE (mysqlInventoryMetadata)-[:DESCRIBES {createdAt: datetime('2025-01-15T00:00:00Z')}]->(mysqlSuppliers);

// Note: Indexes and constraints are already created in constraints.cypher
// This file focuses on data population

// Return summary of created data
MATCH (n:DataAsset) 
RETURN 'Data Assets' as category, count(n) as count;
