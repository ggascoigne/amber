import { NotFound } from 'pages'
import queryString from 'query-string'
import React, { Suspense, useMemo } from 'react'
import { Redirect, Route, Switch, useLocation } from 'react-router-dom'
import { useGetMemberShip, useIsMember, useSettings, useUser } from 'utils'

import { ErrorBoundary } from '../ErrorBoundary'
import { Loader } from '../Loader'
import type { RootRoutes, RouteInfo } from './Routes'

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

const ComponentConditionWrapper: React.FC<{ menuItem: RouteInfo }> = ({ menuItem }) => {
  const { userId } = useUser()
  const membership = useGetMemberShip(userId)
  const [, getSettingTruth] = useSettings()
  const isMember = useIsMember()

  if (!menuItem.userCondition || !!menuItem.alwaysAddRoute) {
    return React.createElement(menuItem.component!)
  }

  if (membership === undefined || getSettingTruth === undefined) {
    return <Loader />
  }

  if (menuItem.userCondition({ userId, isMember, getSetting: getSettingTruth })) {
    return React.createElement(menuItem.component!)
  }
  return <Redirect to='/' />
}

export const SelectedContent: React.FC<{ routes: RootRoutes }> = ({ routes }) => {
  const loader = <Loader />
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
          }
          return (
            <Route
              exact={route.exact}
              path={route.path}
              render={() => <ComponentConditionWrapper menuItem={route} />}
              key={index}
            />
          )
        }),
    [routes]
  )

  return (
    <ErrorBoundary>
      <Suspense fallback={loader}>
        <Switch>
          {results}
          <Route path='/gameBook' component={LegacyGameBookRedirect} />
          <Route path='*' component={NotFound} />
        </Switch>
      </Suspense>
    </ErrorBoundary>
  )
}
