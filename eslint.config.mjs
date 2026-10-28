import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  // Global ignores must come first in ESLint 9 flat config so it ignores before any plugin processing
  globalIgnores([
    ".next/**",
    ".firebase/**",
    "node_modules/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "scripts/**",
    "public/**",
  ]),
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }],
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/purity": "off",
      "@next/next/no-location-assign-relative-destination": "warn",
    },
  },
]);

export default eslintConfig;
