import { FormikHelpers } from 'formik'
import React, { useMemo } from 'react'

import { EditDialog } from '../EditDialog'
import { ProfileFormContent } from './ProfileFormContent'
import { UsersAndProfileType, fillUserAndProfileValues, useEditUserAndProfile } from './profileUtils'
import { profileValidationSchema } from './profileValidationSchema'

interface ProfileDialogProps {
  open: boolean
  initialValues?: UsersAndProfileType | null
  onClose: (event?: any) => void
}

export const ProfileDialog: React.FC<ProfileDialogProps> = ({ open, onClose, initialValues }) => {
  const updateProfile = useEditUserAndProfile(onClose)

  const values = useMemo(() => {
    if (!initialValues) {
      return null
    }
    return fillUserAndProfileValues(initialValues)
  }, [initialValues]) as UsersAndProfileType

  if (!initialValues) {
    return null
  }

  const onSubmit = async (values: UsersAndProfileType, actions: FormikHelpers<UsersAndProfileType>) => {
    await updateProfile(values)
  }

  return (
    <EditDialog
      initialValues={values}
      onClose={onClose}
      open={open}
      onSubmit={onSubmit}
      title='User'
      validationSchema={profileValidationSchema}
      isEditing
    >
      <ProfileFormContent />
    </EditDialog>
  )
}
