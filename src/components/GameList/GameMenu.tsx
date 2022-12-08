import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Divider from '@mui/material/Divider'
import List from '@mui/material/List'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import { Theme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import React, { PropsWithChildren } from 'react'
import { makeStyles } from 'tss-react/mui'

import { ListItemLink } from '../Navigation'
import { GameDecorator, GameDecoratorParams, SlotDecorator, SlotDecoratorParams } from '../types'
import { GameListIndex } from './GameListIndex'
import { GameListNavigator } from './GameListNavigator'

const useStyles = makeStyles()((theme: Theme) => ({
  title: {
    fontSize: '1.125rem',
    paddingTop: 6,
    paddingLeft: 5,
    [theme.breakpoints.up('sm')]: {
      paddingRight: 20,
    },
  },
}))

interface GameMenuProps {
  to: string
  text: string
  title: string
  slugPrefix: string
  selectQuery?: boolean
  navDecorator?: (props: SlotDecorator) => React.ReactNode
  navDecoratorParams?: SlotDecoratorParams
  itemDecorator?: (props: GameDecorator) => React.ReactNode
  itemDecoratorParams?: GameDecoratorParams
}

export const GameMenu: React.FC<PropsWithChildren<GameMenuProps>> = ({
  to,
  text,
  title,
  slugPrefix,
  selectQuery,
  itemDecorator,
  itemDecoratorParams,
  navDecorator,
  navDecoratorParams,
  children,
}) => {
  const { classes } = useStyles()
  return (
    <>
      <List>
        <ListItemLink href={to}>
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
      {children}
      <GameListNavigator small selectQuery={selectQuery} decorator={navDecorator} decoratorParams={navDecoratorParams}>
        {({ year, slot, games }) => (
          <GameListIndex
            year={year}
            slot={slot}
            games={games!}
            slugPrefix={slugPrefix}
            decorator={itemDecorator}
            decoratorParams={itemDecoratorParams}
          />
        )}
      </GameListNavigator>
    </>
  )
}
