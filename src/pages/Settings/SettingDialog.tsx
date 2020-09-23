import { Button, Dialog, DialogActions, useTheme } from '@material-ui/core'
import DialogContent from '@material-ui/core/DialogContent'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { Node, SettingFieldsFragment, useCreateSettingMutation, useUpdateSettingByNodeIdMutation } from 'client'
import { DialogTitle, GridContainer, GridItem, SelectField, TextField, useAuth, useNotification } from 'components/Acnw'
import { Form, Formik, FormikHelpers } from 'formik'
import React, { useMemo } from 'react'
import { onCloseHandler, pick, settingValues } from 'utils'
import Yup from 'utils/Yup'

const settingValidationSchema = Yup.object().shape({
  code: Yup.string().min(2).max(100).required('Required'),
  type: Yup.string().min(2).max(7).required('Required'),
  value: Yup.string().max(100).required('Required'),
})

type FormValues = Omit<SettingFieldsFragment, 'nodeId' | 'id' | '__typename'> & Partial<Node> & { id?: number }

interface SettingDialog {
  open: boolean
  onClose: onCloseHandler
  initialValues?: FormValues
}

export const useEditSetting = (onClose: onCloseHandler) => {
  const [createSetting] = useCreateSettingMutation()
  const [updateSetting] = useUpdateSettingByNodeIdMutation()
  const [notify] = useNotification()

  return async (values: FormValues) => {
    if (values.nodeId) {
      await updateSetting({
        variables: {
          input: {
            nodeId: values.nodeId!,
            patch: {
              ...pick(values, 'id', 'code', 'type', 'value'),
            },
          },
        },
        refetchQueries: ['GetSettings'],
      })
        .then(() => {
          notify({ text: 'Setting updated', variant: 'success' })
          onClose()
        })
        .catch((error) => {
          notify({ text: error.message, variant: 'error' })
        })
    } else {
      await createSetting({
        variables: {
          input: {
            setting: {
              ...pick(values, 'nodeId', 'id', 'code', 'type', 'value'),
            },
          },
        },
        refetchQueries: ['GetSettings'],
      })
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

export const SettingDialog: React.FC<SettingDialog> = ({ open, onClose, initialValues }) => {
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
      <Formik initialValues={values} validationSchema={settingValidationSchema} onSubmit={onSubmit}>
        {({ values, errors, touched, submitForm, isSubmitting }) => (
          <Form>
            <DialogTitle onClose={onClose}>{values.nodeId ? 'Edit' : 'Add'} Setting</DialogTitle>
            <DialogContent>
              <GridContainer spacing={2}>
                <GridItem xs={12} md={12}>
                  <TextField name='code' label='Code' margin='normal' fullWidth required autoFocus />
                </GridItem>
                <GridItem xs={12} md={12}>
                  <TextField name='type' label='Type' margin='normal' fullWidth required />
                </GridItem>
                <GridItem xs={12} md={12}>
                  <SelectField name='value' label='Value' margin='normal' fullWidth selectValues={settingValues} />
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
