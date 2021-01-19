import { useGetSmallGamesByYearQuery } from 'client'
import { GraphQLError, GridContainer, GridItem, Loader, Page, YearTile } from 'components/Acnw'
import range from 'lodash/range'
import React from 'react'
import { Link } from 'react-router-dom'
import { configuration } from 'utils'

const GameByYear: React.FC<{ year: number; to: string }> = ({ year, to }) => {
  const { error, data } = useGetSmallGamesByYearQuery({ variables: { year }, fetchPolicy: 'cache-and-network' })
  if (error) {
    return <GraphQLError error={error} />
  }
  if (!data) {
    return <Loader />
  }

  const game = data.games?.edges[0].node
  return (
    <Link
      to={{
        pathname: to,
        state: { fromClick: true },
      }}
    >
      <YearTile year={year} game={game} />
    </Link>
  )
}

const GameBookPage: React.FC = () => {
  const years = range(configuration.year, 2012)
  return (
    <Page title='Game Book'>
      <GridContainer spacing={2} justify='center'>
        {years.map((year) => (
          <GridItem key={year} xl={2} lg={3} md={4} sm={6}>
            <GameByYear year={year} to={`/game-book/${year}/1`} />
          </GridItem>
        ))}
      </GridContainer>
    </Page>
  )
}

export default GameBookPage
