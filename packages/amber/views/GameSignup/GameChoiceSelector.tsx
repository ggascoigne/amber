import React, { useEffect } from 'react'

import type { Game, GameChoice } from '@amber/client'
import CheckIcon from '@mui/icons-material/Check'
import { ToggleButton, ToggleButtonGroup } from '@mui/material'

import { Perms, useAuth } from '../../components/Auth'
import type { GameCategoryByGameId } from '../../utils'
import { isAnyGameCategory, isAnyGameId, isNoGameCategory, isNoGameId } from '../../utils'

export const isNoGame = (gameCategoryByGameId: GameCategoryByGameId, id: number | null | undefined) =>
  isNoGameId(gameCategoryByGameId, id)

export const isAnyGame = (gameCategoryByGameId: GameCategoryByGameId, id: number | null | undefined) =>
  isAnyGameId(gameCategoryByGameId, id)

const EMPTY_GAME_CATEGORY_BY_GAME_ID: GameCategoryByGameId = new Map()

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

type RankProps = {
  rank: number | null
  rankStyle?: RankStyle
}
export const Rank = ({ rank, rankStyle = RankStyle.superscript }: RankProps) => {
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

export interface SelectorUpdate {
  gameChoices?: GameChoice[]
  gameId: number
  rank: number | null
  oldRank: number | null
  returningPlayer: boolean
  slotId: number
  year: number
}

export interface SelectorParams {
  gameChoices?: GameChoice[]
  updateChoice?: (params: SelectorUpdate) => void
  gmSlots?: GameChoice[]
  gameCategoryByGameId?: GameCategoryByGameId
}

export type GameChoiceSelectorProps = {
  year: number
  slot: number
  game: Game
} & SelectorParams

const toggleButtonSx = {
  textTransform: 'inherit',
  color: 'white',
  p: '5px 7px',
  borderColor: 'white',
  '&:hover': { backgroundColor: 'rgba(102, 8, 22, .3)' },
  '&.Mui-selected': {
    color: 'white',
    backgroundColor: 'rgba(102, 8, 22, 1)',
    borderLeftColor: 'white',
    '&:hover': { backgroundColor: 'rgba(102, 8, 22, .6)' },
  },
}
export const GameChoiceSelector = ({
  year,
  slot,
  game,
  gameChoices,
  updateChoice,
  gmSlots,
  gameCategoryByGameId: _gameCategoryByGameId,
}: GameChoiceSelectorProps) => {
  const thisOne = gameChoices?.filter((c) => c?.year === year && c.gameId === game.id && c.slotId === slot)?.[0]
  const [rank, setRank] = React.useState<number | null>(thisOne?.rank ?? null)
  const [returning, setReturning] = React.useState(thisOne?.returningPlayer ?? false)
  const { hasPermissions } = useAuth()
  const isAdmin = hasPermissions(Perms.IsAdmin)

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

  const isNoOrAnyGame = isNoGameCategory(game.category) || isAnyGameCategory(game.category)

  if (game.full && !isAdmin) {
    return (
      <>
        <div style={{ flex: '1 0 auto', display: 'flex', flexDirection: 'row' }} />
        <div
          style={{
            flex: '1 1 auto',
            display: 'flex',
            flexDirection: 'column',
            margin: '-3px 0',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              height: 52,
            }}
          >
            This game is full, no more spaces available.
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      {/* <div style={{ flex: '1 0 auto', display: 'flex', flexDirection: 'row' }} /> */}
      <div
        style={{
          flex: '1 1 auto',
          display: 'flex',
          flexDirection: 'column',
          margin: '-3px 0',
        }}
        onClick={(event) => event.stopPropagation()}
        onFocus={(event) => event.stopPropagation()}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              width: 60,
              textAlign: 'inherit',
              textTransform: 'inherit',
            }}
          >
            Choice
          </div>
          <ToggleButtonGroup size='small' value={rank} exclusive onChange={handlePriority} aria-label='game priority'>
            {isAdmin && !isNoOrAnyGame && (
              <ToggleButton sx={toggleButtonSx} value={0} aria-label='GM'>
                <Rank rank={0} />
              </ToggleButton>
            )}
            {isAdmin ? (
              <ToggleButton sx={toggleButtonSx} value={1} aria-label='first'>
                <Rank rank={1} />
              </ToggleButton>
            ) : (
              <ToggleButton
                disabled={isGmThisSlot && !isAdmin}
                sx={toggleButtonSx}
                value={rank === 0 ? 0 : 1}
                aria-label='first'
              >
                {rank === 0 ? <Rank rank={0} /> : <Rank rank={1} />}
              </ToggleButton>
            )}
            <ToggleButton sx={toggleButtonSx} value={2} aria-label='second'>
              <Rank rank={2} />
            </ToggleButton>
            <ToggleButton sx={toggleButtonSx} value={3} aria-label='third'>
              <Rank rank={3} />
            </ToggleButton>
            <ToggleButton sx={toggleButtonSx} value={4} aria-label='fourth'>
              <Rank rank={4} />
            </ToggleButton>
          </ToggleButtonGroup>
        </div>
        {!isNoOrAnyGame && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'center',
              paddingTop: 3,
            }}
          >
            <ToggleButton
              value={returning}
              selected={returning}
              onChange={handleReturning}
              sx={[{ textAlign: 'end' }, toggleButtonSx]}
            >
              Returning Player
            </ToggleButton>
          </div>
        )}
      </div>
    </>
  )
}

