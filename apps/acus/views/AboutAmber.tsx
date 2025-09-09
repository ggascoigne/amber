import { MdxPage } from '@amber/ui'

import AboutAmberContent, { metadata } from '../content/AboutAmberContent.mdx'

const AboutAmber = () => <MdxPage frontMatter={metadata} component={<AboutAmberContent />} />

export default AboutAmber
