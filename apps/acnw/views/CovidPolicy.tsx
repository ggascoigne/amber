import { MdxPage } from 'ui/components/MdxPage'
import * as content from '../content/CovidPolicyContent.mdx'

const { default: CovidPolicyContent, ...frontMatter } = content

const CovidPolicy = () => <MdxPage frontMatter={frontMatter} component={<CovidPolicyContent />} />

export default CovidPolicy
