import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

const workspaces = [
  { dir: 'packages/config', name: '@campusos/config', description: 'Shared configuration utilities' },
  { dir: 'packages/common', name: '@campusos/common', description: 'Shared types and utilities' },
  { dir: 'packages/events', name: '@campusos/events', description: 'Event schemas and envelope' },
  { dir: 'packages/auth', name: '@campusos/auth', description: 'Authentication utilities' },
  { dir: 'packages/i18n', name: '@campusos/i18n', description: 'Internationalization' },
  { dir: 'packages/api-client', name: '@campusos/api-client', description: 'Generated API SDK' },
  { dir: 'packages/database', name: '@campusos/database', description: 'Prisma shared utilities' },
  { dir: 'packages/proto', name: '@campusos/proto', description: 'gRPC proto definitions' },
  { dir: 'packages/testing', name: '@campusos/testing', description: 'Test utilities and factories' },
  { dir: 'packages/ui', name: '@campusos/ui', description: 'Design system components' },
  { dir: 'apps/web', name: '@campusos/web', description: 'Next.js primary web application' },
  { dir: 'apps/admin', name: '@campusos/admin', description: 'Admin console' },
  { dir: 'apps/cms', name: '@campusos/cms', description: 'Public CMS application' },
  { dir: 'apps/mobile', name: '@campusos/mobile', description: 'React Native mobile application' },
  { dir: 'apps/api-gateway', name: '@campusos/api-gateway', description: 'Kong API gateway configuration' },
  { dir: 'services/identity', name: '@campusos/identity-service', description: 'IdentityOS service' },
  { dir: 'services/tenant', name: '@campusos/tenant-service', description: 'TenantOS service' },
  { dir: 'services/communicate', name: '@campusos/communicate-service', description: 'CommunicateOS service' },
  { dir: 'services/content', name: '@campusos/content-service', description: 'ContentOS service' },
  { dir: 'services/trust', name: '@campusos/trust-service', description: 'TrustOS service' },
  { dir: 'services/platform', name: '@campusos/platform-service', description: 'PlatformOS service' },
  { dir: 'services/insight', name: '@campusos/insight-service', description: 'InsightOS service' },
  { dir: 'services/search', name: '@campusos/search-service', description: 'SearchOS service' },
  { dir: 'services/web', name: '@campusos/web-service', description: 'WebOS CMS service' },
  { dir: 'services/ai-gateway', name: '@campusos/ai-gateway-service', description: 'AI Gateway service' },
];

async function ensureDir(path) {
  await mkdir(path, { recursive: true });
}

function workspacePackageJson(ws) {
  return {
    name: ws.name,
    version: '0.0.0',
    private: true,
    description: ws.description,
    license: 'UNLICENSED',
    type: 'module',
    main: './dist/index.js',
    types: './dist/index.d.ts',
    exports: { '.': { types: './dist/index.d.ts', import: './dist/index.js' } },
    scripts: {
      build: 'tsc -b',
      lint: 'eslint src --max-warnings 0',
      'lint:fix': 'eslint src --fix --max-warnings 0',
      typecheck: 'tsc -b --emitDeclarationOnly false --noEmit',
      test: 'node --input-type=module -e "process.exit(0)"',
      clean: 'rimraf dist tsconfig.tsbuildinfo',
    },
    devDependencies: {
      '@campusos/eslint-config': 'workspace:*',
      '@campusos/typescript-config': 'workspace:*',
      eslint: '^9.22.0',
      rimraf: '^6.0.1',
      typescript: '^5.8.2',
    },
  };
}

const rootPackage = {
  name: 'campusos-platform',
  version: '0.0.0',
  private: true,
  description: 'CampusOS - The Intelligent University Operating System',
  license: 'UNLICENSED',
  author: 'CampusOS Engineering',
  repository: {
    type: 'git',
    url: 'https://github.com/campusos/campusos-platform.git',
  },
  workspaces: ['apps/*', 'services/*', 'packages/*', 'tooling/*'],
  scripts: {
    build: 'turbo run build',
    dev: 'turbo run dev',
    lint: 'turbo run lint',
    'lint:fix': 'turbo run lint:fix',
    typecheck: 'turbo run typecheck',
    test: 'turbo run test',
    format: 'prettier --write "**/*.{ts,tsx,js,jsx,json,md,yml,yaml}"',
    'format:check': 'prettier --check "**/*.{ts,tsx,js,jsx,json,md,yml,yaml}"',
    clean: 'turbo run clean && rimraf node_modules',
    changeset: 'changeset',
    'version-packages': 'changeset version',
    release: 'turbo run build && changeset publish',
    prepare: 'husky',
    validate: 'turbo run lint typecheck build test && bun run format:check',
    'validate:ci': 'turbo run lint typecheck build test',
  },
  devDependencies: {
    '@campusos/eslint-config': 'workspace:*',
    '@changesets/changelog-github': '^0.5.1',
    '@changesets/cli': '^2.29.0',
    '@commitlint/cli': '^19.8.0',
    '@commitlint/config-conventional': '^19.8.0',
    '@types/node': '^22.13.10',
    eslint: '^9.22.0',
    husky: '^9.1.7',
    'lint-staged': '^15.4.3',
    prettier: '^3.5.3',
    rimraf: '^6.0.1',
    turbo: '^2.4.4',
    typescript: '^5.8.2',
  },
  packageManager: 'bun@1.2.4',
  engines: { node: '>=22.0.0', bun: '>=1.2.0' },
  'lint-staged': {
    '*.{ts,tsx,js,jsx}': ['eslint --fix --max-warnings 0', 'prettier --write'],
    '*.{json,md,yml,yaml}': ['prettier --write'],
  },
};

