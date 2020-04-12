import ListItem, { ListItemProps } from '@material-ui/core/ListItem'
import React, { LegacyRef } from 'react'
import { Link, LinkProps } from 'react-router-dom'

export const ListItemLink: React.FC<ListItemProps & LinkProps> = ({ to, children, ...rest }) => {
  // @ts-ignore
  const MyLink = React.forwardRef((props, ref: LegacyRef<Link>) => <Link {...props} to={to} ref={ref} />)
  return (
    // @ts-ignore
    <ListItem {...rest} component={MyLink}>
      {children}
    </ListItem>
  )
}
