import { forwardRef } from 'react'

import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import type { MenuItemProps } from '@mui/material/MenuItem'
import MenuItem from '@mui/material/MenuItem'
import type { MenuListProps } from '@mui/material/MenuList'
import MenuList from '@mui/material/MenuList'
import { styled } from '@mui/material/styles'
import Link from 'next/link'
import { useRouter } from 'next/router'

export const MenuGroupStyled = styled(MenuItem, {
  shouldForwardProp: (prop) => prop !== 'depth',
})<MenuItemProps & { children?: React.ReactNode; depth: number }>(({ theme, depth }) => ({
  fontSize: 14,
  '&&&': {
    padding: theme.spacing(1, 2, 1, 2 * (depth + 1)),
  },
}))

export const MenuListStyled = styled(MenuList, {
  shouldForwardProp: (prop) => prop !== 'depth',
})<MenuListProps & { children?: React.ReactNode; depth: number }>(({ theme, depth }) => ({
  '& > li': {
    padding: 0,
  },
  '& a': {
    paddingLeft: theme.spacing(2 + 2 * (depth + 1)),
  },
}))

type NavLinkProps = {
  to: string
  className?: string
  activeClassName: string
  children?: React.ReactNode
}

export const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>((props, ref) => {
  const { to, className = '', activeClassName, children, ...rest } = props
  const router = useRouter()
  const isActive = router.pathname === to

  return (
    <Link href={to} ref={ref} {...rest} className={`${className} ${isActive ? activeClassName : ''}`}>
      {children}
    </Link>
  )
})

export const MenuItemStyled = styled(MenuItem)<
  MenuItemProps & { children?: React.ReactNode; depth: number } & NavLinkProps
>(({ theme }) => ({
  display: 'flex',
  justifyContent: 'left',
  padding: theme.spacing(1, 2, 1, 2),
  '& a': {
    color: 'inherit',
    fontSize: 14,
    padding: theme.spacing(1, 2),
    textDecoration: 'none',
    width: '100%',
  },
  '&&&': {
    '&.Mui-selected': {
      fontWeight: '500',
    },
  },
}))

export const ExpandIcon = styled(ExpandMoreIcon)(({ theme }) => ({
  transform: 'rotate(-90deg)',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
  '&.expanded': {
    transform: 'rotate(0deg)',
  },
}))

export const MenuTitle = styled('div', {
  shouldForwardProp: (prop) => prop !== 'depth',
})<{ depth: number }>(({ theme, depth }) => ({
  fontSize: 14,
  padding: theme.spacing(1, 2, 1, 2 * (depth + 1)),
}))
