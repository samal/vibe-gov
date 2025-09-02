# vibeGov Database Setup and Seed Data

This directory contains the database setup files and seed data for the vibeGov application.

## Files Overview

### PostgreSQL
- `schema.sql` - Database schema and table definitions
- `seed.sql` - Initial seed data for PostgreSQL database

### Neo4j
- `constraints.cypher` - Database constraints and indexes
- `seed.cypher` - Initial seed data for Neo4j graph database

## Setup Instructions

### 1. PostgreSQL Setup

1. **Start the PostgreSQL container:**
   ```bash
   docker-compose up postgres -d
   ```

2. **Wait for PostgreSQL to be ready, then run the schema:**
   ```bash
   docker exec -i lineage_postgres_1 psql -U lineage -d lineage < db/postgres/schema.sql
   ```

3. **Populate with seed data:**
   ```bash
   docker exec -i lineage_postgres_1 psql -U lineage -d lineage < db/postgres/seed.sql
   ```

### 2. Neo4j Setup

1. **Start the Neo4j container:**
   ```bash
   docker-compose up neo4j -d
   ```

2. **Wait for Neo4j to be ready, then run the constraints:**
   ```bash
   docker exec -i lineage_neo4j_1 cypher-shell -u neo4j -p lineage123 -f db/neo4j/constraints.cypher
   ```

3. **Populate with seed data:**
   ```bash
   docker exec -i lineage_neo4j_1 cypher-shell -u neo4j -p lineage123 -f db/neo4j/seed.cypher
   ```

## Seed Data Contents

### PostgreSQL Seed Data

The PostgreSQL seed data includes:

- **6 User Roles**: ADMIN, DATA_STEWARD, DATA_ENGINEER, ANALYST, VIEWER, COMPLIANCE_OFFICER
- **6 Default Users**: One for each role with realistic email addresses
- **8 Data Classifications**: PII, PHI, FINANCIAL, CONFIDENTIAL, PUBLIC, SENSITIVE, INTERNAL, RESTRICTED
- **20 Data Assets**: Mix of PostgreSQL tables, views, MySQL tables, and Tableau reports
- **5 Masking Rules**: Different masking strategies for different data types and roles
- **Asset Classifications**: Proper classification assignments for all assets
- **Comprehensive Audit Trail**: Complete audit log of all seed data creation
- **MySQL Integration**: 8 MySQL tables and views with realistic e-commerce data model

### Neo4j Seed Data

The Neo4j seed data includes:

- **23 Data Assets**: Tables, views, reports from multiple systems (PostgreSQL, MySQL, Tableau)
- **Column-Level Assets**: Detailed column information with classifications for both PostgreSQL and MySQL
- **Lineage Relationships**: Complete data flow mapping between assets across systems
- **Transformations**: SQL view definitions and ETL processes for both databases
- **Data Quality Rules**: Sample data quality monitoring for both systems
- **Governance Rules**: Data governance and masking policies for cross-system data
- **Metadata Objects**: Schema definitions and documentation for all systems
- **MySQL Ecosystem**: Complete MySQL data model with sales, inventory, and finance domains

## Default Login Credentials

After running the seed data, you can log in with these accounts:

| Email | Role | Description |
|-------|------|-------------|
| `admin@lineage.com` | ADMIN | Full system access |
| `steward@lineage.com` | DATA_STEWARD | Data governance and quality |
| `engineer@lineage.com` | DATA_ENGINEER | Technical metadata and lineage |
| `analyst@lineage.com` | ANALYST | Data analysis and reporting |
| `viewer@lineage.com` | VIEWER | Read-only access |
| `compliance@lineage.com` | COMPLIANCE_OFFICER | Audit and compliance |

**Note**: All accounts accept any password for demo purposes. In production, proper password authentication should be implemented.

## Data Lineage Structure

The seed data creates a realistic data lineage scenario:

```
PostgreSQL Tables → Views → Tableau Reports
     ↓
MySQL Tables (ETL) → PostgreSQL Tables
     ↓
MySQL Tables → Views → Tableau Reports
     ↓
Column-Level Lineage → Detailed Data Flow
     ↓
Cross-System ETL → Unified Data Platform
```

The MySQL ecosystem includes:
- **Sales Domain**: customers, orders, order_items, customer_summary
- **Inventory Domain**: products, suppliers, stock_alerts  
- **Finance Domain**: transactions
- **Cross-Domain Views**: customer_summary, stock_alerts

## Verification

After running the seed data, you can verify the setup:

### PostgreSQL
```bash
docker exec -i lineage_postgres_1 psql -U lineage -d lineage -c "SELECT COUNT(*) as users FROM users;"
docker exec -i lineage_postgres_1 psql -U lineage -d lineage -c "SELECT COUNT(*) as assets FROM data_assets;"
docker exec -i lineage_postgres_1 psql -U lineage -d lineage -c "SELECT COUNT(*) as audit_events FROM audit_logs_enhanced;"
```

### Neo4j
```bash
docker exec -i lineage_neo4j_1 cypher-shell -u neo4j -p lineage123 -c "MATCH (n:DataAsset) RETURN count(n) as data_assets;"
docker exec -i lineage_neo4j_1 cypher-shell -u neo4j -p lineage123 -c "MATCH ()-[r:FLOWS_TO]->() RETURN count(r) as lineage_relationships;"
```

## Troubleshooting

### Common Issues

1. **Connection Refused**: Wait for containers to fully start before running scripts
2. **Permission Denied**: Ensure you're using the correct database credentials
3. **Duplicate Key Errors**: The seed scripts use `ON CONFLICT DO NOTHING` to handle existing data

### Reset Database

To start fresh:

1. **PostgreSQL:**
   ```bash
   docker exec -i lineage_postgres_1 psql -U lineage -d lineage -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
   ```

2. **Neo4j:**
   ```bash
   docker exec -i lineage_neo4j_1 cypher-shell -u neo4j -p lineage123 -c "MATCH (n) DETACH DELETE n;"
   ```

Then re-run the schema and seed scripts.

## Production Considerations

For production deployment:

1. **Change default passwords** for all user accounts
2. **Implement proper authentication** with secure password hashing
3. **Review and customize** data classifications and masking rules
4. **Add production data assets** specific to your organization
5. **Implement proper backup** and recovery procedures
6. **Set up monitoring** and alerting for the databases

## Support

If you encounter issues with the database setup:

1. Check the Docker container logs: `docker-compose logs postgres` or `docker-compose logs neo4j`
2. Verify container status: `docker-compose ps`
3. Check database connectivity: `docker exec -i lineage_postgres_1 pg_isready -U lineage`
4. Review the application logs for any database connection errors
