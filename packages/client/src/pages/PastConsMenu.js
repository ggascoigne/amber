import { withStyles } from '@material-ui/core'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import { GameFilterQuery } from 'client/resolvers/gameFilter'
import { GameQuery } from 'components/Acnw/GameQuery'
import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'

const styles = {
  listItem: {
    paddingTop: 5,
    paddingBottom: 5
  },
  listItemText: {
    paddingRight: 0
  },
  listItemTextPrimary: {
    overflow: 'hidden',
    maxWidth: '100%',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis'
  }
}

class _PastConsMenu extends Component {
  render() {
    const { classes, history } = this.props
    return (
      <GameFilterQuery>
        {({ year, slot }) => {
          return (
            <div>
              <GameQuery year={year} slot={slot}>
                {({ year, slot, games }) => {
                  return (
                    <List>
                      {games.map(({ node: game }) => {
                        return (
                          <ListItem key={game.id} className={classes.listItem}>
                            <ListItemText
                              className={classes.listItemText}
                              classes={{ primary: classes.listItemTextPrimary }}
                              onClick={() => history.replace(`/pastCons/${year}/${slot.id}/${game.id}`)}
                              primary={game.name}
                            />
                          </ListItem>
                        )
                      })}
                    </List>
                  )
                }}
              </GameQuery>
            </div>
          )
        }}
      </GameFilterQuery>
    )
  }
}

export const PastConsMenu = withStyles(styles, { withTheme: true })(withRouter(_PastConsMenu))
