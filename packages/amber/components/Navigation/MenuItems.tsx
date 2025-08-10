import React from 'react'

import { List, ListItemText } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useRouter } from 'next/router'

import { contextRoutes } from './ContextRoutes'
import { ListItemLink } from './ListItemLink'
import type { RootRoutes } from './types'

import { useIsMember, useSettings, useUser } from '../../utils'
import { HasPermission } from '../Auth'

interface MenuItemsProps {
  menuItems: RootRoutes
}

export const MenuItems = ({ menuItems }: MenuItemsProps) => {
  const { userId } = useUser()
  const isMember = useIsMember()
  const [, getFlagBoolean] = useSettings()
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
            (getFlagBoolean ? menuItem.userCondition({ userId, isMember, getFlag: getFlagBoolean }) : false),
        )
        .map((menuItem) => {
          const link = menuItem.link ?? menuItem.path
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
