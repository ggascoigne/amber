import PgOrderByRelatedPlugin from '@graphile-contrib/pg-order-by-related'
import PgSimplifyInflectorPlugin from '@graphile-contrib/pg-simplify-inflector'
import ConnectionFilterPlugin from 'postgraphile-plugin-connection-filter'

import _acnwReadCache from './acnw/postgraphileCache.json'
import _acusReadCache from './acus/postgraphileCache.json'
import { PgSmallNumericToFloatPlugin } from './postgraphilePlugins/PgSmallNumericToFloatPlugin'

export const options = {
  dynamicJson: true,
  cors: false,
  graphiql: false,
  graphqlRoute: '/api/graphql',
  absoluteRoutes: false,
  disableQueryLog: process.env.NODE_ENV === 'production',
  enableCors: false,
  ignoreRBAC: false,
  showErrorStack: false,
  watchPg: false,
  appendPlugins: [
    PgSimplifyInflectorPlugin,
    ConnectionFilterPlugin,
    PgOrderByRelatedPlugin,
    PgSmallNumericToFloatPlugin,
  ],
}

export const acnwReadCache = _acnwReadCache
export const acusReadCache = _acusReadCache
