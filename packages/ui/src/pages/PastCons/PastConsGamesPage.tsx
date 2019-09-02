import { useUrlSourceMutation, useUrlSourceQuery } from 'client/resolvers/urlSource'
import { Page } from 'components/Acnw/Page'
import jump from 'jump.js'
import debounce from 'lodash/debounce'
import { PastConsPageGameList } from 'pages/PastCons/PastConsPageGameList'
import React, { useCallback, useEffect, useState } from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import compose from 'recompose/compose'

interface MatchParams {
  year: string
  slot: string
  game: string
}

interface IPastConsGamePage extends RouteComponentProps<MatchParams> {}

const _PastConsGamesPage: React.FC<IPastConsGamePage> = props => {
  const {
    match: {
      params: { year: yearStr, slot: slotIdStr, game }
    },
    history
  } = props

  const year = yearStr ? parseInt(yearStr) : 2017
  const [lastSlug, setLastSlug] = useState<string>('')
  const [updateUrlSourceMutation] = useUrlSourceMutation()
  const { data } = useUrlSourceQuery()
  const urlSource = data && data.urlSource

  const setNewUrl = useCallback(
    debounce(async (slug: string) => {
      if (lastSlug !== slug) {
        setLastSlug(slug)
        await updateUrlSourceMutation({ variables: { source: 'scroll', url: slug } })
        history.replace(slug)
      }
    }, 200),
    []
  )

  const scrollToId = useCallback(
    (delay: number) => {
      if (!(year || slotIdStr || game)) {
        return
      }

      if (urlSource && urlSource.source === 'scroll') {
        return
      }

      setTimeout(
        () =>
          window.requestAnimationFrame(() => {
            const el = document.getElementById(`game/${year}/${slotIdStr}/${game}`)
            if (el) {
              jump(el, {
                duration: 200,
                offset: -105
              })
            }
          }),
        delay
      )
    },
    [game, slotIdStr, urlSource, year]
  )

  useEffect(() => scrollToId(200), [scrollToId])

  return (
    <Page>
      <PastConsPageGameList year={year} slotIdStr={slotIdStr} onEnterGame={setNewUrl} />
    </Page>
  )
}

export const PastConsGamesPage = compose<IPastConsGamePage, {}>(withRouter)(_PastConsGamesPage)
