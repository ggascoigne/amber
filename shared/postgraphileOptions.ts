const PgSimplifyInflectorPlugin = require('@graphile-contrib/pg-simplify-inflector')
const ConnectionFilterPlugin = require('postgraphile-plugin-connection-filter')
const PgOrderByRelatedPlugin = require('@graphile-contrib/pg-order-by-related')

export const options = {
  dynamicJson: true,
  cors: false,
  graphiql: false,
  graphqlRoute: '/api/graphql',
  // externalUrlBase: `/${process.env.AWS_STAGE}`,
  absoluteRoutes: false,
  disableQueryLog: process.env.NODE_ENV === 'production',
  enableCors: false,
  ignoreRBAC: false,
  showErrorStack: false,
  watchPg: false,
  appendPlugins: [PgSimplifyInflectorPlugin, ConnectionFilterPlugin, PgOrderByRelatedPlugin],
}
