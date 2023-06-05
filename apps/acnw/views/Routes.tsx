import { Perms } from 'amber/components/Auth'
import { RootRoutes } from 'amber/components/Navigation'
import { Configuration } from 'amber/utils'

export const rootRoutes = (configuration: Configuration): RootRoutes => [
  {
    path: '/',
    label: 'Welcome',
    subText: 'Introduction',
    exact: true,
  },
  {
    path: '/about',
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
    userCondition: ({ getFlag }) => getFlag('display_schedule'),
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
    userCondition: ({ getFlag }) => getFlag('display_virtual_details'),
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
    path: '/transactions',
    label: 'Transactions',
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
