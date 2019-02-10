import { AboutAmberconNw, CallbackPage, GraphiQLPage, Lookups, PastConsGamesPage, PastConsPage, Welcome } from 'pages'
import PropTypes from 'prop-types'

const { shape, arrayOf } = PropTypes

// note that entries are only displayed if they have a label

export const rootRoutes = [
  {
    path: '/',
    label: 'Welcome',
    subText: 'Introduction',
    exact: true,
    component: Welcome
  },
  {
    path: '/aboutacnw',
    label: 'AmberCon NW',
    subText: 'What you get and what it costs',
    exact: false,
    component: AboutAmberconNw
  },
  {
    path: '/aboutedge',
    label: 'Accommodations',
    subText: 'McMenamins Edgefield, the site that makes ACNW unique',
    exact: false,
    component: AboutAmberconNw
  },
  {
    path: '/pastCons/:year/:slot?/:game?',
    link: '/pastCons',
    exact: false,
    component: PastConsGamesPage
  },
  {
    path: '/pastCons',
    label: 'Past Cons',
    exact: true,
    component: PastConsPage
  },
  {
    path: '/lookups',
    label: 'Lookups',
    exact: true,
    component: Lookups
  },
  {
    path: '/graphiql',
    label: 'GraphiQL',
    subText: 'Dynamically query the ACNW database',
    exact: false,
    component: GraphiQLPage,
    permission: 'graphiql:load'
  },
  {
    path: '/callback',
    exact: true,
    component: CallbackPage
  }
]

export const menuDataType = arrayOf(
  shape({
    path: PropTypes.string.isRequired,
    link: PropTypes.string,
    label: PropTypes.string,
    subText: PropTypes.string,
    exact: PropTypes.bool.isRequired,
    component: PropTypes.func.isRequired
  })
)
