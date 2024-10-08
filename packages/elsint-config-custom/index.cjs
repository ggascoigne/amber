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
}
