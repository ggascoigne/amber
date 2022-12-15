import { MdxPage } from 'ui/components/MdxPage'
import * as content from '../content/AccommodationsContent.mdx'

const { default: AccommodationsContent, ...frontMatter } = content

const Accommodations = () => <MdxPage frontMatter={frontMatter} component={<AccommodationsContent />} />

export default Accommodations
