import { GameBookMenu } from '../../views/GameBook/GameBookMenu'
import { GameSignupMenu } from '../../views/GameSignup/GameSignupMenu'

// This controls overriding the nav menu based on the route

type ContextRoutes = Record<string, { load: any }>

const data: ContextRoutes = {
  '/game-book(/.*|)$': {
    load: <GameBookMenu />,
  },
  '/game-signup(/.*|)$': {
    load: <GameSignupMenu />,
  },
}

export const contextRoutes = (path: string) => {
  const key = Object.keys(data).find((k) => new RegExp(k).test(path))
  return key ? data[key] : undefined
}
