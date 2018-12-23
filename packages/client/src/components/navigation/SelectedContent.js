import React from 'react'
import { Route, Switch } from 'react-router-dom'
import NotFound from '../../pages/NotFound.js'
import { menuDataType } from './Routes'

export const SelectedContent = ({ menuItems }) => {
  return (
    <>
      <Switch>
        {menuItems.map((menuItem, index) => (
          <Route exact={menuItem.exact} path={menuItem.path} component={menuItem.component} key={index} />
        ))}
        <Route path='*' component={NotFound} />
      </Switch>
    </>
  )
}

SelectedContent.propTypes = {
  menuItems: menuDataType
}
