import { URL_SOURCE_JUMP, withUrlSource } from 'client/resolvers/urlSource'
import { GameByYearQuery } from 'components/Acnw/GameByYearQuery/GameByYearQuery'
import { Page } from 'components/Acnw/Page'
import { YearTile } from 'components/Acnw/YearTile/YearTile'
import GridContainer from 'components/MaterialKitReact/Grid/GridContainer'
import GridItem from 'components/MaterialKitReact/Grid/GridItem'
import range from 'lodash/range'
import { DateTime } from 'luxon'
import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import compose from 'recompose/compose'

class PastConsPage extends Component {
  selectYear = year => {
    const { updateUrlSourceMutation, history } = this.props
    const slug = `/pastCons/${year}`
    updateUrlSourceMutation({ variables: { source: URL_SOURCE_JUMP, url: slug } })
    return history.push(slug)
  }

  render() {
    const years = range(2012, DateTime.local().year)
    return (
      <Page>
        <GridContainer spacing={16} justify={'center'}>
          {years.reverse().map(year => {
            return (
              <GridItem key={year} xl={2} lg={3} md={4} sm={6}>
                <GameByYearQuery year={year}>
                  {({ year, game }) => <YearTile year={year} game={game} onClick={() => this.selectYear(year)} />}
                </GameByYearQuery>
              </GridItem>
            )
          })}
        </GridContainer>
      </Page>
    )
  }
}

export default compose(
  withRouter,
  withUrlSource
)(PastConsPage)
