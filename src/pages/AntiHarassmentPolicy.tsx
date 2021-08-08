import React from 'react'

// @ts-ignore
import AntiHarassmentPolicyContent, { frontMatter } from '../content/AntiHarassmentPolicyContent.mdx'
import { MdxPage } from './MdxPage'

const AntiHarassmentPolicy = () => <MdxPage frontMatter={frontMatter} component={<AntiHarassmentPolicyContent />} />

export default AntiHarassmentPolicy
