import { MDXProvider } from '@mdx-js/react'
import React from 'react'

import { ExternalLink } from './ExternalLink'

const mdxComponents = {
  a: ExternalLink,
}

export const MdxWithExternalLinks: React.FC = ({ children }) => (
// @ts-ignore
  <MDXProvider components={mdxComponents}>{children}</MDXProvider>
)
