import type React from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

type NearTopResult = false | { active: true; distance: number }

/**
 * Place <NearTopSensor /> immediately BEFORE the element you track, inside the same scroll container.
 * - Active window: distance ∈ [-aboveMarginPx, +distancePx]
 * - Returns `false` outside window
 * - Returns `{ active: true, distance }` inside window (distance can be negative)
 */
export function useNearTopWithPlacedSensor(
  containerRef: React.RefObject<HTMLElement | null>,
  targetRef: React.RefObject<HTMLElement | null>,
  {
    distancePx = 250, // how far below the top we care (0..+distancePx)
    aboveMarginPx = 250, // how far above the top we care (-aboveMarginPx..0)
  } = {},
) {
  const [value, setValue] = useState<NearTopResult>(false)
  const [active, setActive] = useState(false) // true if either sentinel is intersecting

  const tickingRef = useRef(false)

  const measure = useCallback(() => {
    tickingRef.current = false
    const container = containerRef.current
    const target = targetRef.current
    if (!container || !target) return

    const cRect = container.getBoundingClientRect()
    const tRect = target.getBoundingClientRect()
    const distance = tRect.top - cRect.top // negative if above the top edge

    // Only report while inside the window; outside the window we go false.
    if (distance >= -aboveMarginPx && distance <= distancePx) {
      setValue({ active: true, distance })
    } else {
      setValue(false)
    }
  }, [containerRef, targetRef, distancePx, aboveMarginPx])

  const scheduleMeasure = useCallback(() => {
    if (tickingRef.current) return
    tickingRef.current = true
    requestAnimationFrame(measure)
  }, [measure])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return undefined
    if (!active) {
      setValue(false)
      return undefined
    }

    const onScroll = () => scheduleMeasure()

    container.addEventListener('scroll', onScroll, { passive: true })

    const ro = new ResizeObserver(() => scheduleMeasure())
    const t = targetRef.current
    if (t) ro.observe(t)
    ro.observe(container)

    // initial read
    scheduleMeasure()

    return () => {
      container.removeEventListener('scroll', onScroll)
      ro.disconnect()
    }
  }, [active, containerRef, targetRef, scheduleMeasure])

  const NearTopSensor = useMemo(
    () =>
      function NearTopSensorImpl() {
        const upRef = useRef<HTMLDivElement | null>(null)
        const downRef = useRef<HTMLDivElement | null>(null)

        useEffect(() => {
          const container = containerRef.current
          const upNode = upRef.current
          const downNode = downRef.current
          if (!container || !upNode || !downNode) return undefined

          let upSeen = false
          let downSeen = false

          const updateActive = () => {
            const nowActive = upSeen || downSeen
            setActive(nowActive)
            if (nowActive) {
              // ensure a fresh read as soon as we enter
              scheduleMeasure()
            }
          }

          const io = new IntersectionObserver(
            (entries) => {
              for (const e of entries) {
                if (e.target === upNode) upSeen = e.isIntersecting
                if (e.target === downNode) downSeen = e.isIntersecting
              }
              updateActive()
            },
            { root: container, threshold: 0 },
          )

          io.observe(upNode)
          io.observe(downNode)

          return () => io.disconnect()
        }, [])

        // Two zero-height sentinels positioned relative to the target's top:
        //  - "up" sentinel: translated upward by aboveMarginPx (enables negative distances)
        //  - "down" sentinel: translated downward by distancePx (enables positive distances)
        return (
          <>
            <div
              ref={upRef}
              aria-hidden
              style={{
                position: 'relative',
                height: 0,
                transform: `translateY(${-Math.max(0, aboveMarginPx)}px)`,
                pointerEvents: 'none',
              }}
            />
            <div
              ref={downRef}
              aria-hidden
              style={{
                position: 'relative',
                height: 0,
                transform: `translateY(${Math.max(0, distancePx)}px)`,
                pointerEvents: 'none',
              }}
            />
          </>
        )
      },
    [containerRef, distancePx, aboveMarginPx, scheduleMeasure],
  )

  return { value, NearTopSensor }
}
