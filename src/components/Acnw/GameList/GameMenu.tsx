import Divider from '@material-ui/core/Divider'
import List from '@material-ui/core/List'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'
import React from 'react'

import { ListItemLink } from '../Navigation'
import { GameListIndex } from './GameListIndex'
import { GameListNavigator } from './GameListNavigator'

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

type GameMenu = {
  to: string
  text: string
  title: string
  slugPrefix: string
}

export const GameMenu: React.FC<GameMenu> = ({ to, text, title, slugPrefix }) => {
  const classes = useStyles()
  return (
    <>
      <List>
        <ListItemLink button to={to}>
          <ListItemIcon>
            <ArrowBackIcon />
          </ListItemIcon>
          <ListItemText primary={text} />
        </ListItemLink>
      </List>
      <Divider />
      <Typography variant='h4' className={classes.title}>
        {title}
      </Typography>
      <GameListNavigator small>
        {({ year, slot, games }) => <GameListIndex year={year} slot={slot} games={games!} slugPrefix={slugPrefix} />}
      </GameListNavigator>
    </>
  )
}
