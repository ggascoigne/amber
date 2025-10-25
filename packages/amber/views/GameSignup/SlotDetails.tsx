import type React from 'react'
import { useEffect } from 'react'

import type { GameChoice } from '@amber/client'
import { useTRPC } from '@amber/client'
import { Loader, notEmpty, range } from '@amber/ui'
import { useQuery } from '@tanstack/react-query'

import { Rank, rankString, RankStyle } from './GameChoiceSelector'

import { getSlotDescription, useConfiguration } from '../../utils'
import { getGms } from '../Games'

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
            <div style={{ display: 'flex', flex: 1 }} key={info.gameId}>
              <div style={{ width: 40, textAlign: 'right' }}>
                <Rank rankStyle={RankStyle.superscript} rank={info.rank} />
              </div>
              <div style={{ paddingLeft: 20 }}>
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
