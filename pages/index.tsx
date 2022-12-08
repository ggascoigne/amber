import * as React from 'react'
import type { NextPage } from 'next'
import { Welcome, WelcomeVirtual } from '@/views'
import { configuration } from '@/utils'

const Home: NextPage = () => (!configuration.virtual ? <Welcome /> : <WelcomeVirtual />)

export default Home
