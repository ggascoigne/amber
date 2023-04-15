import React, { PropsWithChildren } from 'react'

import { Theme } from '@mui/material'
import { makeStyles } from 'tss-react/mui'

import { CardHeader } from './Card'
import { GridItem } from './Grid'

const useStyles = makeStyles()((theme: Theme) => ({
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
    [theme.breakpoints.down('md')]: {
      marginLeft: 0,
      marginRight: 0,
    },
  },
}))

export const linkRenderer = (string: string) => {
  const linkExp = /^https?:\/\/[a-z0-9_./-]*$/i
  return (
    <>
      {string.split(/(https?:\/\/[a-z0-9_./-]*)/gi).map((part, k) => (
        <React.Fragment key={k}>
          {linkExp.exec(part) ? (
            <a
              href={part}
              onFocus={(e) => {
                e.stopPropagation()
              }}
              target='_blank'
              rel='noreferrer'
            >
              {part}
            </a>
          ) : (
            part
          )}
        </React.Fragment>
      ))}
    </>
  )
}

export const MultiLine: React.FC<{ text: string }> = ({ text }) => (
  <>
    {text.split('\n').map((i, key) => (
      <p key={key}>{linkRenderer(i)}</p>
    ))}
  </>
)

export const HeaderContent: React.FC<PropsWithChildren<{ name: string; tiny?: boolean }>> = ({
  name,
  tiny = false,
  children,
}) => {
  const { classes, cx } = useStyles()
  return (
    <CardHeader color='info' className={classes.header}>
      <GridItem container spacing={2} xs={12} md={12} style={{ paddingRight: 0 }}>
        <GridItem xs={12} sm={children ? 7 : 12}>
          <h4 className={cx({ [classes.tinyHeaderText]: tiny })}>{name}</h4>
        </GridItem>
        {children && (
          <GridItem xs={12} sm={5}>
            {children}
          </GridItem>
        )}
      </GridItem>
    </CardHeader>
  )
}

export const Field: React.FC<PropsWithChildren<{ label: string; small?: boolean; tiny?: boolean }>> = ({
  label,
  children,
  small,
  tiny = false,
}) => {
  const { classes, cx } = useStyles()
  return (
    <>
      <GridItem xs={12} sm={2} className={cx(classes.gridItem, classes.label)}>
        {label}
      </GridItem>
      <GridItem xs={12} sm={small ? 4 : tiny ? 8 : 10} className={classes.gridItem}>
        {children}
      </GridItem>
    </>
  )
}
