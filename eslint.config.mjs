// eslint.config.mjs — config d'audit sécurité (ESLint 9 flat config)
import security from "eslint-plugin-security";
import react from "eslint-plugin-react";
import tseslint from "typescript-eslint";

export default [
  // 1) on n'analyse pas les dossiers générés
  {
    ignores: ["node_modules/**", ".next/**", "next-env.d.ts"],
  },

  // 2) règles JS de base
  ...tseslint.configs.recommended,

  // 3) le plugin sécurité sur tout le code TS/TSX
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: { security, react },
    rules: {
      // active les règles "sécurité"
      ...security.configs.recommended.rules,
      // 🚨 la règle clé : interdit dangerouslySetInnerHTML
      "react/no-danger": "error",
    },
  },
];