/* eslint-disable import/no-webpack-loader-syntax */
// @ts-ignore
import AccommodationsContent from '!babel-loader!@mdx-js/loader!../content/AccommodationsContent.mdx'
import { Page } from 'components/Page'
import React from 'react'

import { MdxWithExternalLinks } from '../components/MdxWithExternalLinks'

const Accommodations = () => (
  <Page title='About the AmberCon NW Venue'>
    <MdxWithExternalLinks>
      <AccommodationsContent />
    </MdxWithExternalLinks>
  </Page>
)

export default Accommodations
