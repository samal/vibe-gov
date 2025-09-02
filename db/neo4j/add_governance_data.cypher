// Add comprehensive governance data to existing Neo4j instance
// This script adds missing governance, data quality, and metadata nodes

// Add PostgreSQL data quality rules
CREATE (pgDataQuality:DataQuality {
  id: 'dq.postgres.users.email_validation',
  name: 'PostgreSQL Email Validation',
  description: 'Validates email format in users table',
  status: 'ACTIVE',
  severity: 'MEDIUM',
  createdAt: datetime('2025-01-15T00:00:00Z')
});

CREATE (pgDataQuality)-[:MONITORS {createdAt: datetime('2025-01-15T00:00:00Z')}]->(userEmail);

// Add PostgreSQL governance rules
CREATE (pgGovernance:DataGovernance {
  id: 'gov.postgres.pii.masking',
  name: 'PostgreSQL PII Data Masking',
  description: 'Applies masking rules to PII data in PostgreSQL',
  status: 'ACTIVE',
  createdAt: datetime('2025-01-15T00:00:00Z')
});

CREATE (pgGovernance)-[:GOVERNES {createdAt: datetime('2025-01-15T00:00:00Z')}]->(users);
CREATE (pgGovernance)-[:GOVERNES {createdAt: datetime('2025-01-15T00:00:00Z')}]->(userEmail);

// Add financial data governance
CREATE (financialGovernance:DataGovernance {
  id: 'gov.financial.data.protection',
  name: 'Financial Data Protection',
  description: 'Governance rules for financial data across all systems',
  status: 'ACTIVE',
  createdAt: datetime('2025-01-15T00:00:00Z')
});

CREATE (financialGovernance)-[:GOVERNES {createdAt: datetime('2025-01-15T00:00:00Z')}]->(orders);
CREATE (financialGovernance)-[:GOVERNES {createdAt: datetime('2025-01-15T00:00:00Z')}]->(orderAmount);
CREATE (financialGovernance)-[:GOVERNES {createdAt: datetime('2025-01-15T00:00:00Z')}]->(productPrice);
CREATE (financialGovernance)-[:GOVERNES {createdAt: datetime('2025-01-15T00:00:00Z')}]->(mysqlOrders);
CREATE (financialGovernance)-[:GOVERNES {createdAt: datetime('2025-01-15T00:00:00Z')}]->(mysqlOrderAmount);
CREATE (financialGovernance)-[:GOVERNES {createdAt: datetime('2025-01-15T00:00:00Z')}]->(mysqlProductPrice);
CREATE (financialGovernance)-[:GOVERNES {createdAt: datetime('2025-01-15T00:00:00Z')}]->(mysqlTransactions);
CREATE (financialGovernance)-[:GOVERNES {createdAt: datetime('2025-01-15T00:00:00Z')}]->(mysqlTransactionAmount);

// Add data quality rules for financial data
CREATE (financialDataQuality:DataQuality {
  id: 'dq.financial.amount_validation',
  name: 'Financial Amount Validation',
  description: 'Validates financial amounts are positive and within reasonable ranges',
  status: 'ACTIVE',
  severity: 'HIGH',
  createdAt: datetime('2025-01-15T00:00:00Z')
});

CREATE (financialDataQuality)-[:MONITORS {createdAt: datetime('2025-01-15T00:00:00Z')}]->(orderAmount);
CREATE (financialDataQuality)-[:MONITORS {createdAt: datetime('2025-01-15T00:00:00Z')}]->(productPrice);
CREATE (financialDataQuality)-[:MONITORS {createdAt: datetime('2025-01-15T00:00:00Z')}]->(mysqlOrderAmount);
CREATE (financialDataQuality)-[:MONITORS {createdAt: datetime('2025-01-15T00:00:00Z')}]->(mysqlProductPrice);
CREATE (financialDataQuality)-[:MONITORS {createdAt: datetime('2025-01-15T00:00:00Z')}]->(mysqlTransactionAmount);

