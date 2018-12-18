import PropTypes from 'prop-types'
import React from 'react'
import { Header } from 'semantic-ui-react'
import AboutAmberconNw from './pages/AboutAmberconNw'
import Welcome from './pages/Welcome'
import CallbackPage from './pages/CallbackPage'

const { shape, arrayOf } = PropTypes

export const menuData = [
  {
    path: '/',
    content: (
      <>
        <Header inverted as='h4'>
          Welcome
        </Header>
        <p>Introduction</p>
      </>
    ),
    exact: true,
    component: Welcome
  },
  {
    path: '/aboutacnw',
    content: (
      <>
        <Header inverted as='h4'>
          AmberCon NW
        </Header>
        <p>What you get and what it costs</p>
      </>
    ),
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
