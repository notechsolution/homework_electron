/**
 * @type {import('eslint').Linter.Config}
 */
module.exports = {
  env: {
    es2021: true,
    browser: true,
    node: true
  },
  extends: [
    'plugin:vue/essential',
    'standard'
  ],
  globals: {
    __static: true,
    __windowUrls: true,
    __preloads: true,
    __workers: true,
    NodeJS: true
  },
  parserOptions: {
    ecmaVersion: 12,
    parser: '@typescript-eslint/parser',
    sourceType: 'module'
  },
  plugins: [
    'vue',
    '@typescript-eslint'
  ],
  rules: {
    'space-before-function-paren': 0,
    'vue/no-multiple-template-root': 0,
    'import/no-absolute-path': 0,
    semi: 0,
    'no-tabs': 0,
    indent: 0,
    'no-mixed-spaces-and-tabs': 0
  },
  ignorePatterns: [
    'node_modules/**',
    'dist/**'
  ]
}
