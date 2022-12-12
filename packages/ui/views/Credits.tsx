import { MdxPage } from './MdxPage'
import * as content from '../content/CreditsContent.mdx'

const { default: CreditsContent, ...frontMatter } = content

const Credits = () => <MdxPage frontMatter={frontMatter} component={<CreditsContent />} />

export default Credits
