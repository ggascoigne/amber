import { Button, Dialog, DialogActions } from '@material-ui/core'
import DialogContent from '@material-ui/core/DialogContent'
import { Form, Formik, FormikHelpers } from 'formik'
import React from 'react'

import { Node, UserInput, useGetUserByEmailQuery, useUpdateUserMutation } from '../../../client'
import Yup from '../../../utils/Yup'
import { DialogTitle } from '../Dialog'
import { TextField } from '../Form'
import { GraphQLError } from '../GraphQLError'
import { GridContainer, GridItem } from '../Grid'
import { useNotification } from '../Notifications'

const validationSchema = Yup.object().shape({
  fullName: Yup.string().min(2).max(64).required('Required'),
  email: Yup.string().min(2).max(64).required('Required'),
  snailMailAddress: Yup.string().min(2).max(250).required('Required'),
  phoneNumber: Yup.string().min(2).max(32).required('Required'),
})

type FormValues = UserInput & Partial<Node>

interface ProfileDialog {
  open: boolean
  onClose: (event?: any) => void
  email: string
}

export const ProfileDialog: React.FC<ProfileDialog> = ({ open, onClose, email }) => {
  const [updateUser] = useUpdateUserMutation()
  const [notify] = useNotification()

  const { loading, error, data } = useGetUserByEmailQuery({ variables: { email } })
  if (loading) {
    return null
  }
  if (error) {
    return <GraphQLError error={error} />
  }

  const user: FormValues = data!.userByEmail!

  const onSubmit = async (values: FormValues, actions: FormikHelpers<FormValues>) => {
    await updateUser({
      variables: {
        input: {
          id: user.id!,
          patch: {
            fullName: values.fullName,
            email: values.email,
            snailMailAddress: values.snailMailAddress,
            phoneNumber: values.phoneNumber,
          },
        },
      },
    })
      .then(() => {
        notify({ text: 'Profile updated', variant: 'success' })
        onClose()
      })
      .catch((error) => {
        notify({ text: error.message, variant: 'error' })
      })
  }

  return (
    <Dialog disableBackdropClick fullWidth maxWidth={false} open={open} onClose={onClose}>
      <Formik initialValues={user} validationSchema={validationSchema} onSubmit={onSubmit}>
        {({ isSubmitting }) => (
          <Form>
            <DialogTitle onClose={onClose}>Edit Profile</DialogTitle>
            <DialogContent>
              <GridContainer spacing={2}>
                <GridItem xs={12} md={12}>
                  {/* todo: enable email edit once we've got the mail server verified */}
                  <TextField name='email' label='Email Address' margin='normal' fullWidth required disabled />
                </GridItem>
                <GridItem xs={12} md={12}>
                  <TextField name='fullName' label='Full Name' margin='normal' fullWidth required />
                </GridItem>
                <GridItem xs={12} md={12}>
                  <TextField name='snailMailAddress' label='Address' margin='normal' multiline fullWidth required />
                </GridItem>
                <GridItem xs={12} md={12}>
                  <TextField name='phoneNumber' label='Phone number' margin='normal' fullWidth required />
                </GridItem>
              </GridContainer>
            </DialogContent>
            <DialogActions className='modalFooterButtons'>
              <Button onClick={onClose} variant='outlined'>
                Cancel
              </Button>
              <Button disabled={isSubmitting} type='submit' variant='contained' color='primary'>
                Save
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  )
}
