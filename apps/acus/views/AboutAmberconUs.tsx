import { useConfiguration, useYearFilter } from '@amber/amber/utils'
import { FrontMatter, MdxPage, Page } from '@amber/ui'
import { useTheme } from '@mui/material/styles'

import AboutAmberconNwContent, { metadata as acusFm } from '../content/AboutAmberconUsContent.mdx'
import AboutAmberconNwContentVirtual, { metadata as virtualFm } from '../content/AboutAmberconUsContentVirtual.mdx'

const AboutAmberconUs = () => {
  const theme = useTheme()
  const [year] = useYearFilter()
  const configuration = useConfiguration()

  const isVirtual = configuration.startDates[year].virtual

  return !isVirtual ? (
    <MdxPage frontMatter={acusFm} component={<AboutAmberconNwContent />} />
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
