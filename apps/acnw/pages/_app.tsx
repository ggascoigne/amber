import RootComponent from '@amber/amber/components/RootComponent'
import type { EmotionCache } from '@emotion/react'
import type { AppProps } from 'next/app'

import { Banner } from '../components'
import { rootRoutes } from '../views/Routes'

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache
  configData?: any
}

const MyApp = (props: MyAppProps) => (
  <RootComponent title='AmberCon Northwest' banner={<Banner to='/' />} rootRoutes={rootRoutes} {...props} />
)

export default MyApp
