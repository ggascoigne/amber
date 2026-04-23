import React from 'react'

import { useTRPC } from '@amber/client'
import { Loader, range } from '@amber/ui'
import { Grid } from '@mui/material'
import { useQuery } from '@tanstack/react-query'

import { Page } from '../../components'
import { Link } from '../../components/Navigation'
import { TransportError } from '../../components/TransportError'
import { YearTile } from '../../components/YearTile'
import { useConfiguration } from '../../utils'

type GameByYearProps = { year: number; to: string }

const GameByYear = ({ year, to }: GameByYearProps) => {
  const trpc = useTRPC()
  const { error, data } = useQuery(trpc.games.getSmallGamesByYear.queryOptions({ year }))
  if (error) {
    return <TransportError error={error} />
  }
  if (!data) {
    return <Loader />
  }

  const game = data[0]
  return game ? (
    <Link href={{ pathname: to }} sx={{ textDecoration: 'none' }}>
      <YearTile year={year} game={game} />
    </Link>
  ) : null
}

const GameBookPage = () => {
  const configuration = useConfiguration()

  const years = range(configuration.firstDataYear - 1, configuration.year - 1, -1)
  return (
    <Page title='Game Book' hideTitle>
      <Grid container spacing={2} sx={{ justifyContent: 'center' }}>
        {years.map((year) => (
          <Grid key={year} size={{ xl: 3, lg: 4, md: 4, sm: 6 }}>
            <GameByYear year={year} to={`/game-book/${year}/1`} />
          </Grid>
        ))}
      </Grid>
    </Page>
  )
}

export default GameBookPage