export const GameChoiceDecorator = ({ year, slot, game, gameChoices }: GameChoiceSelectorProps) => {
  const thisOne = gameChoices?.filter((c) => c?.year === year && c.gameId === game.id && c.slotId === slot)?.[0]
  const rank = thisOne?.rank ?? null // rank is numeric and zero is a valid value!

  return (
    <>
      {game.full && (
        <div
          style={{
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
          }}
        >
          full
        </div>
      )}
      {rank !== null && (
        <div
          style={{
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
          }}
        >
          <Rank rank={rank} rankStyle={RankStyle.small} />
        </div>
      )}
    </>
  )
}

type SlotDecoratorCheckMarkProps = {
  year: number
  slot: number
} & SelectorParams

const isNoGameOrAnyGame = (gameCategoryByGameId: GameCategoryByGameId, choice?: GameChoice) => {
  const id = choice?.gameId
  return id && (isNoGame(gameCategoryByGameId, id) || isAnyGame(gameCategoryByGameId, id))
}

export const orderChoices = (choices?: GameChoice[]) => [
  choices?.find((c) => c?.rank === 0),
  choices?.find((c) => c?.rank === 1),
  choices?.find((c) => c?.rank === 2),
  choices?.find((c) => c?.rank === 3),
  choices?.find((c) => c?.rank === 4),
]

export const isSlotComplete = (gameCategoryByGameId: GameCategoryByGameId, choices?: GameChoice[]) => {
  if (!choices?.length) return false

  const ordered = orderChoices(choices)

  const firstOrRunning = ordered[1]?.gameId ?? ordered[0]?.gameId
  if (firstOrRunning && ordered[2]?.gameId && ordered[3]?.gameId && ordered[4]?.gameId) return true
  if (isNoGameOrAnyGame(gameCategoryByGameId, ordered[1])) return true
  if (firstOrRunning && isNoGameOrAnyGame(gameCategoryByGameId, ordered[2])) return true
  if (firstOrRunning && ordered[2]?.gameId && isNoGameOrAnyGame(gameCategoryByGameId, ordered[3])) return true
  return !!(
    firstOrRunning &&
    ordered[2]?.gameId &&
    ordered[3]?.gameId &&
    isNoGameOrAnyGame(gameCategoryByGameId, ordered[4])
  )
}

export const SlotDecoratorCheckMark = ({
  year,
  slot,
  gameChoices,
  gameCategoryByGameId = EMPTY_GAME_CATEGORY_BY_GAME_ID,
}: SlotDecoratorCheckMarkProps) => {
  const thisSlotChoices = gameChoices?.filter((c) => c?.year === year && c.slotId === slot + 1)
  const isComplete = isSlotComplete(gameCategoryByGameId, thisSlotChoices)
  return isComplete ? <CheckIcon sx={{ color: '#ffe100', position: 'absolute', left: -6, bottom: -8 }} /> : null
}
