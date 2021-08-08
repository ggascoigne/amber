import { Welcome, WelcomeVirtual } from 'pages'
import React from 'react'
import { configuration } from 'utils'

import { Perms } from '../Auth'

interface UserCondition {
  userId: number | null | undefined
  isMember: boolean
  getSetting: (setting: string, defaultValue?: any) => boolean
}

// note that entries are only displayed if they have a label
export interface RouteInfo {
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
  alwaysAddRoute?: boolean
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
    component: React.lazy(() => import('pages/AboutAmberconNw')),
  },
  {
    path: '/about-amber',
    label: 'Amber',
    subText: 'Just what is this "Amber" thing?',
    exact: false,
    component: React.lazy(() => import('pages/AboutAmber')),
  },
  {
    path: '/about-edgefield',
    label: 'Accommodations',
    subText: 'McMenamins Edgefield, the site that makes ACNW unique',
    exact: false,
    component: React.lazy(() => import('pages/Accommodations')),
    condition: !configuration.virtual,
  },
  {
    path: '/virtual-details',
    label: 'The Virtual Convention',
    subText: 'Accessing the virtual convention',
    exact: false,
    component: React.lazy(() => import('pages/VirtualDetails')),
    condition: configuration.virtual,
    userCondition: ({ getSetting }) => getSetting('display.virtual.details'),
    alwaysAddRoute: true,
  },
  {
    path: '/membership',
    label: 'Membership',
    subText: 'Your membership details',
    exact: false,
    component: React.lazy(() => import('pages/Memberships/MembershipSummary')),
  },
  {
    path: '/gm',
    label: 'Become a GM',
    subText: `Manage your games`,
    exact: false,
    component: React.lazy(() => import('pages/GmPage/GmPage')),
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
    component: React.lazy(() => import('pages/GameBook/GameBookGamesPage')),
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
    component: React.lazy(() => import('pages/GameSignup/GameSignupPage')),
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
    component: React.lazy(() => import('pages/GameSignup/GameChoiceSummary')),
    userCondition: ({ getSetting }) => getSetting('display.game.signup'),
  },
  {
    path: '/schedule',
    label: 'Schedule',
    subText: 'Your Schedule',
    exact: true,
    component: React.lazy(() => import('pages/Schedule/SchedulePage')),
    userCondition: ({ getSetting }) => getSetting('display.schedule'),
    alwaysAddRoute: true,
  },
  {
    path: '/game-history',
    label: 'Past Conventions',
    subText: 'See game books from earlier cons',
    exact: true,
    component: React.lazy(() => import('pages/GameBook/GameBookPage')),
  },
  {
    path: '/lookup-admin',
    label: 'Lookups',
    exact: true,
    component: React.lazy(() => import('pages/Lookups/Lookups')),
    permission: Perms.IsAdmin,
  },
  {
    path: '/settings-admin',
    label: 'Settings',
    exact: true,
    component: React.lazy(() => import('pages/Settings/Settings')),
    permission: Perms.IsAdmin,
  },
  {
    path: '/hotel-room-types',
    label: 'Hotel Room Types',
    exact: true,
    component: React.lazy(() => import('pages/HotelRoomTypes/HotelRoomTypes')),
    permission: Perms.IsAdmin,
  },
  {
    path: '/hotel-rooms',
    label: 'Hotel Rooms',
    exact: true,
    component: React.lazy(() => import('pages/HotelRoomDetails/HotelRoomDetails')),
    permission: Perms.IsAdmin,
  },
  {
    path: '/user-admin',
    label: 'Users',
    exact: true,
    component: React.lazy(() => import('pages/Users/Users')),
    permission: Perms.IsAdmin,
  },
  {
    path: '/game-admin',
    label: 'Games',
    exact: true,
    component: React.lazy(() => import('pages/Games/Games')),
    permission: Perms.FullGameBook,
  },
  {
    path: '/member-admin',
    label: 'Members',
    exact: true,
    component: React.lazy(() => import('pages/Memberships/Memberships')),
    permission: Perms.IsAdmin,
  },
  {
    path: '/report-admin',
    label: 'Reports',
    exact: true,
    component: React.lazy(() => import('pages/Reports')),
    permission: Perms.Reports,
  },
  {
    path: '/graphiql',
    label: 'GraphiQL',
    subText: 'Dynamically query the ACNW database',
    exact: false,
    component: React.lazy(() => import('components/GraphiQL/GraphiQL')),
    permission: Perms.GraphiqlLoad,
  },
  {
    path: '/antiHarassmentPolicy',
    label: 'Anti-Harassment Policy',
    exact: false,
    component: React.lazy(() => import('pages/AntiHarassmentPolicy')),
  },
  {
    path: '/faq',
    label: 'Frequently Asked Questions',
    subText: 'Hopefully with some answers',
    exact: false,
    component: React.lazy(() => import('pages/Faq')),
  },
  {
    path: '/contact',
    label: 'Contact',
    exact: false,
    component: React.lazy(() => import('pages/Contact')),
  },
  {
    path: '/credits',
    label: 'Credits',
    exact: false,
    component: React.lazy(() => import('pages/Credits')),
  },
]
