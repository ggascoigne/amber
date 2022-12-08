import { MDXProvider } from '@mdx-js/react'
import React from 'react'

import { ExternalLink } from './ExternalLink'
import { Children } from '@/utils'

const mdxComponents = {
  a: ExternalLink,
}

export const MdxWithExternalLinks: React.FC<Children> = ({ children }) => (
  <MDXProvider components={mdxComponents}>{children}</MDXProvider>
)
