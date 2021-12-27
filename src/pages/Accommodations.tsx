// @ts-ignore
import AccommodationsContent, { frontMatter } from '../content/AccommodationsContent.mdx'
import { MdxPage } from './MdxPage'

const Accommodations = () => <MdxPage frontMatter={frontMatter} component={<AccommodationsContent />} />

export default Accommodations
