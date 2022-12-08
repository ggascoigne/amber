import React from 'react'
import { Page } from '@/components/Page'

import { MdxWithExternalLinks } from '@/components/MdxWithExternalLinks'

export type FrontMatter = Record<string, string>

export interface MdxPageProps {
  component: React.ReactNode
  frontMatter: FrontMatter
}

export const MdxPage: React.FC<MdxPageProps> = ({ component, frontMatter }) => (
  <Page title={frontMatter?.title}>
    <MdxWithExternalLinks>{component}</MdxWithExternalLinks>
  </Page>
)
