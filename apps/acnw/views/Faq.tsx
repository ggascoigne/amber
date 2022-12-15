import { MdxPage } from 'ui/components/MdxPage'
import * as content from '../content/FaqContent.mdx'

const { default: FaqContent, ...frontMatter } = content

const Faq = () => <MdxPage frontMatter={frontMatter} component={<FaqContent />} />

export default Faq
