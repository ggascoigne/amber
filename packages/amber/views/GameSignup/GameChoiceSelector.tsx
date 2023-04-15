/* eslint-disable @getify/proper-ternary/nested */
import React, { useEffect } from 'react'

import CheckIcon from '@mui/icons-material/Check'
import { Theme, ToggleButton, ToggleButtonGroup } from '@mui/material'
import { makeStyles } from 'tss-react/mui'

import { Game, GameChoice, GameEntry, Maybe } from '../../client'
import { Perms, useAuth } from '../../components/Auth'
import { Configuration, useConfiguration } from '../../utils'

export const isNoGame = (configuration: Configuration, id: number) => {
  const acus = configuration.numberOfSlots === 8
  if (acus) {
    return id >= 596 && id <= 603
  } else {
    return id <= 7
  }
}

// 144 is the magic number of the Any Game entry :(
export const isAnyGame = (configuration: Configuration, id: number) => {
  const acus = configuration.numberOfSlots === 8
  if (acus) {
    return id === 604
  } else {
    return id === 144
  }
}

const useStyles = makeStyles()((_theme: Theme) => ({
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
  full: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: 52,
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
  fullDecorator: {
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
    color: 'rgb(8,80,102)',
    backgroundColor: 'white',
    padding: '5px',
    borderColor: 'rgb(8,80,102)',
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
    color: '#ffe100',
    position: 'absolute',
    left: -6,
    bottom: -8,
  },
}))

export enum RankStyle {
  small,
  superscript,
  plain,
}

export const rankString = (rank: number | null) => {
  switch (rank) {
    case 0:
      return 'GM'
    case 1:
      return '1st'
    case 2:
      return '2nd'
    case 3:
      return '3rd'
    case 4:
      return '4th'
    default:
      return null
  }
}

