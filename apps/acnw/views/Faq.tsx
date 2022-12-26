import { MdxPage } from 'ui'
import * as content from '../content/FaqContent.mdx'

const { default: FaqContent, ...frontMatter } = content

const Faq = () => <MdxPage frontMatter={frontMatter} component={<FaqContent />} />

export default Faq
