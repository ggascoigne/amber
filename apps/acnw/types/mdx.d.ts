/// <reference types="@mdx-js/loader" />

declare module '*.mdx' {
  import type { ComponentType } from 'react'

  export const metadata: Record<string, any>
  const MDXComponent: ComponentType<any>
  export default MDXComponent
}
