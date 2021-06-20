import { Button, Dialog, DialogActions, DialogContent, useMediaQuery, useTheme } from '@material-ui/core'
import { Node, SettingFieldsFragment, useCreateSettingMutation, useUpdateSettingByNodeIdMutation } from 'client'
import { DialogTitle, GridContainer, GridItem, SelectField, TextField, useAuth, useNotification } from 'components'
import { Form, Formik, FormikHelpers } from 'formik'
import React, { useMemo } from 'react'
import { useQueryClient } from 'react-query'
import { onCloseHandler, pick, settingValues } from 'utils'
import Yup from 'utils/Yup'

const settingValidationSchema = Yup.object().shape({
  code: Yup.string().min(2).max(100).required('Required'),
  type: Yup.string().min(2).max(7).required('Required'),
  value: Yup.string().max(100).required('Required'),
})

export const typeValues = ['integer', 'string']

type FormValues = Omit<SettingFieldsFragment, 'nodeId' | 'id' | '__typename'> & Partial<Node> & { id?: number }

interface SettingDialogProps {
  open: boolean
  onClose: onCloseHandler
  initialValues?: FormValues
}

export const useEditSetting = (onClose: onCloseHandler) => {
  const createSetting = useCreateSettingMutation()
  const updateSetting = useUpdateSettingByNodeIdMutation()
  const queryClient = useQueryClient()
  const [notify] = useNotification()

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
              queryClient.invalidateQueries('getSettings')
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
              queryClient.invalidateQueries('getSettings')
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
  const { isAuthenticated, user } = useAuth()
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const createOrUpdateSetting = useEditSetting(onClose)

  if (!isAuthenticated || !user) {
    throw new Error('login expired')
  } // todo test this

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
    <Dialog disableBackdropClick fullWidth maxWidth='md' fullScreen={fullScreen} open={open} onClose={onClose}>
      <Formik initialValues={values} enableReinitialize validationSchema={settingValidationSchema} onSubmit={onSubmit}>
        {({ values, errors, touched, submitForm, isSubmitting }) => (
          <Form>
            <DialogTitle onClose={onClose}>{values.nodeId ? 'Edit' : 'Add'} Setting</DialogTitle>
            <DialogContent>
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
            </DialogContent>
            <DialogActions className='modalFooterButtons'>
              <Button onClick={onClose} variant='outlined'>
                Cancel
              </Button>
              <Button type='submit' variant='contained' color='primary' disabled={isSubmitting}>
                Save
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  )
}
