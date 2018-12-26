import AboutAmberconNw from 'pages/AboutAmberconNw'
import CallbackPage from 'pages/CallbackPage'
import { GraphiQLPage } from 'pages/GraphiQLPage'
import Welcome from 'pages/Welcome'
import PropTypes from 'prop-types'

const { shape, arrayOf } = PropTypes

export const menuData = [
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
    label: PropTypes.string,
    subText: PropTypes.string,
    exact: PropTypes.bool.isRequired,
    component: PropTypes.func.isRequired
  })
)
