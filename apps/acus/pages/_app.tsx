import * as React from 'react'

import { EmotionCache } from '@emotion/react'
import RootComponent from 'amber/components/RootComponent'
import { AppProps } from 'next/app'

import { Banner } from '../components'
import { rootRoutes } from '../views/Routes'

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache
  configData?: any
}

export default function MyApp(props: MyAppProps) {
  return <RootComponent title='Ambercon US' banner={<Banner to='/' />} rootRoutes={rootRoutes} {...props} />
}
