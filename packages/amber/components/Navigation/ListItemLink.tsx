import React from 'react'

import ListItemButton, { ListItemButtonProps } from '@mui/material/ListItemButton'

import { Link, LinkProps } from './Link'

// FYI see the composition examples at https://material-ui.com/guides/composition/#button

export const ListItemLink = ({ children, ...rest }: ListItemButtonProps & LinkProps) => (
  <ListItemButton {...rest} component={Link}>
    {children}
  </ListItemButton>
)
