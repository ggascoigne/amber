import { Autocomplete, Dialog, Divider, TextField as MuiTextField } from '@mui/material'
import {
  useCreateGameRoomMutation,
  useGetGamesByYearQuery,
  useUpdateGameMutation,
  useUpdateGameRoomMutation,
} from 'client'
import { FormikHelpers } from 'formik'
import React, { useCallback, useMemo } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { makeStyles } from 'tss-react/mui'
import { ToFormValues, notEmpty, onCloseHandler, pick, range, useYearFilter } from 'utils'
import Yup from 'utils/Yup'

import { EditDialog } from '../../components/EditDialog'
import { CheckboxWithLabel, TextField } from '../../components/Form'
import { GraphQLError } from '../../components/GraphQLError'
import { GridContainer, GridItem } from '../../components/Grid'
import { Loader } from '../../components/Loader'
import { useNotification } from '../../components/Notifications'
import { GameRoom } from './GameRooms'

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
  onClose: onCloseHandler
  initialValues?: GameRoomType
}

export const useEditGameRoom = (onClose: onCloseHandler) => {
  const createGameRoomDetail = useCreateGameRoomMutation()
  const updateGameRoomDetail = useUpdateGameRoomMutation()
  const updateGame = useUpdateGameMutation()

  const queryClient = useQueryClient()
  const notify = useNotification()

  return async (values: GameRoomFormValues, actions: FormikHelpers<GameRoomFormValues>) => {
    if (values.id) {
      await updateGameRoomDetail
        .mutateAsync(
          {
            input: {
              id: values.id,
              patch: {
                ...pick(values, 'description', 'size', 'type', 'updated'),
              },
            },
          },
          {
            onSuccess: () => {
              queryClient.invalidateQueries(['getGameRoom'])
            },
          }
        )
        .then(() => {
          if (values.gamesChanged) {
            const updaters = range(7).reduce((acc: Promise<any>[], slot: number) => {
              const { original, current } = values.games[slot]
              if (current !== original) {
                if (current) {
                  acc.push(
                    updateGame.mutateAsync({
                      input: {
                        id: current!,
                        patch: {
                          roomId: values.id,
                        },
                      },
                    })
                  )
                }
                if (original) {
                  acc.push(
                    updateGame.mutateAsync({
                      input: {
                        id: original!,
                        patch: {
                          roomId: null,
                        },
                      },
                    })
                  )
                }
              }
              return acc
            }, [])
            Promise.allSettled(updaters).then(([result]) => {
              actions.setSubmitting(false)
              queryClient.invalidateQueries(['getGamesByYear'])
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
        .mutateAsync(
          {
            input: {
              room: {
                ...pick(values, 'description', 'size', 'type', 'updated'),
              },
            },
          },
          {
            onSuccess: () => {
              queryClient.invalidateQueries(['getGameRoom'])
            },
          }
        )
        .then((res) => {
          notify({ text: 'Game Room created', variant: 'success' })
          onClose()
        })
        .catch((error) => {
          notify({ text: error.message, variant: 'error' })
        })
    }
  }
}

export const GameRoomsDialog: React.FC<GameRoomDialogProps> = ({ open, onClose, initialValues }) => {
  const createOrUpdateGameRoom = useEditGameRoom(onClose)
  const [year] = useYearFilter()
  const { error: gameError, data: gData } = useGetGamesByYearQuery(
    {
      year,
    },
    {
      enabled: !!initialValues?.id,
    }
  )

  const { classes, cx } = useStyles()

  const games = useMemo(() => gData?.games?.edges.map((v) => v.node).filter(notEmpty), [gData])
  const gamesBySlot = useCallback(
    (slotId: number) => games?.filter((g) => g.slotId === slotId).filter(notEmpty) ?? [],
    [games]
  )

  const values: GameRoomFormValues = useMemo(() => {
    const gamesInThisRoom = games
      ? range(7).map((slot) => {
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
  }, [games, initialValues])

  if (gameError) {
    return <GraphQLError error={gameError} />
  }
  if (!gData) {
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
      initialValues={values}
      onClose={onClose}
      open={open}
      onSubmit={onSubmit}
      title='Game Room'
      validationSchema={validationSchema}
      isEditing={!!values?.id}
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
          {!!values?.id
            ? range(8, 1).map((slotId) => {
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
                        const line = `${game.name}${game.gmNames ? ': ' + game.gmNames : ''}${
                          hasRoom ? ' (' + game.room?.description + ')' : ''
                        }`
                        return (
                          <li {...props} className={cx({ [classes.hasRoom]: hasRoom })}>
                            {line}
                          </li>
                        )
                      }}
                      fullWidth
                      renderInput={(params) => <MuiTextField {...params} label={`Slot ${slotId}`} variant='outlined' />}
                      onChange={(e, value) => {
                        setFieldValue('gamesChanged', true)
                        setFieldValue(`games[${slotId - 1}].current`, value?.id ?? null)
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
