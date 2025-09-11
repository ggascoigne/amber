import { MdxPage } from '@amber/ui'

import CovidPolicyContent, { metadata } from '../content/CovidPolicyContent.mdx'

const CovidPolicy = () => <MdxPage frontMatter={metadata} component={<CovidPolicyContent />} />

export default CovidPolicy
