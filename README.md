# CampusOS Platform

**The Intelligent University Operating System**

Enterprise-grade, cloud-native, AI-first, multi-tenant university platform.

## Genesis Foundation Status

**G-001: CLOSED** — Repository foundation implemented and validated.

| Component                           | Status |
| ----------------------------------- | ------ |
| Bun workspace (27 packages)         | Active |
| Turborepo orchestration             | Active |
| TypeScript project references       | Active |
| Constitutional ESLint (FF-PERF-006) | Active |
| GitHub Actions CI                   | Active |
| Husky + Commitlint + lint-staged    | Active |

## Constitutional Authority

| Document | Version |
| -------- | ------- |
| MBC      | v1.1.0  |
| CEC      | v1.0.0  |
| EAP      | v1.0.0  |
| EDS      | v1.0.0  |

## Monorepo Architecture

CampusOS uses a **Bun workspace** monorepo orchestrated by **Turborepo**.

```
apps/          # 5 Next.js portals and API gateway config
services/      # 10 Genesis microservice placeholders
packages/      # 10 shared @campusos/* libraries
tooling/       # 2 shared config packages (ESLint, TypeScript)
infra/         # Terraform, Kubernetes, Docker (placeholders)
deploy/        # Helm and ArgoCD (placeholders)
docs/          # Architecture and runbooks (placeholders)
scripts/       # CI and operational scripts
tests/         # E2E, contract, performance, chaos (placeholders)
examples/      # API usage examples (placeholders)
```

### Workspace Breakdown (27 total)

| Type     | Count |
| -------- | ----: |
| packages |    10 |
| apps     |     5 |
| services |    10 |
| tooling  |     2 |

## Workspace Aliases

All workspaces use the `@campusos/*` scope:

```typescript
import { GENESIS_VERSION } from '@campusos/common';
```

TypeScript path aliases are configured in `tsconfig.base.json`.

## Quick Start

```bash
cp .env.example .env.local
bun install
bun run validate
```

## Scripts

| Script              | Description                         |
| ------------------- | ----------------------------------- |
| `bun run build`     | Build all workspaces via Turborepo  |
| `bun run lint`      | ESLint across all workspaces        |
| `bun run typecheck` | TypeScript project references build |
| `bun run test`      | Run workspace test placeholders     |
| `bun run validate`  | Full local validation gate          |
| `bun run format`    | Prettier format all files           |

## License

Proprietary — see [LICENSE](LICENSE).
