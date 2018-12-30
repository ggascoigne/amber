import { withStyles } from '@material-ui/core'

import contentPageStyles from 'assets/jss/acnw/contentPage'
import Game from 'components/Game/Game'
import Loader from 'components/Loader/Loader'
import gql from 'graphql-tag'
import React from 'react'
import { Query } from 'react-apollo'
import Page from 'components/Page/Page'

const styles = theme => ({
  ...contentPageStyles(theme)
})

const QUERY_SLOTS = gql`
  {
    slots {
      nodes {
        id
        slot
        day
        length
        time
      }
    }
  }
`

const QUERY_GAMES = gql`
  query($year: Int!, $slot: Int!) {
    games(condition: { year: $year, slotId: $slot }, orderBy: [SLOT_ID_ASC, NAME_ASC]) {
      edges {
        node {
          id
          name
          year
          slotId
          gameAssignments(filter: { gm: { lessThan: 0 } }) {
            nodes {
              gm
              member {
                user {
                  profile {
                    fullName
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`

const PastConsPage = ({ classes }) => {
  return (
    <Page>
      <Query query={QUERY_SLOTS}>
        {({ loading, error, data: slot_data }) => {
          if (loading) {
            return <Loader />
          }
          if (error) {
            return <p>Error :(</p>
          }

          return slot_data.slots.nodes.map(slot => (
            <Query key={`slot_${slot.id}`} query={QUERY_GAMES} variables={{ year: 2017, slot: slot.id }}>
              {({ loading, error, data: game_data }) => {
                if (loading) {
                  return <Loader />
                }
                if (error) {
                  return <p>Error :(</p>
                }
                return (
                  <React.Fragment key={`slot_${slot.id}`}>
                    <div>Slot {slot.id}</div>
                    {game_data.games.edges.map(({ node: game }) => (
                      <Game key={`game_${game.id}`} game={game} />
                    ))}
                  </React.Fragment>
                )
              }}
            </Query>
          ))
        }}
      </Query>
    </Page>
  )
}

export default withStyles(styles, { withTheme: true })(PastConsPage)
