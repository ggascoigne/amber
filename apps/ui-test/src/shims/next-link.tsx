import { forwardRef } from 'react'

type NextLinkProps = {
  href: string
  children?: React.ReactNode
} & React.AnchorHTMLAttributes<HTMLAnchorElement>

const NextLink = forwardRef<HTMLAnchorElement, NextLinkProps>(({ href, children, ...props }, ref) => (
  <a ref={ref} href={href} {...props}>
    {children}
  </a>
))

export default NextLink
