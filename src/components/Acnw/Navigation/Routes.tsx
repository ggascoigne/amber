import {
  AboutAmber,
  AboutAmberconNw,
  AntiHarassmentPolicy,
  Contact,
  Credits,
  Faq,
  GameBookGamesPage,
  GameBookPage,
  GameChoiceSummary,
  GameSignupPage,
  Games,
  GmPage,
  GraphiQLPage,
  Lookups,
  MembershipSummary,
  Memberships,
  Reports,
  SchedulePage,
  Settings,
  Users,
  Welcome,
  WelcomeVirtual,
} from 'pages'
import type React from 'react'
import { configuration } from 'utils'

import { Perms } from '../Auth/PermissionRules'

type UserCondition = {
  userId: number | null | undefined
  isMember: boolean
  getSetting: (setting: string, defaultValue?: any) => boolean
}

// note that entries are only displayed if they have a label
export type RouteInfo = {
  path: string
  label?: string
  link?: string
  subText?: string
  exact: boolean
  redirect?: string
  component?: React.ComponentType<any>
  permission?: Perms
  condition?: boolean
  userCondition?: (params: UserCondition) => boolean
}

export type RootRoutes = RouteInfo[]

export const rootRoutes: RootRoutes = [
  {
    path: '/',
    label: 'Welcome',
    subText: 'Introduction',
    exact: true,
    component: !configuration.virtual ? Welcome : WelcomeVirtual,
  },
  {
    path: '/about-acnw',
    label: 'AmberCon NW',
    subText: 'What you get and what it costs',
    exact: false,
    component: AboutAmberconNw,
  },
  {
    path: '/about-edgefield',
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
    path: '/game-book',
    label: `${configuration.year} Game Book`,
    subText: "This year's games",
    exact: true,
    redirect: `/game-book/${configuration.year}`,
    userCondition: ({ getSetting }) => getSetting('display.game.book'),
  },
  {
    path: '/game-book/:year/:slot?',
    link: '/game-book',
    exact: false,
    component: GameBookGamesPage,
  },
  {
    path: '/game-signup',
    label: 'Game Signup',
    subText: 'Choose your games',
    exact: true,
    redirect: `/game-signup/${configuration.year}`,
    userCondition: ({ getSetting }) => getSetting('display.game.signup'),
  },
  {
    path: '/game-signup/:year/:slot?',
    link: '/game-signup',
    exact: false,
    component: GameSignupPage,
    userCondition: ({ getSetting }) => getSetting('display.game.signup'),
  },
  {
    path: '/game-choices',
    exact: true,
    redirect: `/game-choices/${configuration.year}`,
    userCondition: ({ getSetting }) => getSetting('display.game.signup'),
  },
  {
    path: '/game-choices/:year',
    exact: true,
    component: GameChoiceSummary,
    userCondition: ({ getSetting }) => getSetting('display.game.signup'),
  },
  {
    path: '/schedule',
    label: 'Schedule',
    subText: 'Your Schedule',
    exact: true,
    component: SchedulePage,
    userCondition: ({ getSetting }) => getSetting('display.schedule'),
  },
  {
    path: '/about-amber',
    label: 'Amber',
    subText: 'Just what is this "Amber" thing?',
    exact: false,
    component: AboutAmber,
  },
  {
    path: '/game-history',
    label: 'Past Conventions',
    subText: 'See game books from earlier cons',
    exact: true,
    component: GameBookPage,
  },
  {
    path: '/lookup-admin',
    label: 'Lookups',
    exact: true,
    component: Lookups,
    permission: Perms.IsAdmin,
  },
  {
    path: '/settings-admin',
    label: 'Settings',
    exact: true,
    component: Settings,
    permission: Perms.IsAdmin,
  },
  {
    path: '/user-admin',
    label: 'Users',
    exact: true,
    component: Users,
    permission: Perms.IsAdmin,
  },
  {
    path: '/game-admin',
    label: 'Games',
    exact: true,
    component: Games,
    permission: Perms.FullGameBook,
  },
  {
    path: '/member-admin',
    label: 'Members',
    exact: true,
    component: Memberships,
    permission: Perms.IsAdmin,
  },
  {
    path: '/report-admin',
    label: 'Reports',
    exact: true,
    component: Reports,
    permission: Perms.Reports,
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
    path: '/faq',
    label: 'Frequently Asked Questions',
    subText: 'Hopefully with some answers',
    exact: false,
    component: Faq,
  },
  {
    path: '/contact',
    label: 'Contact',
    exact: false,
    component: Contact,
  },
  {
    path: '/credits',
    label: 'Credits',
    exact: false,
    component: Credits,
  },
]
