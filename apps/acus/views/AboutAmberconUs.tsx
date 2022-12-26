import { useTheme } from '@mui/material'
import { FrontMatter, MdxPage, Page } from 'ui'

import { configuration, useYearFilter } from 'amber/utils'

import * as aboutAmberconUsContent from '../content/AboutAmberconUsContent.mdx'
import * as aboutAmberconUsContentVirtual from '../content/AboutAmberconUsContentVirtual.mdx'

const { default: AboutAmberconNwContent, ...acnwFm } = aboutAmberconUsContent
const { default: AboutAmberconNwContentVirtual, ...virtualFm } = aboutAmberconUsContentVirtual

const AboutAmberconUs = () => {
  const theme = useTheme()
  const [year] = useYearFilter()
  const isVirtual = configuration.startDates[year].virtual

  return !isVirtual ? (
    <MdxPage frontMatter={acnwFm} component={<AboutAmberconNwContent />} />
  ) : (
    <Page
      title={(virtualFm as FrontMatter).title}
      titleElement={
        <h1>
          About <span style={{ color: theme.palette.error.main }}>virtual</span> AmberCon NW
        </h1>
      }
    >
      <AboutAmberconNwContentVirtual />
    </Page>
  )
}

export default AboutAmberconUs
