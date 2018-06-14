// note that this is designed to be injected into the create-react-app internal webpack.config
// see scripts/install.js and scripts/webpack-mods.js

module.exports = function () {
  return {
    // Necessary for external CSS imports to work
    // https://github.com/facebookincubator/create-react-app/issues/2677
    ident: 'postcss',
    plugins: () => [
      require('postcss-flexbugs-fixes'),
      require('postcss-import'), /* tw - add this */
      require('postcss-cssnext')({
        /* tw - replace autoprefixer with post-cssnext */
        browsers: [
          '>1%',
          'last 4 versions',
          'Firefox ESR',
          'not ie < 9', // React doesn't support IE8 anyway
        ],
        flexbox: 'no-2009',
      }),
    ],
  }
}
