import jump from 'jump.js'
import debounce from 'lodash/debounce'
import { useCallback, useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router'

import { MatchParams } from '../components/Acnw/GameList'
import { configuration } from './configuration'
import { useUrlSourceState } from './useUrlSourceState'

export const useGameScroll = () => {
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
    }, 100),
    [lastSlug, setUrlSource, setLastSlug]
  )

  useEffect(() => {
    const scrollToId = (delay: number) => {
      if (!year || !slotIdStr || !game || urlSource?.source === 'scroll') {
        return
      }

      const timer = setTimeout(
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
      return () => clearTimeout(timer)
    }

    return scrollToId(200)
  }, [game, slotIdStr, urlSource, year])

  return setNewUrl
}
