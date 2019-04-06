import ListItem, { ListItemProps } from '@material-ui/core/ListItem'
import * as H from 'history'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export class ListItemLink extends Component<ListItemProps & { to: H.LocationDescriptor }> {
  renderLink: React.FC<ListItemProps> = ({ innerRef, ...itemProps }) => <Link to={this.props.to} {...itemProps} />

  render() {
    const { to, children, ...rest } = this.props
    return (
      <ListItem {...rest} component={this.renderLink}>
        {children}
      </ListItem>
    )
  }
}
