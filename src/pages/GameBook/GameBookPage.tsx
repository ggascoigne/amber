import { useGetSmallGamesByYearQuery } from 'client'
import { GraphQLError, GridContainer, GridItem, Loader, Page, YearTile } from 'components/Acnw'
import range from 'lodash/range'
import React, { useCallback } from 'react'
import { useHistory } from 'react-router'
import { configuration, useUrlSourceState } from 'utils'

const GameByYear: React.FC<{ year: number; onClick: any }> = ({ year, onClick }) => {
  const { loading, error, data } = useGetSmallGamesByYearQuery({ variables: { year } })
  if (error) {
    return <GraphQLError error={error} />
  }
  if (loading) {
    return <Loader />
  }

  const game = data?.games?.edges[0].node
  return <YearTile year={year} game={game} onClick={onClick} />
}

export const GameBookPage: React.FC = () => {
  const setUrlSource = useUrlSourceState((state) => state.setUrlSource)
  const history = useHistory()

  const selectYear = useCallback(
    async (year: number) => {
      const slug = `/game-book/${year}`
      await setUrlSource({ source: 'jump', url: slug })
      return history.push(slug)
    },
    [history, setUrlSource]
  )

  const years = range(2012, configuration.year)
  return (
    <Page>
      <GridContainer spacing={2} justify='center'>
        {years.reverse().map((year) => (
          <GridItem key={year} xl={2} lg={3} md={4} sm={6}>
            <GameByYear year={year} onClick={() => selectYear(year)} />
          </GridItem>
        ))}
      </GridContainer>
    </Page>
  )
}