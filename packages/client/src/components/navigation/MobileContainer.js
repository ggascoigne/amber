import Flexbox from 'flexbox-react'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Container, Icon, Menu, Responsive, Segment, Sidebar } from 'semantic-ui-react'
import LoginMenu from '../LoginMenu'
import './navigation.scss'

export default class MobileContainer extends Component {
  state = {}

  handleToggle = () => this.setState({ sidebarOpened: !this.state.sidebarOpened })

  render() {
    const { children, menu } = this.props
    const { sidebarOpened } = this.state

    return (
      <Responsive className='mobile_container' {...Responsive.onlyMobile}>
        <Sidebar.Pushable>
          <Sidebar as={Menu} animation='overlay' onClick={this.handleToggle} inverted vertical visible={sidebarOpened}>
            <Menu.Item className='topbar__acnw_title'>AmberCon NW</Menu.Item>
            {menu}
          </Sidebar>

          <Sidebar.Pusher dimmed={sidebarOpened} className='mobile_container__sidebar'>
            <Segment className='mobile_container__topbar' inverted textAlign='center' vertical>
              <Container>
                <Menu inverted pointing secondary size='small'>
                  <Menu.Item className='mobile_container__icon_wrapper' onClick={this.handleToggle}>
                    <Icon name='sidebar' />
                  </Menu.Item>
                  <Menu.Item
                    className='topbar__acnw_title'
                    style={{
                      visibility: sidebarOpened ? 'hidden' : 'inherit'
                    }}
                  >
                    <Flexbox flex='1 1 auto' flexDirection='row' justifyContent='space-between' alignItems='center'>
                      <span>AmberCon NW</span>
                      <LoginMenu />
                    </Flexbox>
                  </Menu.Item>
                </Menu>
              </Container>
            </Segment>
            {children}
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </Responsive>
    )
  }
}

MobileContainer.propTypes = {
  children: PropTypes.node.isRequired,
  menu: PropTypes.node.isRequired
}
