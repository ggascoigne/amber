import { MdxPage } from '@amber/ui'

import CreditsContent, { metadata } from '../content/CreditsContent.mdx'

const Credits = () => <MdxPage frontMatter={metadata} component={<CreditsContent />} />

export default Credits
