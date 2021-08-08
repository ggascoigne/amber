import React from 'react'

// @ts-ignore
import FaqContent, { frontMatter } from '../content/FaqContent.mdx'
import { MdxPage } from './MdxPage'

const Faq = () => <MdxPage frontMatter={frontMatter} component={<FaqContent />} />

export default Faq
