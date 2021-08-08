/* eslint-disable import/no-webpack-loader-syntax */
// @ts-ignore
import AboutAmberconNwContent from '!babel-loader!@mdx-js/loader!../content/AboutAmberconNwContent.mdx'
/* eslint-disable import/no-webpack-loader-syntax */
// @ts-ignore
import AboutAmberconNwContentVirtual from '!babel-loader!@mdx-js/loader!../content/AboutAmberconNwContentVirtual.mdx'
import { useTheme } from '@material-ui/core'
import { Page } from 'components/Page'
import React from 'react'

import { configuration, useYearFilter } from '../utils'

const AboutAmberconNw = () => {
  const theme = useTheme()
  const [year] = useYearFilter()
  const isVirtual = configuration.startDates[year].virtual

  const titleElement = isVirtual ? (
    <h1>
      About <span style={{ color: theme.palette.error.main }}>virtual</span> AmberCon NW
    </h1>
  ) : (
    <h1>About AmberCon NW</h1>
  )
  return (
    <Page title='About' titleElement={titleElement}>
      {isVirtual ? <AboutAmberconNwContentVirtual /> : <AboutAmberconNwContent />}
    </Page>
  )
}

export default AboutAmberconNw
