import { URL_SOURCE_SCROLL, withUrlSource } from 'client/resolvers/urlSource'
import { Game } from 'components/Acnw/Game'
import { GameQuery } from 'components/Acnw/GameQuery'
import { Page } from 'components/Acnw/Page'
import { SlotQuery } from 'components/Acnw/SlotQuery'
import { SlotSelector } from 'components/Acnw/SlotSelector'
import jump from 'jump.js'
import debounce from 'lodash/debounce'
import * as PropTypes from 'prop-types'
import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import compose from 'recompose/compose'

const GamesBySlot = ({ year, slot, games, onEnterGame }) => {
  return (
    <React.Fragment key={`slot_${slot.id}`}>
      {games.map(({ node: game }) => {
        return (
          <Game
            key={`game_${game.id}`}
            year={year}
            slot={slot}
            game={game}
            onEnter={() => onEnterGame(`/pastCons/${year}/${slot.id}/${game.id}`)}
          />
        )
      })}
    </React.Fragment>
  )
}

GamesBySlot.propTypes = {
  year: PropTypes.number.isRequired,
  slot: PropTypes.object.isRequired,
  games: PropTypes.array.isRequired,
  onEnterGame: PropTypes.func.isRequired
}

class PastConsPage extends Component {
  constructor(props) {
    super(props)
    this.state = { lastSlug: '' }
  }

  setNewUrl = debounce(slug => {
    const { history, updateUrlSourceMutation } = this.props
    if (this.state.lastSlug !== slug) {
      this.setState({ lastSlug: slug })
      updateUrlSourceMutation({ variables: { source: URL_SOURCE_SCROLL, url: slug } })
      history.replace(slug)
    }
  }, 200)

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
      },
      urlSource
    } = this.props
    if (!(year || slot || game)) {
      return
    }

    if (urlSource.source === URL_SOURCE_SCROLL) {
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
      },
      history
    } = this.props
    const year = yearStr ? parseInt(yearStr) : 2017
    return (
      <Page>
        <SlotQuery year={year}>
          {({ year, slots }) => (
            <SlotSelector slots={slots} selectedSlotId={slotIdStr ? parseInt(slotIdStr) : null}>
              {slot => (
                <GameQuery year={year} slot={slot}>
                  {({ year, slot, games }) => {
                    return (
                      <GamesBySlot
                        history={history}
                        year={year}
                        slot={slot}
                        games={games}
                        onEnterGame={this.setNewUrl}
                      />
                    )
                  }}
                </GameQuery>
              )}
            </SlotSelector>
          )}
        </SlotQuery>
      </Page>
    )
  }
}

export default compose(
  withRouter,
  withUrlSource
)(PastConsPage)
