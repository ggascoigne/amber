import { PastConsMenu } from 'pages/PastConsMenu'
import React from 'react'

const data = {
  '/pastCons.*': {
    load: <PastConsMenu />
  }
}

export const contextRoutes = path => {
  return data[Object.keys(data).find(k => new RegExp(k).test(path))]
}
