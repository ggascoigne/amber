const rulesDirPlugin = require('eslint-plugin-rulesdir')

rulesDirPlugin.RULES_DIR = 'eslint-rules'

module.exports = {
  plugins: ['rulesdir'],
  // when changing this, remember that you can run `pnpm eslint --print-config <filename>` to print
  // the existing used config for that path
  extends: '@ggascoigne/eslint-config/ts',
  parserOptions: {
    project: `./tsconfig.json`,
  },
  rules: {
    'rulesdir/no-promise-all': 'error',
    'no-console': 'off',
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
