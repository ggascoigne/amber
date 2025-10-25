import React from 'react'

import type { Children } from '@amber/ui'
import { MDXProvider } from '@mdx-js/react'

import { ExternalLink } from './ExternalLink'

const mdxComponents = {
  a: ExternalLink,
}

export const MdxWithExternalLinks = ({ children }: Children) => (
  <MDXProvider components={mdxComponents}>{children}</MDXProvider>
)
