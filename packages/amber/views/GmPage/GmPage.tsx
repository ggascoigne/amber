import React, { MouseEventHandler, useState } from 'react'

import { Game, useTRPC, useInvalidateGameQueries } from '@amber/client'
import { Loader, Page, range, Table } from '@amber/ui'
import { Button, Theme } from '@mui/material'
import { useQuery, useMutation } from '@tanstack/react-query'
import Link from 'next/link'
import { useRouter } from 'next/router'
import type { Column, Row, TableInstance, TableState } from 'react-table'
import { makeStyles } from 'tss-react/mui'

import { ConfigDate, MDY } from '../../components'
import { Redirect } from '../../components/Navigation'
import { TransportError } from '../../components/TransportError'
import { getSlotDescription, useConfiguration, useGetMemberShip, useFlag, useUser, useYearFilter } from '../../utils'
import { GamesDialog, GamesDialogEdit } from '../Games/GamesDialog'

// type Game = GameFieldsFragment & GameGmsFragment

const useStyles = makeStyles()((_theme: Theme) => ({
  blurb: {
    '& li': {
      paddingBottom: 10,
      paddingRight: 40,
    },
  },
}))

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

const initialState: Partial<TableState<Game>> = {
  sortBy: [
    {
      id: 'slotPreference',
      desc: false,
    },
  ],
}

const VirtualGmBlurb = () => {
  const configuration = useConfiguration()
  const { classes } = useStyles()
  return (
    <>
      <p>Thank you for considering offering games for virtual{configuration.name}!</p>
      <p>While most things we need are similar to our usual years, there are a few key differences:</p>
      <ol className={classes.blurb}>
        <li>
          <p>
            <strong>Slot times and durations</strong>: Rather than our usual mix of short slots and long slots, all
            slots for virtual{configuration.name} are four hours long. If you plan to run, say, a 6-hour game, simply
            choose 2 slots in the same day (so, Slots 2&3, 4&5, or 6&7), and enter your game twice, marking them as part
            1 and part 2.
          </p>

          <p>
            Just like at a regular {configuration.title}, when your game&apos;s scheduled time is over, another group
            may need to use your room, and your players may need to go off to their next events.
          </p>
        </li>

        <li>
          <p>
            <strong>Returning games</strong>: Unless you have made other arrangements with your returning players, we
            request that at least one slot of any returning game cover that game&apos;s original convention slot. For
            example, if you have a returning game from Slot 3, and you want it to &ldquo;run long,&rdquo; you might
            choose Slots 2&3 for your game. Then you would have the option of starting at any time during the Slot 2
            time block, and ending any time during Slot 3.
          </p>
          <p>
            If you have already made other time arrangements with your players, please enter your game covering however
            many slots it will take, even if you are only covering a part of that slot. For example, if you have
            arranged to play your returning game from 10 am Pacific time to 5 pm Pacific time on Sunday, you would
            &ldquo;block out&rdquo; Slots 6 and 7 with your game.
          </p>
        </li>

        <li>
          <p>
            <strong>Off-book games</strong>: Night owls, early birds, and our European members may wish to run games in
            addition to those in the official game book. We will be arranging space on the {configuration.name} Discord
            server for you to list your games.
          </p>
        </li>
      </ol>
    </>
  )
}

