module.exports = {
  parser: "@typescript-eslint/parser",
  env: {
    browser: true,
    node: true
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ],
  plugins: ["@typescript-eslint", "react-hooks"],
  ignorePatterns: ["lib/*"],
  rules: {
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "error",
    "no-console": "error",
    "no-unused-vars": "error"
  }
};
