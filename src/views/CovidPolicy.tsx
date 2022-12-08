import { MdxPage } from './MdxPage'
import * as content from '../content/CovidPolicyContent.mdx'

const { default: CovidPolicyContent, ...frontMatter } = content

const CovidPolicy = () => <MdxPage frontMatter={frontMatter} component={<CovidPolicyContent />} />

export default CovidPolicy
