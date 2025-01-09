module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
    },
    plugins: ['@typescript-eslint'],
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
    ],
    env: {
      browser: true,
      es2021: true,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn'],
      // Add any other rules you want to enforce for the client
    },
  };