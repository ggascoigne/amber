import { MdxPage } from '@amber/amber'

import AboutAmberContent, { metadata } from '../content/AboutAmberContent.mdx'

const AboutAmber = () => <MdxPage frontMatter={metadata} component={<AboutAmberContent />} />

export default AboutAmber
