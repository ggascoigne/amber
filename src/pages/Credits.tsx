/* eslint-disable import/no-webpack-loader-syntax */
// @ts-ignore
import CreditsContent from '!babel-loader!@mdx-js/loader!../content/CreditsContent.mdx'
import { Page } from 'components/Page'
import React from 'react'

import { MdxWithExternalLinks } from '../components/MdxWithExternalLinks'

const Credits = () => (
  <Page title='Credits'>
    <MdxWithExternalLinks>
      <CreditsContent />
    </MdxWithExternalLinks>
  </Page>
)

export default Credits
