import { Button, Theme, createStyles, makeStyles } from '@material-ui/core'
import {
  GameFieldsFragment,
  GameGmsFragment,
  useDeleteGameMutation,
  useGetGamesByAuthorQuery,
  useGetGamesByYearAndAuthorQuery,
} from 'client'
import { GraphQLError, Loader, Page, Table } from 'components/Acnw'
import React, { MouseEventHandler, useState } from 'react'
import { Redirect } from 'react-router-dom'
import type { Column, Row, TableInstance, TableState } from 'react-table'
import { configuration, notEmpty, useGetMemberShip, useSetting, useUser, useYearFilter } from 'utils'

import { GamesDialog } from '../Games/GamesDialog'

type Game = GameFieldsFragment & GameGmsFragment

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    blurb: {
      '& li': {
        paddingBottom: 10,
        paddingRight: 40,
      },
    },
  })
)

const columns: Column<Game>[] = [
  {
    accessor: 'name',
  },
  {
    Header: 'GM',
    accessor: 'gmNames',
  },
  {
    accessor: 'slotPreference',
  },
  {
    accessor: 'description',
  },
  {
    accessor: 'estimatedLength',
    width: 140,
    filter: 'numeric',
  },
  {
    accessor: 'playerMin',
    width: 100,
    align: 'right',
    filter: 'numeric',
  },
  {
    accessor: 'playerMax',
    width: 100,
    align: 'right',
    filter: 'numeric',
  },
]

export const GmPage = () => {
  const { userId } = useUser()
  const membership = useGetMemberShip(userId)
  if (membership === undefined) {
    // still loading
    return <Loader />
  } else if (membership == null || !membership.attending) {
    // OK we know this is not a member
    return <Redirect to='/membership' />
  } else {
    return <MemberGmPage />
  }
}

const initialState: Partial<TableState<Game>> = {
  sortBy: [
    {
      id: 'slotPreference',
      desc: false,
    },
  ],
}

const MemberGmPage: React.FC = React.memo(() => {
  const [year] = useYearFilter()
  const [showEdit, setShowEdit] = useState(false)
  const [selection, setSelection] = useState<Game[]>([])
  const [deleteGame] = useDeleteGameMutation()
  const classes = useStyles()
  const { userId } = useUser()
  const displayGameBook = useSetting('display.game.book')
  // you can only delete games for the current year, and only if they haven't been published.
  const displayDeleteButton = year === configuration.year && !displayGameBook

  const { error, data, refetch } = useGetGamesByYearAndAuthorQuery({
    variables: {
      year,
      id: userId!,
    },
    fetchPolicy: 'cache-and-network',
  })

  // just kick this off now so that it's cached by the tie the user clicks the button
  useGetGamesByAuthorQuery({
    variables: {
      id: userId!,
    },
  })

  if (error) {
    return <GraphQLError error={error} />
  }
  if (!data) {
    return <Loader />
  }

  const { games } = data!

  const list: Game[] = games!.nodes.filter(notEmpty)

  const onCloseEdit: MouseEventHandler = () => {
    setShowEdit(false)
    setSelection([])
  }

  const onDelete = (instance: TableInstance<Game>) => () => {
    const toDelete = instance.selectedFlatRows.map((r) => r.original)
    const updater = toDelete.map((g) =>
      deleteGame({
        variables: { input: { id: g.id } },
        refetchQueries: ['getGamesByYear', 'getGamesByAuthor', 'getGamesByYearAndAuthor'],
      })
    )
    Promise.allSettled(updater).then(() => console.log('deleted'))
  }

  const onClick = (row: Row<Game>) => {
    setShowEdit(true)
    setSelection([row.original])
  }

  return (
    <Page>
      {showEdit && <GamesDialog open={showEdit} onClose={onCloseEdit} initialValues={selection[0]} />}
      <h1>Become a GM</h1>
      <br />
      <p>Thank you for considering offering games for virtualACNW!</p>

      <p>While most things we need are similar to our usual years, there are a few key differences:</p>

      <ol className={classes.blurb}>
        <li>
          <p>
            <strong>Slot times and durations</strong>: Rather than our usual mix of short slots and long slots, all
            slots for virtualACNW are four hours long. If you plan to run, say, a 6-hour game, simply choose 2 slots in
            the same day (so, Slots 2&3, 4&5, or 6&7), and enter your game twice, marking them as part 1 and part 2.
          </p>

          <p>
            Just like at a regular AmberCon NW, when your game's scheduled time is over, another group may need to use
            your room, and your players may need to go off to their next events.
          </p>
        </li>

        <li>
          <p>
            <strong>Returning games</strong>: Unless you have made other arrangements with your returning players, we
            request that at least one slot of any returning game cover that game's original convention slot. For
            example, if you have a returning game from Slot 3, and you want it to "run long," you might choose Slots 2&3
            for your game. Then you would have the option of starting at any time during the Slot 2 time block, and
            ending any time during Slot 3.
          </p>
          <p>
            If you have already made other time arrangements with your players, please enter your game covering however
            many slots it will take, even if you are only covering a part of that slot. For example, if you have
            arranged to play your returning game from 10 am Pacific time to 5 pm Pacific time on Sunday, you would
            "block out" Slots 6 and 7 with your game.
          </p>
        </li>

        <li>
          <p>
            <strong>Off-book games</strong>: Night owls, early birds, and our European members may wish to run games in
            addition to those in the official game book. We will be arranging space on the AmberCon NW Discord server
            for you to list your games.
          </p>
        </li>
      </ol>

      <Button variant='outlined' color='primary' size='large' onClick={() => setShowEdit(true)}>
        Add a Game
      </Button>

      {list?.length ? (
        <Table<Game>
          name='gm_games'
          initialState={initialState}
          disableGroupBy
          data={list}
          columns={columns}
          onDelete={displayDeleteButton ? onDelete : undefined}
          onClick={onClick}
          onRefresh={() => refetch()}
          hideSelectionUi={!displayDeleteButton}
        />
      ) : null}
    </Page>
  )
})
