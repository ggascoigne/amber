import { useGameByYearQuery, useUrlSourceMutation } from 'client'
import { GraphQLError } from 'components/Acnw/GraphQLError'
import { Loader } from 'components/Acnw/Loader'
import { Page } from 'components/Acnw/Page'
import { YearTile } from 'components/Acnw/YearTile'
import GridContainer from 'components/MaterialKitReact/Grid/GridContainer'
import GridItem from 'components/MaterialKitReact/Grid/GridItem'
import get from 'lodash/get'
import range from 'lodash/range'
import { DateTime } from 'luxon'
import React, { useCallback } from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import compose from 'recompose/compose'

const GameByYear: React.FC<{ year: number; onClick: any }> = ({ year, onClick }) => {
  const { loading, error, data } = useGameByYearQuery({ year })
  if (loading) {
    return <Loader />
  }
  if (error) {
    return <GraphQLError error={error} />
  }

  const game = get(data, 'games.nodes[0]')
  return <YearTile year={year} game={game} onClick={onClick} />
}

const _PastConsPage: React.FC<RouteComponentProps> = ({ history }) => {
  const [updateUrlSourceMutation] = useUrlSourceMutation()

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

export const PastConsPage = compose<RouteComponentProps, {}>(withRouter)(_PastConsPage)
