import ListItem, { ListItemProps } from '@mui/material/ListItem'
import React from 'react'
import { Link, LinkProps } from './Link'

// FYI see the composition examples at https://material-ui.com/guides/composition/#button

export const ListItemLink: React.FC<ListItemProps & LinkProps> = ({ children, ...rest }) => (
  <ListItem {...rest} component={Link}>
    {children}
  </ListItem>
)
