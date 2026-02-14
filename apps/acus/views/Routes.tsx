import { Perms } from '@amber/amber/components/Auth'
import type { RootRoutes } from '@amber/amber/components/Navigation'
import type { Configuration } from '@amber/amber/utils'

export const rootRoutes = (configuration: Configuration): RootRoutes => [
  {
    path: '/',
    label: 'Welcome',
    subText: 'Introduction',
    exact: true,
  },
  {
    path: '/about',
    label: 'Ambercon US',
    subText: 'What you get and what it costs',
    exact: false,
  },
  {
    path: '/about-amber',
    label: 'Amber',
    subText: 'Just what is this "Amber" thing?',
    exact: false,
  },
  {
    path: '/hotel',
    label: 'Hotel',
    subText: 'Convention Hotel Details',
    exact: false,
  },
  {
    path: '/schedule',
    label: 'Schedule',
    subText: 'Your Schedule',
    exact: true,
    userCondition: ({ getFlag }) => getFlag('display_schedule'),
  },
  {
    path: '/membership',
    label: 'Membership',
    subText: 'Your membership details',
    exact: false,
  },
  {
    path: '/payment',
    label: 'Payment',
    exact: true,
    permission: Perms.IsLoggedIn,
    userCondition: ({ getFlag }) => getFlag('allow_payment'),
  },
  {
    path: '/gm',
    label: 'Become a GM',
    subText: `Manage your games`,
    exact: false,
  },
  {
    path: '/game-book',
    label: `${configuration.year} Game Book`,
    subText: "This year's games",
    exact: true,
    userCondition: ({ getFlag }) => getFlag('display_gamebook'),
  },
  {
    path: '/game-signup',
    label: 'Game Signup',
    subText: 'Choose your games',
    exact: true,
    userCondition: ({ getFlag }) => getFlag('allow_game_signup'),
  },
  {
    path: '/game-choices',
    exact: true,
    userCondition: ({ getFlag }) => getFlag('allow_game_signup'),
  },
  {
    path: '/game-history',
    label: 'Past Conventions',
    subText: 'See game books from earlier cons',
    exact: true,
  },
  {
    path: '/lookup-admin',
    label: 'Lookups',
    exact: true,
    permission: Perms.IsAdmin,
  },
  {
    path: '/settings-admin',
    label: 'Settings',
    exact: true,
    permission: Perms.IsAdmin,
  },
  {
    path: '/user-admin',
    label: 'Users',
    exact: true,
    permission: Perms.IsAdmin,
  },
  {
    path: '/game-admin',
    label: 'Games',
    exact: true,
    permission: Perms.FullGameBook,
  },
  {
    path: '/game-assignments',
    label: 'Game Assignments',
    exact: true,
    permission: Perms.GameAdmin,
  },
  {
    path: '/member-admin',
    label: 'Members',
    exact: true,
    permission: Perms.IsAdmin,
  },
  {
    path: '/transactions',
    label: 'Transactions',
    exact: true,
    permission: Perms.IsAdmin,
  },
  {
    path: '/stripe',
    label: 'Stripe Log',
    exact: true,
    permission: Perms.IsAdmin,
  },
  {
    path: '/report-admin',
    label: 'Reports',
    exact: true,
    permission: Perms.Reports,
  },
  {
    path: '/covid-policy',
    label: 'COVID Policy',
    exact: false,
  },
  {
    path: '/anti-harassment-policy',
    label: 'Anti-Harassment Policy',
    exact: false,
  },
  {
    path: '/faq',
    label: 'Frequently Asked Questions',
    subText: 'Hopefully with some answers',
    exact: false,
  },
  {
    path: '/contact',
    label: 'Contact',
    exact: false,
  },
  {
    path: '/credits',
    label: 'Credits',
    exact: false,
  },
]
