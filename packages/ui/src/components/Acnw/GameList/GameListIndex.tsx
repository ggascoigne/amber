import { GetGames_games_edges } from '__generated__/GetGames'
import { GetSlots_slots_nodes } from '__generated__/GetSlots'
import { Typography } from '@material-ui/core'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import { WithStyles } from '@material-ui/core/styles'
import createStyles from '@material-ui/core/styles/createStyles'
import withStyles from '@material-ui/core/styles/withStyles'
import { WithUrlSource, withUrlSource } from 'client/resolvers/urlSource'
import React from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import compose from 'recompose/compose'

const styles = createStyles({
  listItem: {
    paddingTop: 5,
    paddingBottom: 5
  }
})

interface IGameListIndex {
  year: number
  slot: GetSlots_slots_nodes
  games: GetGames_games_edges[]
  onEnterGame?: any
}

interface IGameListIndexInternal
  extends WithStyles<typeof styles>,
    IGameListIndex,
    RouteComponentProps,
    WithUrlSource {}

const _GameListIndex: React.FC<IGameListIndexInternal> = ({
  classes,
  history,
  location,
  year,
  slot,
  games,
  updateUrlSourceMutation
}) => {
  return (
    <List>
      {games.map(({ node: game }) => {
        const slug = `/pastCons/${year}/${slot.id}/${game.id}`
        return (
          <ListItem
            key={game.id}
            button
            className={classes.listItem}
            selected={slug === location.pathname}
            onClick={() => {
              updateUrlSourceMutation({ variables: { source: 'jump', url: slug } })
              return history.replace(slug)
            }}
          >
            <Typography variant='body1' noWrap>
              {game.name}
            </Typography>
          </ListItem>
        )
      })}
    </List>
  )
}
export const GameListIndex = compose<IGameListIndexInternal, IGameListIndex>(
  withStyles(styles, { withTheme: true }),
  withRouter,
  withUrlSource
)(_GameListIndex)
