import type { PropsWithChildren } from 'react'
import type React from 'react'

import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Divider from '@mui/material/Divider'
import List from '@mui/material/List'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'

import { GameListIndex } from './GameListIndex'
import { GameListNavigator } from './GameListNavigator'

import { ListItemLink } from '../Navigation'
import type { GameDecorator, GameDecoratorParams, SlotDecorator, SlotDecoratorParams } from '../types'

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

export const GameMenu = ({
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
}: PropsWithChildren<GameMenuProps>) => (
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
    <Typography variant='h4' sx={{ fontSize: '1.125rem', pt: '6px', pl: '5px', pr: { sm: '20px' } }}>
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
