import type React from 'react'
import { useMemo } from 'react'

import type { HotelRoomEditorType } from '@amber/client'
import { useTRPC } from '@amber/client'
import type { OnCloseHandler } from '@amber/ui'
import { CheckboxWithLabel, EditDialog, pick, TextField, useNotification } from '@amber/ui'
import Yup from '@amber/ui/utils/Yup'
import { Grid } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { FormikHelpers } from 'formik'

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

type HotelRoomType = HotelRoomEditorType

interface HotelRoomTypeDialogProps {
  open: boolean
  onClose: OnCloseHandler
  initialValues?: HotelRoomType
}

export const useEditHotelRoomType = (onClose: OnCloseHandler) => {
  const trpc = useTRPC()
  const createHotelRoomType = useMutation(trpc.hotelRooms.createHotelRoom.mutationOptions())
  const updateHotelRoomType = useMutation(trpc.hotelRooms.updateHotelRoom.mutationOptions())
  const queryClient = useQueryClient()
  const notify = useNotification()

  return async (values: HotelRoomType) => {
    if (values.id) {
      await updateHotelRoomType
        .mutateAsync(
          {
            id: values.id,
            data: {
              ...pick(
                values,
                'id',
                'description',
                'gamingRoom',
                'bathroomType',
                'occupancy',
                'rate',
                'type',
                'quantity',
              ),
            },
          },
          {
            onSuccess: () => {
              queryClient.invalidateQueries({
                queryKey: trpc.hotelRooms.getHotelRooms.queryKey(),
              })
            },
          },
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
            ...pick(values, 'id', 'description', 'gamingRoom', 'bathroomType', 'occupancy', 'rate', 'type'),
            quantity: 0,
          },
          {
            onSuccess: () => {
              queryClient.invalidateQueries({
                queryKey: trpc.hotelRooms.getHotelRooms.queryKey(),
              })
            },
          },
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
      isEditing={!!values?.id}
    >
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 12 }}>
          <TextField name='description' label='Description' margin='normal' fullWidth required autoFocus />
        </Grid>
        <Grid container spacing={2} size={{ xs: 12, md: 12 }} direction='row' style={{ paddingRight: 0 }}>
          <Grid size={{ xs: 6, md: 6 }}>
            <CheckboxWithLabel label='Gaming Room?' name='gamingRoom' />
          </Grid>
          <Grid size={{ xs: 6, md: 6 }} style={{ paddingRight: 0 }}>
            <LookupField
              realm='bathroomType'
              name='bathroomType'
              label='Bathroom Type'
              margin='normal'
              fullWidth
              required
            />
          </Grid>
        </Grid>
        <Grid size={{ xs: 12, md: 12 }}>
          <TextField name='occupancy' label='Occupancy' margin='normal' fullWidth />
        </Grid>
        <Grid size={{ xs: 12, md: 12 }}>
          <TextField name='rate' label='Rate' margin='normal' fullWidth />
        </Grid>
        <Grid size={{ xs: 12, md: 12 }}>
          <LookupField realm='roomType' name='type' label='Type' margin='normal' fullWidth required />
        </Grid>
        <Grid size={{ xs: 12, md: 12 }}>
          <TextField name='quantity' label='Quantity' margin='normal' fullWidth type='number' />
        </Grid>
      </Grid>
    </EditDialog>
  )
}
