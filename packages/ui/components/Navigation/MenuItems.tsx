import { List, ListItemText, useTheme } from '@mui/material'
import React from 'react'
import { useRouter } from 'next/router'
import { useIsMember, useSettings, useUser } from '../../utils'

import { HasPermission } from '../Auth'
import { ListItemLink } from './ListItemLink'
import type { RootRoutes } from './Routes'
import { contextRoutes } from './ContextRoutes'

interface MenuItemsProps {
  menuItems: RootRoutes
}

export const MenuItems: React.FC<MenuItemsProps> = ({ menuItems }) => {
  const { userId } = useUser()
  const isMember = useIsMember()
  const [, getSettingTruth] = useSettings()
  const router = useRouter()
  const theme = useTheme()

  const activeItem = router.asPath

  const matchedContextRoute = contextRoutes(router.asPath)
  if (matchedContextRoute) {
    return matchedContextRoute.load
  }
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
              href={{ pathname: link }}
              selected={activeItem === link}
              sx={{ color: theme.palette.text.primary }}
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
          }
          return item
        })}
    </List>
  )
}
