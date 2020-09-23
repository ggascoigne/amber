import {
  AboutAmber,
  AboutAmberconNw,
  Credits,
  GmPage,
  GraphiQLPage,
  PastConsGamesPage,
  PastConsPage,
  Settings,
  Welcome,
  WelcomeVirtual,
} from 'pages'
import type React from 'react'

import { AntiHarassmentPolicy, Games, Lookups, MembershipSummary, Memberships } from '../../../pages'
import { configuration } from '../../../utils'
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
  condition?: boolean
  userCondition?: (userId: number | null | undefined, isMember: boolean) => boolean
}

export type RootRoutes = RouteInfo[]

export const rootRoutes: RootRoutes = [
  {
    path: '/',
    label: 'Welcome',
    subText: 'Introduction',
    exact: true,
    component: Welcome,
    condition: !configuration.virtual,
  },
  {
    path: '/',
    label: 'Welcome',
    subText: 'Introduction',
    exact: true,
    component: WelcomeVirtual,
    condition: configuration.virtual,
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
    condition: !configuration.virtual,
  },
  {
    path: '/membership',
    label: 'Membership',
    subText: 'Your membership details',
    exact: true,
    component: MembershipSummary,
  },
  {
    path: '/gm',
    label: 'Become a GM',
    subText: `Submit an event for ${configuration.year}`,
    exact: true,
    component: GmPage,
  },
  {
    path: '/pastCons/:year/:slot?/:game?',
    link: '/pastCons',
    exact: false,
    component: PastConsGamesPage,
  },
  {
    path: '/aboutamber',
    label: 'Amber',
    subText: 'Just what is this "Amber" thing?',
    exact: false,
    component: AboutAmber,
  },
  {
    path: '/pastCons',
    label: 'Past Conventions',
    subText: 'See game books from earlier cons',
    exact: true,
    component: PastConsPage,
  },
  {
    path: '/lookups',
    label: 'Lookups',
    exact: true,
    component: Lookups,
    permission: Perms.IsAdmin,
  },
  {
    path: '/settings',
    label: 'Settings',
    exact: true,
    component: Settings,
    permission: Perms.IsAdmin,
  },
  {
    path: '/games',
    label: 'Games',
    exact: true,
    component: Games,
    permission: Perms.IsAdmin,
  },
  {
    path: '/members',
    label: 'Members',
    exact: true,
    component: Memberships,
    permission: Perms.IsAdmin,
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
    path: '/antiHarassmentPolicy',
    label: 'Anti-Harassment Policy',
    exact: false,
    component: AntiHarassmentPolicy,
  },
  {
    path: '/credits',
    label: 'Credits',
    exact: false,
    component: Credits,
  },
]
