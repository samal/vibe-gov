# LineageNexus Milestones

## Milestone 1: Architecture & Platform Foundations ✅ COMPLETED
- Deliverables:
  - Architecture document with microservice boundaries and data flows
  - Tech stack selections (NestJS/Fastify, shared libs, TypeScript config)
  - Initial Neo4j and PostgreSQL schemas (DDL + ER/G models)
  - Local dev environment (Docker Compose) and base CI pipeline
- Acceptance Criteria:
  - Diagrams and ADRs reviewed and approved
  - `docker compose up` brings up core infra locally
  - CI builds, lints, and runs unit tests on PRs

## Milestone 2: Service Scaffolds & Messaging ✅ COMPLETED
- Deliverables:
  - Scaffolds for services: Connectors, Ingestion, Lineage API, Governance, Web UI
  - Messaging broker (Kafka/RabbitMQ) topics/queues and contracts defined
  - Shared proto/schemas for inter-service events
- Acceptance Criteria:
  - Services build and run independently; health endpoints pass
  - Basic e2e: sample metadata event flows from Connectors -> Ingestion -> Storage

## Milestone 3: Connector Framework & Initial Connectors ✅ COMPLETED
- Deliverables:
  - Universal connector SDK (interfaces, lifecycle, auth, scheduling)
  - Connectors: PostgreSQL, MySQL, SQL Server, MongoDB, Kafka, Tableau
  - Connector testing harness and sample configs
- Acceptance Criteria:
  - Each connector ingests schemas/tables/columns and emits metadata events
  - Tableau connector extracts report/dashboard dependencies

## Milestone 4: Lineage Engine & APIs ✅ COMPLETED
- Deliverables:
  - SQL parsing pipeline and dependency mapping to column-level lineage
  - Lineage versioning and history APIs
  - Neo4j lineage queries optimized for common patterns
- Acceptance Criteria:
  - Given example SQL/view/ETL, engine produces correct upstream/downstream graph
  - Versioned lineage retrieval under 500ms P95 for typical queries

## Milestone 5: Governance, Security, and Auditing (Weeks 13-16)
- Deliverables:
  - RBAC with SSO (SAML/OAuth2) integration
  - Data classification/tagging APIs and masking rule engine/proxy
  - Immutable audit logging with PostgreSQL
- Acceptance Criteria:
  - Role-based access enforced on APIs and UI
  - Masking rules applied based on role and classification in sample flows
  - Audit logs recorded for key actions and are tamper-evident

## Milestone 6: Frontend UI & Visualizations (Weeks 17-20)
- Deliverables:
  - React/Vue app shell, design system, and routing
  - Interactive DAG lineage graph (zoom, pan, node detail)
  - Data catalog search with owners, descriptions, and metadata views
  - Dashboards and change impact analysis
- Acceptance Criteria:
  - Graph renders >1,000 nodes interactively in target hardware
  - Catalog search returns expected assets with filter facets
  - Impact analysis shows accurate downstream dependencies

## Milestone 7: Ops, Observability, and Hardening (Weeks 21-22)
- Deliverables:
  - Docker images and Kubernetes manifests/Helm charts
  - Prometheus metrics, Grafana dashboards, and distributed tracing
  - Security hardening and secrets management
- Acceptance Criteria:
  - Green deploy to a staging cluster
  - SLO dashboards show availability, latency, and error budgets
  - Basic penetration and config scans pass

## Milestone 8: Performance, DR, and GA Readiness (Weeks 23-24)
- Deliverables:
  - Load/perf tests for APIs and UI, tuning applied
  - Backup/restore and disaster recovery procedures
  - Documentation: developer setup, runbooks, user guides
- Acceptance Criteria:
  - API P95 < 500ms for typical lineage queries at target load
  - DR playbook validated in a simulated failover
  - Docs reviewed and complete 