import { withStyles } from '@material-ui/core'
import contentPageStyles from 'assets/jss/acnw/contentPage'
import { Game } from 'components/Acnw/Game'
import { GameQuery } from 'components/Acnw/GameQuery'
import { Page } from 'components/Acnw/Page'
import { SlotQuery } from 'components/Acnw/SlotQuery'
import { SlotSelector } from 'components/Acnw/SlotSelector'
import React from 'react'

const styles = theme => ({
  ...contentPageStyles(theme),
  card: {
    display: 'inline-block',
    position: 'relative',
    width: '100%',
    margin: '25px 0',
    boxShadow: '0 1px 4px 0 rgba(0, 0, 0, 0.14)',
    borderRadius: '3px',
    color: 'rgba(0, 0, 0, 0.87)',
    background: '#fff'
  }
})

const GamesBySlot = ({ classes, slot, games }) => {
  return (
    <React.Fragment key={`slot_${slot.id}`}>
      {games.map(({ node: game }) => (
        <Game key={`game_${game.id}`} game={game} />
      ))}
    </React.Fragment>
  )
}

const PastConsPage = ({ classes }) => {
  const year = 2017
  return (
    <Page>
      <SlotQuery year={year}>
        {({ year, slots }) => (
          <SlotSelector slots={slots}>
            {slot => (
              <GameQuery year={year} slot={slot}>
                {({ year, slot, games }) => <GamesBySlot classes={classes} slot={slot} games={games} />}
              </GameQuery>
            )}
          </SlotSelector>
        )}
      </SlotQuery>
    </Page>
  )
}

export default withStyles(styles, { withTheme: true })(PastConsPage)
