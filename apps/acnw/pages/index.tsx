import * as React from 'react'

import { useConfiguration } from 'amber/utils'
import type { NextPage } from 'next'

import { Welcome, WelcomeVirtual } from '../views'

const Home: NextPage = () => {
  const configuration = useConfiguration()
  return !configuration.virtual ? <Welcome /> : <WelcomeVirtual />
}

export default Home
