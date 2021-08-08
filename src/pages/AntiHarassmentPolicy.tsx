/* eslint-disable import/no-webpack-loader-syntax */
// @ts-ignore
import AntiHarassmentPolicyContent from '!babel-loader!@mdx-js/loader!../content/AntiHarassmentPolicyContent.mdx'
import { MdxWithExternalLinks } from 'components/MdxWithExternalLinks'
import { Page } from 'components/Page'
import React from 'react'

const AntiHarassmentPolicy = () => (
  <Page title='Anti-harassment' titleElement={<h1>AmberCon NW's Anti-harassment policy</h1>}>
    <MdxWithExternalLinks>
      <AntiHarassmentPolicyContent />
    </MdxWithExternalLinks>{' '}
  </Page>
)

export default AntiHarassmentPolicy
