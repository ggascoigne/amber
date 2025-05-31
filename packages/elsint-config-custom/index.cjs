module.exports = {
  // plugins: ['local'],
  // when changing this, remember that you can run `pnpm eslint --print-config <filename>` to print
  // the existing used config for that path
  extends: '@ggascoigne/eslint-config/ts',
  rules: {
    // 'local/no-promise-all': 'error',
    'no-console': 'off',
    'no-plusplus': 'off',
    // see https://www.totaltypescript.com/method-shorthand-syntax-considered-harmful
    '@typescript-eslint/method-signature-style': ['error', 'property'],
  },
  overrides: [
    {
      files: ['**/*.test.ts?(x)'],
      // parser: '@typescript-eslint/parser',
      // parserOptions: {
      //   ecmaVersion: 2018,
      //   sourceType: 'module',
      //   ecmaFeatures: {
      //     jsx: true,
      //   },
      // },
      // extends: ['airbnb-typescript', 'prettier'],
      rules: {
        'import/no-extraneous-dependencies': 0
      },
    },
  ],
}
