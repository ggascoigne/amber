import { PastConsMenu } from 'pages/PastCons/PastConsMenu'
import React from 'react'

const data = {
  '/pastCons/\\d+': {
    load: <PastConsMenu />
  }
}

export const contextRoutes = path => {
  return data[Object.keys(data).find(k => new RegExp(k).test(path))]
}
