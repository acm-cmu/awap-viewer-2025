/** @type {import("eslint").Linter.Config} */
const config = {
  extends: ['plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
  env: {
    es2022: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: { project: true },
  plugins: ['@typescript-eslint', 'import'],
  rules: {
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    '@typescript-eslint/consistent-type-imports': [
      'warn',
      { prefer: 'type-imports', fixStyle: 'separate-type-imports' },
    ],
    '@typescript-eslint/no-misused-promises': [2, { checksVoidReturn: false }],
    'import/consistent-type-specifier-style': ['error', 'prefer-top-level'],
  },
  ignorePatterns: [
    '**/*.config.js',
    '**/*.config.cjs',
    '**/.eslint.config.cjs',
    '**/.next',
    '**/dist',
    '**/public',
    'pnpm-lock.yaml',
    'cdk.out/**/*',
  ],
  reportUnusedDisableDirectives: true,
};

module.exports = config
