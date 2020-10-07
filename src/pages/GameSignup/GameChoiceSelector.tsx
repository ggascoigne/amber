import { Theme, makeStyles } from '@material-ui/core'
import createStyles from '@material-ui/core/styles/createStyles'
import CheckIcon from '@material-ui/icons/Check'
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab'
import classNames from 'classnames'
import { Game, GameChoice, Maybe } from 'client'
import { GameCardChild } from 'components/Acnw'
import React, { useEffect } from 'react'

import { range } from '../../utils'

const isNoGame = (id: number) => id <= 7
// 144 is the magic number of the Any Game entry :(
const isAnyGame = (id: number) => id === 144

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    spacer: {
      flex: '1 0 auto',
      display: 'flex',
      flexDirection: 'row',
    },
    container: {
      flex: '1 1 auto',
      display: 'flex',
      flexDirection: 'column',
      margin: '-3px 0',
    },
    row: {
      flex: '1 1 auto',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      '&:last-of-type': {
        paddingTop: 3,
      },
    },
    label: {
      width: 60,
      textAlign: 'inherit',
      textTransform: 'inherit',
      // flex: 1,
    },
    returning: {
      textAlign: 'end',
      textTransform: 'inherit',
      // flex: 1,
    },
    button: {
      textTransform: 'inherit',
      color: 'white',
      padding: '5px 7px',
      borderColor: 'white',
      '& sup': {
        lineHeight: 0,
        display: 'inline-block',
        paddingBottom: 3,
      },
      '&:hover': {
        backgroundColor: 'rgba(102, 8, 22, .3)',
      },
      '&.Mui-selected': {
        color: 'white',
        backgroundColor: 'rgba(102, 8, 22, 1)',
        borderLeftColor: 'white',
        '&:hover': {
          backgroundColor: 'rgba(102, 8, 22, .6)',
        },
      },
    },
    rankDecorator: {
      justifyContent: 'center',
      alignItems: 'center',
      display: 'flex',
      textTransform: 'inherit',
      width: 30,
      borderRadius: 15,
      borderWidth: 1,
      fontSize: '0.72rem',
      flexGrow: 0,
      flexShrink: 0,
      color: 'rgba(102, 8, 22, 1)',
      backgroundColor: 'white',
      padding: '5px',
      borderColor: 'rgba(102, 8, 22, 1)',
      lineHeight: '18px',
      borderStyle: 'solid',
      margin: -6,
      '& sup': {
        lineHeight: 0,
        display: 'inline-block',
        paddingBottom: 3,
      },
    },
    check: {
      color: '#fcc60a',
      position: 'absolute',
      left: -6,
      bottom: -8,
    },
  })
)

const Rank: React.FC<{ rank: number | null; small?: boolean }> = ({ rank, small = false }) => {
  if (small) {
    if (rank === 0) {
      return <>GM</>
    } else {
      return <>{rank}</>
    }
  }

  switch (rank) {
    case 0:
      return <>GM</>
    case 1:
      return (
        <>
          1<sup>st</sup>
        </>
      )
    case 2:
      return (
        <>
          2<sup>nd</sup>
        </>
      )
    case 3:
      return (
        <>
          3<sup>rd</sup>
        </>
      )
    case 4:
      return (
        <>
          4<sup>th</sup>
        </>
      )
    default:
      return null
  }
}

export type MaybeGameChoice = Maybe<
  { __typename: 'GameChoice' } & Pick<
    GameChoice,
    'gameId' | 'id' | 'memberId' | 'nodeId' | 'rank' | 'returningPlayer' | 'slotId' | 'year'
  > & { game?: Maybe<{ __typename: 'Game' } & Pick<Game, 'year' | 'name'>> }
>

export type SelectorUpdate = {
  gameChoices?: MaybeGameChoice[]
  gameId: number
  rank: number | null
  oldRank: number | null
  returningPlayer: boolean
  slotId: number
  year: number
}

export type SelectorParams = {
  gameChoices?: MaybeGameChoice[]
  updateChoice?: (params: SelectorUpdate) => void
}

export type GameChoiceSelector = GameCardChild & SelectorParams

