const js = require("@eslint/js");
const react = require("eslint-plugin-react");
const globals = require("globals");

module.exports = [
  { ignores: ["eslint.config.js", "**/build/"] },
  js.configs.recommended,
  react.configs.flat.recommended,

  {
    rules: {
      "no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "no-undef": "error",
      "react/prop-types": "off",
      "react/display-name": "off",
    },
    languageOptions: {
      sourceType: "module",
      globals: {
        ...globals.browser,
      },
    },
  },
];
