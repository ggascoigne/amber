import React, { useCallback, useMemo } from 'react'

import { GameRoom, useInvalidateGameRoomQueries, useInvalidateGameQueries, useTRPC } from '@amber/client'
import { Autocomplete, Dialog, Divider, TextField as MuiTextField } from '@mui/material'
import { useMutation, useQuery } from '@tanstack/react-query'
import { FormikHelpers } from 'formik'
import { makeStyles } from 'tss-react/mui'
import {
  CheckboxWithLabel,
  EditDialog,
  GridContainer,
  GridItem,
  Loader,
  notEmpty,
  OnCloseHandler,
  pick,
  range,
  TextField,
  ToFormValues,
  useNotification,
} from 'ui'
import Yup from 'ui/utils/Yup'

import { TransportError } from '../../components/TransportError'
import { useConfiguration, useYearFilter } from '../../utils'

const useStyles = makeStyles()({
  hasRoom: {
    opacity: '.6',
  },
})

const validationSchema = Yup.object().shape({
  description: Yup.string().min(2).max(100).required('Required'),
  size: Yup.number().min(2).max(100).required('Required'),
  type: Yup.string().min(2).max(100).required('Required'),
  updated: Yup.boolean().required('Required'),
})

type GameRoomType = ToFormValues<GameRoom>

type GameRoomFormValues = GameRoomType & {
  gamesChanged: boolean
  games: Array<{
    original: number | null
    current: number | null
  }>
}

interface GameRoomDialogProps {
  open: boolean
  onClose: OnCloseHandler
  initialValues?: GameRoomType
}

export const useEditGameRoom = (onClose: OnCloseHandler) => {
  const trpc = useTRPC()
  const configuration = useConfiguration()

  const createGameRoomDetail = useMutation(trpc.gameRooms.createGameRoom.mutationOptions())
  const updateGameRoomDetail = useMutation(trpc.gameRooms.updateGameRoom.mutationOptions())
  const updateGame = useMutation(trpc.games.updateGame.mutationOptions())
  const invalidateGameRoomQueries = useInvalidateGameRoomQueries()
  const invalidateGameQueries = useInvalidateGameQueries()

  const notify = useNotification()

  return async (values: GameRoomFormValues, actions: FormikHelpers<GameRoomFormValues>) => {
    if (values.id) {
      await updateGameRoomDetail
        .mutateAsync(
          {
            id: values.id,
            data: pick(values, 'description', 'size', 'type', 'updated'),
          },
          {
            onSuccess: invalidateGameRoomQueries,
          },
        )
        .then(() => {
          if (values.gamesChanged) {
            const updaters = range(configuration.numberOfSlots).reduce((acc: Promise<any>[], slot: number) => {
              const { original, current } = values.games[slot]!
              if (current !== original) {
                if (current) {
                  acc.push(
                    updateGame.mutateAsync({
                      id: current!,
                      data: {
                        roomId: values.id,
                      },
                    }),
                  )
                }
                if (original) {
                  acc.push(
                    updateGame.mutateAsync({
                      id: original!,
                      data: {
                        roomId: null,
                      },
                    }),
                  )
                }
              }
              return acc
            }, [])
            Promise.allSettled(updaters).then(([_result]) => {
              actions.setSubmitting(false)
              invalidateGameQueries()
              notify({ text: 'Game Room updated', variant: 'success' })
              onClose()
            })
          } else {
            notify({ text: 'Game Room updated', variant: 'success' })
            onClose()
          }
        })
        .catch((error) => {
          notify({ text: error.message, variant: 'error' })
        })
    } else {
      await createGameRoomDetail
        .mutateAsync(pick(values, 'description', 'size', 'type', 'updated'), {
          onSuccess: invalidateGameRoomQueries,
        })
        .then((_res) => {
          notify({ text: 'Game Room created', variant: 'success' })
          onClose()
        })
        .catch((error) => {
          notify({ text: error.message, variant: 'error' })
        })
    }
  }
}

