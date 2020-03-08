// BASE ESLINT RULES

module.exports = {
  env: {
    commonjs: true,
    jest: true,
    node: true,
    es6: true,
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: ['jest'],
  extends: 'eslint:recommended',
  rules: {
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single'],
    semi: ['error', 'never'],
    'jest/no-disabled-tests': 'warn',
    'jest/no-focused-tests': 'error',
    'jest/no-identical-title': 'error',
    'jest/prefer-to-have-length': 'warn',
    'jest/valid-expect': 'error',
    'no-unused-vars': ['error', { argsIgnorePattern: '^_.*$' }],
  },
}
