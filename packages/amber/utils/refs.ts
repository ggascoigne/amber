import type { MutableRefObject, RefCallback } from 'react'

type RefType<T> = RefCallback<T> | MutableRefObject<T> | null

export const mergeRefs = <T>(...refs: RefType<T>[]) => {
  const filteredRefs = refs.filter(Boolean)
  if (!filteredRefs.length) return null
  if (filteredRefs.length === 0) return filteredRefs[0]
  return (inst: T) => {
    for (const ref of filteredRefs) {
      if (typeof ref === 'function') {
        ref(inst)
      } else if (ref) {
        ref.current = inst
      }
    }
  }
}
