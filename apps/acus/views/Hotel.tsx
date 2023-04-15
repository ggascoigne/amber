import { MdxPage } from 'ui'

import * as content from '../content/HotelContent.mdx'

const { default: HotelContent, ...frontMatter } = content

const Hotel = () => <MdxPage frontMatter={frontMatter} component={<HotelContent />} />

export default Hotel
