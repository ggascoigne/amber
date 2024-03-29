import { MdxPage } from 'ui'

import * as content from '../content/AntiHarassmentPolicyContent.mdx'

const { default: AntiHarassmentPolicyContent, ...frontMatter } = content

const AntiHarassmentPolicy = () => <MdxPage frontMatter={frontMatter} component={<AntiHarassmentPolicyContent />} />

export default AntiHarassmentPolicy
