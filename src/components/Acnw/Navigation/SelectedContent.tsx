import { ErrorBoundary } from 'components/Acnw/ErrorBoundary'
import { NotFound } from 'pages'
import queryString from 'query-string'
import React, { useMemo } from 'react'
import { Redirect, Route, Switch, useLocation } from 'react-router-dom'
import { useSettings, useUser } from 'utils'
import { useGetMemberShip } from 'utils/membership'

import type { RootRoutes } from './Routes'

export const SelectedContent: React.FC<{ routes: RootRoutes }> = ({ routes }) => {
  const { userId } = useUser()
  const isMember = !!useGetMemberShip(userId)
  const getSetting = useSettings()

  const results = useMemo(
    () =>
      routes
        .filter((menuItem) => menuItem.condition === undefined || menuItem.condition)
        .filter(
          (menuItem) => menuItem.userCondition === undefined || menuItem.userCondition({ userId, isMember, getSetting })
        )
        .map((route, index) => {
          if (route.redirect) {
            return (
              <Route
                exact={route.exact}
                path={route.path}
                render={() => <Redirect to={route.redirect!} />}
                key={index}
              />
            )
          } else {
            return <Route exact={route.exact} path={route.path} component={route.component!} key={index} />
          }
        }),
    [getSetting, isMember, routes, userId]
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
// http://www.amberconnw.org/game-book/2019/1/1115
const LegacyGameBookRedirect = () => {
  const location = useLocation()
  const qs = queryString.parse(location.search)
  const { year, slot } = qs
  const id = location.hash.slice(1)
  console.log('redirecting a legacy game book url')
  return <Redirect to={`/game-book/${year}/${slot}#${id}`} />
}
