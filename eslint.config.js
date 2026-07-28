// @ts-check
import tseslint from '@typescript-eslint/eslint-plugin'
import tsparser from '@typescript-eslint/parser'
import prettierConfig from 'eslint-config-prettier'

/** @type {import("eslint").Linter.Config[]} */
export default [
  {
    ignores: [
      '**/dist/**',
      '**/build/**',
      '**/node_modules/**',
      'packages/site/**',
      'packages/codemods/**',
    ],
  },
  // Source files — use each package's tsconfig.json (project: true)
  {
    files: ['**/*.ts', '**/*.tsx'],
    ignores: ['**/tsup.config.ts', '**/vitest.config.ts'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        project: true,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
    },
  },
  // Build / test config files — use the dedicated tsconfig.node.json
  {
    files: ['**/tsup.config.ts', '**/vitest.config.ts'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        project: ['./packages/theme/tsconfig.node.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
    },
  },
  prettierConfig,
]
