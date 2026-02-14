import type React from 'react'

import { MdxWithExternalLinks } from './MdxWithExternalLinks'

import { Page } from '../Page'

export type FrontMatter = Record<string, string>

export interface MdxPageProps {
  component: React.ReactNode
  frontMatter: FrontMatter
}

export const MdxPage: React.FC<MdxPageProps> = ({ component, frontMatter }) => (
  <Page title={frontMatter?.title ?? ''}>
    <MdxWithExternalLinks>{component}</MdxWithExternalLinks>
  </Page>
)
