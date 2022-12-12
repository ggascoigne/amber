import { configuration } from '../../utils'

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
  },
  {
    path: '/about-acnw',
    label: 'AmberCon NW',
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
    path: '/schedule',
    label: 'Schedule',
    subText: 'Your Schedule',
    exact: true,
    userCondition: ({ getSetting }) => getSetting('display.schedule'),
  },
  {
    path: '/about-edgefield',
    label: 'Accommodations',
    subText: 'McMenamins Edgefield, the site that makes ACNW unique',
    exact: false,
    condition: !configuration.virtual,
  },
  {
    path: '/virtual-details',
    label: 'The Virtual Convention',
    subText: 'Accessing the virtual convention',
    exact: false,
    condition: configuration.virtual,
    userCondition: ({ getSetting }) => getSetting('display.virtual.details'),
  },
  {
    path: '/membership',
    label: 'Membership',
    subText: 'Your membership details',
    exact: false,
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
    userCondition: ({ getSetting }) => getSetting('display.game.book'),
  },
  {
    path: '/game-signup',
    label: 'Game Signup',
    subText: 'Choose your games',
    exact: true,
    userCondition: ({ getSetting }) => getSetting('display.game.signup'),
  },
  {
    path: '/game-choices',
    exact: true,
    userCondition: ({ getSetting }) => getSetting('display.game.signup'),
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
    path: '/hotel-room-types',
    label: 'Hotel Room Types',
    exact: true,
    permission: Perms.IsAdmin,
  },
  {
    path: '/hotel-rooms',
    label: 'Hotel Rooms',
    exact: true,
    permission: Perms.IsAdmin,
  },
  {
    path: '/game-rooms',
    label: 'Game Rooms',
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
    path: '/member-admin',
    label: 'Members',
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
    path: '/graphiql',
    label: 'GraphiQL',
    subText: 'Dynamically query the ACNW database',
    exact: false,
    permission: Perms.GraphiqlLoad,
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
