import { useCallback, useEffect, useState } from 'react'

import { useGameUrl } from './useGameUrl'
import { useUrlSource } from './useUrlSourceState'

export const useGameScroll = () => {
  const [lastSlug, setLastSlug] = useState<string>('')
  const [, setUrlSource] = useUrlSource()

  return useCallback(
    (slug: string) => {
      if (lastSlug !== slug) {
        setLastSlug(slug)
        setUrlSource({ source: 'scroll', url: slug })
      }
    },
    [lastSlug, setUrlSource, setLastSlug],
  )
}

export const useScrollToHash = () => {
  const { slot, year, hash } = useGameUrl()

  useEffect(() => {
    const scrollToId = (delay: number) => {
      if (!hash) {
        return undefined
      }
      const game = hash
      const timer = setTimeout(
        () =>
          window.requestAnimationFrame(() => {
            // TODO: rewrite without accessing the DOM
            const el = document.getElementById(`game/${year}/${slot}/${game}`)
            if (el) {
              const y = el.getBoundingClientRect().top + window.scrollY - 105
              window.scrollTo({ top: y })
            }
          }),
        delay,
      )
      return () => clearTimeout(timer)
    }

    return scrollToId(100)
  }, [hash, slot, year])
}
