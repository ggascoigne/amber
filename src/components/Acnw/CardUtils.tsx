import { makeStyles } from '@material-ui/core'
import classNames from 'classnames'
import React from 'react'

import CardHeader from '../MaterialKitReact/Card/CardHeader'
import { GridItem } from './Grid'

const useStyles = makeStyles({
  gridItem: {
    paddingBottom: 10,
  },
  label: {
    fontWeight: 500,
    minWidth: 80,
  },
  tinyHeaderText: {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
  header: {
    display: 'flex',
    flex: 1,
    justifyContent: 'space-between',
  },
})

export const MultiLine: React.FC<{ text: string }> = ({ text }) => (
  <>
    {text.split('\n').map((i, key) => (
      <p key={key}>{i}</p>
    ))}
  </>
)

export const HeaderContent: React.FC<{ name: string; tiny?: boolean }> = ({ name, tiny = false, children }) => {
  const classes = useStyles()
  return (
    <CardHeader color='info' className={classes.header}>
      <GridItem container spacing={2} xs={12} md={12} style={{ paddingRight: 0 }}>
        <GridItem xs={12} sm={7}>
          <h4 className={classNames({ [classes.tinyHeaderText]: tiny })}>{name}</h4>
        </GridItem>
        <GridItem xs={12} sm={5}>
          {children}
        </GridItem>
      </GridItem>
    </CardHeader>
  )
}

export const Field: React.FC<{ label: string; small?: boolean; tiny?: boolean }> = ({
  label,
  children,
  small,
  tiny = false,
}) => {
  const classes = useStyles()
  return (
    <>
      <GridItem xs={12} sm={2} className={classNames(classes.gridItem, classes.label)}>
        {label}
      </GridItem>
      <GridItem xs={12} sm={small ? 4 : tiny ? 8 : 10} className={classes.gridItem}>
        {children}
      </GridItem>
    </>
  )
}
