import type React from 'react'

import Link from 'next/link'

type ExternalLinkProps = {
  href?: string
  target?: string
  rel?: string
  children?: React.ReactNode
  [key: string]: any
}

export const ExternalLink = (props: ExternalLinkProps) => {
  const { href, target, rel, ...otherProps } = props
  const isInternalLink = href?.startsWith('/') ?? false

  if (isInternalLink && href) {
    return <Link href={href} {...otherProps} />
  }

  const externalProps = {
    ...otherProps,
    href,
    target: '_blank',
    rel: 'noopener noreferrer',
  }
  // eslint-disable-next-line jsx-a11y/anchor-has-content
  return <a {...externalProps} />
}
