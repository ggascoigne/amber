import { MdxPage } from '@amber/ui'

import * as content from '../content/AboutAmberContent.mdx'

const { default: AboutAmberContent, ...frontMatter } = content

const AboutAmber = () => <MdxPage frontMatter={frontMatter} component={<AboutAmberContent />} />

export default AboutAmber
