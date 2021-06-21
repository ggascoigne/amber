import { Typography, createStyles, makeStyles } from '@material-ui/core'
import classNames from 'classnames'
import React from 'react'

import { Card, CardBody, CardHeader } from '../Card'
import { GameCard } from '../GameCard'

const useStyles = makeStyles(
  createStyles({
    card: {
      width: 220,
      margin: '30px auto',
    },
    cardBody: {
      height: 267,
      padding: '0.9rem 20px',
    },
    greyCardHeader: {
      color: '#fff',
      background: 'linear-gradient(60deg, #a0a0a0, #888888)',
      boxShadow:
        '0 12px 20px -10px rgba(153, 153, 153, 0.28), 0 4px 20px 0px rgba(0, 0, 0, 0.12), 0 7px 8px -5px rgba(153, 153, 153, 0.2)',
    },
    yearTitle: {
      color: '#fff',
      textAlign: 'center',
      lineHeight: 1.4,
    },
    gameWrapper: {
      position: 'relative',
      height: 300,
      width: 295,
      transform: 'scale(0.6,0.6)',
      transformOrigin: 'top left',
      padding: '20px 0px',
    },
    fakeCard: {
      position: 'absolute',
      top: 20,
      left: 0,
      height: 279,
      width: 295,
    },
    fakeHeader2: {
      background: 'linear-gradient(60deg, #23b7cb, #019eb3)',
    },
    card2: {
      zIndex: 9,
      transform: 'rotateZ(1deg)',
    },
    fakeHeader3: {
      background: 'linear-gradient(60deg, #22afc2, #0197ab )',
    },
    card3: {
      zIndex: 8,
      transform: 'rotateZ(5deg)',
    },
  })
)

interface FakeTileProps {
  index: number
}

const FakeTile = ({ index }: FakeTileProps) => {
  const classes = useStyles()
  return (
    <Card className={classNames((classes as any)[`card${index}`], classes.fakeCard)}>
      <CardHeader className={(classes as any)[`fakeHeader${index}`]} />
      <CardBody />
    </Card>
  )
}

interface YearTileProps {
  year: number
  game: any
  onClick?: any
}

export const YearTile = ({ year, game, onClick }: YearTileProps) => {
  const classes = useStyles()
  return (
    <Card className={classes.card} onClick={onClick}>
      {' '}
      <CardBody className={classes.cardBody}>
        <CardHeader className={classes.greyCardHeader}>
          <Typography variant='h6' className={classes.yearTitle}>
            {year}
          </Typography>
        </CardHeader>
        <div className={classes.gameWrapper}>
          <GameCard game={game} year={year} slot={1} tiny />
          <FakeTile index={2} />
          <FakeTile index={3} />
        </div>
      </CardBody>
    </Card>
  )
}
