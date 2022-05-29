import { List, ListItemText } from '@mui/material'
import React from 'react'
import { useLocation } from 'react-router'
import { useIsMember, useSettings, useUser } from 'utils'

import { HasPermission } from '../Auth'
import { contextRoutes } from './ContextRoutes'
import { ListItemLink } from './ListItemLink'
import type { RootRoutes } from './Routes'

interface MenuItemsProps {
  menuItems: RootRoutes
}

export const MenuItems: React.FC<MenuItemsProps> = ({ menuItems }) => {
  const location = useLocation()
  const { userId } = useUser()
  const isMember = useIsMember()
  const [, getSettingTruth] = useSettings()

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
          .filter(
            (menuItem) =>
              menuItem.userCondition === undefined ||
              (getSettingTruth ? menuItem.userCondition({ userId, isMember, getSetting: getSettingTruth }) : false)
          )
          .map((menuItem) => {
            const link = menuItem.link ? menuItem.link : menuItem.path
            const item = (
              <ListItemLink
                key={link}
                to={{ pathname: link, state: { fromClick: true } }}
                selected={activeItem === link}
              >
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
