import React, { PropsWithChildren } from 'react'

export const ExternalLink: React.FC<PropsWithChildren<unknown>> = ({ children, ...props }) => (
  <a target='_blank' rel='noopener noreferrer' {...props}>
    {children}
  </a>
)
