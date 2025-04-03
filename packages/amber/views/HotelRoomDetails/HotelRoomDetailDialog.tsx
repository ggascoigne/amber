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

import { HotelRoomDetail } from './HotelRoomDetails'

import {
  useGraphQLMutation,
  CreateHotelRoomDetailDocument,
  UpdateHotelRoomDetailByNodeIdDocument,
} from '../../client-graphql'
import { LookupField } from '../../components/Form'

const validationSchema = Yup.object().shape({
  name: Yup.string().min(2).max(100).required('Required'),
  roomType: Yup.string().min(2).max(100).required('Required'),
  comment: Yup.string().min(2).max(100).required('Required'),
  reservedFor: Yup.string().min(2).max(100).required('Required'),
  bathroomType: Yup.string().min(2).max(100).required('Required'),
  gamingRoom: Yup.boolean().required('Required'),
  enabled: Yup.boolean().required('Required'),
  formattedRoomType: Yup.string().min(2).max(100).required('Required'),
  internalRoomType: Yup.string().min(2).max(100).required('Required'),
  reserved: Yup.boolean().required('Required'),
})

type HotelRoomDetailType = ToFormValues<HotelRoomDetail>

interface HotelRoomDetailsDialogProps {
  open: boolean
  onClose: OnCloseHandler
  initialValues?: HotelRoomDetailType
}

export const useEditHotelRoomDetail = (onClose: OnCloseHandler) => {
  const createHotelRoomDetail = useGraphQLMutation(CreateHotelRoomDetailDocument)
  const updateHotelRoomDetail = useGraphQLMutation(UpdateHotelRoomDetailByNodeIdDocument)
  const queryClient = useQueryClient()
  const notify = useNotification()

  return async (values: HotelRoomDetailType) => {
    if (values.nodeId) {
      await updateHotelRoomDetail
        .mutateAsync(
          {
            input: {
              nodeId: values.nodeId,
              patch: {
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
          },
          {
            onSuccess: () => {
              queryClient.invalidateQueries({ queryKey: ['getHotelRoomDetails'] })
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
            input: {
              hotelRoomDetail: {
                ...pick(
                  values,
                  'nodeId',
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
                version: 1,
              },
            },
          },
          {
            onSuccess: () => {
              queryClient.invalidateQueries({ queryKey: ['getHotelRoomDetails'] })
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

  const onSubmit = async (values: HotelRoomDetailType, _actions: FormikHelpers<HotelRoomDetailType>) => {
    await createOrUpdateHotelRoomDetail(values)
  }

  const values = useMemo(() => {
    const defaultValues: HotelRoomDetailType = {
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
      isEditing={!!values?.nodeId}
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
