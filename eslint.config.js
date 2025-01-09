/** @type {import('eslint').Linter.Config} */
const config = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  rules: {
    // Add any custom rules here
  },
  ignores: ['node_modules/', 'dist/', 'build/'], // This is fine
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/no-unused-vars': 'warn',
        // Add any specific rules for TypeScript files here
      },
    },
  ],
};

export default config; // Use export default instead of module.exports