const toolingTypescriptConfig = {
  name: '@campusos/typescript-config',
  version: '0.0.0',
  private: true,
  description: 'Shared TypeScript configuration for CampusOS',
  license: 'UNLICENSED',
  type: 'module',
  exports: {
    './base.json': './base.json',
    './node.json': './node.json',
  },
  scripts: {
    build: 'tsc -b',
    lint: 'eslint src --max-warnings 0',
    'lint:fix': 'eslint src --fix --max-warnings 0',
    typecheck: 'tsc -b --emitDeclarationOnly false --noEmit',
    test: 'node --input-type=module -e "process.exit(0)"',
    clean: 'rimraf dist tsconfig.tsbuildinfo',
  },
  devDependencies: {
    '@campusos/eslint-config': 'workspace:*',
    eslint: '^9.22.0',
    rimraf: '^6.0.1',
    typescript: '^5.8.2',
  },
};

const toolingEslintConfig = {
  name: '@campusos/eslint-config',
  version: '0.0.0',
  private: true,
  description: 'Constitutional ESLint configuration for CampusOS (CEC §2.8)',
  license: 'UNLICENSED',
  type: 'module',
  main: './index.js',
  exports: { '.': './index.js' },
  scripts: {
    build: 'node --input-type=module -e "process.exit(0)"',
    lint: 'node --input-type=module -e "process.exit(0)"',
    'lint:fix': 'node --input-type=module -e "process.exit(0)"',
    typecheck: 'node --input-type=module -e "process.exit(0)"',
    test: 'node --input-type=module -e "process.exit(0)"',
    clean: 'node --input-type=module -e "process.exit(0)"',
  },
  dependencies: {
    '@eslint/js': '^9.22.0',
    'eslint-plugin-import': '^2.31.0',
    globals: '^16.0.0',
    'typescript-eslint': '^8.26.1',
  },
  devDependencies: {
    eslint: '^9.22.0',
    typescript: '^5.8.2',
  },
};

const tsconfigWorkspace = {
  extends: '@campusos/typescript-config/node.json',
  compilerOptions: { composite: true, outDir: 'dist', rootDir: 'src' },
  include: ['src/**/*.ts'],
};

const tsconfigRoot = {
  files: [],
  references: [
    { path: './tooling/typescript-config' },
    { path: './tooling/eslint-config' },
    ...workspaces.map((ws) => ({ path: `./${ws.dir}` })),
  ],
};

const placeholderDirs = [
  'infra/terraform/modules',
  'infra/terraform/environments/dev',
  'infra/terraform/environments/staging',
  'infra/terraform/environments/production',
  'infra/kubernetes/charts',
  'infra/kubernetes/overlays',
  'infra/docker',
  'deploy/helm',
  'deploy/argocd',
  'docs/constitution',
  'docs/architecture/adr',
  'docs/api',
  'docs/runbooks',
  'scripts/seed',
  'scripts/migration',
  'tests/e2e',
  'tests/performance',
  'tests/contract',
  'tests/chaos',
  'examples/api-usage',
  'tooling/scripts',
];

async function writeJson(path, data) {
  await ensureDir(dirname(path));
  await writeFile(path, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

async function writeText(path, content) {
  await ensureDir(dirname(path));
  await writeFile(path, content, 'utf8');
}

async function convertUtf16Files() {
  async function walk(dir) {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name === 'node_modules' || entry.name === '.git') continue;
      const full = join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(full);
        continue;
      }
      const buf = await readFile(full);
      if (!buf.includes(0)) continue;
      const text = buf.toString('utf16le').replace(/^\uFEFF/, '');
      await writeFile(full, text, 'utf8');
      console.log(`Converted: ${full}`);
    }
  }
  await walk(ROOT);
}

async function main() {
  await convertUtf16Files();

  await writeJson(join(ROOT, 'package.json'), rootPackage);
  await writeJson(join(ROOT, 'tsconfig.json'), tsconfigRoot);
  await writeJson(join(ROOT, 'tooling/typescript-config/package.json'), toolingTypescriptConfig);
  await writeJson(join(ROOT, 'tooling/eslint-config/package.json'), toolingEslintConfig);

  for (const ws of workspaces) {
    const base = join(ROOT, ws.dir);
    await ensureDir(join(base, 'src'));
    await writeJson(join(base, 'package.json'), workspacePackageJson(ws));
    await writeJson(join(base, 'tsconfig.json'), tsconfigWorkspace);
    await writeText(
      join(base, 'src/index.ts'),
      '/** Genesis placeholder */\nexport const GENESIS_VERSION = \'0.0.0\' as const;\n',
    );
  }

  for (const dir of placeholderDirs) {
    await ensureDir(join(ROOT, dir));
    const readme = join(ROOT, dir, 'README.md');
    await writeText(readme, `# ${dir.split('/').pop()}\n\nGenesis placeholder per CEC §3.2.\n`);
  }

  await writeText(
    join(ROOT, 'CHANGELOG.md'),
    '# Changelog\n\nAll notable changes are documented via Changesets.\n',
  );

  await writeText(
    join(ROOT, '.husky/pre-commit'),
    '#!/usr/bin/env sh\n. "$(dirname -- "$0")/_/husky.sh"\n\nbunx lint-staged\n',
  );
  await writeText(
    join(ROOT, '.husky/commit-msg'),
    '#!/usr/bin/env sh\n. "$(dirname -- "$0")/_/husky.sh"\n\nbunx commitlint --edit "$1"\n',
  );

  await writeText(
    join(ROOT, 'commitlint.config.js'),
    "export default { extends: ['@commitlint/config-conventional'] };\n",
  );

  console.log(`Fixed encoding and regenerated ${workspaces.length} workspaces.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
