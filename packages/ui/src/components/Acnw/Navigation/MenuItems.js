import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import { HasPermission } from 'components/Acnw/Auth'
import React from 'react'
import { Link, withRouter } from 'react-router-dom'

import { contextRoutes } from './ContextRoutes'
import { menuDataType } from './Routes'

export const MenuItems = withRouter(({ menuItems, location }) => {
  const activeItem = location.pathname
  const matchedContextRoute = contextRoutes(location.pathname)
  if (matchedContextRoute) {
    return matchedContextRoute.load
  } else {
    return (
      <List>
        {/*<ListItem>{location.pathname}</ListItem>*/}
        {menuItems
          // only display routes with a label
          .filter(menuItem => menuItem.label)
          .map(menuItem => {
            const link = menuItem.link ? menuItem.link : menuItem.path
            const item = (
              <ListItem key={link} button component={Link} to={link} selected={activeItem === link}>
                <ListItemText primary={menuItem.label} secondary={menuItem.subText} />
              </ListItem>
            )
            if (menuItem.permission) {
              return (
                <HasPermission key={link} permission={menuItem.permission}>
                  {item}
                </HasPermission>
              )
            } else {
              return item
            }
          })}
      </List>
    )
  }
})

MenuItems.propTypes = {
  menuItems: menuDataType
}
