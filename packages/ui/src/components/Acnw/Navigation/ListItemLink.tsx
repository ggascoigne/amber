import ListItem, { ListItemProps } from '@material-ui/core/ListItem'
import * as H from 'history'
import React from 'react'
import { Link } from 'react-router-dom'

export const ListItemLink: React.FC<ListItemProps & { to: H.LocationDescriptor }> = ({ to, children, ...rest }) => {
  return (
    <ListItem {...rest} component={({ innerRef, ...rest }) => <Link {...rest} to={to} />}>
      {children}
    </ListItem>
  )
}
