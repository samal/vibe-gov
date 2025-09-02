#!/bin/bash

# vibeGov Database Initialization Script
# This script sets up both PostgreSQL and Neo4j databases with seed data

set -e

echo "🚀 Starting vibeGov Database Initialization..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to wait for database to be ready
wait_for_postgres() {
    print_status "Waiting for PostgreSQL to be ready..."
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if docker exec lineage_postgres_1 pg_isready -U lineage > /dev/null 2>&1; then
            print_success "PostgreSQL is ready!"
            return 0
        fi
        
        print_status "Attempt $attempt/$max_attempts: PostgreSQL not ready yet, waiting 2 seconds..."
        sleep 2
        attempt=$((attempt + 1))
    done
    
    print_error "PostgreSQL failed to become ready after $max_attempts attempts"
    return 1
}

wait_for_neo4j() {
    print_status "Waiting for Neo4j to be ready..."
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if docker exec lineage_neo4j_1 cypher-shell -u neo4j -p lineage123 -c "RETURN 1 as test;" > /dev/null 2>&1; then
            print_success "Neo4j is ready!"
            return 0
        fi
        
        print_status "Attempt $attempt/$max_attempts: Neo4j not ready yet, waiting 2 seconds..."
        sleep 2
        attempt=$((attempt + 1))
    done
    
    print_error "Neo4j failed to become ready after $max_attempts attempts"
    return 1
}

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    print_error "docker-compose is not installed. Please install it and try again."
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "../docker-compose.yml" ]; then
    print_error "This script must be run from the db/ directory. Please navigate to db/ and try again."
    exit 1
fi

# Start PostgreSQL
print_status "Starting PostgreSQL container..."
cd ..
docker-compose up postgres -d

# Wait for PostgreSQL to be ready
if ! wait_for_postgres; then
    print_error "Failed to initialize PostgreSQL"
    exit 1
fi

# Run PostgreSQL schema
print_status "Running PostgreSQL schema..."
docker exec -i lineage_postgres_1 psql -U lineage -d lineage < db/postgres/schema.sql
print_success "PostgreSQL schema created successfully"

# Run PostgreSQL seed data
print_status "Populating PostgreSQL with seed data..."
docker exec -i lineage_postgres_1 psql -U lineage -d lineage < db/postgres/seed.sql
print_success "PostgreSQL seed data inserted successfully"

# Start Neo4j
print_status "Starting Neo4j container..."
docker-compose up neo4j -d

# Wait for Neo4j to be ready
if ! wait_for_neo4j; then
    print_error "Failed to initialize Neo4j"
    exit 1
fi

# Run Neo4j constraints
print_status "Creating Neo4j constraints and indexes..."
docker exec -i lineage_neo4j_1 cypher-shell -u neo4j -p lineage123 -f db/neo4j/constraints.cypher
print_success "Neo4j constraints created successfully"

# Run Neo4j seed data
print_status "Populating Neo4j with seed data..."
docker exec -i lineage_neo4j_1 cypher-shell -u neo4j -p lineage123 -f db/neo4j/seed.cypher
print_success "Neo4j seed data inserted successfully"

# Verify the setup
print_status "Verifying database setup..."

echo ""
print_status "PostgreSQL Verification:"
postgres_users=$(docker exec -i lineage_postgres_1 psql -U lineage -d lineage -t -c "SELECT COUNT(*) FROM users;" | tr -d ' ')
postgres_assets=$(docker exec -i lineage_postgres_1 psql -U lineage -d lineage -t -c "SELECT COUNT(*) FROM data_assets;" | tr -d ' ')
postgres_audit=$(docker exec -i lineage_postgres_1 psql -U lineage -d lineage -t -c "SELECT COUNT(*) FROM audit_logs_enhanced;" | tr -d ' ')

echo "  - Users: $postgres_users"
echo "  - Data Assets: $postgres_assets"
echo "  - Audit Events: $postgres_audit"

echo ""
print_status "Neo4j Verification:"
neo4j_assets=$(docker exec -i lineage_neo4j_1 cypher-shell -u neo4j -p lineage123 -c "MATCH (n:DataAsset) RETURN count(n) as count;" | grep -v "count" | grep -v "---" | tr -d ' ')
neo4j_relationships=$(docker exec -i lineage_neo4j_1 cypher-shell -u neo4j -p lineage123 -c "MATCH ()-[r:FLOWS_TO]->() RETURN count(r) as count;" | grep -v "count" | grep -v "---" | tr -d ' ')

echo "  - Data Assets: $neo4j_assets"
echo "  - Lineage Relationships: $neo4j_relationships"

echo ""
print_success "🎉 Database initialization completed successfully!"
echo ""
print_status "Default login credentials:"
echo "  - Admin: admin@lineage.com (any password)"
echo "  - Data Steward: steward@lineage.com (any password)"
echo "  - Data Engineer: engineer@lineage.com (any password)"
echo "  - Analyst: analyst@lineage.com (any password)"
echo "  - Viewer: viewer@lineage.com (any password)"
echo "  - Compliance: compliance@lineage.com (any password)"
echo ""
print_status "You can now start the application services:"
echo "  docker-compose up -d"
echo ""
print_warning "Note: All demo accounts accept any password. Change this in production!"
