import { ExternalLink } from '@amber/amber/components/Mdx/ExternalLink'
import type { MDXComponents } from 'mdx/types'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Use ExternalLink for all anchor tags
    a: ExternalLink,
    ...components,
  }
}
