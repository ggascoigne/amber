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
import qs from 'query-string'

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
            onEnter={() => onEnterGame(`/pastCons/${year}/${slot.id}/${game.id}?s=1`)}
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

  trimQuery = slug => {
    return slug.replace(/\?.*$/, '')
  }

  setNewUrl = debounce(slug => {
    const { history } = this.props
    const trimmedSlug = this.trimQuery(slug)
    if (this.state.lastSlug !== trimmedSlug) {
      this.setState({ lastSlug: trimmedSlug })
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
      location
    } = this.props
    if (!(year || slot || game)) {
      return
    }

    const queryString = qs.parse(location.search)
    // if we scrolled to the URL, then don't jump back to it
    if (queryString.s && queryString.s === '1') {
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

export default withRouter(PastConsPage)
