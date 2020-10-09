import { ErrorBoundary } from 'components/Acnw/ErrorBoundary'
import { NotFound } from 'pages'
import queryString from 'query-string'
import React, { useMemo } from 'react'
import { Redirect, Route, Switch, useLocation } from 'react-router-dom'
import { useSettings, useUser } from 'utils'
import { useGetMemberShip } from 'utils/membership'

import { Loader } from '../Loader'
import type { RootRoutes, RouteInfo } from './Routes'

const ComponentConditionWrapper: React.FC<{ menuItem: RouteInfo }> = ({ menuItem }) => {
  const { userId } = useUser()
  const membership = useGetMemberShip(userId)
  const getSetting = useSettings()

  if (!menuItem.userCondition) {
    return React.createElement(menuItem.component!)
  }

  if (membership === undefined || getSetting === undefined) {
    return <Loader />
  }

  const isMember = !!membership

  if (menuItem.userCondition({ userId, isMember, getSetting })) {
    return React.createElement(menuItem.component!)
  } else {
    return <Redirect to='/' />
  }
}

export const SelectedContent: React.FC<{ routes: RootRoutes }> = ({ routes }) => {
  const results = useMemo(
    () =>
      routes
        .filter((menuItem) => menuItem.condition === undefined || menuItem.condition)
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
            return (
              <Route
                exact={route.exact}
                path={route.path}
                render={() => <ComponentConditionWrapper menuItem={route} />}
                key={index}
              />
            )
          }
        }),
    [routes]
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
