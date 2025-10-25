import type { MouseEvent, KeyboardEvent } from 'react'

export const isKeyboardEvent = (e: MouseEvent | KeyboardEvent): e is KeyboardEvent =>
  (e as KeyboardEvent).getModifierState !== undefined
