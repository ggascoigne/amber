import type { MDXComponents } from 'mdx/types'
import { ExternalLink } from '@amber/amber/components/Mdx/ExternalLink'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Use ExternalLink for all anchor tags
    a: ExternalLink,
    ...components,
  }
}
