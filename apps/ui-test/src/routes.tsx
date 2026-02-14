import type { MenuEntry } from './Components/Navigation/MenuTypes'

export const routes: MenuEntry[] = [
  {
    name: 'Table - Client',
    path: '/table-client',
  },
  {
    name: 'Table - Server',
    path: '/table-server',
  },
  {
    name: 'Table Playground',
    path: '/table-playground',
  },
  {
    name: 'Table Layout Test',
    path: '/table-layouts',
  },
  {
    name: 'Table - Editable',
    path: '/table-editing',
  },
  {
    name: 'Menu',
    children: [
      {
        name: 'Basic Menu',
        path: '/menu/basic',
      },
      {
        name: 'Nested Menu',
        path: '/menu/nested',
      },
    ],
  },
]
