/* eslint-disable import/no-webpack-loader-syntax */
// @ts-ignore
import AboutAmberContent from '!babel-loader!@mdx-js/loader!../content/AboutAmberContent.mdx'
import { Page } from 'components/Page'
import React from 'react'

import { MdxWithExternalLinks } from '../components/MdxWithExternalLinks'

const AboutAmber = () => (
  <Page title='What is Amber Roleplaying?'>
    <MdxWithExternalLinks>
      <AboutAmberContent />
    </MdxWithExternalLinks>
  </Page>
)

export default AboutAmber
