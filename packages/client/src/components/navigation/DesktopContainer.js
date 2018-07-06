import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Menu, Responsive, Segment, Sidebar, Sticky } from 'semantic-ui-react'
import './navigation.css'

export default class DesktopContainer extends Component {
  render () {
    const { children, menu } = this.props

    return (
      <Responsive className='desktop_container' minWidth={Responsive.onlyTablet.minWidth}>
        <Sticky>
          <Segment className='desktop_container__topbar' inverted vertical>
            <Sidebar className='desktop_container__sidebar' as={Menu} inverted vertical visible pointing>
              {menu}
            </Sidebar>
          </Segment>
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
