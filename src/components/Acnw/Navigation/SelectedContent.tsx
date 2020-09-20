import { ErrorBoundary } from 'components/Acnw/ErrorBoundary'
import { NotFound } from 'pages'
import React, { useMemo } from 'react'
import { Route, Switch } from 'react-router-dom'
import { useUser } from 'utils'
import { useIsMember } from 'utils/membership'

import type { RootRoutes } from './Routes'

export const SelectedContent: React.FC<{ routes: RootRoutes }> = ({ routes }) => {
  const { userId } = useUser()
  const isMember = useIsMember(userId)
  const results = useMemo(
    () =>
      routes
        .filter((menuItem) => menuItem.condition === undefined || menuItem.condition)
        .filter((menuItem) => menuItem.userCondition === undefined || menuItem.userCondition(userId, isMember))
        .map((route, index) => (
          <Route
            exact={route.exact}
            path={route.path}
            render={() => React.createElement(route.component)}
            key={index}
          />
        )),
    [isMember, routes, userId]
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