// Add data quality rules for data completeness
CREATE (completenessDataQuality:DataQuality {
  id: 'dq.completeness.required_fields',
  name: 'Required Fields Completeness',
  description: 'Ensures required fields are not null across all systems',
  status: 'ACTIVE',
  severity: 'MEDIUM',
  createdAt: datetime('2025-01-15T00:00:00Z')
});

CREATE (completenessDataQuality)-[:MONITORS {createdAt: datetime('2025-01-15T00:00:00Z')}]->(users);
CREATE (completenessDataQuality)-[:MONITORS {createdAt: datetime('2025-01-15T00:00:00Z')}]->(mysqlCustomers);
CREATE (completenessDataQuality)-[:MONITORS {createdAt: datetime('2025-01-15T00:00:00Z')}]->(mysqlOrders);

// Add cross-system data governance
CREATE (crossSystemGovernance:DataGovernance {
  id: 'gov.cross_system.data_consistency',
  name: 'Cross-System Data Consistency',
  description: 'Ensures data consistency across PostgreSQL and MySQL systems',
  status: 'ACTIVE',
  createdAt: datetime('2025-01-15T00:00:00Z')
});

CREATE (crossSystemGovernance)-[:GOVERNES {createdAt: datetime('2025-01-15T00:00:00Z')}]->(users);
CREATE (crossSystemGovernance)-[:GOVERNES {createdAt: datetime('2025-01-15T00:00:00Z')}]->(mysqlCustomers);
CREATE (crossSystemGovernance)-[:GOVERNES {createdAt: datetime('2025-01-15T00:00:00Z')}]->(orders);
CREATE (crossSystemGovernance)-[:GOVERNES {createdAt: datetime('2025-01-15T00:00:00Z')}]->(mysqlOrders);

// Add data lineage governance
CREATE (lineageGovernance:DataGovernance {
  id: 'gov.lineage.tracking',
  name: 'Data Lineage Tracking',
  description: 'Governance rules for tracking data lineage across systems',
  status: 'ACTIVE',
  createdAt: datetime('2025-01-15T00:00:00Z')
});

CREATE (lineageGovernance)-[:GOVERNES {createdAt: datetime('2025-01-15T00:00:00Z')}]->(userSummary);
CREATE (lineageGovernance)-[:GOVERNES {createdAt: datetime('2025-01-15T00:00:00Z')}]->(productPerformance);
CREATE (lineageGovernance)-[:GOVERNES {createdAt: datetime('2025-01-15T00:00:00Z')}]->(mysqlCustomerSummary);
CREATE (lineageGovernance)-[:GOVERNES {createdAt: datetime('2025-01-15T00:00:00Z')}]->(mysqlStockAlerts);

// Add metadata for PostgreSQL assets
CREATE (pgUsersMetadata:Metadata {
  id: 'meta.postgres.users.schema',
  name: 'PostgreSQL Users Table Schema',
  description: 'Schema definition for users table with PII classifications',
  version: '1.0',
  createdAt: datetime('2025-01-15T00:00:00Z')
});

CREATE (pgOrdersMetadata:Metadata {
  id: 'meta.postgres.orders.schema',
  name: 'PostgreSQL Orders Table Schema',
  description: 'Schema definition for orders table with financial data',
  version: '1.0',
  createdAt: datetime('2025-01-15T00:00:00Z')
});

CREATE (pgProductsMetadata:Metadata {
  id: 'meta.postgres.products.schema',
  name: 'PostgreSQL Products Table Schema',
  description: 'Schema definition for products table with pricing data',
  version: '1.0',
  createdAt: datetime('2025-01-15T00:00:00Z')
});

CREATE (pgUsersMetadata)-[:DESCRIBES {createdAt: datetime('2025-01-15T00:00:00Z')}]->(users);
CREATE (pgOrdersMetadata)-[:DESCRIBES {createdAt: datetime('2025-01-15T00:00:00Z')}]->(orders);
CREATE (pgProductsMetadata)-[:DESCRIBES {createdAt: datetime('2025-01-15T00:00:00Z')}]->(products);

