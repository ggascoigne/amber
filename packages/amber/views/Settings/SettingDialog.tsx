import React, { useMemo } from 'react'

import { useQueryClient } from '@tanstack/react-query'
import { Field, FormikHelpers } from 'formik'
import { DateTime } from 'luxon'
import { match } from 'ts-pattern'
import {
  EditDialog,
  DatePickerField,
  GridContainer,
  GridItem,
  OnCloseHandler,
  pick,
  SelectField,
  TextField,
  ToFormValues,
  useNotification,
} from 'ui'
import Yup from 'ui/utils/Yup'

import { Setting } from './Settings'

import { useCreateSettingMutation, useUpdateSettingByNodeIdMutation } from '../../client'
import { permissionGateValues, useConfiguration } from '../../utils'

const validationSchema = Yup.object().shape({
  code: Yup.string().min(2).max(100).required('Required'),
  type: Yup.string().min(2).max(15).required('Required'),
  value: Yup.string().max(100).required('Required'),
})

export const typeValues = ['perm-gate', 'string', 'date', 'number', 'boolean']

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
  const configuration = useConfiguration()

  const onSubmit = async (values: FormValues, _actions: FormikHelpers<FormValues>) => {
    await createOrUpdateSetting(values)
  }

  const startingValues = useMemo(() => {
    const defaultValues: FormValues = {
      code: '',
      type: 'date',
      value: '',
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
      isEditing={!!startingValues.nodeId}
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
            {match(values)
              .with({ type: 'perm-gate' }, () => (
                <SelectField name='value' label='Value' margin='normal' fullWidth selectValues={permissionGateValues} />
              ))
              .with({ type: 'date' }, () => (
                <Field
                  component={DatePickerField}
                  required
                  label='Value'
                  name='value'
                  defaultCalendarMonth={DateTime.now()}
                  timeZone={configuration.baseTimeZone}
                />
              ))
              .otherwise(() => (
                <TextField name='value' label='Value' margin='normal' fullWidth required />
              ))}
          </GridItem>
        </GridContainer>
      )}
    </EditDialog>
  )
}
