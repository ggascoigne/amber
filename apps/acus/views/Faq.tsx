import { MdxPage } from '@amber/ui'

import FaqContent, { metadata } from '../content/FaqContent.mdx'

const Faq = () => <MdxPage frontMatter={metadata} component={<FaqContent />} />

export default Faq
