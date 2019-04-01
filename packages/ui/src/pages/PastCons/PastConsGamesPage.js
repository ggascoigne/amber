import { withUrlSource } from 'client/resolvers/urlSource'
import { Page } from 'components/Acnw/Page'
import jump from 'jump.js'
import debounce from 'lodash/debounce'
import { PastConsPageGameList } from 'pages/PastCons/PastConsPageGameList'
import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import compose from 'recompose/compose'

class _PastConsGamesPage extends Component {
  constructor(props) {
    super(props)
    this.state = { lastSlug: '' }
  }

  setNewUrl = debounce(slug => {
    const { history, updateUrlSourceMutation } = this.props
    if (this.state.lastSlug !== slug) {
      this.setState({ lastSlug: slug })
      updateUrlSourceMutation({ variables: { source: 'scroll', url: slug } })
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

    if (urlSource.source === 'scroll') {
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
        <PastConsPageGameList year={year} slotIdStr={slotIdStr} onEnterGame={this.setNewUrl} />
      </Page>
    )
  }
}

export const PastConsGamesPage = compose(
  withRouter,
  withUrlSource
)(_PastConsGamesPage)
