import { MdxPage } from '@amber/amber'

import AntiHarassmentPolicyContent, { metadata } from '../content/AntiHarassmentPolicyContent.mdx'

const AntiHarassmentPolicy = () => <MdxPage frontMatter={metadata} component={<AntiHarassmentPolicyContent />} />

export default AntiHarassmentPolicy
