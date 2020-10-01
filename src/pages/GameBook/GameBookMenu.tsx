import Divider from '@material-ui/core/Divider'
import List from '@material-ui/core/List'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import { GameListIndex, GameListNavigator } from 'components/Acnw/GameList'
import { ListItemLink } from 'components/Acnw/Navigation'
import React from 'react'
import { configuration, useGameFilterState } from 'utils'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      fontSize: '1.125rem',
      paddingTop: 6,
      paddingLeft: 5,
      [theme.breakpoints.up('sm')]: {
        paddingRight: 20,
      },
    },
  })
)

export const GameBookMenu: React.FC = () => {
  const classes = useStyles()
  const { year, slotId } = useGameFilterState((state) => state.gameFilter)
  const links =
    year === configuration.year ? { to: '/', text: 'Main Menu' } : { to: '/game-history', text: 'Past Cons' }
  return (
    <>
      <List>
        <ListItemLink button to={links.to}>
          <ListItemIcon>
            <ArrowBackIcon />
          </ListItemIcon>
          <ListItemText primary={links.text} />
        </ListItemLink>
      </List>
      <Divider />
      <Typography variant='h4' className={classes.title}>
        Games for {year}
      </Typography>
      <GameListNavigator small year={year} slotIdStr={`${slotId}`}>
        {({ year, slot, games }) => <GameListIndex year={year} slot={slot} games={games!} />}
      </GameListNavigator>
    </>
  )
}
