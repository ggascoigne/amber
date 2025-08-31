import React, { useMemo } from 'react'

import { Setting, useInvalidateSettingsQueries, useTRPC } from '@amber/client'
import {
  EditDialog,
  GridContainer,
  GridItem,
  OnCloseHandler,
  pick,
  SelectField,
  TextField,
  useNotification,
} from '@amber/ui'
import { useMutation } from '@tanstack/react-query'
import { FormikHelpers } from 'formik'
import { z } from 'zod'
import { toFormikValidationSchema } from 'zod-formik-adapter'

import { SettingValue, typeValues } from './shared'

const validationSchema = toFormikValidationSchema(
  z.object({
    code: z.string().min(2, 'Required').max(100, 'Required'),
    type: z.string().min(2, 'Required').max(15, 'Required'),
    value: z.string().max(100, 'Required'),
  }),
)

type FormValues = Setting

interface SettingDialogProps {
  open: boolean
  onClose: OnCloseHandler
  initialValues?: FormValues
}

export const useEditSetting = (onClose: OnCloseHandler) => {
  const trpc = useTRPC()
  const createSetting = useMutation(trpc.settings.createSetting.mutationOptions())
  const updateSetting = useMutation(trpc.settings.updateSetting.mutationOptions())
  const invalidateSettingsQueries = useInvalidateSettingsQueries()
  const notify = useNotification()

  return async (values: FormValues) => {
    if (values.id) {
      updateSetting
        .mutateAsync(pick(values, 'id', 'code', 'type', 'value'), {
          onSuccess: invalidateSettingsQueries,
        })
        .then(() => {
          notify({ text: 'Setting updated', variant: 'success' })
          onClose()
        })
        .catch((error) => {
          notify({ text: error.message, variant: 'error' })
        })
    } else {
      await createSetting
        .mutateAsync(pick(values, 'id', 'code', 'type', 'value'), {
          onSuccess: invalidateSettingsQueries,
        })
        .then((_res) => {
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
  const onSubmit = async (values: FormValues, _actions: FormikHelpers<FormValues>) => {
    await createOrUpdateSetting(values)
  }

  const startingValues = useMemo(() => {
    const defaultValues: FormValues = {
      code: '',
      type: 'date',
      value: '',
      id: 0,
    }
    return initialValues ? { ...initialValues } : { ...defaultValues }
  }, [initialValues])

  return (
    <EditDialog
      initialValues={startingValues}
      onClose={onClose}
      open={open}
      onSubmit={onSubmit}
      title='Setting'
      validationSchema={validationSchema}
      isEditing={!!startingValues.id}
    >
      {({ values }) => (
        <GridContainer spacing={2}>
          <GridItem xs={12} md={12}>
            <TextField name='code' label='Code' margin='normal' fullWidth required autoFocus />
          </GridItem>
          <GridItem xs={12} md={12}>
            <SelectField name='type' label='Type' margin='normal' fullWidth selectValues={typeValues} />
          </GridItem>
          <GridItem xs={12} md={12}>
            <SettingValue name='value' value={values} />
          </GridItem>
        </GridContainer>
      )}
    </EditDialog>
  )
}