// Add metadata for views
CREATE (pgViewsMetadata:Metadata {
  id: 'meta.postgres.views.schema',
  name: 'PostgreSQL Views Schema',
  description: 'Schema definitions for PostgreSQL views and aggregations',
  version: '1.0',
  createdAt: datetime('2025-01-15T00:00:00Z')
});

CREATE (pgViewsMetadata)-[:DESCRIBES {createdAt: datetime('2025-01-15T00:00:00Z')}]->(userSummary);
CREATE (pgViewsMetadata)-[:DESCRIBES {createdAt: datetime('2025-01-15T00:00:00Z')}]->(productPerformance);

// Add metadata for Tableau reports
CREATE (tableauMetadata:Metadata {
  id: 'meta.tableau.reports.schema',
  name: 'Tableau Reports Schema',
  description: 'Schema definitions for Tableau dashboards and reports',
  version: '1.0',
  createdAt: datetime('2025-01-15T00:00:00Z')
});

CREATE (tableauMetadata)-[:DESCRIBES {createdAt: datetime('2025-01-15T00:00:00Z')}]->(customerDashboard);
CREATE (tableauMetadata)-[:DESCRIBES {createdAt: datetime('2025-01-15T00:00:00Z')}]->(revenueAnalysis);
CREATE (tableauMetadata)-[:DESCRIBES {createdAt: datetime('2025-01-15T00:00:00Z')}]->(stockMonitoring);

// Add data classification governance
CREATE (classificationGovernance:DataGovernance {
  id: 'gov.classification.management',
  name: 'Data Classification Management',
  description: 'Governance rules for managing data classifications across systems',
  status: 'ACTIVE',
  createdAt: datetime('2025-01-15T00:00:00Z')
});

CREATE (classificationGovernance)-[:GOVERNES {createdAt: datetime('2025-01-15T00:00:00Z')}]->(users);
CREATE (classificationGovernance)-[:GOVERNES {createdAt: datetime('2025-01-15T00:00:00Z')}]->(userEmail);
CREATE (classificationGovernance)-[:GOVERNES {createdAt: datetime('2025-01-15T00:00:00Z')}]->(orderAmount);
CREATE (classificationGovernance)-[:GOVERNES {createdAt: datetime('2025-01-15T00:00:00Z')}]->(productPrice);
CREATE (classificationGovernance)-[:GOVERNES {createdAt: datetime('2025-01-15T00:00:00Z')}]->(mysqlCustomerEmail);
CREATE (classificationGovernance)-[:GOVERNES {createdAt: datetime('2025-01-15T00:00:00Z')}]->(mysqlOrderAmount);
CREATE (classificationGovernance)-[:GOVERNES {createdAt: datetime('2025-01-15T00:00:00Z')}]->(mysqlProductPrice);
CREATE (classificationGovernance)-[:GOVERNES {createdAt: datetime('2025-01-15T00:00:00Z')}]->(mysqlTransactionAmount);

// Add audit governance
CREATE (auditGovernance:DataGovernance {
  id: 'gov.audit.compliance',
  name: 'Audit Compliance Governance',
  description: 'Governance rules for audit logging and compliance tracking',
  status: 'ACTIVE',
  createdAt: datetime('2025-01-15T00:00:00Z')
});

CREATE (auditGovernance)-[:GOVERNES {createdAt: datetime('2025-01-15T00:00:00Z')}]->(users);
CREATE (auditGovernance)-[:GOVERNES {createdAt: datetime('2025-01-15T00:00:00Z')}]->(mysqlCustomers);
CREATE (auditGovernance)-[:GOVERNES {createdAt: datetime('2025-01-15T00:00:00Z')}]->(orders);
CREATE (auditGovernance)-[:GOVERNES {createdAt: datetime('2025-01-15T00:00:00Z')}]->(mysqlOrders);

// Return summary of governance data
MATCH (n:DataQuality) 
RETURN 'Data Quality Rules' as category, count(n) as count
UNION ALL
MATCH (n:DataGovernance) 
RETURN 'Governance Rules' as category, count(n) as count
UNION ALL
MATCH (n:Metadata) 
RETURN 'Metadata Objects' as category, count(n) as count;
