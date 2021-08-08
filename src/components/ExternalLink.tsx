import React from 'react'

export const ExternalLink: React.FC = ({ children, ...props }) => (
  <a target='_blank' rel='noopener noreferrer' {...props}>
    {children}
  </a>
)
