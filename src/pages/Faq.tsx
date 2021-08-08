/* eslint-disable import/no-webpack-loader-syntax */
// @ts-ignore
import FaqContent from '!babel-loader!@mdx-js/loader!../content/FaqContent.mdx'
import { Page } from 'components/Page'
import React from 'react'

const Faq = () => (
  <Page title='Frequently Asked Questions'>
    <FaqContent />
  </Page>
)

export default Faq
