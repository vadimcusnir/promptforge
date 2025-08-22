module.exports = {
  rules: {
    // UI Overlay Policy Guardrails
    "no-restricted-syntax": [
      "error",
      {
        selector:
          'CallExpression[callee.property.name="querySelector"][arguments.0.value="#bg-overlay"]',
        message:
          "Direct DOM manipulation of #bg-overlay is forbidden. Use OverlayController or quote-focus system instead.",
      },
      {
        selector:
          'CallExpression[callee.property.name="querySelectorAll"][arguments.0.value*="bg-overlay"]',
        message:
          "Direct DOM manipulation of #bg-overlay is forbidden. Use OverlayController or quote-focus system instead.",
      },
      {
        selector:
          'CallExpression[callee.property.name="getElementById"][arguments.0.value="bg-overlay"]',
        message:
          "Direct DOM manipulation of #bg-overlay is forbidden. Use OverlayController or quote-focus system instead.",
      },
      {
        selector:
          'MemberExpression[object.name="document"][property.name="getElementById"] + [arguments.0.value="bg-overlay"]',
        message:
          "Direct DOM manipulation of #bg-overlay is forbidden. Use OverlayController or quote-focus system instead.",
      },
    ],
    "no-console": [
      "error",
      {
        allow: ["warn", "error"],
      },
    ],
  },
  overrides: [
    {
      // Allow DOM manipulation only in approved files
      files: [
        "components/OverlayController.tsx",
        "lib/quote-focus.tsx",
        "tests/**/*.spec.ts",
      ],
      rules: {
        "no-restricted-syntax": "off",
      },
    },
    {
      // Allow console.log in development files
      files: ["components/OverlayController.tsx", "lib/quote-focus.tsx"],
      rules: {
        "no-console": [
          "error",
          {
            allow: ["warn", "error", "log"],
          },
        ],
      },
    },
  ],
};
