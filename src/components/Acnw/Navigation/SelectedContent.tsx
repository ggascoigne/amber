import { ErrorBoundary } from 'components/Acnw/ErrorBoundary'
import { NotFound } from 'pages'
import React, { useMemo } from 'react'
import { Route, Switch } from 'react-router-dom'

import type { RootRoutes } from './Routes'

export const SelectedContent: React.FC<{ routes: RootRoutes }> = ({ routes }) => {
  const results = useMemo(
    () =>
      routes.map((route, index) => (
        <Route exact={route.exact} path={route.path} render={() => React.createElement(route.component)} key={index} />
      )),
    [routes]
  )

  return (
    <ErrorBoundary>
      <Switch>
        {results}
        <Route path='*' component={NotFound} />
      </Switch>
    </ErrorBoundary>
  )
}
