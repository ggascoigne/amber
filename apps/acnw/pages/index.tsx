import * as React from 'react'
import type { NextPage } from 'next'
import { Welcome, WelcomeVirtual } from 'ui/views'
import { configuration } from 'ui/utils'

const Home: NextPage = () => (!configuration.virtual ? <Welcome /> : <WelcomeVirtual />)

export default Home