export const GameChoiceSelector: React.FC<GameChoiceSelector> = ({ year, slot, gameId, gameChoices, updateChoice }) => {
  const classes = useStyles()
  const thisOne = gameChoices?.filter((c) => c?.year === year && c?.gameId === gameId && c?.slotId === slot)?.[0]
  const [rank, setRank] = React.useState<number | null>(thisOne?.rank ?? null)
  const [returning, setReturning] = React.useState(thisOne?.returningPlayer ?? false)

  useEffect(() => {
    setRank(thisOne?.rank ?? null)
  }, [thisOne])

  const handlePriority = (event: React.MouseEvent<HTMLElement>, newRank: number | null) => {
    setRank(newRank)
    updateChoice &&
      updateChoice({
        gameChoices,
        gameId,
        rank: newRank,
        oldRank: rank,
        returningPlayer: returning,
        slotId: slot,
        year,
      })
  }

  const handleReturning = () => {
    setReturning(!returning)
    updateChoice &&
      updateChoice({
        gameChoices,
        gameId,
        rank,
        oldRank: rank,
        returningPlayer: !returning,
        slotId: slot,
        year,
      })
  }

  return (
    <>
      <div className={classes.spacer} />
      <div
        className={classes.container}
        onClick={(event) => event.stopPropagation()}
        onFocus={(event) => event.stopPropagation()}
      >
        <div className={classes.row}>
          <div className={classes.label}>Choice</div>
          <ToggleButtonGroup size='small' value={rank} exclusive onChange={handlePriority} aria-label='game priority'>
            <ToggleButton className={classes.button} value={0} aria-label='GM'>
              <Rank rank={0} />
            </ToggleButton>
            <ToggleButton className={classes.button} value={1} aria-label='first'>
              <Rank rank={1} />
            </ToggleButton>
            <ToggleButton className={classes.button} value={2} aria-label='second'>
              <Rank rank={2} />
            </ToggleButton>
            <ToggleButton className={classes.button} value={3} aria-label='third'>
              <Rank rank={3} />
            </ToggleButton>
            <ToggleButton className={classes.button} value={4} aria-label='fourth'>
              <Rank rank={4} />
            </ToggleButton>
          </ToggleButtonGroup>
        </div>
        {!(isNoGame(gameId) || isAnyGame(gameId)) && (
          <div className={classes.row}>
            <ToggleButton
              value={returning}
              selected={returning}
              onChange={handleReturning}
              className={classNames(classes.returning, classes.button)}
            >
              Returning Player
            </ToggleButton>
          </div>
        )}
      </div>
    </>
  )
}

export const GameChoiceDecorator: React.FC<GameChoiceSelector> = ({ year, slot, gameId, gameChoices }) => {
  const classes = useStyles()
  const thisOne = gameChoices?.filter((c) => c?.year === year && c?.gameId === gameId && c?.slotId === slot)?.[0]
  const rank = thisOne?.rank ?? null // rank is numeric and zero is a valid value!

  return rank !== null ? (
    <div className={classes.rankDecorator}>
      <Rank rank={rank} small />
    </div>
  ) : null
}

type SlotDecoratorCheckMark = { year: number; slot: number } & SelectorParams

// 144 is the magic number of the Any Game entry :(
const isNoGameOrAnyGame = (choice?: MaybeGameChoice) => {
  const id = choice?.gameId
  return id && (isNoGame(id) || isAnyGame(id))
}

export const orderChoices = (choices?: MaybeGameChoice[]) => [
  choices?.find((c) => c?.rank === 0),
  choices?.find((c) => c?.rank === 1),
  choices?.find((c) => c?.rank === 2),
  choices?.find((c) => c?.rank === 3),
  choices?.find((c) => c?.rank === 4),
]

const isSlotComplete = (choices?: MaybeGameChoice[]) => {
  if (!choices?.length) return false

  const ordered = orderChoices(choices)

  const firstOrRunning = ordered[1]?.gameId ?? ordered[0]?.gameId
  if (firstOrRunning && ordered[2]?.gameId && ordered[3]?.gameId && ordered[4]?.gameId) return true
  if (isNoGameOrAnyGame(ordered[1])) return true
  if (firstOrRunning && isNoGameOrAnyGame(ordered[2])) return true
  if (firstOrRunning && ordered[2]?.gameId && isNoGameOrAnyGame(ordered[3])) return true
  return !!(firstOrRunning && ordered[2]?.gameId && ordered[3]?.gameId && isNoGameOrAnyGame(ordered[4]))
}

export const allSlotsComplete = (year: number, gameChoices?: MaybeGameChoice[]) =>
  range(0, 7).reduce(
    (acc, slot) => acc && isSlotComplete(gameChoices?.filter((c) => c?.year === year && c?.slotId === slot + 1)),
    true
  )

export const SlotDecoratorCheckMark: React.FC<SlotDecoratorCheckMark> = ({ year, slot, gameChoices }) => {
  const classes = useStyles()
  const thisSlotChoices = gameChoices?.filter((c) => c?.year === year && c?.slotId === slot + 1)
  const isComplete = isSlotComplete(thisSlotChoices)
  return isComplete ? <CheckIcon className={classes.check} /> : null
}
