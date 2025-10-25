import { MdxPage } from '@amber/amber'

import AccommodationsContent, { metadata } from '../content/AccommodationsContent.mdx'

const Accommodations = () => <MdxPage frontMatter={metadata} component={<AccommodationsContent />} />

export default Accommodations
