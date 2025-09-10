import { useConfiguration, useYearFilter } from '@amber/amber/utils'
import { FrontMatter, MdxPage, Page } from '@amber/ui'
import { useTheme } from '@mui/material/styles'

import AboutAmberconNwContent, { metadata as acnwFm } from '../content/AboutAmberconNwContent.mdx'
import AboutAmberconNwContentVirtual, { metadata as virtualFm } from '../content/AboutAmberconNwContentVirtual.mdx'

const AboutAmberconNw = () => {
  const theme = useTheme()
  const [year] = useYearFilter()
  const configuration = useConfiguration()
  const isVirtual = configuration.startDates[year]?.virtual

  console.log({ acnwFm, virtualFm })
  return isVirtual ? (
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
  ) : (
    <MdxPage frontMatter={acnwFm} component={<AboutAmberconNwContent />} />
  )
}

export default AboutAmberconNw
