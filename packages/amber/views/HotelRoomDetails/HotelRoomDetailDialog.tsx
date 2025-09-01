import React, { useMemo } from 'react'

import { useTRPC, HotelRoomDetailsEditorType } from '@amber/client'
import {
  CheckboxWithLabel,
  EditDialog,
  GridContainer,
  GridItem,
  OnCloseHandler,
  pick,
  TextField,
  useNotification,
} from '@amber/ui'
import Yup from '@amber/ui/utils/Yup'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { FormikHelpers } from 'formik'

import { LookupField } from '../../components/Form'

const validationSchema = Yup.object().shape({
  name: Yup.string().min(2).max(100).required('Required'),
  roomType: Yup.string().max(100).required('Required'),
  comment: Yup.string().max(100).required('Required'),
  reservedFor: Yup.string().max(50).required('Required'),
  bathroomType: Yup.string().max(100).required('Required'),
  gamingRoom: Yup.boolean().required('Required'),
  enabled: Yup.boolean().required('Required'),
  formattedRoomType: Yup.string().max(255).required('Required'),
  internalRoomType: Yup.string().max(100).required('Required'),
  reserved: Yup.boolean().required('Required'),
})

interface HotelRoomDetailsDialogProps {
  open: boolean
  onClose: OnCloseHandler
  initialValues?: HotelRoomDetailsEditorType
}

export const useEditHotelRoomDetail = (onClose: OnCloseHandler) => {
  const trpc = useTRPC()
  const createHotelRoomDetail = useMutation(trpc.hotelRoomDetails.createHotelRoomDetail.mutationOptions())
  const updateHotelRoomDetail = useMutation(trpc.hotelRoomDetails.updateHotelRoomDetail.mutationOptions())
  const queryClient = useQueryClient()
  const notify = useNotification()

  return async (values: HotelRoomDetailsEditorType) => {
    if (values.id) {
      await updateHotelRoomDetail
        .mutateAsync(
          {
            id: values.id,
            data: {
              ...pick(
                values,
                'id',
                'name',
                'roomType',
                'comment',
                'reservedFor',
                'bathroomType',
                'gamingRoom',
                'enabled',
                'formattedRoomType',
                'internalRoomType',
                'reserved',
              ),
            },
          },
          {
            onSuccess: () => {
              queryClient.invalidateQueries({ queryKey: trpc.hotelRoomDetails.getHotelRoomDetails.queryKey() })
            },
          },
        )
        .then(() => {
          notify({ text: 'Hotel Room updated', variant: 'success' })
          onClose()
        })
        .catch((error) => {
          notify({ text: error.message, variant: 'error' })
        })
    } else {
      await createHotelRoomDetail
        .mutateAsync(
          {
            ...pick(
              values,
              'name',
              'roomType',
              'comment',
              'reservedFor',
              'bathroomType',
              'gamingRoom',
              'enabled',
              'formattedRoomType',
              'internalRoomType',
              'reserved',
            ),
          },
          {
            onSuccess: () => {
              queryClient.invalidateQueries({ queryKey: trpc.hotelRoomDetails.getHotelRoomDetails.queryKey() })
            },
          },
        )
        .then((_res) => {
          notify({ text: 'Hotel Room created', variant: 'success' })
          onClose()
        })
        .catch((error) => {
          notify({ text: error.message, variant: 'error' })
        })
    }
  }
}

export const HotelRoomDetailDialog: React.FC<HotelRoomDetailsDialogProps> = ({ open, onClose, initialValues }) => {
  const createOrUpdateHotelRoomDetail = useEditHotelRoomDetail(onClose)

  const onSubmit = async (values: HotelRoomDetailsEditorType, _actions: FormikHelpers<HotelRoomDetailsEditorType>) => {
    await createOrUpdateHotelRoomDetail(values)
  }

  const values = useMemo(() => {
    const defaultValues: HotelRoomDetailsEditorType = {
      name: '',
      roomType: '',
      comment: '',
      reservedFor: '',
      bathroomType: '',
      gamingRoom: false,
      enabled: true,
      formattedRoomType: '',
      internalRoomType: '',
      reserved: false,
    }
    return initialValues ? { ...initialValues } : { ...defaultValues }
  }, [initialValues])

  return (
    <EditDialog
      initialValues={values}
      onClose={onClose}
      open={open}
      onSubmit={onSubmit}
      title='Hotel Room'
      validationSchema={validationSchema}
      isEditing={!!values?.id}
    >
      <GridContainer spacing={2}>
        <GridItem xs={12} md={12}>
          <TextField name='name' label='Name' margin='normal' fullWidth required autoFocus />
        </GridItem>
        <GridItem xs={12} md={12}>
          <LookupField realm='roomType' name='roomType' label='Room Type' margin='normal' fullWidth required />
        </GridItem>
        <GridItem xs={12} md={12}>
          <TextField name='comment' label='Comment' margin='normal' fullWidth />
        </GridItem>
        <GridItem xs={12} md={12}>
          <TextField name='reservedFor' label='Reserved For' margin='normal' fullWidth />
        </GridItem>
        <GridItem xs={12} md={12}>
          <LookupField
            realm='bathroomType'
            name='bathroomType'
            label='Bathroom Type'
            margin='normal'
            fullWidth
            required
          />
        </GridItem>
        <GridItem xs={12} md={12}>
          <CheckboxWithLabel label='Gaming Room?' name='gamingRoom' />
        </GridItem>
        <GridItem xs={12} md={12}>
          <CheckboxWithLabel label='Enabled?' name='enabled' />
        </GridItem>
        <GridItem xs={12} md={12}>
          <TextField name='formattedRoomType' label='Formatted Room Type' margin='normal' fullWidth />
        </GridItem>
        <GridItem xs={12} md={12}>
          <TextField name='internalRoomType' label='Internal Room Type' margin='normal' fullWidth />
        </GridItem>
        <GridItem xs={12} md={12}>
          <CheckboxWithLabel label='Reserved?' name='reserved' />
        </GridItem>
      </GridContainer>
    </EditDialog>
  )
}
