import * as React from 'react'

import { useConfiguration } from 'amber/utils'
import { configGetServerSideProps } from 'amber/utils/getServerSideProps'
import type { NextPage } from 'next'

import { Welcome, WelcomeVirtual } from '../views'

export const getServerSideProps = configGetServerSideProps

const Home: NextPage = () => {
  const configuration = useConfiguration()

  return configuration.virtual ? <WelcomeVirtual /> : <Welcome />
}

export default Home
