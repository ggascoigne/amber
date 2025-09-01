import { MdxPage } from '@amber/ui'

import * as content from '../content/CovidPolicyContent.mdx'

const { default: CovidPolicyContent, ...frontMatter } = content

const CovidPolicy = () => <MdxPage frontMatter={frontMatter} component={<CovidPolicyContent />} />

export default CovidPolicy
