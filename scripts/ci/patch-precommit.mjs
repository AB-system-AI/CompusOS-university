import { readFileSync, writeFileSync } from 'node:fs';

const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
pkg['lint-staged']['*.{ts,tsx,js,jsx}'] = [
  'eslint --fix --max-warnings 0 --no-warn-ignored',
  'prettier --write',
];
writeFileSync('package.json', `${JSON.stringify(pkg, null, 2)}\n`, 'utf8');

let eslintConfig = readFileSync('tooling/eslint-config/index.js', 'utf8');
eslintConfig = eslintConfig.replace(/      'commitlint\.config\.js',\n/, '');
if (!eslintConfig.includes("'commitlint.config.js'")) {
  eslintConfig = eslintConfig.replace(
    "files: ['**/eslint.config.js', 'tooling/eslint-config/**'],",
    "files: ['**/eslint.config.js', 'commitlint.config.js', 'tooling/eslint-config/**'],",
  );
}
writeFileSync('tooling/eslint-config/index.js', eslintConfig, 'utf8');

console.log('Patched lint-staged and eslint-config for pre-commit.');
