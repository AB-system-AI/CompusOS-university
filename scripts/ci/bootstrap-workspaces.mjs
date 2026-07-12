import { mkdir, writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const workspaces = [
  { dir: "packages/config", name: "@campusos/config", description: "Shared configuration utilities" },
  { dir: "packages/common", name: "@campusos/common", description: "Shared types and utilities" },
  { dir: "packages/events", name: "@campusos/events", description: "Event schemas and envelope" },
  { dir: "packages/auth", name: "@campusos/auth", description: "Authentication utilities" },
  { dir: "packages/i18n", name: "@campusos/i18n", description: "Internationalization" },
  { dir: "packages/api-client", name: "@campusos/api-client", description: "Generated API SDK" },
  { dir: "packages/database", name: "@campusos/database", description: "Prisma shared utilities" },
  { dir: "packages/proto", name: "@campusos/proto", description: "gRPC proto definitions" },
  { dir: "packages/testing", name: "@campusos/testing", description: "Test utilities and factories" },
  { dir: "packages/ui", name: "@campusos/ui", description: "Design system components" },
  { dir: "apps/web", name: "@campusos/web", description: "Next.js primary web application" },
  { dir: "apps/admin", name: "@campusos/admin", description: "Admin console" },
  { dir: "apps/cms", name: "@campusos/cms", description: "Public CMS application" },
  { dir: "apps/mobile", name: "@campusos/mobile", description: "React Native mobile application" },
  { dir: "apps/api-gateway", name: "@campusos/api-gateway", description: "Kong API gateway configuration" },
  { dir: "services/identity", name: "@campusos/identity-service", description: "IdentityOS service" },
  { dir: "services/tenant", name: "@campusos/tenant-service", description: "TenantOS service" },
  { dir: "services/communicate", name: "@campusos/communicate-service", description: "CommunicateOS service" },
  { dir: "services/content", name: "@campusos/content-service", description: "ContentOS service" },
  { dir: "services/trust", name: "@campusos/trust-service", description: "TrustOS service" },
  { dir: "services/platform", name: "@campusos/platform-service", description: "PlatformOS service" },
  { dir: "services/insight", name: "@campusos/insight-service", description: "InsightOS service" },
  { dir: "services/search", name: "@campusos/search-service", description: "SearchOS service" },
  { dir: "services/web", name: "@campusos/web-service", description: "WebOS CMS service" },
];
for (const ws of workspaces) {
  const base = join(ROOT, ws.dir);
  await mkdir(join(base, "src"), { recursive: true });
  const pkg = {
    name: ws.name,
    version: "0.0.0",
    private: true,
    description: ws.description,
    license: "UNLICENSED",
    type: "module",
    main: "./dist/index.js",
    types: "./dist/index.d.ts",
    exports: { ".": { types: "./dist/index.d.ts", import: "./dist/index.js" } },
    scripts: {
      build: "tsc -b",
      lint: "eslint src --max-warnings 0",
      "lint:fix": "eslint src --fix --max-warnings 0",
      typecheck: "tsc -b --emitDeclarationOnly false --noEmit",
      test: 'node --input-type=module -e "process.exit(0)"',
      clean: "rimraf dist tsconfig.tsbuildinfo",
    },
    devDependencies: {
      "@campusos/eslint-config": "workspace:*",
      "@campusos/typescript-config": "workspace:*",
      eslint: "^9.22.0",
      rimraf: "^6.0.1",
      typescript: "^5.8.2",
    },
  };
  await writeFile(join(base, "package.json"), JSON.stringify(pkg, null, 2));
  await writeFile(
    join(base, "tsconfig.json"),
    JSON.stringify(
      {
        extends: "@campusos/typescript-config/node.json",
        compilerOptions: { composite: true, outDir: "dist", rootDir: "src" },
        include: ["src/**/*.ts"],
      },
      null,
      2,
    ),
  );
  await writeFile(
    join(base, "src", "index.ts"),
    "/** Genesis placeholder */\nexport const GENESIS_VERSION = '0.0.0' as const;\n",
  );
}
console.log("Bootstrapped", workspaces.length, "workspaces");