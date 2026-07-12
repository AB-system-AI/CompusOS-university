# Contributing to CampusOS

Thank you for contributing to CampusOS — The Intelligent University Operating System.

## Constitutional Authority

All contributions must comply with:

- **MBC v1.1.0** — Master Blueprint Constitution
- **CEC v1.0.0** — Engineering Constitution
- **EAP v1.0.0** — Enterprise Architecture Pack
- **EDS v1.0.0** — Enterprise Design Specification

## Development Setup

```bash
# Prerequisites: Bun >= 1.2.0, Node >= 22
cp .env.example .env.local
bun install
bun run validate
```

## Branch Naming (CEC §3.5)

| Type    | Pattern                 | Example                      |
| ------- | ----------------------- | ---------------------------- |
| Feature | `feat/CAMP-{n}-{desc}`  | `feat/CAMP-123-tenant-api`   |
| Bug fix | `fix/CAMP-{n}-{desc}`   | `fix/CAMP-456-auth-token`    |
| Chore   | `chore/CAMP-{n}-{desc}` | `chore/CAMP-789-eslint`      |
| ADR     | `adr/ADR-{nnnn}-{desc}` | `adr/ADR-0022-bun-workspace` |

## Commit Messages (CEC §3.6)

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(identity): add user provisioning endpoint
fix(tenant): correct module entitlement cache invalidation
docs(architecture): add ADR-0022
```

## Pull Request Process

1. Ensure `bun run validate` passes locally
2. Fill out the PR template completely
3. Obtain CODEOWNERS approval for changed paths
4. Squash merge to `main`

## Definition of Done

See CEC §3.11 for the full Definition of Done checklist.

## Code of Conduct

Be respectful, inclusive, and professional. Report concerns to engineering leadership.
