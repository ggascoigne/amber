import { Card, Theme } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { makeStyles } from 'tss-react/mui'
import { CardBody } from 'ui'

import { useFlag } from '../utils'

const useStyles = makeStyles()((_theme: Theme) => ({
  card: {
    paddingTop: 0,
  },
  betaCard: {
    marginTop: 20,
    marginBottom: 20,
  },
}))

export const BetaWarning = () => {
  const isBeta = useFlag('is_beta')
  const theme = useTheme()
  const { classes } = useStyles()

  return isBeta ? (
    <Card className={classes.betaCard} elevation={3}>
      <CardBody className={classes.card}>
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
