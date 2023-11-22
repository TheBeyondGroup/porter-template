module.exports = {
  rules: {
    "at-rule-no-unknown": [
      true,
      {
        ignoreAtRules: ["tailwind"],
      },
    ],
  },
  extends: ["stylelint-config-standard"],
};
