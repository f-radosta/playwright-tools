import eslint from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import playwrightPlugin from 'eslint-plugin-playwright';
import globals from 'globals';

// Shared globals for all TypeScript files
const sharedGlobals = {
  ...globals.node,
  ...globals.browser,
  console: 'readonly',
  page: 'readonly',
  browser: 'readonly',
  context: 'readonly',
  expect: 'readonly',
};

// Shared rules for all TypeScript files
const sharedRules = {
  '@typescript-eslint/explicit-module-boundary-types': 'off',
  '@typescript-eslint/no-explicit-any': 'warn',
  '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
  'no-undef': 'off', // TypeScript already checks this
  'no-unused-vars': 'off', // TypeScript already checks this
  ...playwrightPlugin.configs.recommended.rules,
};

export default [
  eslint.configs.recommended,
  // Configuration for test files (inside the tests directory)
  {
    files: ['tests/**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        project: ['./tsconfig.json'],
        tsconfigRootDir: '.',
      },
      globals: sharedGlobals,
    },
    plugins: {
      '@typescript-eslint': tseslint,
      'playwright': playwrightPlugin,
    },
    rules: {
      ...sharedRules,
      '@typescript-eslint/no-floating-promises': 'error', // Type-aware rule for test files
    },
  },
  // Configuration for other TypeScript files (outside the tests directory)
  {
    files: ['**/*.ts'],
    ignores: ['tests/**/*.ts'], // Exclude test files which are handled by the previous config
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
      },
      globals: sharedGlobals,
    },
    plugins: {
      '@typescript-eslint': tseslint,
      'playwright': playwrightPlugin,
    },
    rules: sharedRules, // No type-aware rules for non-test files
  },
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      '.playwright/**',
      'test-results/**',
      'playwright-report/**',
    ],
  },
];
