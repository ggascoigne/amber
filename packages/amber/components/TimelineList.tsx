import React from 'react'

import { Theme } from '@mui/material'
import { DateTime } from 'luxon'
import { makeStyles } from 'tss-react/mui'

import { useConfiguration } from '../utils'

import { MDY } from '.'

const useStyles = makeStyles()((theme: Theme) => ({
  listItem: {
    paddingTop: 5,
    paddingBottom: 5,
  },
  card: {
    marginTop: 20,
    marginBottom: 20,
  },
  cardBody: {
    paddingTop: 0,
  },
  deadline: {
    paddingTop: 5,
    paddingBottom: 5,
  },
  deadlineExpired: {
    paddingTop: 5,
    paddingBottom: 5,
    color: theme.palette.grey[700],
    textDecoration: 'line-through',
    '&:after': {
      content: '" - DEADLINE PASSED"',
    },
  },
}))

interface TimelineListProps {
  ignoreBeforeDateConfig?: string
}

export const TimelineList: React.FC<TimelineListProps> = ({ ignoreBeforeDateConfig }) => {
  const { classes } = useStyles()
  const configuration = useConfiguration()
  let timelineArray = Object.entries(configuration.timelineDates).sort((arr1, arr2) => {
    if (arr1[1] > arr2[1]) {
      return 1
    }
    if (arr1[1] < arr2[1]) {
      return -1
    }
    return 0
  })
  if (ignoreBeforeDateConfig) {
    const ignoreBeforeDateItem = timelineArray.find((i) => i[0] === ignoreBeforeDateConfig)
    if (ignoreBeforeDateItem !== undefined) {
      const ignoreBeforeDate = ignoreBeforeDateItem[1]
      timelineArray = timelineArray.filter((i) => i[1] >= ignoreBeforeDate)
    }
  }
  return (
    <>
      <h2>Deadline Dates</h2>
      <ul>
        {timelineArray.map(([deadlineLabel, deadlineDate]) => {
          if (deadlineLabel !== '') {
            return (
              <li key={deadlineLabel}>
                <span className={deadlineDate < DateTime.now() ? classes.deadlineExpired : classes.deadline}>
                  {deadlineLabel}: {deadlineDate.setZone(configuration.baseTimeZone).toLocaleString(MDY)}
                </span>
              </li>
            )
          } else {
            return null
          }
        })}
      </ul>
    </>
  )
}
