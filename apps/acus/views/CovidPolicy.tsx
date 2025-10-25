import { MdxPage } from '@amber/amber'

import CovidPolicyContent, { metadata } from '../content/CovidPolicyContent.mdx'

const CovidPolicy = () => <MdxPage frontMatter={metadata} component={<CovidPolicyContent />} />

export default CovidPolicy
