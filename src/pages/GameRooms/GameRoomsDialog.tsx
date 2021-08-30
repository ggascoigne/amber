import { useCreateGameRoomMutation, useUpdateGameRoomMutation } from 'client'
import { FormikHelpers } from 'formik'
import React, { useMemo } from 'react'
import { useQueryClient } from 'react-query'
import { ToFormValues, onCloseHandler, pick } from 'utils'
import Yup from 'utils/Yup'

import { EditDialog } from '../../components/EditDialog'
import { CheckboxWithLabel, TextField } from '../../components/Form'
import { GridContainer, GridItem } from '../../components/Grid'
import { useNotification } from '../../components/Notifications'
import { GameRoom } from './GameRooms'

const validationSchema = Yup.object().shape({
  description: Yup.string().min(2).max(100).required('Required'),
  size: Yup.number().min(2).max(100).required('Required'),
  type: Yup.string().min(2).max(100).required('Required'),
  updated: Yup.boolean().required('Required'),
})

type GameRoomType = ToFormValues<GameRoom>

interface GameRoomDialogProps {
  open: boolean
  onClose: onCloseHandler
  initialValues?: GameRoomType
}

export const useEditGameRoom = (onClose: onCloseHandler) => {
  const createGameRoomDetail = useCreateGameRoomMutation()
  const updateGameRoomDetail = useUpdateGameRoomMutation()
  const queryClient = useQueryClient()
  const notify = useNotification()

  return async (values: GameRoomType) => {
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
              queryClient.invalidateQueries('getGameRoom')
            },
          }
        )
        .then(() => {
          notify({ text: 'Game Room updated', variant: 'success' })
          onClose()
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
              queryClient.invalidateQueries('getGameRoom')
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

  const onSubmit = async (values: GameRoomType, actions: FormikHelpers<GameRoomType>) => {
    await createOrUpdateGameRoom(values)
  }

  const values = useMemo(() => {
    const defaultValues: GameRoomType = {
      description: '',
      size: 0,
      type: '',
      updated: false,
    }
    return initialValues ? { ...initialValues } : { ...defaultValues }
  }, [initialValues])

  return (
    <EditDialog
      initialValues={values}
      onClose={onClose}
      open={open}
      onSubmit={onSubmit}
      title='Game Room'
      validationSchema={validationSchema}
      isEditing={!!values?.nodeId}
    >
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
      </GridContainer>
    </EditDialog>
  )
}
