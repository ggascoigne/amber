import React from 'react'
import { GraphQLError, GridContainer, GridItem, Loader, Page, range } from 'ui'
import { useGetSmallGamesByYearQuery } from '../../client'
import { Link } from '../../components/Navigation'
import { YearTile } from '../../components/YearTile'
import { useConfiguration } from '../../utils'

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
    <Link href={{ pathname: to }} sx={{ textDecoration: 'none' }}>
      <YearTile year={year} game={game} />
    </Link>
  ) : null
}

const GameBookPage: React.FC = () => {
  const configuration = useConfiguration()

  const years = range(configuration.firstYear - 1, configuration.year - 1, -1)
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
