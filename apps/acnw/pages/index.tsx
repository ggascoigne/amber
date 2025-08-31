import * as React from 'react'

import { useConfiguration } from '@amber/amber/utils'
import { configGetServerSideProps } from '@amber/amber/utils/getServerSideProps'
import type { NextPage } from 'next'

import { Welcome, WelcomeVirtual } from '../views'

const Home: NextPage = () => {
  const configuration = useConfiguration()
  return configuration.virtual ? <WelcomeVirtual /> : <Welcome />
}

export const getServerSideProps = configGetServerSideProps

export default Home
