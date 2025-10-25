export type MenuDecoration = {
  name: string
  style: 'title' | 'divider'
}

export type MenuCollection = {
  name: string
  children: MenuEntry[]
}

export type MenuLink = {
  name: string
  path: string
  element?: React.ReactNode
  hidden?: boolean
  strict?: boolean
}

export type MenuEntry = MenuLink | MenuDecoration | MenuCollection

export type PluginDescription = {
  name: string
  baseUrl: string
  menu?: MenuEntry[]
}

export type GetPluginDescription = (baseUrl: string) => PluginDescription

export type ApplicationProps = {
  name: string
  baseUrl: string
}

export const isMenuCollection = (value: MenuEntry): value is MenuCollection =>
  Object.prototype.hasOwnProperty.call(value, 'children')

export const isMenuLink = (value: MenuEntry): value is MenuLink => Object.prototype.hasOwnProperty.call(value, 'path')

export const isMenuTitle = (value: MenuEntry): value is MenuDecoration =>
  Object.prototype.hasOwnProperty.call(value, 'style') && (value as MenuDecoration).style === 'title'

export const isMenuDivider = (value: MenuEntry): value is MenuDecoration =>
  Object.prototype.hasOwnProperty.call(value, 'style') && (value as MenuDecoration).style === 'divider'
