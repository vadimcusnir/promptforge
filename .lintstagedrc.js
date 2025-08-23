module.exports = {
  // TypeScript and JavaScript files
  '*.{js,jsx,ts,tsx}': [
    'eslint --fix',
    'eslint --config .eslintrc.security.js',
    'prettier --write',
  ],

  // JSON files
  '*.json': ['prettier --write'],

  // Markdown files
  '*.md': ['prettier --write'],

  // CSS files
  '*.{css,scss}': ['prettier --write'],

  // YAML files
  '*.{yml,yaml}': ['prettier --write'],

  // Package files - run audit after changes
  'package.json': ['npm audit --audit-level=moderate'],
  'pnpm-lock.yaml': ['npm audit --audit-level=moderate'],
};