export const GameRoomsDialog = ({ open, onClose, initialValues }: GameRoomDialogProps) => {
  const trpc = useTRPC()
  const configuration = useConfiguration()
  const createOrUpdateGameRoom = useEditGameRoom(onClose)
  const [year] = useYearFilter()
  const { error: gameError, data: games } = useQuery(
    trpc.games.getGamesByYear.queryOptions(
      {
        year,
      },
      {
        enabled: !!initialValues?.id,
      },
    ),
  )

  const { classes, cx } = useStyles()

  const gamesBySlot = useCallback(
    (slotId: number) => games?.filter((g) => g.slotId === slotId).filter(notEmpty) ?? [],
    [games],
  )

  const workingValues: GameRoomFormValues = useMemo(() => {
    const gamesInThisRoom = games
      ? range(configuration.numberOfSlots).map((slot) => {
          const val =
            games?.filter((g) => g.slotId === slot + 1).find((g) => g.roomId === initialValues?.id)?.id ?? null
          return {
            original: val,
            current: val,
          }
        })
      : []

    const defaultGames = { games: gamesInThisRoom, gamesChanged: false }
    const defaultValues: GameRoomFormValues = {
      description: '',
      size: 0,
      type: '',
      updated: false,
      ...defaultGames,
    }
    return initialValues ? { ...initialValues, ...defaultGames } : { ...defaultValues }
  }, [configuration.numberOfSlots, games, initialValues])

  if (gameError) {
    return <TransportError error={gameError} />
  }
  if (!games) {
    return (
      <Dialog fullWidth maxWidth='md' open onClose={onClose}>
        <Loader />
      </Dialog>
    )
  }

  const onSubmit = async (values: GameRoomFormValues, actions: FormikHelpers<GameRoomFormValues>) => {
    await createOrUpdateGameRoom(values, actions)
  }

  return (
    <EditDialog
      initialValues={workingValues}
      onClose={onClose}
      open={open}
      onSubmit={onSubmit}
      title='Game Room'
      validationSchema={validationSchema}
      isEditing={!!workingValues?.id}
    >
      {({ values, setFieldValue }) => (
        <GridContainer spacing={2}>
          <GridItem xs={12} md={12}>
            <TextField name='description' label='Description' margin='normal' fullWidth required autoFocus />
          </GridItem>
          <GridItem xs={12} md={12}>
            <TextField name='size' label='Size' margin='normal' fullWidth type='number' />
          </GridItem>
          <GridItem xs={12} md={12}>
            <TextField name='type' label='Type' margin='normal' fullWidth />
          </GridItem>
          <GridItem xs={12} md={12}>
            <CheckboxWithLabel label='Updated?' name='updated' />
          </GridItem>
          <GridItem xs={12} md={12}>
            <Divider orientation='horizontal' />
          </GridItem>
          {values?.id
            ? range(configuration.numberOfSlots + 1, 1).map((slotId) => {
                const options = gamesBySlot(slotId)
                const value = options.find((game) => game.id === values.games?.[slotId - 1]?.current) ?? null
                return (
                  <GridItem xs={12} md={12} key={`item${slotId}`}>
                    <Autocomplete
                      id={`slot-game-${slotId}`}
                      options={options}
                      getOptionLabel={(game) => game.name ?? ''}
                      value={value}
                      renderOption={(props, game) => {
                        const hasRoom = !!game.roomId
                        const line = `${game.name}${game.gmNames ? `: ${game.gmNames}` : ''}${
                          hasRoom ? ` (${game.room?.description})` : ''
                        }`
                        return (
                          <li {...props} className={cx({ [classes.hasRoom]: hasRoom })}>
                            {line}
                          </li>
                        )
                      }}
                      fullWidth
                      renderInput={(params) => <MuiTextField {...params} label={`Slot ${slotId}`} variant='outlined' />}
                      onChange={(e, v) => {
                        setFieldValue('gamesChanged', true)
                        setFieldValue(`games[${slotId - 1}].current`, v?.id ?? null)
                      }}
                    />
                  </GridItem>
                )
              })
            : null}
        </GridContainer>
      )}
    </EditDialog>
  )
}
