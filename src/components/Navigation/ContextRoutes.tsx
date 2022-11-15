import { GameBookMenu } from 'pages/GameBook/GameBookMenu'
import { GameSignupMenu } from 'pages/GameSignup/GameSignupMenu'

// This controls overriding the nav menu based on the route

type ContextRoutes = Record<string, { load: any }>

const data: ContextRoutes = {
  '/game-book/\\d+': {
    load: <GameBookMenu />,
  },
  '/game-signup/\\d+': {
    load: <GameSignupMenu />,
  },
}

export const contextRoutes = (path: string) => {
  const key = Object.keys(data).find((k) => new RegExp(k).test(path))
  return key ? data[key] : undefined
}
