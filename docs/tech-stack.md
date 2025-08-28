# Tech Stack Selections

## Backend
- Node.js (LTS) with TypeScript for all services
- Framework: NestJS (structured modules, DI, testing) or Fastify for lightweight services
- Validation: Zod or class-validator
- Messaging: Kafka/RabbitMQ (introduced in Milestone 2)

## Storage
- Neo4j for lineage graphs and relationship queries
- PostgreSQL for RBAC, audit logs, configurations, and catalog metadata

## Frontend
- React (Vite) or Vue 3 (Vite) with TypeScript
- State: Redux Toolkit/Query or Vue Query/Pinia
- Graph rendering: Cytoscape.js or D3 + Dagre

## DevEx
- ESLint, Prettier, Husky, lint-staged
- Jest/Vitest, Supertest/Playwright
- Docker, Docker Compose; Kubernetes (Helm) for environments

## Rationale
- TypeScript across stack improves maintainability and safety
- Neo4j optimized for complex lineage traversals
- NestJS accelerates modular service development with mature ecosystem 