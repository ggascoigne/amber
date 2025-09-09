import { MdxPage } from '@amber/ui'

import AccommodationsContent, { metadata } from '../content/AccommodationsContent.mdx'

const Accommodations = () => <MdxPage frontMatter={metadata} component={<AccommodationsContent />} />

export default Accommodations
