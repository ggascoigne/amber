module.exports = {
  root: true,
  extends: ['custom'],
  parserOptions: {
    project: ['./tsconfig.json'],
  },
  overrides: [
    {
      files: '*.{ts,tsx}',
      rules: {
        // this is node.js code, it needs require
        '@typescript-eslint/no-var-requires': 'off',
        'import/no-extraneous-dependencies': 'off',
        'no-console': 'off',
      },
    },
    {
      files: '*.{js,cjs}',
      parserOptions: {
        ecmaVersion: 2020,
      },
      rules: {
        // this is node.js code, it needs require
        'import/no-extraneous-dependencies': 'off',
        'no-console': 'off',
        'func-names': 'off',
        'no-empty-function': 'off',
      },
    },
  ],
}
