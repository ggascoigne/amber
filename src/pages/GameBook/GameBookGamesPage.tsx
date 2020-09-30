import { Page } from 'components/Acnw/Page'
import jump from 'jump.js'
import debounce from 'lodash/debounce'
import React, { useCallback, useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router'
import { configuration, useUrlSourceState } from 'utils'

import { GameBookPageGameList } from './GameBookPageGameList'

export interface MatchParams {
  year: string
  slot?: string
  game?: string
}

export const GameBookGamesPage: React.FC = () => {
  const history = useHistory()
  const { year: yearStr, slot: slotIdStr, game } = useParams<MatchParams>()
  const year = yearStr ? parseInt(yearStr) : configuration.year
  const [lastSlug, setLastSlug] = useState<string>('')
  const setUrlSource = useUrlSourceState((state) => state.setUrlSource)
  const urlSource = useUrlSourceState((state) => state.urlSource)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const setNewUrl = useCallback(
    debounce(async (slug: string) => {
      if (lastSlug !== slug) {
        setLastSlug(slug)
        await setUrlSource({ source: 'scroll', url: slug })
        history.replace(slug)
      }
    }, 200),
    [lastSlug, setUrlSource, setLastSlug]
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
                offset: -105,
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
      <GameBookPageGameList year={year} slotIdStr={slotIdStr || '1'} onEnterGame={setNewUrl} />
    </Page>
  )
}
