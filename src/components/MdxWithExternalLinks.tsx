import { MDXProvider } from '@mdx-js/react'
import React, { PropsWithChildren } from 'react'

import { ExternalLink } from './ExternalLink'

const mdxComponents = {
  a: ExternalLink,
}

export const MdxWithExternalLinks: React.FC<PropsWithChildren<unknown>> = ({ children }) => (
  // @ts-ignore
  <MDXProvider components={mdxComponents}>{children}</MDXProvider>
)
