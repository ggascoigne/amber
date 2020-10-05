module.exports = {
  // when changing this, remember that you can run `yarn eslint --print-config <filename>` to print
  // the existing used config for that path
  extends: [
    'react-app',
    // enable typescript support
    'plugin:@typescript-eslint/recommended',
    // now disable all of the rules that are in conflict with prettier
    'prettier/@typescript-eslint',
    // note that we don't add the prettier rules, they add noise to the IDE
    // and the code is all being formatted on commit anyway.
  ],
  rules: {
    'arrow-body-style': 'warn',
    'dot-notation': 'warn',
    'no-var': 'error',
    'no-debugger': 'error',
    'no-duplicate-imports': 'error',
    'object-shorthand': 'warn',
    'prefer-arrow-callback': 'warn',
    'prefer-const': 'warn',
    'no-use-before-define': 'off',
    // enforce consistent jsx attributes
    'react/jsx-curly-brace-presence': ['warn', 'never'],
    'react/jsx-boolean-value': 'warn',
    'react/jsx-fragments': 'warn',
    'react/jsx-key': ['warn', { checkFragmentShorthand: true }],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
  },
  overrides: [
    {
      files: '*.{js,jsx}',
      rules: {
        // this should just be fixed
        '@typescript-eslint/no-unused-vars': 'off',
        // opinion: this is reasonable to disable
        '@typescript-eslint/no-use-before-define': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
      },
    },
    {
      files: '*.{ts,tsx}',
      rules: {
        // disabled because it conflicts with jsx-a11y/alt-text
        'jsx-a11y/img-redundant-alt': 'off',
        // changed to match the default tsconfig
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unused-vars': ['off'],
        // currently this throws far too many false positives - re-enable this once it's working again
        //   'warn',
        //   {
        //     args: 'none',
        //     ignoreRestSiblings: true,
        //     // above this line if the default config for this rule, below are my adds
        //     varsIgnorePattern: '_',
        //   },
        // ],
        '@typescript-eslint/explicit-member-accessibility': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/prefer-interface': 'off',
        '@typescript-eslint/no-empty-interface': [
          'error',
          {
            allowSingleExtends: true,
          },
        ],
        '@typescript-eslint/no-angle-bracket-type-assertion': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
      },
    },
    {
      files: '{api,scripts,shared}/*.{ts,tsx}',
      rules: {
        // this is node.js code, it needs require
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
    {
      files: 'support/**/*.js',
      rules: {
        '@typescript-eslint/no-empty-function': 'off',
      },
    },
  ],
}
