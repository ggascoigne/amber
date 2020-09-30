import { GameBookMenu } from 'pages/GameBook/GameBookMenu'
import React from 'react'

interface ContextRoutes {
  [k: string]: { load: any }
}

const data: ContextRoutes = {
  '/game-book/\\d+': {
    load: <GameBookMenu />,
  },
}

export const contextRoutes = (path: string) => {
  const key = Object.keys(data).find((k) => new RegExp(k).test(path))
  return !!key ? data[key] : undefined
}
