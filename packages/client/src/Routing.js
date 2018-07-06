import PropTypes from 'prop-types'
import React, { Fragment } from 'react'
import { Header } from 'semantic-ui-react'
import AboutAmberconNw from './pages/AboutAmberconNw'
import Welcome from './pages/Welcome'

const { shape, arrayOf } = PropTypes

export const menuData = [
  {
    path: '/',
    content: (
      <Fragment>
        <Header inverted as='h4'>
          Welcome
        </Header>
        <p>Introduction</p>
      </Fragment>
    ),
    exact: true,
    component: Welcome
  },
  {
    path: '/aboutacnw',
    content: (
      <Fragment>
        <Header inverted as='h4'>
          AmberCon NW
        </Header>
        <p>What you get and what it costs</p>
      </Fragment>
    ),
    exact: false,
    component: AboutAmberconNw
  }
]

export const menuDataType = arrayOf(
  shape({
    path: PropTypes.string.isRequired,
    content: PropTypes.node.isRequired,
    exact: PropTypes.bool.isRequired,
    component: PropTypes.func.isRequired
  })
)
