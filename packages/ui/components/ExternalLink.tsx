import React from 'react'

import Link from 'next/link'

export const ExternalLink: React.FC<any> = (props) => {
  const { href } = props
  const isInternalLink = href && (href.startsWith('/') || href.startsWith('#'))

  if (isInternalLink) {
    return (
      <Link href={href} {...props}>
        {props.children}
      </Link>
    )
  }

  // eslint-disable-next-line jsx-a11y/anchor-has-content
  return <a target='_blank' rel='noopener noreferrer' {...props} />
}
