import { Configuration } from 'amber/utils'
import { Perms } from 'amber/components/Auth'
import { RootRoutes } from 'amber/components/Navigation'

export const rootRoutes = (configuration: Configuration): RootRoutes => [
  {
    path: '/',
    label: 'Welcome',
    subText: 'Introduction',
    exact: true,
  },
  {
    path: '/about',
    label: 'AmberCon US',
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
