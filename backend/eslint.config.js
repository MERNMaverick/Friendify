const { defineConfig } = require('eslint');
const pluginJs = require('@eslint/js');
const pluginPrettier = require('eslint-plugin-prettier');

module.exports = defineConfig({
  languageOptions: {
    globals: {
      ...require('globals').node,
    },
    parserOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
    },
  },
  extends: [
    'eslint:recommended',
    'plugin:prettier/recommended',
    'prettier',
  ],
  plugins: [pluginPrettier],
  rules: {
    'prettier/prettier': 'error',
  },
});
