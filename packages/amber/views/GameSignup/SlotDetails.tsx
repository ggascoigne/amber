import React, { useEffect } from 'react'

import { GameChoice, useTRPC } from '@amber/client'
import { Theme } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { makeStyles } from 'tss-react/mui'
import { Loader, notEmpty, range } from 'ui'

import { Rank, rankString, RankStyle } from './GameChoiceSelector'

import { getSlotDescription, useConfiguration } from '../../utils'
import { getGms } from '../Games'

const useStyles = makeStyles()((_theme: Theme) => ({
  line: {
    display: 'flex',
    flex: 1,
  },
  rank: {
    width: 40,
    textAlign: 'right',
    '& sup': {
      lineHeight: 0,
      display: 'inline-block',
      // paddingBottom: 3,
    },
  },
  name: {
    paddingLeft: 20,
  },
}))

export interface SlotSummary {
  slotId: number
  slotDescription: string
  lines: {
    rank: string
    description: string
  }[]
}

interface SlotDetailsProps {
  slotId: number
  year: number
  gameChoices?: GameChoice[]
  storeTextResults?: (details: SlotSummary) => void
}

const rankSort = (a: GameChoice, b: GameChoice) => (a?.rank ?? 0) - (b?.rank ?? 0)

export const SlotDetails: React.FC<SlotDetailsProps> = ({ year, slotId, gameChoices, storeTextResults }) => {
  const trpc = useTRPC()
  const configuration = useConfiguration()
  const { classes } = useStyles()

  const { data: games } = useQuery(trpc.games.getGamesBySlotForSignup.queryOptions({ year, slotId }))
  const slotInfo = gameChoices?.filter((c) => c?.year === year && c.slotId === slotId)

  const slotDescription = getSlotDescription(configuration, {
    year,
    slot: slotId,
    local: true,
  })

  useEffect(() => {
    if (storeTextResults && games) {
      const lines = slotInfo
        ?.concat()
        ?.sort(rankSort)
        ?.map((info) => {
          const g = games.find((game) => game?.id === info?.gameId)
          if (!g || !info) return null
          const gms = getGms(g)
          const rank = rankString(info.rank)!
          const description = `${g.name} ${info.returningPlayer ? ' (returning player)' : ''}${gms && ` - ${gms}`}`
          return {
            rank,
            description,
          }
        })
        .filter(notEmpty)

      if (lines) {
        const res: SlotSummary = {
          slotId,
          slotDescription,
          lines,
        }
        storeTextResults(res)
      }
    }
  }, [games, slotDescription, slotId, slotInfo, storeTextResults])

  if (!games) return <Loader />

  return (
    <>
      <h5>{slotDescription}</h5>
      {slotInfo
        ?.concat()
        ?.sort(rankSort)
        ?.map((info) => {
          const g = games?.find((game) => game?.id === info?.gameId)
          if (!g || !info) return null

          const gms = getGms(g)
          return (
            <div className={classes.line} key={info.gameId}>
              <div className={classes.rank}>
                <Rank rankStyle={RankStyle.superscript} rank={info.rank} />
              </div>
              <div className={classes.name}>
                {g.name}
                {info.returningPlayer ? ' (returning player)' : ''}
                {gms && ` - ${gms}`}
              </div>
            </div>
          )
        })}
    </>
  )
}

interface ChoiceSummaryProps {
  year: number
  gameChoices?: GameChoice[]
  storeTextResults?: any
}

export const ChoiceSummary: React.FC<ChoiceSummaryProps> = ({ year, gameChoices, storeTextResults }) => {
  const configuration = useConfiguration()
  return (
    <>
      {range(configuration.numberOfSlots + 1, 1).map((slotId) => (
        <SlotDetails
          key={slotId}
          slotId={slotId}
          year={year}
          gameChoices={gameChoices}
          storeTextResults={storeTextResults}
        />
      ))}
    </>
  )
}
