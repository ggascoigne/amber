import React from 'react'

import { Card, Theme } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { DateTime } from 'luxon'
import { makeStyles } from 'tss-react/mui'
import { CardBody } from 'ui'

import { useConfiguration } from '../utils'

import { ConfigDate, ContactEmail, MDY } from '.'

const useStyles = makeStyles()((_theme: Theme) => ({
  card: {
    paddingTop: 0,
  },
  cutoffDateCard: {
    marginTop: 20,
    marginBottom: 20,
  },
}))

interface CutoffDateWarningProps {
  cutoffDateConfig: string
}

export const CutoffDateWarning: React.FC<CutoffDateWarningProps> = ({ cutoffDateConfig }) => {
  const configuration = useConfiguration()
  const timelineArray = Object.entries(configuration.timelineDates)
  let showCutoff = false
  if (cutoffDateConfig !== '') {
    const cutoffDateConfigItem = timelineArray.find((i) => i[0] === cutoffDateConfig)
    if (cutoffDateConfigItem !== undefined) {
      const cutoffDate = cutoffDateConfigItem[1]
      showCutoff = cutoffDate < DateTime.now()
    }
  }
  const theme = useTheme()
  const { classes } = useStyles()

  return showCutoff ? (
    <Card className={classes.cutoffDateCard} elevation={3}>
      <CardBody className={classes.card}>
        <h2 style={{ color: theme.palette.error.main }}>
          You are accessing this site after the cutoff date <ConfigDate name={cutoffDateConfig} format={MDY} />
        </h2>
        <p>
          Please contact the organizers by e-mail at <ContactEmail /> before registering.
        </p>
      </CardBody>
    </Card>
  ) : null
}
