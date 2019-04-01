import { PastConsMenu } from 'pages/PastCons/PastConsMenu'
import React from 'react'

interface ContextRoutes {
  [k: string]: { load: any }
}

const data: ContextRoutes = {
  '/pastCons/\\d+': {
    load: <PastConsMenu />
  }
}

export const contextRoutes = (path: string) => {
  return data[Object.keys(data).find(k => new RegExp(k).test(path))]
}
