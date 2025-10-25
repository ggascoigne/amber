import type { MouseEvent } from 'react'
import { useEffect, useState } from 'react'

import { Collapse, Divider } from '@mui/material'
import MenuList from '@mui/material/MenuList'
import type { SxProps, Theme } from '@mui/material/styles'
import { useRouter } from 'next/router'

import { ExpandIcon, MenuGroupStyled, MenuItemStyled, MenuListStyled, MenuTitle, NavLink } from './MenuComponents'
import type { MenuEntry } from './MenuTypes'
import { isMenuCollection, isMenuLink } from './MenuTypes'

const normalizePath = (path: string) => {
  if (!path) return '/'
  if (path === '/') return '/'
  return path.endsWith('/') ? path.slice(0, -1) : path
}

// Check if current path is within this menu group
const isPathInGroup = (currentPath: string, menuEntries: MenuEntry[]): boolean =>
  menuEntries.some((entry) => {
    if (isMenuLink(entry)) {
      return normalizePath(entry.path) === normalizePath(currentPath)
    }
    if (isMenuCollection(entry)) {
      return isPathInGroup(currentPath, entry.children)
    }
    return false
  })

type MenuItemProps = {
  entry: MenuEntry
  depth: number
  currentPath: string
  onItemClick?: (event: MouseEvent<Element>) => void
}

const MenuItem = ({ entry, depth, currentPath, onItemClick }: MenuItemProps) => {
  const [isOpen, setIsOpen] = useState(false)

  // Auto-expand if current path is within this group
  useEffect(() => {
    if (isMenuCollection(entry)) {
      const shouldBeOpen = isPathInGroup(currentPath, entry.children)
      setIsOpen(shouldBeOpen)
    }
  }, [currentPath, entry])

  if (isMenuCollection(entry)) {
    return (
      <>
        <MenuGroupStyled onClick={() => setIsOpen(!isOpen)} depth={depth}>
          {entry.name}
          <ExpandIcon className={isOpen ? 'expanded' : ''} sx={{ ml: 'auto' }} />
        </MenuGroupStyled>
        <Collapse in={isOpen} timeout='auto' unmountOnExit>
          <MenuListStyled depth={depth}>
            {entry.children.map((child, index) => (
              <MenuItem
                key={`${entry.name}-${index}`}
                entry={child}
                depth={depth + 1}
                currentPath={currentPath}
                onItemClick={onItemClick}
              />
            ))}
          </MenuListStyled>
        </Collapse>
      </>
    )
  }

  if (isMenuLink(entry)) {
    if (entry.hidden) return null

    return (
      <MenuItemStyled
        component={NavLink}
        onClick={onItemClick}
        depth={depth}
        activeClassName='Mui-selected'
        to={entry.path}
      >
        {entry.name}
      </MenuItemStyled>
    )
  }

  // Handle decorative elements (titles, dividers)
  if ('style' in entry) {
    if (entry.style === 'title') {
      return <MenuTitle depth={depth}>{entry.name}</MenuTitle>
    }
    if (entry.style === 'divider') {
      return <Divider />
    }
  }

  return null
}

type MenuContentProps = {
  menu: MenuEntry[]
  sx?: SxProps<Theme>
  onItemClick?: (event: MouseEvent<Element>) => void
}

export const MenuContent = ({ sx, menu, onItemClick }: MenuContentProps) => {
  const router = useRouter()
  const currentPath = normalizePath(router.asPath.split('?')[0])

  if (menu.length === 0) {
    return null
  }

  return (
    <MenuList sx={sx}>
      {menu.map((entry, index) => (
        <MenuItem
          key={`${entry.name}-${index}`}
          entry={entry}
          depth={0}
          currentPath={currentPath}
          onItemClick={onItemClick}
        />
      ))}
    </MenuList>
  )
}
