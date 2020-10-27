import { Theme, createStyles, makeStyles } from '@material-ui/core'
import { useGetGamesBySlotForSignupQuery } from 'client'
import { Loader } from 'components/Acnw'
import React, { useEffect } from 'react'
import { getSlotDescription, notEmpty, range } from 'utils'

import { getGms } from '../Games'
import { MaybeGameChoice, Rank, RankStyle, rankString } from './GameChoiceSelector'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
  })
)

type ChoiceSummaryProps = {
  year: number
  gameChoices?: MaybeGameChoice[]
  storeTextResults?: any
}

export const ChoiceSummary: React.FC<ChoiceSummaryProps> = ({ year, gameChoices, storeTextResults }) => (
  <>
    {range(8, 1).map((slotId) => (
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

type SlotDetailsProps = {
  slotId: number
  year: number
  gameChoices?: MaybeGameChoice[]
  storeTextResults?: (details: SlotSummary) => void
}

export type SlotSummary = {
  slotId: number
  slotDescription: string
  lines: {
    rank: string
    description: string
  }[]
}

const rankSort = (a: MaybeGameChoice, b: MaybeGameChoice) => (a?.rank ?? 0) - (b?.rank ?? 0)

export const SlotDetails: React.FC<SlotDetailsProps> = ({ year, slotId, gameChoices, storeTextResults }) => {
  const classes = useStyles()

  const { data } = useGetGamesBySlotForSignupQuery({ variables: { year, slotId }, fetchPolicy: 'cache-and-network' })
  const slotInfo = gameChoices?.filter((c) => c?.year === year && c?.slotId === slotId)

  const games = data?.games?.edges

  const slotDescription = getSlotDescription({
    year,
    slot: slotId,
    local: true,
  })

  useEffect(() => {
    if (storeTextResults && games) {
      const lines = slotInfo
        ?.sort(rankSort)
        ?.map((info) => {
          const g = games?.find(({ node: game }) => game?.id === info?.gameId)?.node
          if (!g || !info) return null
          const gms = getGms(g)
          const rank = rankString(info.rank)!
          const description = `${g?.name} ${info.returningPlayer ? ' (returning player)' : ''}${gms && ` - ${gms}`}`
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

  if (!data) return <Loader />

  return (
    <>
      <h5>{slotDescription}</h5>
      {slotInfo?.sort(rankSort)?.map((info) => {
        const g = games?.find(({ node: game }) => game?.id === info?.gameId)?.node
        if (!g || !info) return null

        const gms = getGms(g)
        return (
          <div className={classes.line} key={info?.gameId}>
            <div className={classes.rank}>
              <Rank rankStyle={RankStyle.superscript} rank={info.rank} />
            </div>
            <div className={classes.name}>
              {g?.name}
              {info.returningPlayer ? ' (returning player)' : ''}
              {gms && ` - ${gms}`}
            </div>
          </div>
        )
      })}
    </>
  )
}
