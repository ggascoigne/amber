import List from '@material-ui/core/List'
import ListItemText from '@material-ui/core/ListItemText'
import { HasPermission } from 'components/Acnw/Auth'
import React from 'react'
import { useLocation } from 'react-router'
import { useIsMember } from 'utils/membership'

import { useUser } from '../../../utils'
import { contextRoutes } from './ContextRoutes'
import { ListItemLink } from './ListItemLink'
import type { RootRoutes } from './Routes'

interface MenuItems {
  menuItems: RootRoutes
}

export const MenuItems: React.FC<MenuItems> = ({ menuItems }) => {
  const location = useLocation()
  const { userId } = useUser()
  const isMember = useIsMember(userId)

  const activeItem = location.pathname
  const matchedContextRoute = contextRoutes(location.pathname)
  if (matchedContextRoute) {
    return matchedContextRoute.load
  } else {
    return (
      <List>
        {menuItems
          // only display routes with a label
          .filter((menuItem) => menuItem.label)
          .filter((menuItem) => menuItem.condition === undefined || menuItem.condition)
          .filter((menuItem) => menuItem.userCondition === undefined || menuItem.userCondition(userId, isMember))
          .map((menuItem) => {
            const link = menuItem.link ? menuItem.link : menuItem.path
            const item = (
              <ListItemLink key={link} button to={link} selected={activeItem === link}>
                <ListItemText primary={menuItem.label} secondary={menuItem.subText} />
              </ListItemLink>
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
}
