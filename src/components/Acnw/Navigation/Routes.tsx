import { AboutAmberconNw, Credits, GraphiQLPage, PastConsGamesPage, PastConsPage, Welcome } from 'pages'
import type React from 'react'

import { Games, Lookups } from '../../../pages/Admin'
import { Perms } from '../Auth/PermissionRules'

// note that entries are only displayed if they have a label
export type RouteInfo = {
  path: string
  label?: string
  link?: string
  subText?: string
  exact: boolean
  component: React.ComponentType<any>
  permission?: Perms
}

export type RootRoutes = RouteInfo[]

export const rootRoutes: RootRoutes = [
  {
    path: '/',
    label: 'Welcome',
    subText: 'Introduction',
    exact: true,
    component: Welcome,
  },
  {
    path: '/aboutacnw',
    label: 'AmberCon NW',
    subText: 'What you get and what it costs',
    exact: false,
    component: AboutAmberconNw,
  },
  {
    path: '/aboutedge',
    label: 'Accommodations',
    subText: 'McMenamins Edgefield, the site that makes ACNW unique',
    exact: false,
    component: AboutAmberconNw,
  },
  {
    path: '/pastCons/:year/:slot?/:game?',
    link: '/pastCons',
    exact: false,
    component: PastConsGamesPage,
  },
  {
    path: '/pastCons',
    label: 'Past Cons',
    exact: true,
    component: PastConsPage,
  },
  {
    path: '/lookups',
    label: 'Lookups',
    exact: true,
    component: Lookups,
  },
  {
    path: '/games',
    label: 'Games',
    exact: true,
    component: Games,
  },
  {
    path: '/graphiql',
    label: 'GraphiQL',
    subText: 'Dynamically query the ACNW database',
    exact: false,
    component: GraphiQLPage,
    permission: Perms.GraphiqlLoad,
  },
  {
    path: '/credits',
    label: 'Credits',
    exact: false,
    component: Credits,
  },
]
