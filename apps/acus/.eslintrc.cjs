module.exports = {
  root: true,
  extends: ['custom'],
  parserOptions: {
    project: ['./tsconfig.json'],
  },
  overrides: [
    {
      files: '{api,scripts,shared}/*.{ts,tsx}',
      rules: {
        // this is node.js code, it needs require
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
    {
      files: 'scripts/*.{js,ts}',
      rules: {
        'no-console': 'off',
      },
    },
    {
      files: 'support/**/*.js',
      rules: {
        '@typescript-eslint/no-empty-function': 'off',
        'func-names': 'off',
      },
    },
  ],
}
