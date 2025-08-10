import React from 'react'

import ListItem, { ListItemProps } from '@mui/material/ListItem'

import { Link, LinkProps } from './Link'

// FYI see the composition examples at https://material-ui.com/guides/composition/#button

export const ListItemLink = ({ children, ...rest }: ListItemProps & LinkProps) => (
  <ListItem {...rest} component={Link}>
    {children}
  </ListItem>
)
