// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const js = require('@eslint/js');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');
const simpleImportSort = require('eslint-plugin-simple-import-sort');
const unusedImports = require('eslint-plugin-unused-imports');
const prettierConfig = require('eslint-config-prettier');
const globals = require('globals');
const reactHooks = require('eslint-plugin-react-hooks');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  { ignores: ['.expo', 'dist', 'node_modules', 'out', '*.config.js', '*.config.mjs', '*.config.cjs'] },
  js.configs.recommended,
  ...expoConfig,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
        ...globals.es2021,
        React: 'readonly',
        JSX: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      'simple-import-sort': simpleImportSort,
      'unused-imports': unusedImports,
      'react-hooks': reactHooks,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      'no-undef': 'off',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'unused-imports/no-unused-imports': 'error',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
  // Config files (Node)
  {
    files: ['*.config.js', '*.config.cjs', '*.config.mjs', 'scripts/**/*.js'],
    languageOptions: {
      globals: { ...globals.node },
    },
  },
  prettierConfig,
]);
