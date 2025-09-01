import RootComponent from '@amber/amber/components/RootComponent'
import { api } from '@amber/server/src/utils/api'
import { EmotionCache } from '@emotion/react'
import { AppProps } from 'next/app'

import { Banner } from '../components'
import { rootRoutes } from '../views/Routes'

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache
  configData?: any
}

const MyApp = (props: MyAppProps) => (
  <RootComponent title='Ambercon US' banner={<Banner to='/' />} rootRoutes={rootRoutes} {...props} />
)

export default api.withTRPC(MyApp)
