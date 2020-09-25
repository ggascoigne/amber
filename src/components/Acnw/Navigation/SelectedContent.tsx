import { ErrorBoundary } from 'components/Acnw/ErrorBoundary'
import { NotFound } from 'pages'
import queryString from 'query-string'
import React, { useMemo } from 'react'
import { Redirect, Route, Switch, useLocation } from 'react-router-dom'
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
        <Route path='/gameBook' component={LegacyGameBookRedirect} />
        <Route path='*' component={NotFound} />
      </Switch>
    </ErrorBoundary>
  )
}

// want to convert from
// http://www.amberconnw.org/gameBook/index?year=2019&slot=1#1115
// http://www.amberconnw.org/pastCons/2019/1/1115
const LegacyGameBookRedirect = () => {
  const location = useLocation()
  const qs = queryString.parse(location.search)
  const { year, slot } = qs
  const id = location.hash.slice(1)
  return <Redirect to={`/pastCons/${year}/${slot}/${id}`} />
}
