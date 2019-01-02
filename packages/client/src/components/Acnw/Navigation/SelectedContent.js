import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { ErrorBoundary } from 'components/Acnw/ErrorBoundary'
import NotFound from 'pages/NotFound.js'
import { menuDataType } from './Routes'

export const SelectedContent = ({ routes }) => {
  return (
    <ErrorBoundary>
      <Switch>
        {routes.map((route, index) => (
          <Route exact={route.exact} path={route.path} component={route.component} key={index} />
        ))}
        <Route path='*' component={NotFound} />
      </Switch>
    </ErrorBoundary>
  )
}

SelectedContent.propTypes = {
  menuItems: menuDataType
}
