import { useCreateSettingMutation, useUpdateSettingByNodeIdMutation } from 'client'
import { FormikHelpers } from 'formik'
import React, { useMemo } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { ToFormValues, OnCloseHandler, pick, settingValues } from 'utils'
import Yup from 'utils/Yup'

import { EditDialog } from '../../components/EditDialog'
import { SelectField, TextField } from '../../components/Form'
import { GridContainer, GridItem } from '../../components/Grid'
import { useNotification } from '../../components/Notifications'
import { Setting } from './Settings'

const validationSchema = Yup.object().shape({
  code: Yup.string().min(2).max(100).required('Required'),
  type: Yup.string().min(2).max(7).required('Required'),
  value: Yup.string().max(100).required('Required'),
})

export const typeValues = ['integer', 'string']

type FormValues = ToFormValues<Setting>

interface SettingDialogProps {
  open: boolean
  onClose: OnCloseHandler
  initialValues?: FormValues
}

export const useEditSetting = (onClose: OnCloseHandler) => {
  const createSetting = useCreateSettingMutation()
  const updateSetting = useUpdateSettingByNodeIdMutation()
  const queryClient = useQueryClient()
  const notify = useNotification()

  return async (values: FormValues) => {
    if (values.nodeId) {
      await updateSetting
        .mutateAsync(
          {
            input: {
              nodeId: values.nodeId,
              patch: {
                ...pick(values, 'id', 'code', 'type', 'value'),
              },
            },
          },
          {
            onSuccess: () => {
              queryClient.invalidateQueries(['getSettings'])
            },
          }
        )
        .then(() => {
          notify({ text: 'Setting updated', variant: 'success' })
          onClose()
        })
        .catch((error) => {
          notify({ text: error.message, variant: 'error' })
        })
    } else {
      await createSetting
        .mutateAsync(
          {
            input: {
              setting: {
                ...pick(values, 'nodeId', 'id', 'code', 'type', 'value'),
              },
            },
          },
          {
            onSuccess: () => {
              queryClient.invalidateQueries(['getSettings'])
            },
          }
        )
        .then((res) => {
          notify({ text: 'Setting created', variant: 'success' })
          onClose()
        })
        .catch((error) => {
          notify({ text: error.message, variant: 'error' })
        })
    }
  }
}

export const SettingDialog: React.FC<SettingDialogProps> = ({ open, onClose, initialValues }) => {
  const createOrUpdateSetting = useEditSetting(onClose)

  const onSubmit = async (values: FormValues, actions: FormikHelpers<FormValues>) => {
    await createOrUpdateSetting(values)
  }

  const values = useMemo(() => {
    const defaultValues: FormValues = {
      code: '',
      type: 'integer',
      value: '',
    }
    return initialValues ? { ...initialValues } : { ...defaultValues }
  }, [initialValues])

  return (
    <EditDialog
      initialValues={values}
      onClose={onClose}
      open={open}
      onSubmit={onSubmit}
      title='Setting'
      validationSchema={validationSchema}
      isEditing={!!values.nodeId}
    >
      <GridContainer spacing={2}>
        <GridItem xs={12} md={12}>
          <TextField name='code' label='Code' margin='normal' fullWidth required autoFocus />
        </GridItem>
        <GridItem xs={12} md={12}>
          <SelectField name='type' label='Type' margin='normal' fullWidth selectValues={typeValues} />
        </GridItem>
        <GridItem xs={12} md={12}>
          {values.type === 'integer' ? (
            <SelectField name='value' label='Value' margin='normal' fullWidth selectValues={settingValues} />
          ) : (
            <TextField name='value' label='Value' margin='normal' fullWidth required />
          )}
        </GridItem>
      </GridContainer>
    </EditDialog>
  )
}
