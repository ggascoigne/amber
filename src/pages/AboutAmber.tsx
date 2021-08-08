import React from 'react'

// @ts-ignore
import AboutAmberContent, { frontMatter } from '../content/AboutAmberContent.mdx'
import { MdxPage } from './MdxPage'

const AboutAmber = () => <MdxPage frontMatter={frontMatter} component={<AboutAmberContent />} />

export default AboutAmber
