import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Menu, Responsive, Segment, Sidebar, Sticky } from 'semantic-ui-react'
import LoginMenu from '../LoginMenu'
import './navigation.scss'

export default class DesktopContainer extends Component {
  render () {
    const { children, menu } = this.props

    return (
      <Responsive className='desktop_container' minWidth={Responsive.onlyTablet.minWidth}>
        <Sticky>
          <Segment className='desktop_container__topbar' inverted vertical>
            <LoginMenu />
          </Segment>

          <Sidebar className='desktop_container__sidebar' as={Menu} inverted vertical visible pointing>
            <Menu.Item className='topbar__acnw_title'>AmberCon NW</Menu.Item>
            {menu}
          </Sidebar>
        </Sticky>
        <div className='desktop_container__content_wrapper'>{children}</div>
      </Responsive>
    )
  }
}

DesktopContainer.propTypes = {
  children: PropTypes.node.isRequired,
  menu: PropTypes.node.isRequired
}
