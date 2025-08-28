# LineageNexus Architecture

## Overview
LineageNexus is a microservices-based platform for data governance and lineage. Core domains are separated into independently deployable services communicating via APIs and asynchronous events.

## Services
- Connectors Service: pluggable ingestion from source systems (DBs, warehouses, BI, streams).
- Metadata Ingestion Service: normalizes connector metadata into canonical events and persists to stores.
- Lineage API Service: computes and serves lineage queries backed by Neo4j.
- Governance Engine: RBAC/SSO enforcement, classification, masking evaluation, audit hooks.
- Web UI Service: React/Vue SPA serving UI for lineage graphs, catalog, dashboards.

## Data Stores
- Neo4j: graph store for assets, relationships, and lineage versions.
- PostgreSQL: relational store for RBAC, users, roles, classifications, audit logs, configs.

## Data Flow (high-level)
1. Connectors extract metadata (schemas, tables, columns, reports) from sources.
2. Ingestion normalizes to canonical events and writes to PostgreSQL and Neo4j.
3. Lineage API computes and caches lineage traversals and serves queries to UI.
4. Governance applies RBAC, masking, and logs actions to audit.

## APIs and Contracts
- REST/GraphQL APIs for UI and external integrations.
- Event contracts (JSON/Avro) for metadata and lineage updates.

## Non-Functional Considerations
- Scalability via horizontal scaling and partitioned event processing.
- Observability: metrics, logs, tracing.
- Security: SSO, least-privilege RBAC, secrets management.

## Diagrams
See `tasks/milestones.md` for milestone scope; detailed sequence and component diagrams will be added as ADRs in `/docs/adrs/`. 