import campusosEslintConfig from '@campusos/eslint-config';

/** @type {import('eslint').Linter.Config[]} */
export default [
  ...campusosEslintConfig,
  {
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
];
