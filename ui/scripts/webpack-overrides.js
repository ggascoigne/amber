'use strict'

var path = require('path')

module.exports = function mutateWebpack (config) {
  const configToInject = require(path.resolve(__dirname, '..', 'postcss.config').replace(/\\/g, '/'))()
  const cssRule = config.module.rules[1].oneOf.find((r) => (new RegExp(r.test).toString() === '/\\.css$/'))

  // in create-react-app 1.x th webpack 2 config is fairly different between dev and production.

  // in dev we start with:
  //
  // {
  //   test: /\.css$/,
  //   use: [
  //     require.resolve('style-loader'),
  //     {
  //       loader: require.resolve('css-loader'),
  //       options: {
  //         importLoaders: 1,
  //       },
  //     },
  //     {
  //       loader: require.resolve('postcss-loader'),
  //       options: {
  //         // Necessary for external CSS imports to work
  //         // https://github.com/facebookincubator/create-react-app/issues/2677
  //         ident: 'postcss',
  //         plugins: () => [
  //           require('postcss-flexbugs-fixes'),
  //           autoprefixer({
  //             browsers: [
  //               '>1%',
  //               'last 4 versions',
  //               'Firefox ESR',
  //               'not ie < 9', // React doesn't support IE8 anyway
  //             ],
  //             flexbox: 'no-2009',
  //           }),
  //         ],
  //       },
  //     },
  //   ],
  // },
  //

  // in production we get:
  //
  // {
  //   test: /\.css$/,
  //   loader: ExtractTextPlugin.extract(
  //     Object.assign(
  //       {
  //         fallback: require.resolve('style-loader'),
  //         use: [
  //           {
  //             loader: require.resolve('css-loader'),
  //             options: {
  //               importLoaders: 1,
  //               minimize: true,
  //               sourceMap: true,
  //             },
  //           },
  //           {
  //             loader: require.resolve('postcss-loader'),
  //             options: {
  //               // Necessary for external CSS imports to work
  //               // https://github.com/facebookincubator/create-react-app/issues/2677
  //               ident: 'postcss',
  //               plugins: () => [
  //                 require('postcss-flexbugs-fixes'),
  //                 autoprefixer({
  //                   browsers: [
  //                     '>1%',
  //                     'last 4 versions',
  //                     'Firefox ESR',
  //                     'not ie < 9', // React doesn't support IE8 anyway
  //                   ],
  //                   flexbox: 'no-2009',
  //                 }),
  //               ],
  //             },
  //           },
  //         ],
  //       },
  //       extractTextPluginOptions
  //     )
  //   ),
  //   // Note: this won't work without `new ExtractTextPlugin()` in `plugins`.
  // },
  //
  // in both cases we edit the options block for the postcss-loader segment.

  // Note the huge comment is here to make tracking differences between the config this was last updated for
  // and whatever we need to upgrade to.

  if (cssRule.use) {
    cssRule.use[2].options = configToInject
  } else {
    cssRule.loader[3].options = configToInject
  }
  return config
}
