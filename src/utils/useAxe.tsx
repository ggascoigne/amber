import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'

import { isDev } from './globals'

export function useAxe(): void {
  // this is a bit too noisy at this point to want to enable this all of the time,
  // so let people opt in.
  if (isDev) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const axe = require('@axe-core/react')
      axe(React, ReactDOM, 1000, {})
    })
  }
}
