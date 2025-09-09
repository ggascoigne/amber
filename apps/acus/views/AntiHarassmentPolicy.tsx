import { MdxPage } from '@amber/ui'

import AntiHarassmentPolicyContent, { metadata } from '../content/AntiHarassmentPolicyContent.mdx'

const AntiHarassmentPolicy = () => <MdxPage frontMatter={metadata} component={<AntiHarassmentPolicyContent />} />

export default AntiHarassmentPolicy
