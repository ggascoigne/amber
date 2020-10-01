import { GameArray, SlotFieldsFragment } from 'client'
import { GameCard, GameCardChild, GameListNavigator, MatchParams, Page } from 'components/Acnw'
import React, { useEffect } from 'react'
import { useParams } from 'react-router'
import { configuration, useGameScroll } from 'utils'

interface GameBookPageGameList {
  year: number
  slotIdStr: string
  onEnterGame: any
}
const GameList: React.FC<GameBookPageGameList> = ({ year, slotIdStr, onEnterGame }) => (
  <GameListNavigator year={year} slotIdStr={slotIdStr}>
    {({ year, slot, games }) => <GameListFull year={year} slot={slot} games={games!} onEnterGame={onEnterGame} />}
  </GameListNavigator>
)

interface GameListFull {
  year: number
  slot: SlotFieldsFragment
  games: GameArray
  onEnterGame: any
}

export const GameChoiceSelector: React.FC<GameCardChild> = ({ year, slotId, gameId }) => (
  <>
    {year}/{slotId}/{gameId}
  </>
)

export const GameListFull: React.FC<GameListFull> = ({ year, slot, games, onEnterGame }) => {
  const firstGameId = games?.[0]?.node?.id
  const { year: yearStr, slot: slotIdStr } = useParams<MatchParams>()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    if (firstGameId && (slotIdStr !== `${slot.id}` || year !== parseInt(yearStr))) {
      onEnterGame(`/game-signup/${year}/${slot.id}/${firstGameId}`)
    }
  }, [slotIdStr, firstGameId, onEnterGame, slot.id, year, yearStr])

  return (
    <React.Fragment key={`slot_${slot.id}`}>
      {games.map(({ node: game }) =>
        game ? (
          <GameCard
            key={`game_${game.id}`}
            year={year}
            slot={slot}
            game={game}
            onEnter={() => onEnterGame(`/game-signup/${year}/${slot.id}/${game.id}`)}
            selectionComponent={GameChoiceSelector}
          />
        ) : null
      )}
    </React.Fragment>
  )
}

export const GameSignupPage: React.FC = () => {
  const setNewUrl = useGameScroll()
  const { year: yearStr, slot: slotIdStr } = useParams<MatchParams>()
  const year = yearStr ? parseInt(yearStr) : configuration.year

  return (
    <Page>
      <GameList year={year} slotIdStr={slotIdStr || '1'} onEnterGame={setNewUrl} />
    </Page>
  )
}
