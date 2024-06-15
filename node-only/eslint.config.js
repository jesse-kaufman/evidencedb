import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

const config = [
  { ignores: ["**/node_modules/*", "**/public/js/*"] },
  {
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      "no-await-in-loop": "error",
      "no-duplicate-imports": "error",
      "no-inner-declarations": "error",
      "no-self-compare": "error",
      "no-template-curly-in-string": "error",
      "no-unmodified-loop-condition": "error",
      "no-unreachable-loop": "error",
      "no-use-before-define": "warn",
      "require-atomic-updates": "warn",
      "capitalized-comments": ["warn", "always"],
      camelcase: "warn",
    },
  },
];

export default config;
