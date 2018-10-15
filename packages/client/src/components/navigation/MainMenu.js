import PropTypes from 'prop-types'
import React from 'react'
import { NavLink, Route, Switch, withRouter } from 'react-router-dom'
import { Header, Menu, Segment } from 'semantic-ui-react'
import DesktopContainer from '../../components/navigation/DesktopContainer'
import MobileContainer from '../../components/navigation/MobileContainer'
import { menuDataType } from '../../Routing'
import pure from '../../utils/pure'

const MenuItems = withRouter(({ menuItems, location }) => {
  const activeItem = location.pathname
  // todo upgrade to babel-7 and then use the <> </> syntax
  return (
    <>
      {menuItems.filter(menuItem => menuItem.content).map((menuItem, index) => (
        <Menu.Item name={menuItem.path} active={activeItem === menuItem.path} key={index}>
          <NavLink activeClassName='active' exact={menuItem.exact} to={menuItem.path}>
            {menuItem.content}
          </NavLink>
        </Menu.Item>
      ))}
    </>
  )
})

MenuItems.propTypes = {
  menuItems: menuDataType
}

const ResponsiveContainer = ({ children, menuItems }) => (
  <>
    <DesktopContainer menu={<MenuItems menuItems={menuItems} />}>{children}</DesktopContainer>
    <MobileContainer menu={<MenuItems menuItems={menuItems} />}>{children}</MobileContainer>
  </>
)

ResponsiveContainer.propTypes = {
  children: PropTypes.node,
  menuItems: menuDataType
}

export const MainMenu = withRouter(({ menuItems }) => {
  const notFound = pure(
    () => (
      <Segment basic>
        <Header as='h1' icon='warning sign' content='Page Not Found' />
      </Segment>
    ),
    false
  )

  return (
    <ResponsiveContainer menuItems={menuItems}>
      <Switch>
        {menuItems.map((menuItem, index) => (
          <Route exact={menuItem.exact} path={menuItem.path} component={menuItem.component} key={index} />
        ))}
        <Route path='*' component={notFound} />
      </Switch>
    </ResponsiveContainer>
  )
})

MainMenu.propTypes = {
  menuItems: menuDataType
}
