import * as React from 'react'
import type { NextPage } from 'next'
import { configuration } from 'ui/utils'
import { Welcome, WelcomeVirtual } from '../views'

const Home: NextPage = () => (!configuration.virtual ? <Welcome /> : <WelcomeVirtual />)

export default Home
