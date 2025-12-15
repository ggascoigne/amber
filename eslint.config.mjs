import { configs } from '@ggascoigne/eslint-config'
// import oxlint from 'eslint-plugin-oxlint'

const globalIgnores = [
  {
    name: '@ambercon/global-ignores',
    ignores: [
      'apps/*/.{next,vercel}',
      'packages/server/src/generated',
      'apps/*/next-env.d.ts',
      'apps/ui-test/src/shims/side-channel.cjs',
    ],
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
    name: 'allow-default-project-for-config-files',
    files: ['scripts/*.ts', 'scripts/*.mts', 'scripts/*.cts'],
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ['scripts/*.ts', 'scripts/*.mts', 'scripts/*.cts'],
        },
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
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
  // oxlint is very cool, but doesn't have a good replacement for the import/order rule
  // when it does I think that we can swap over to it.
  // this chunk allows us to disable all rules provided by oxlint and see what's left
  // ...oxlint.buildFromOxlintConfigFile('./.oxlintrc.json'),
  // {
  //   name: 'disable-unused-directives-warnings',
  //   linterOptions: {
  //     reportUnusedDisableDirectives: false
  //   }
  // }
]
