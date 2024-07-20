import globals from "globals";
import pluginJs from "@eslint/js";
import pluginPrettier from "eslint-plugin-prettier";
import configPrettier from "eslint-config-prettier";

export default [
  {
    languageOptions: { globals: globals.node }, // Use globals.node for Node.js
    parserOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
    },
  },
  pluginJs.configs.recommended,
  {
    plugins: [pluginPrettier],
    extends: ["eslint:recommended", "plugin:prettier/recommended", "prettier"],
    rules: {
      "prettier/prettier": "error", // Show Prettier issues as ESLint errors
    },
  },
];
