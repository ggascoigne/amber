import { api } from '@amber/server/src/utils/api'
import { EmotionCache } from '@emotion/react'
import RootComponent from 'amber/components/RootComponent'
import { AppProps } from 'next/app'

import { Banner } from '../components'
import { rootRoutes } from '../views/Routes'

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache
  configData?: any
}

const MyApp = (props: MyAppProps) => (
  <RootComponent title='AmberCon Northwest' banner={<Banner to='/' />} rootRoutes={rootRoutes} {...props} />
)

export default api.withTRPC(MyApp)
