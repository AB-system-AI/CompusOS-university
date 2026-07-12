# CampusOS Architecture Decision Record (ADR) Registry

| Field           | Value                     |
| --------------- | ------------------------- |
| **Document ID** | CAMPUSOS-ADR-REGISTRY-001 |
| **Version**     | 1.0.0                     |
| **Status**      | Published                 |
| **Authority**   | MBC v1.1.0 §1.7, ARB      |

## Purpose

Canonical registry of architecture decisions ADR-0001 through ADR-0021.

## Registry

| ID       | Title                                   | Status   | Related Documents                                                    |
| -------- | --------------------------------------- | -------- | -------------------------------------------------------------------- |
| ADR-0001 | Monorepo with Turborepo                 | Accepted | MBC v1.1.0, CEC §3.2, EAP Deliverable 1, EDS §9                      |
| ADR-0002 | PostgreSQL as primary OLTP              | Accepted | MBC §5, CEC §5, EAP Deliverable 5, EDS §5                            |
| ADR-0003 | Schema-per-tenant multi-tenancy         | Accepted | MBC §6.3, CEC §5.11, EAP Deliverable 5, EDS §1.2                     |
| ADR-0004 | NestJS for domain microservices         | Accepted | CEC §4, EAP Deliverable 2, EDS §1                                    |
| ADR-0005 | Next.js 15 App Router for web           | Accepted | MBC §25, CEC §6, EAP Deliverable 11                                  |
| ADR-0006 | React Native + Expo for mobile          | Accepted | CEC §2.2, EAP Deliverable 11                                         |
| ADR-0007 | Apache Kafka for event fabric           | Accepted | MBC Phase 0.1 §2, CEC §4.9, EAP Deliverable 4, EDS §7                |
| ADR-0008 | Kubernetes on AWS EKS primary           | Accepted | MBC §10, CEC §8, EAP Deliverable 7, EDS §9                           |
| ADR-0009 | Keycloak for identity plane             | Accepted | MBC §8, CEC §4.7, EAP Deliverable 8, EDS §1.1                        |
| ADR-0010 | RBAC + ABAC + ReBAC hybrid              | Accepted | MBC §8.3, MBC §15, CEC §10, EAP Deliverable 8                        |
| ADR-0011 | OpenSearch for full-text search         | Accepted | MBC Phase 0.1 §15, EAP Deliverable 2, EDS §1.8                       |
| ADR-0012 | Azure OpenAI primary LLM                | Accepted | MBC §9, CEC §7, EAP Deliverable 6, EDS §1.10                         |
| ADR-0013 | Cursor-based API pagination             | Accepted | MBC Phase 0.1 §3, CEC §4.15, EAP Deliverable 3                       |
| ADR-0014 | Conventional Commits                    | Accepted | MBC Phase 0.1 §6, CEC §3.6                                           |
| ADR-0015 | LaunchDarkly for feature flags          | Proposed | MBC Phase 0.1 §6.6, EAP §1.10                                        |
| ADR-0016 | GraphQL federation at v6.0              | Proposed | MBC Phase 0.1 §3.7, EAP Deliverable 3                                |
| ADR-0017 | pgvector for embeddings                 | Accepted | MBC Phase 0.1 §8, EAP Deliverable 6, EDS §1.8, EDS §1.10             |
| ADR-0018 | Cloudflare R2 for object storage        | Proposed | MBC §29, EAP §1.11, EDS §1.4                                         |
| ADR-0019 | SearchOS as independent bounded context | Accepted | MBC Phase 0.1 §15, EAP Deliverable 2, EDS §1.8                       |
| ADR-0020 | RFC 7807 Problem Details for all APIs   | Accepted | MBC Phase 0.1 §3.5, CEC §4.15, EAP Deliverable 3                     |
| ADR-0021 | Bun as monorepo package manager         | Accepted | ADR-0001, CEC §3.2, G-001 Repository Foundation, EDS §15 FF-PERF-006 |

## ADR Lifecycle

| Status     | Meaning                    |
| ---------- | -------------------------- |
| Proposed   | Under ARB review           |
| Accepted   | Binding for implementation |
| Deprecated | Superseded by newer ADR    |
| Rejected   | Not adopted                |

## Amendment Policy

New ADRs require draft → ARB review (2/3 quorum) → Accepted/Rejected.
Implementation PRs must reference accepted ADR IDs.
