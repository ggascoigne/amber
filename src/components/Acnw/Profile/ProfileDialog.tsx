import { Button, Dialog, DialogActions, useTheme } from '@material-ui/core'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { useUpdateUserMutation } from 'client'
import { Form, Formik, FormikHelpers } from 'formik'
import React from 'react'

import { DialogTitle } from '../Dialog'
import { useNotification } from '../Notifications'
import { ProfileFormContent, ProfileType } from './ProfileFormContent'
import { profileValidationSchema } from './profileValidationSchema'

type FormValues = ProfileType

interface ProfileDialogProps {
  open: boolean
  initialValues?: ProfileType | null
  onClose: (event?: any) => void
}

export const ProfileDialog: React.FC<ProfileDialogProps> = ({ open, onClose, initialValues: profile }) => {
  const [updateUser] = useUpdateUserMutation()
  const [notify] = useNotification()
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

  if (!profile) {
    return null
  }

  const onSubmit = async (values: FormValues, actions: FormikHelpers<FormValues>) => {
    await updateUser({
      variables: {
        input: {
          id: profile.id!,
          patch: {
            firstName: values.firstName,
            lastName: values.lastName,
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
    <Dialog disableBackdropClick fullWidth maxWidth='md' open={open} onClose={onClose} fullScreen={fullScreen}>
      <Formik initialValues={profile} enableReinitialize validationSchema={profileValidationSchema} onSubmit={onSubmit}>
        {({ isSubmitting }) => (
          <Form>
            <DialogTitle onClose={onClose}>Edit Profile</DialogTitle>
            <ProfileFormContent />
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
