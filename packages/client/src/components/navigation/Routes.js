import PropTypes from 'prop-types'
import AboutAmberconNw from '../../pages/AboutAmberconNw'
import Welcome from '../../pages/Welcome'
import CallbackPage from '../../pages/CallbackPage'

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
    path: '/callback',
    exact: true,
    component: CallbackPage
  }
]

export const menuDataType = arrayOf(
  shape({
    path: PropTypes.string.isRequired,
    content: PropTypes.node,
    exact: PropTypes.bool.isRequired,
    component: PropTypes.func.isRequired
  })
)
