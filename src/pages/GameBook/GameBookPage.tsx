import { useGetSmallGamesByYearQuery } from 'client'
import range from 'lodash/range'
import React from 'react'
import { Link } from 'react-router-dom'
import { configuration } from 'utils'

import { GraphQLError } from '../../components/GraphQLError'
import { GridContainer, GridItem } from '../../components/Grid'
import { Loader } from '../../components/Loader'
import { Page } from '../../components/Page'
import { YearTile } from '../../components/YearTile'

const GameByYear: React.FC<{ year: number; to: string }> = ({ year, to }) => {
  const { error, data } = useGetSmallGamesByYearQuery({ year })
  if (error) {
    return <GraphQLError error={error} />
  }
  if (!data) {
    return <Loader />
  }

  const game = data.games?.edges?.[0]?.node
  return game ? (
    <Link
      to={{
        pathname: to,
        state: { fromClick: true },
      }}
    >
      <YearTile year={year} game={game} />
    </Link>
  ) : null
}

const GameBookPage: React.FC = () => {
  const years = range(configuration.year - 1, 2012)
  return (
    <Page title='Game Book' hideTitle>
      <GridContainer spacing={2} justifyContent='center'>
        {years.map((year) => (
          <GridItem key={year} xl={3} lg={4} md={4} sm={6}>
            <GameByYear year={year} to={`/game-book/${year}/1`} />
          </GridItem>
        ))}
      </GridContainer>
    </Page>
  )
}

export default GameBookPage
