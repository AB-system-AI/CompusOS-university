import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { REQUIRED_DOCS } from './constitution-data.mjs';

const ROOT = process.cwd();
const REQUIRED_DIRS = [
  'docs/constitution',
  'docs/constitution/MBC',
  'docs/constitution/CEC',
  'docs/constitution/EAP',
  'docs/constitution/EDS',
  'docs/constitution/ADR',
  'docs/constitution/versions',
];

const DOC_IDS = {
  'docs/constitution/MBC/CAMPUSOS-MBC-001-v1.1.0.md': 'CAMPUSOS-MBC-001',
  'docs/constitution/CEC/CAMPUSOS-CEC-001-v1.0.0.md': 'CAMPUSOS-CEC-001',
  'docs/constitution/EAP/CAMPUSOS-EAP-001-v1.0.0.md': 'CAMPUSOS-EAP-001',
  'docs/constitution/EDS/CAMPUSOS-EDS-001-v1.0.0.md': 'CAMPUSOS-EDS-001',
};

const errors = [];

function isUtf16(buf) {
  return buf.includes(0) || (buf[0] === 0xff && buf[1] === 0xfe);
}

for (const dir of REQUIRED_DIRS) {
  const path = join(ROOT, dir);
  if (!existsSync(path)) errors.push(`Missing directory: ${dir}`);
}

for (const rel of REQUIRED_DOCS) {
  const path = join(ROOT, rel);
  if (!existsSync(path)) {
    errors.push(`Missing document: ${rel}`);
    continue;
  }
  const buf = readFileSync(path);
  if (isUtf16(buf)) errors.push(`UTF-16 encoding: ${rel}`);
  const text = buf.toString('utf8');
  if (!text.trim().startsWith('#')) errors.push(`Invalid markdown (no H1): ${rel}`);
  const docId = DOC_IDS[rel];
  if (docId && !text.includes(docId)) errors.push(`Missing Document ID ${docId}: ${rel}`);
  if (rel.includes('MBC') && !text.includes('Amendment Policy')) {
    errors.push(`Missing Amendment Policy: ${rel}`);
  }
}

if (errors.length > 0) {
  console.error('Constitution audit FAILED:\n');
  for (const e of errors) console.error(`  ✖ ${e}`);
  process.exit(1);
}

console.log('Constitution audit PASSED');
console.log(`  Directories: ${REQUIRED_DIRS.length}`);
console.log(`  Documents:   ${REQUIRED_DOCS.length}`);
console.log('  Encoding:    UTF-8 (no BOM/UTF-16)');
console.log('  Document IDs: verified');
