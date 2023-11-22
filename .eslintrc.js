module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["standard", "prettier"],
  ignorePatterns: ["**/assets/*.js", "**/vendor/*.js"],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {},
  globals: {
    Shopify: true,
    $: true,
    theme: true,
  },
  overrides: [
    {
      extends: [
        "eslint:recommended",
        "standard",
        "prettier",
        "plugin:@typescript-eslint/recommended",
      ],
      files: ["*.ts", "*.tsx"],
      parser: "@typescript-eslint/parser",
      plugins: ["@typescript-eslint"],
    },
  ],
};
