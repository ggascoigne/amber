import { configs } from '@ggascoigne/eslint-config'

const globalIgnores = [
  {
    name: '@ambercon/global-ignores',
    ignores: ['apps/*/.{next,vercel}', 'packages/server/src/generated'],
  },
]

// eslint-disable-next-line import/no-anonymous-default-export
export default [
  ...configs.globalIgnores,
  ...globalIgnores,
  ...configs.recommendedJs,
  // ...configs.slow,
  ...configs.officialReact,
  ...configs.react,
  ...configs.recommendedTs,
  {
    name: 'local overrides',
    rules: {
      'no-console': ['off'],
      '@typescript-eslint/no-empty-function': 'off',
    },
  },
  {
    files: ['support/**/*.js'],
    rules: {
      '@typescript-eslint/no-empty-function': 'off',
      'func-names': 'off',
    },
  },
  {
    files: ['**/*.test.ts'],
    rules: { 'import/no-extraneous-dependencies': 'off' },
  },
]