const GmBlurb = () => {
  const { classes } = useStyles()
  const configuration = useConfiguration()
  return (
    <>
      <p>
        Thank you for considering offering games for {configuration.name}! The <strong>deadline</strong> for game
        submissions is{' '}
        <strong>
          <ConfigDate name='gameSubmissionDeadline' format={MDY} />
        </strong>
      </p>
      <ol className={classes.blurb}>
        <li>
          {configuration.isAcnw && (
            <p>
              <strong>Non-Amber Games</strong>: We encourage GMs to be creative with diceless and system-lite
              roleplaying, whether you run Amber Diceless Role-Playing, another diceless system, an indie rpg, or
              something entirely of your own design. Please include the setting, game system, and mechanics in your
              description, so attendees can make informed choices. Unless you note otherwise in your description, we
              will assume that any non-Amber game is accessible enough that attendees can participate without prior
              knowledge of the system or setting.
            </p>
          )}
          {configuration.isAcus && (
            <p>
              <strong>Non-Amber or non-Diceless Games</strong>: We encourage you to be creative and run games that are
              fun for you. We welcome a wide variety of games and settings. If you like to run it, chances are,
              we&apos;ll have people that want to play in it! We have had games from classic Amber, to other diceless
              games using the same or GM-created systems, narrative and GM-less games, to games using dice and other
              mechanics. Please include the setting, game system, and mechanics in your description, so attendees can
              make informed choices.
            </p>
          )}
        </li>
        <li>
          <p>
            <strong>Continuing Campaigns/Ongoing Games</strong>: Please run the game in the same slot that it ran in
            last year. This way people participating in more than one continuing game do not have to drop out of one to
            fit schedule changes of another. As a word of advice, don&apos;t build your game around a specific player
            playing. Please consider ways in which new players can be brought into your game.
          </p>
        </li>
        <li>
          <p>
            <strong>Schedule</strong>: Please keep the length of the slots in mind when choosing a preferred game slot.
            If you pick to allow us to run your game in any slot, you will earn the undying gratitude of the genie
            building the game book. You can also run your game over two slots: please title them as part 1 and part 2
            and put in the description that people must sign up for both parts. The slots are as follows:
          </p>
          <ul>
            {range(configuration.numberOfSlots).map((slotNo) => (
              <li key={slotNo}>
                {getSlotDescription(configuration, {
                  year: configuration.year,
                  slot: slotNo + 1,
                  local: configuration.virtual,
                })}
              </li>
            ))}
          </ul>
        </li>
        <li>
          <p>
            <strong>Teen Friendly</strong>: Because of teens attending the con, usually with their parents, we have a
            field asking if the game is &ldquo;Teen Friendly.&rdquo; By saying &ldquo;Yes&rdquo; you assert that (a) you
            don&apos;t mind having a younger player in your group and (b) the game is unlikely to have content that
            would earn it the equivalent of an &ldquo;R&rdquo; rating. We realize that not everyone wants to GM for
            younger players, but we appreciate those who do.
          </p>
        </li>
        {configuration.isAcnw && (
          <li>
            <p>
              <strong>Room Assignments</strong>: Although we try to schedule all games into Edgefield event spaces or
              AmberCon subsidized game rooms, games with 5 or fewer players may be scheduled to run in the GM&apos;s
              room, in some slots.
            </p>
          </li>
        )}
        {configuration.isAcus && (
          <li>
            <p>
              <strong>Minimum Number of Players</strong>: We no longer accept games that require more than three
              players: they are hard to schedule, they do not always run, sometimes have to be canceled after
              scheduling, and that hurts players. To have more people play in their first choices we request that you
              try to figure out a way to run it with fewer players as a minimum. If that is absolutely not possible,
              please email <a href='mailto:games@ambercon.com'>games@ambercon.com</a>.
            </p>
          </li>
        )}
      </ol>
    </>
  )
}

const MemberGmPage = React.memo(() => {
  const trpc = useTRPC()
  const [year] = useYearFilter()
  const [selection, setSelection] = useState<Game[]>([])
  const deleteGame = useMutation(trpc.games.deleteGame.mutationOptions())
  const invalidateGameQueries = useInvalidateGameQueries()
  const { userId } = useUser()
  const configuration = useConfiguration()
  const displayGameBook = useFlag('display_gamebook')
  // you can only delete games for the current year, and only if they haven't been published.
  const displayDeleteButton = year === configuration.year && !displayGameBook
  const router = useRouter()
  const { query } = router

  const { error, data, refetch } = useQuery(
    trpc.games.getGamesByYearAndAuthor.queryOptions({
      year,
      id: userId!,
    }),
  )

  // just kick this off now so that it's cached by the time the user clicks the button
  useQuery(
    trpc.games.getGamesByAuthor.queryOptions({
      id: userId!,
    }),
  )

  if (error) {
    return <TransportError error={error} />
  }
  if (!data) {
    return <Loader />
  }

  const onCloseEdit: MouseEventHandler = () => {
    setSelection([])
    router.push('/gm')
  }

  const onDelete = (instance: TableInstance<Game>) => () => {
    const toDelete = instance.selectedFlatRows.map((r) => r.original)
    const updater = toDelete.map((g) =>
      deleteGame.mutateAsync(
        {
          id: g.id,
        },
        {
          onSuccess: invalidateGameQueries,
        },
      ),
    )
    Promise.allSettled(updater).then(() => console.log('deleted'))
  }

  const onClick = (row: Row<Game>) => {
    router.push(`/gm/edit/${row.original.id}`)
    setSelection([row.original])
  }

  return (
    <Page title='Become a GM'>
      {query.all?.[0] === 'new' && <GamesDialog open onClose={onCloseEdit} initialValues={selection[0]} />}
      {query.all?.[0] === 'edit' && <GamesDialogEdit open onClose={onCloseEdit} initialValues={selection[0]} />}

      <br />
      {configuration.virtual ? <VirtualGmBlurb /> : <GmBlurb />}

      <Button component={Link} href='/gm/new' variant='outlined' color='primary' size='large'>
        Add a Game
      </Button>

      {data.length ? (
        <Table<Game>
          name='gm_games'
          initialState={initialState}
          disableGroupBy
          data={data}
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

const GmPage = () => {
  const { userId } = useUser()
  const membership = useGetMemberShip(userId)
  if (membership === undefined) {
    // still loading
    return <Loader />
  }
  if (membership == null || !membership.attending) {
    // OK we know this is not a member
    return <Redirect to='/membership' />
  }
  return <MemberGmPage />
}

export default GmPage
