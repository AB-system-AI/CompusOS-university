import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  ADRS,
  CEC_SECTIONS,
  EAP_DELIVERABLES,
  EDS_SECTIONS,
  MBC_SECTIONS,
  REQUIRED_DOCS,
} from './constitution-data.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

function write(rel, content) {
  const path = join(ROOT, rel);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, content, 'utf8');
}

function docHeader({ id, version, status, title, authority, complements }) {
  return `# ${title}

| Field | Value |
|-------|-------|
| **Document ID** | ${id} |
| **Version** | ${version} |
| **Status** | ${status} |
| **Classification** | Constitutional |
| **Effective Date** | July 12, 2026 |
| **Governance Authority** | ${authority} |
| **Complements** | ${complements} |

---

## Purpose

This document is a canonical constitutional artifact for CampusOS. It defines planning-level
governance, architecture, and design authority. It does not contain implementation source code.

## Scope

- Product and platform constitution (planning authority)
- Cross-document binding rules and governance
- Section index and constitutional summaries
- Amendment and ratification policy

## Governance Authority

| Authority | Role |
|-----------|------|
| Architecture Review Board (ARB) | Ratification, amendments, ADR acceptance |
| CTO | Executive architecture authority |
| CISO | Security architecture authority |
| Release Council | Release gate enforcement |

**Hierarchy:** MBC v1.1.0 → CEC v1.0.0 → EAP v1.0.0 → EDS v1.0.0 → ADRs → Implementation

## Amendment Policy

1. Constitutional amendments require ARB quorum (2/3 members).
2. MBC amendments require ARB + CEO approval.
3. Version bumps follow semantic versioning per document family.
4. No implementation may contradict ratified constitutional documents.
5. Amendments are recorded in \`docs/constitution/versions/README.md\`.

## Cross References

| Document | Path |
|----------|------|
| MBC v1.1.0 | \`docs/constitution/MBC/CAMPUSOS-MBC-001-v1.1.0.md\` |
| CEC v1.0.0 | \`docs/constitution/CEC/CAMPUSOS-CEC-001-v1.0.0.md\` |
| EAP v1.0.0 | \`docs/constitution/EAP/CAMPUSOS-EAP-001-v1.0.0.md\` |
| EDS v1.0.0 | \`docs/constitution/EDS/CAMPUSOS-EDS-001-v1.0.0.md\` |
| ADR Registry | \`docs/constitution/ADR/README.md\` |
| Version Registry | \`docs/constitution/versions/README.md\` |

---

`;
}

function sectionIndex(title, sections) {
  let md = `## Full Section Index\n\n### ${title}\n\n`;
  if (Array.isArray(sections[0])) {
    for (const group of sections) {
      md += `#### ${group.part}\n\n`;
      for (const item of group.items) md += `- ${item}\n`;
      md += '\n';
    }
  } else {
    for (const item of sections) md += `- ${item}\n`;
    md += '\n';
  }
  return md;
}

// --- README ---
write(
  'docs/constitution/README.md',
  `# CampusOS Constitutional Framework

Published canonical constitution per **EDS v1.0.0** and **G-002**.

## Constitutional Tree

\`\`\`
MBC (Master Blueprint Constitution)
 ↓
CEC (Engineering Constitution)
 ↓
EAP (Enterprise Architecture Pack)
 ↓
EDS (Enterprise Design Specification)
 ↓
ADRs (Architecture Decision Records)
 ↓
Phase 1 Genesis Implementation
\`\`\`

## Published Documents

| Document | Version | Path |
|----------|---------|------|
| CAMPUSOS-MBC-001 | v1.1.0 | [MBC/CAMPUSOS-MBC-001-v1.1.0.md](./MBC/CAMPUSOS-MBC-001-v1.1.0.md) |
| CAMPUSOS-CEC-001 | v1.0.0 | [CEC/CAMPUSOS-CEC-001-v1.0.0.md](./CEC/CAMPUSOS-CEC-001-v1.0.0.md) |
| CAMPUSOS-EAP-001 | v1.0.0 | [EAP/CAMPUSOS-EAP-001-v1.0.0.md](./EAP/CAMPUSOS-EAP-001-v1.0.0.md) |
| CAMPUSOS-EDS-001 | v1.0.0 | [EDS/CAMPUSOS-EDS-001-v1.0.0.md](./EDS/CAMPUSOS-EDS-001-v1.0.0.md) |

## Registries

- [ADR Registry](./ADR/README.md) — ADR-0001 through ADR-0021
- [Version Management](./versions/README.md) — Ratified versions and amendment process

## Genesis Status

| Task | Status |
|------|--------|
| G-001 Repository Foundation | **CLOSED** |
| G-002 Constitutional Publishing | **IN PROGRESS** |
| G-003+ Implementation | Not started |

## Audit

Run \`bun run constitution:audit\` to validate constitutional documentation integrity.
`,
);

