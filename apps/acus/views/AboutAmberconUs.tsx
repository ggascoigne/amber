import type { FrontMatter } from '@amber/amber'
import { MdxPage, Page } from '@amber/amber'
import { useConfiguration, useYearFilter } from '@amber/amber/utils'
import { useTheme } from '@mui/material/styles'

import AboutAmberconNwContent, { metadata as acusFm } from '../content/AboutAmberconUsContent.mdx'
import AboutAmberconNwContentVirtual, { metadata as virtualFm } from '../content/AboutAmberconUsContentVirtual.mdx'

const AboutAmberconUs = () => {
  const theme = useTheme()
  const [year] = useYearFilter()
  const configuration = useConfiguration()

  const isVirtual = configuration.startDates[year].virtual

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
    <MdxPage frontMatter={acusFm} component={<AboutAmberconNwContent />} />
  )
}

export default AboutAmberconUs
