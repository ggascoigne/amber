import { Game } from 'components/Acnw/Game'
import { GameQuery } from 'components/Acnw/GameQuery'
import { Page } from 'components/Acnw/Page'
import { SlotQuery } from 'components/Acnw/SlotQuery'
import { SlotSelector } from 'components/Acnw/SlotSelector'
import jump from 'jump.js'
import React, { Component } from 'react'

const GamesBySlot = ({ year, slot, games }) => {
  return (
    <React.Fragment key={`slot_${slot.id}`}>
      {games.map(({ node: game }) => (
        <Game key={`game_${game.id}`} year={year} slot={slot} game={game} />
      ))}
    </React.Fragment>
  )
}

class PastConsPage extends Component {
  componentDidMount() {
    // delay the first one so that there's a bit of time for the page to actually load
    this.scrollToId(200)
  }

  componentDidUpdate() {
    this.scrollToId(0)
  }

  scrollToId = delay => {
    const {
      match: {
        params: { year, slot, game }
      }
    } = this.props
    if (!(year || slot || game)) {
      return
    }

    setTimeout(
      () =>
        window.requestAnimationFrame(() => {
          const el = document.getElementById(`game/${year}/${slot}/${game}`)
          if (el) {
            jump(el, {
              duration: 200,
              offset: -105
            })
          }
        }),
      delay
    )
  }

  render() {
    const {
      match: {
        params: { year: yearStr, slot: slotIdStr }
      }
    } = this.props
    const year = yearStr ? parseInt(yearStr) : 2017
    return (
      <Page>
        <SlotQuery year={year}>
          {({ year, slots }) => (
            <SlotSelector slots={slots} selectedSlotId={slotIdStr ? parseInt(slotIdStr) : null}>
              {slot => (
                <GameQuery year={year} slot={slot}>
                  {({ year, slot, games }) => <GamesBySlot year={year} slot={slot} games={games} />}
                </GameQuery>
              )}
            </SlotSelector>
          )}
        </SlotQuery>
      </Page>
    )
  }
}

export default PastConsPage