// --- MBC ---
write(
  'docs/constitution/MBC/CAMPUSOS-MBC-001-v1.1.0.md',
  `${docHeader({
    id: 'CAMPUSOS-MBC-001',
    version: '1.1.0',
    status: 'Ratified — Constitutional',
    title: 'CampusOS Master Blueprint Constitution (MBC)',
    authority: 'Architecture Review Board (ARB)',
    complements: 'None (highest authority)',
  })}
## Preamble

CampusOS is the **Intelligent University Operating System** — a cloud-native, AI-first,
multi-tenant platform unifying academic, administrative, financial, operational, research,
student-life, alumni, and ecosystem capabilities.

**Binding Rule:** No feature, service, schema, screen, integration, or release may be built
outside this constitution unless formally amended by the ARB.

## Constitutional Summary

- **85 modules** across 7 domains (CORE, PEOPLE, FINANCE, CAMPUS, GROWTH, ENGAGEMENT, PLATFORM)
- **24+ portals** and **600+ UI pages** (constitutional scope)
- **Roadmap v1.0 → v15.0** with Phase 1 Genesis (v1.0) as current gate
- **Phase 0.1 Amendment** extends v1.0.0 with ADRs, API/Event/UI constitutions, and readiness gates

${sectionIndex('MBC v1.1.0', MBC_SECTIONS)}
## Key Constitutional Metrics

| Metric | Value |
|--------|------:|
| Modules | 85 |
| Portals | 24+ |
| Readiness items (Phase 1) | 332 |
| Release gates | 20 |
| Genesis services | 10 + ai-gateway |

## Related Documents

- CEC v1.0.0 — Engineering execution rules
- EAP v1.0.0 — Enterprise architecture deliverables
- EDS v1.0.0 — Service internal design depth
- ADR Registry — Architecture decisions ADR-0001–0021
`,
);

// --- CEC ---
write(
  'docs/constitution/CEC/CAMPUSOS-CEC-001-v1.0.0.md',
  `${docHeader({
    id: 'CAMPUSOS-CEC-001',
    version: '1.0.0',
    status: 'Ratified — Constitutional',
    title: 'CampusOS Engineering Constitution (CEC)',
    authority: 'ARB + Engineering Governance Board',
    complements: 'MBC v1.1.0',
  })}
## Preamble

The CEC governs how CampusOS is designed, built, tested, deployed, secured, observed, and maintained.
Where MBC defines **what** CampusOS must become, CEC defines **how** engineering work must be executed.

**Binding Rule:** No engineer, architect, AI agent, or contributor may implement production code
until CEC v1.0.0 is ratified and acknowledged.

${sectionIndex('CEC v1.0.0', CEC_SECTIONS)}
## Key Engineering Rules (Summary)

| Area | Constitutional Rule |
|------|---------------------|
| Repository | Monorepo per CEC §3.2; Turborepo orchestration |
| TypeScript | Strict mode, project references, composite builds |
| ESLint | Constitutional rules via \`@campusos/eslint-config\` |
| Commits | Conventional Commits (CEC §3.6) |
| Testing | Unit, integration, E2E, contract, performance, chaos |
| Security | Zero-trust, tenant isolation, OWASP ASVS L2+ |

## Related Documents

- MBC v1.1.0 §6 Platform Architecture
- EAP Deliverable 15 — Enterprise Quality Architecture
- EDS §15 — Architecture Fitness Functions (FF-PERF-006: max 300 lines/file)
`,
);

// --- EAP ---
write(
  'docs/constitution/EAP/CAMPUSOS-EAP-001-v1.0.0.md',
  `${docHeader({
    id: 'CAMPUSOS-EAP-001',
    version: '1.0.0',
    status: 'Ratified — Constitutional',
    title: 'CampusOS Enterprise Architecture Pack (EAP)',
    authority: 'ARB + Chief Architect',
    complements: 'MBC v1.1.0, CEC v1.0.0',
  })}
## Preamble

The EAP is the final planning-phase enterprise architecture pack before Genesis implementation.
It binds C4 models, service catalog, API/event/data/AI/security/infrastructure architecture,
and the expanded readiness checklist (247 → 332 items with EDS).

**Binding Rule:** Phase 1 (Genesis) implementation requires EAP v1.0.0 ratification and
100% readiness on constitutional gates.

${sectionIndex('EAP v1.0.0 Deliverables', EAP_DELIVERABLES)}
## Genesis Service Catalog (Phase 1)

| Service | Bounded Context |
|---------|-----------------|
| identity-service | IdentityOS |
| tenant-service | TenantOS |
| communicate-service | CommunicateOS |
| content-service | ContentOS |
| trust-service | TrustOS |
| platform-service | PlatformOS |
| insight-service | InsightOS |
| search-service | SearchOS |
| web-service | WebOS CMS |
| ai-gateway-service | IntelligenceOS (internal) |

## Related Documents

- EDS v1.0.0 — Internal service design depth
- MBC Phase 0.1 §23 — Phase 1 Readiness Checklist
`,
);

