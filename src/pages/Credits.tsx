import React from 'react'

// @ts-ignore
import CreditsContent, { frontMatter } from '../content/CreditsContent.mdx'
import { MdxPage } from './MdxPage'

const Credits = () => <MdxPage frontMatter={frontMatter} component={<CreditsContent />} />

export default Credits