export const Rank: React.FC<{ rank: number | null; rankStyle?: RankStyle }> = ({
  rank,
  rankStyle = RankStyle.superscript,
}) => {
  if (rankStyle === RankStyle.small) {
    if (rank === 0) {
      return <>GM</>
    }
    return <>{rank}</>
  }

  if (rankStyle === RankStyle.plain) {
    return <>{rankString(rank)}</>
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

export type MaybeGameChoice =
  | Maybe<
      { __typename: 'GameChoice' } & Pick<
        GameChoice,
        'gameId' | 'id' | 'memberId' | 'nodeId' | 'rank' | 'returningPlayer' | 'slotId' | 'year'
      > & { game?: Maybe<{ __typename: 'Game' } & Pick<Game, 'year' | 'name'>> }
    >
  | undefined

export interface SelectorUpdate {
  gameChoices?: MaybeGameChoice[]
  gameId: number
  rank: number | null
  oldRank: number | null
  returningPlayer: boolean
  slotId: number
  year: number
}

export interface SelectorParams {
  gameChoices?: MaybeGameChoice[]
  updateChoice?: (params: SelectorUpdate) => void
  gmSlots?: MaybeGameChoice[]
}

export type GameChoiceSelectorProps = {
  year: number
  slot: number
  game: GameEntry
} & SelectorParams

export const GameChoiceSelector: React.FC<GameChoiceSelectorProps> = ({
  year,
  slot,
  game,
  gameChoices,
  updateChoice,
  gmSlots,
}) => {
  const { classes, cx } = useStyles()
  const thisOne = gameChoices?.filter((c) => c?.year === year && c.gameId === game.id && c.slotId === slot)?.[0]
  const [rank, setRank] = React.useState<number | null>(thisOne?.rank ?? null)
  const [returning, setReturning] = React.useState(thisOne?.returningPlayer ?? false)
  const { hasPermissions } = useAuth()
  const isAdmin = hasPermissions(Perms.IsAdmin)
  const configuration = useConfiguration()

  const isGmThisSlot = !!gmSlots?.filter((c) => c?.slotId === slot)?.length

  useEffect(() => {
    setRank(thisOne?.rank ?? null)
  }, [thisOne])

  const handlePriority = (event: React.MouseEvent<HTMLElement>, newRank: number | null) => {
    setRank(newRank)
    updateChoice?.({
      gameChoices,
      gameId: game.id,
      rank: newRank,
      oldRank: rank,
      returningPlayer: returning,
      slotId: slot,
      year,
    })
  }

  const handleReturning = () => {
    setReturning(!returning)
    updateChoice?.({
      gameChoices,
      gameId: game.id,
      rank,
      oldRank: rank,
      returningPlayer: !returning,
      slotId: slot,
      year,
    })
  }

  const isNoOrAnyGame = isNoGame(configuration, game.id) || isAnyGame(configuration, game.id)

  if (game.full && !isAdmin) {
    return (
      <>
        <div className={classes.spacer} />
        <div className={classes.container}>
          <div className={classes.full}>This game is full, no more spaces available.</div>
        </div>
      </>
    )
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
            {isAdmin && !isNoOrAnyGame && (
              <ToggleButton className={classes.button} value={0} aria-label='GM'>
                <Rank rank={0} />
              </ToggleButton>
            )}
            {isAdmin ? (
              <ToggleButton className={classes.button} value={1} aria-label='first'>
                <Rank rank={1} />
              </ToggleButton>
            ) : (
              <ToggleButton
                disabled={isGmThisSlot && !isAdmin}
                className={classes.button}
                value={rank === 0 ? 0 : 1}
                aria-label='first'
              >
                {rank === 0 ? <Rank rank={0} /> : <Rank rank={1} />}
              </ToggleButton>
            )}
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
        {!isNoOrAnyGame && (
          <div className={classes.row}>
            <ToggleButton
              value={returning}
              selected={returning}
              onChange={handleReturning}
              className={cx(classes.returning, classes.button)}
            >
              Returning Player
            </ToggleButton>
          </div>
        )}
      </div>
    </>
  )
}

export const GameChoiceDecorator: React.FC<GameChoiceSelectorProps> = ({ year, slot, game, gameChoices }) => {
  const { classes } = useStyles()
  const thisOne = gameChoices?.filter((c) => c?.year === year && c.gameId === game.id && c.slotId === slot)?.[0]
  const rank = thisOne?.rank ?? null // rank is numeric and zero is a valid value!

  return (
    <>
      {game.full && <div className={classes.fullDecorator}>full</div>}
      {rank !== null && (
        <div className={classes.rankDecorator}>
          <Rank rank={rank} rankStyle={RankStyle.small} />
        </div>
      )}
    </>
  )
}

type SlotDecoratorCheckMarkProps = { year: number; slot: number } & SelectorParams

// 144 is the magic number of the Any Game entry :(
const isNoGameOrAnyGame = (configuration: Configuration, choice?: MaybeGameChoice) => {
  const id = choice?.gameId
  return id && (isNoGame(configuration, id) || isAnyGame(configuration, id))
}

export const orderChoices = (choices?: MaybeGameChoice[]) => [
  choices?.find((c) => c?.rank === 0),
  choices?.find((c) => c?.rank === 1),
  choices?.find((c) => c?.rank === 2),
  choices?.find((c) => c?.rank === 3),
  choices?.find((c) => c?.rank === 4),
]

export const isSlotComplete = (configuration: Configuration, choices?: MaybeGameChoice[]) => {
  if (!choices?.length) return false

  const ordered = orderChoices(choices)

  const firstOrRunning = ordered[1]?.gameId ?? ordered[0]?.gameId
  if (firstOrRunning && ordered[2]?.gameId && ordered[3]?.gameId && ordered[4]?.gameId) return true
  if (isNoGameOrAnyGame(configuration, ordered[1])) return true
  if (firstOrRunning && isNoGameOrAnyGame(configuration, ordered[2])) return true
  if (firstOrRunning && ordered[2]?.gameId && isNoGameOrAnyGame(configuration, ordered[3])) return true
  return !!(firstOrRunning && ordered[2]?.gameId && ordered[3]?.gameId && isNoGameOrAnyGame(configuration, ordered[4]))
}

export const SlotDecoratorCheckMark: React.FC<SlotDecoratorCheckMarkProps> = ({ year, slot, gameChoices }) => {
  const { classes } = useStyles()
  const configuration = useConfiguration()
  const thisSlotChoices = gameChoices?.filter((c) => c?.year === year && c.slotId === slot + 1)
  const isComplete = isSlotComplete(configuration, thisSlotChoices)
  return isComplete ? <CheckIcon className={classes.check} /> : null
}
