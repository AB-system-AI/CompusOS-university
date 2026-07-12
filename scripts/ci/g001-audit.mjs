import { execSync } from 'node:child_process';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const roots = { app: 'apps', package: 'packages', service: 'services', tooling: 'tooling' };
const workspaces = [];
const names = new Set();
const issues = [];

function isUtf16(buf) {
  return buf.includes(0) || (buf[0] === 0xff && buf[1] === 0xfe);
}

for (const [type, root] of Object.entries(roots)) {
  for (const dir of readdirSync(root)) {
    const base = join(root, dir);
    const pkgPath = join(base, 'package.json');
    if (!statSync(base).isDirectory() || !readdirSync(base).includes('package.json')) continue;
    const buf = readFileSync(pkgPath);
    if (isUtf16(buf)) issues.push({ file: pkgPath, issue: 'UTF-16 encoding' });
    let pkg;
    try {
      pkg = JSON.parse(buf.toString('utf8'));
    } catch (e) {
      issues.push({ file: pkgPath, issue: `Invalid JSON: ${e.message}` });
      continue;
    }
    if (!pkg.name?.startsWith('@campusos/'))
      issues.push({ file: pkgPath, issue: 'Invalid name scope' });
    if (names.has(pkg.name)) issues.push({ file: pkgPath, issue: `Duplicate name ${pkg.name}` });
    names.add(pkg.name);
    for (const script of ['build', 'lint', 'typecheck']) {
      if (!pkg.scripts?.[script])
        issues.push({ file: pkgPath, issue: `Missing script: ${script}` });
    }
    workspaces.push({ path: base.replace(/\\/g, '/'), name: pkg.name, type });
  }
}

const configFiles = [
  'package.json',
  'README.md',
  'eslint.config.js',
  'turbo.json',
  'tsconfig.json',
  'tsconfig.base.json',
  'commitlint.config.js',
  'tooling/eslint-config/index.js',
  '.github/workflows/ci-lint.yml',
  '.github/workflows/ci-build.yml',
  '.github/workflows/ci-security.yml',
];

for (const file of configFiles) {
  const buf = readFileSync(file);
  if (isUtf16(buf)) issues.push({ file, issue: 'UTF-16 encoding' });
}

const tsRefs = (readFileSync('tsconfig.json', 'utf8').match(/"path"/g) ?? []).length;
const turboOut = execSync('bunx turbo ls', { encoding: 'utf8' });
const turboCount = (turboOut.match(/@campusos\//g) ?? []).length;
const bunOut = execSync('bun pm ls', { encoding: 'utf8' });
const bunWs = [...new Set(bunOut.match(/@campusos\/[^\s]+@workspace/g) ?? [])];

const eslint = readFileSync('tooling/eslint-config/index.js', 'utf8');
const maxLines = eslint.match(/'max-lines':\s*\['error',\s*\{\s*max:\s*(\d+)/)?.[1];
if (maxLines !== '300')
  issues.push({ file: 'tooling/eslint-config/index.js', issue: `max-lines is ${maxLines}` });
const ignoresBlock = eslint.match(/ignores:\s*\[([\s\S]*?)\],/)?.[1] ?? '';
if (ignoresBlock.includes('commitlint.config.js')) {
  issues.push({
    file: 'tooling/eslint-config/index.js',
    issue: 'commitlint in ignores (should be override)',
  });
}
if (!eslint.includes("'commitlint.config.js', 'tooling/eslint-config/**'")) {
  issues.push({
    file: 'tooling/eslint-config/index.js',
    issue: 'commitlint missing from override files',
  });
}

const breakdown = { app: 0, package: 0, service: 0, tooling: 0 };
workspaces.forEach((w) => breakdown[w.type]++);

console.log(
  JSON.stringify(
    {
      workspaces: workspaces.length,
      breakdown,
      bun: bunWs.length,
      turbo: turboCount,
      tsRefs,
      maxLines,
      issues,
    },
    null,
    2,
  ),
);
