import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import HasPermission from 'components/Auth/HasPermission'
import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import { menuDataType } from './Routes'

export const MenuItems = withRouter(({ menuItems, location }) => {
  const activeItem = location.pathname
  return (
    <List>
      {menuItems
        .filter(menuItem => menuItem.label)
        .map((menuItem, index) => {
          const item = (
            <ListItem
              key={menuItem.path}
              button
              component={Link}
              to={menuItem.path}
              selected={activeItem === menuItem.path}
            >
              <ListItemText primary={menuItem.label} secondary={menuItem.subText} />
            </ListItem>
          )
          if (menuItem.permission) {
            return (
              <HasPermission key={menuItem.path} permission={menuItem.permission}>
                {item}
              </HasPermission>
            )
          } else {
            return item
          }
        })}
    </List>
  )
})

MenuItems.propTypes = {
  menuItems: menuDataType
}