// --- EDS ---
write(
  'docs/constitution/EDS/CAMPUSOS-EDS-001-v1.0.0.md',
  `${docHeader({
    id: 'CAMPUSOS-EDS-001',
    version: '1.0.0',
    status: 'Ratified — Constitutional',
    title: 'CampusOS Enterprise Design Specification (EDS)',
    authority: 'ARB + Service Owners',
    complements: 'MBC v1.1.0, CEC v1.0.0, EAP v1.0.0',
  })}
## Preamble

The EDS provides authoritative internal design depth for Genesis services. It extends MBC, CEC,
and EAP without modifying them. EDS defines service specifications, sequence diagrams, data
ownership, event catalogs, infrastructure topology, threat surfaces, and fitness functions.

**Binding Rule:** No service implementation may begin until EDS v1.0.0 is ratified and
EAP §20 implementation gate is open.

${sectionIndex('EDS v1.0.0', EDS_SECTIONS)}
## Fitness Functions (§15 Summary)

| ID | Rule |
|----|------|
| FF-PERF-006 | No source file may exceed **300 lines** |
| FF-SEC-001 | All APIs require authentication |
| FF-SEC-002 | Tenant isolation on every data path |
| FF-EVT-001 | All domain events use constitutional envelope |
| FF-API-001 | RFC 7807 error responses (ADR-0020) |

## Related Documents

- EAP Deliverable 2 — Service Catalog
- CEC §2.8 — ESLint constitutional rules
- ADR Registry — Binding architecture decisions
`,
);

// --- ADR Registry ---
const adrTable = ADRS.map(
  (a) => `| ${a.id} | ${a.title} | ${a.status} | ${a.related.join(', ')} |`,
).join('\n');

write(
  'docs/constitution/ADR/README.md',
  `# CampusOS Architecture Decision Record (ADR) Registry

| Field | Value |
|-------|-------|
| **Document ID** | CAMPUSOS-ADR-REGISTRY-001 |
| **Version** | 1.0.0 |
| **Status** | Published |
| **Authority** | MBC v1.1.0 §1.7, ARB |

## Purpose

Canonical registry of architecture decisions ADR-0001 through ADR-0021.

## Registry

| ID | Title | Status | Related Documents |
|----|-------|--------|-------------------|
${adrTable}

## ADR Lifecycle

| Status | Meaning |
|--------|---------|
| Proposed | Under ARB review |
| Accepted | Binding for implementation |
| Deprecated | Superseded by newer ADR |
| Rejected | Not adopted |

## Amendment Policy

New ADRs require draft → ARB review (2/3 quorum) → Accepted/Rejected.
Implementation PRs must reference accepted ADR IDs.
`,
);

// --- Versions ---
write(
  'docs/constitution/versions/README.md',
  `# CampusOS Constitutional Version Management

| Field | Value |
|-------|-------|
| **Document ID** | CAMPUSOS-VERSION-REGISTRY-001 |
| **Version** | 1.0.0 |
| **Status** | Published |

## Ratified Versions

| Document | Version | Status | Path |
|----------|---------|--------|------|
| CAMPUSOS-MBC-001 | v1.1.0 | Ratified | \`docs/constitution/MBC/\` |
| CAMPUSOS-CEC-001 | v1.0.0 | Ratified | \`docs/constitution/CEC/\` |
| CAMPUSOS-EAP-001 | v1.0.0 | Ratified | \`docs/constitution/EAP/\` |
| CAMPUSOS-EDS-001 | v1.0.0 | Ratified | \`docs/constitution/EDS/\` |

## Draft Versions

None. All constitutional documents are ratified for Genesis Phase 1.

## Amendment Process

1. Author drafts amendment with ARB ticket reference.
2. ARB reviews at bi-weekly meeting (2/3 quorum).
3. On acceptance, version bump per rules below.
4. Update this registry and publish amended document.
5. Implementation teams acknowledge within one sprint.

## Version Bump Rules

| Change Type | Bump | Example |
|-------------|------|---------|
| Breaking constitutional rule | Major | 1.0.0 → 2.0.0 |
| New section or module | Minor | 1.1.0 → 1.2.0 |
| Clarification, no rule change | Patch | 1.1.0 → 1.1.1 |

## Genesis Milestones

| Task | Commit | Status |
|------|--------|--------|
| G-001 Repository Foundation | \`ebeb168\`, \`f8c0a5a\` | Closed |
| G-002 Constitutional Publishing | — | In progress |
`,
);

console.log(`Published ${REQUIRED_DOCS.length} constitutional documents.`);
