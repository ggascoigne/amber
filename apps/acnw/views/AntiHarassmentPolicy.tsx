import { MdxPage } from 'ui/components/MdxPage'
import * as content from '../content/AntiHarassmentPolicyContent.mdx'

const { default: AntiHarassmentPolicyContent, ...frontMatter } = content

const AntiHarassmentPolicy = () => <MdxPage frontMatter={frontMatter} component={<AntiHarassmentPolicyContent />} />

export default AntiHarassmentPolicy
