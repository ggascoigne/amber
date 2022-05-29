import { useTheme } from '@mui/material'
import { Page } from 'components/Page'

// @ts-ignore
import AboutAmberconNwContent, { frontMatter as acnwFm } from '../content/AboutAmberconNwContent.mdx'
// @ts-ignore
import AboutAmberconNwContentVirtual, { frontMatter as virtualFm } from '../content/AboutAmberconNwContentVirtual.mdx'
import { configuration, useYearFilter } from '../utils'
import { MdxPage } from './MdxPage'

const AboutAmberconNw = () => {
  const theme = useTheme()
  const [year] = useYearFilter()
  const isVirtual = configuration.startDates[year].virtual

  return !isVirtual ? (
    <MdxPage frontMatter={acnwFm} component={<AboutAmberconNwContent />} />
  ) : (
    <Page
      title={virtualFm.title}
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
