import { useEffect, useRef } from 'react'

// use to assign focus to a field that might not be visible as the form mounts

export const useFocusableInput = (shouldFocus: boolean) => {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const setInputRef = (instance: HTMLInputElement | null) => {
    inputRef.current = instance
  }

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | undefined
    if (shouldFocus) {
      timeout = setTimeout(() => {
        inputRef.current?.focus()
      })
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout)
      }
    }
  }, [shouldFocus])

  return {
    setInputRef,
  }
}
