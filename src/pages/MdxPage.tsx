import { Page } from 'components/Page'
import React from 'react'

import { MdxWithExternalLinks } from '../components/MdxWithExternalLinks'

interface MdxPageProps {
  component: React.ReactNode
  frontMatter: Record<string, string>
}

export const MdxPage: React.FC<MdxPageProps> = ({ component, frontMatter }) => (
  <Page title={frontMatter.title}>
    <MdxWithExternalLinks>{component}</MdxWithExternalLinks>
  </Page>
)
