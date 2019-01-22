import { withStyles } from '@material-ui/core'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import { GameFilterQuery } from 'client/resolvers/gameFilter'
import { GameQuery } from 'components/Acnw/GameQuery'
import React from 'react'
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

const _PastConsMenu = ({ classes, history, location }) => {
  return (
    <GameFilterQuery>
      {({ year, slot }) => {
        return (
          <div>
            <GameQuery year={year} slot={slot}>
              {({ year, slot, games }) => {
                return (
                  <List>
                    <ListItem>{location.pathname}</ListItem>
                    {games.map(({ node: game }) => {
                      const slug = `/pastCons/${year}/${slot.id}/${game.id}`
                      return (
                        <ListItem
                          key={game.id}
                          button
                          className={classes.listItem}
                          selected={slug === location.pathname}
                          onClick={() => history.replace(slug)}
                        >
                          <ListItemText
                            className={classes.listItemText}
                            classes={{ primary: classes.listItemTextPrimary }}
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

export const PastConsMenu = withStyles(styles, { withTheme: true })(withRouter(_PastConsMenu))
