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
  ignores: ['node_modules/', 'dist/', 'build/'], // Use ignores property instead of .eslintignore
};

module.exports = config;