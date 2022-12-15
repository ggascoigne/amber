import { useTheme } from '@mui/material'
import { Page } from 'ui/components/Page'

import { configuration, useYearFilter } from 'ui/utils'
import { FrontMatter, MdxPage } from 'ui/components/MdxPage'

import * as aboutAmberconNwContent from '../content/AboutAmberconNwContent.mdx'
import * as aboutAmberconNwContentVirtual from '../content/AboutAmberconNwContentVirtual.mdx'

const { default: AboutAmberconNwContent, ...acnwFm } = aboutAmberconNwContent
const { default: AboutAmberconNwContentVirtual, ...virtualFm } = aboutAmberconNwContentVirtual

const AboutAmberconNw = () => {
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

export default AboutAmberconNw
