import { useUrlSourceMutation } from 'client'
import { GraphQLError, GridContainer, GridItem, Loader, Page, YearTile } from 'components/Acnw'
import range from 'lodash/range'
import { DateTime } from 'luxon'
import React, { useCallback } from 'react'
import { useHistory } from 'react-router'

import { useGetGamesByYearQuery } from '../../client'

const GameByYear: React.FC<{ year: number; onClick: any }> = ({ year, onClick }) => {
  const { loading, error, data } = useGetGamesByYearQuery({ variables: { year } })
  if (loading) {
    return <Loader />
  }
  if (error) {
    return <GraphQLError error={error} />
  }

  const game = data?.games?.edges[0].node
  return <YearTile year={year} game={game} onClick={onClick} />
}

export const PastConsPage: React.FC = () => {
  const [updateUrlSourceMutation] = useUrlSourceMutation()
  const history = useHistory()

  const selectYear = useCallback(
    async (year: number) => {
      const slug = `/pastCons/${year}`
      await updateUrlSourceMutation({ variables: { source: 'jump', url: slug } })
      return history.push(slug)
    },
    [history, updateUrlSourceMutation]
  )

  const years = range(2012, DateTime.local().year)
  return (
    <Page>
      <GridContainer spacing={2} justify={'center'}>
        {years.reverse().map(year => {
          return (
            <GridItem key={year} xl={2} lg={3} md={4} sm={6}>
              <GameByYear year={year} onClick={() => selectYear(year)} />
            </GridItem>
          )
        })}
      </GridContainer>
    </Page>
  )
}
