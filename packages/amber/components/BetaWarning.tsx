import { CardBody } from '@amber/ui'
import { Card } from '@mui/material'
import { useTheme } from '@mui/material/styles'

import { useFlag } from '../utils'

export const BetaWarning = () => {
  const isBeta = useFlag('is_beta')
  const theme = useTheme()

  return isBeta ? (
    <Card sx={{ mt: '20px', mb: '20px' }} elevation={3}>
      <CardBody sx={{ pt: 0 }}>
        <h2 style={{ color: theme.palette.error.main }}>Beta</h2>
        <p>
          This version of the site is a work in progress. All changes should be considered temporary and are very likely
          to get rolled back.
        </p>

        <p>Feel free to look around, but if things seem broken or incomplete, assume that they are being worked on.</p>
      </CardBody>
    </Card>
  ) : null
}
