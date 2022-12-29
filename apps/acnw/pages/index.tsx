import * as React from 'react'
import type { NextPage } from 'next'
import { useConfiguration } from 'amber/utils'
import { Welcome, WelcomeVirtual } from '../views'

const Home: NextPage = () => {
  const configuration = useConfiguration()
  return !configuration.virtual ? <Welcome /> : <WelcomeVirtual />
}

export default Home
