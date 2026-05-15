import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      ".eslintrc.cjs",
      "postcss.config.js",
      "tailwind.config.js",
      "vite.config.ts",
      "vitest.config.ts",
      "cypress/**",
      "cypress.config.ts",
      "src/api/**",
      "src/composable/**",
      "src/helpers/**",
      "src/locales/**",
      "src/main.ts",
      "src/router/**",
      "src/services/**",
      "src/stores/**",
      "src/views/**",
      "src/components/__tests__/**",
      "src/App.vue",
    ],
  },
];

export default eslintConfig;
