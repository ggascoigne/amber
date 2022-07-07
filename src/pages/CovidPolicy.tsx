// @ts-ignore
import CovidPolicyContent, { frontMatter } from '../content/CovidPolicyContent.mdx'
import { MdxPage } from './MdxPage'

const CovidPolicy = () => <MdxPage frontMatter={frontMatter} component={<CovidPolicyContent />} />

export default CovidPolicy
