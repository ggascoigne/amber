import React, { useMemo } from 'react'

import { useQueryClient } from '@tanstack/react-query'
import { FormikHelpers } from 'formik'
import {
  CheckboxWithLabel,
  EditDialog,
  GridContainer,
  GridItem,
  OnCloseHandler,
  pick,
  TextField,
  ToFormValues,
  useNotification,
} from 'ui'
import Yup from 'ui/utils/Yup'

import { HotelRoom } from './HotelRoomTypes'

import { useCreateHotelRoomMutation, useUpdateHotelRoomByNodeIdMutation } from '../../client'
import { LookupField } from '../../components/Form'

const validationSchema = Yup.object().shape({
  description: Yup.string().min(2).max(156).required('Required'),
  gamingRoom: Yup.boolean().required('Required'),
  bathroomType: Yup.string().min(2).max(100).required('Required'),
  occupancy: Yup.string().min(2).max(255),
  quantity: Yup.number().required('Required'),
  rate: Yup.string().min(2).max(255),
  type: Yup.string().min(2).max(255).required('Required'),
})

type HotelRoomType = ToFormValues<HotelRoom>

interface HotelRoomTypeDialogProps {
  open: boolean
  onClose: OnCloseHandler
  initialValues?: HotelRoomType
}

export const useEditHotelRoomType = (onClose: OnCloseHandler) => {
  const createHotelRoomType = useCreateHotelRoomMutation()
  const updateHotelRoomType = useUpdateHotelRoomByNodeIdMutation()
  const queryClient = useQueryClient()
  const notify = useNotification()

  return async (values: HotelRoomType) => {
    if (values.nodeId) {
      await updateHotelRoomType
        .mutateAsync(
          {
            input: {
              nodeId: values.nodeId,
              patch: {
                ...pick(
                  values,
                  'id',
                  'description',
                  'gamingRoom',
                  'bathroomType',
                  'occupancy',
                  'rate',
                  'type',
                  'quantity'
                ),
              },
            },
          },
          {
            onSuccess: () => {
              queryClient.invalidateQueries(['getHotelRooms'])
            },
          }
        )
        .then(() => {
          notify({ text: 'HotelRoomType updated', variant: 'success' })
          onClose()
        })
        .catch((error) => {
          notify({ text: error.message, variant: 'error' })
        })
    } else {
      await createHotelRoomType
        .mutateAsync(
          {
            input: {
              hotelRoom: {
                ...pick(
                  values,
                  'nodeId',
                  'id',
                  'description',
                  'gamingRoom',
                  'bathroomType',
                  'occupancy',
                  'rate',
                  'type'
                ),
                quantity: 0,
              },
            },
          },
          {
            onSuccess: () => {
              queryClient.invalidateQueries(['getHotelRooms'])
            },
          }
        )
        .then((_res) => {
          notify({ text: 'HotelRoomType created', variant: 'success' })
          onClose()
        })
        .catch((error) => {
          notify({ text: error.message, variant: 'error' })
        })
    }
  }
}

export const HotelRoomTypeDialog: React.FC<HotelRoomTypeDialogProps> = ({ open, onClose, initialValues }) => {
  const createOrUpdateHotelRoomType = useEditHotelRoomType(onClose)

  const onSubmit = async (values: HotelRoomType, _actions: FormikHelpers<HotelRoomType>) => {
    await createOrUpdateHotelRoomType(values)
  }

  const values = useMemo(() => {
    const defaultValues: HotelRoomType = {
      description: '',
      gamingRoom: false,
      bathroomType: '',
      occupancy: '',
      rate: '',
      type: '',
      quantity: 0,
    }
    return initialValues ? { ...initialValues } : { ...defaultValues }
  }, [initialValues])

  return (
    <EditDialog
      initialValues={values}
      onClose={onClose}
      open={open}
      onSubmit={onSubmit}
      title='Hotel Room Type'
      validationSchema={validationSchema}
      isEditing={!!values?.nodeId}
    >
      <GridContainer spacing={2}>
        <GridItem xs={12} md={12}>
          <TextField name='description' label='Description' margin='normal' fullWidth required autoFocus />
        </GridItem>
        <GridItem container spacing={2} xs={12} md={12} direction='row' style={{ paddingRight: 0 }}>
          <GridItem xs={6} md={6}>
            <CheckboxWithLabel label='Gaming Room?' name='gamingRoom' />
          </GridItem>
          <GridItem xs={6} md={6} style={{ paddingRight: 0 }}>
            <LookupField
              realm='bathroomType'
              name='bathroomType'
              label='Bathroom Type'
              margin='normal'
              fullWidth
              required
            />
          </GridItem>
        </GridItem>
        <GridItem xs={12} md={12}>
          <TextField name='occupancy' label='Occupancy' margin='normal' fullWidth />
        </GridItem>
        <GridItem xs={12} md={12}>
          <TextField name='rate' label='Rate' margin='normal' fullWidth />
        </GridItem>
        <GridItem xs={12} md={12}>
          <LookupField realm='roomType' name='type' label='Type' margin='normal' fullWidth required />
        </GridItem>
        <GridItem xs={12} md={12}>
          <TextField name='quantity' label='Quantity' margin='normal' fullWidth type='number' />
        </GridItem>
      </GridContainer>
    </EditDialog>
  )
}
