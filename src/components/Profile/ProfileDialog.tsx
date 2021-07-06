import { FormikHelpers } from 'formik'
import React from 'react'

import { EditDialog } from '../EditDialog'
import { ProfileFormContent, ProfileType } from './ProfileFormContent'
import { useEditProfile } from './profileUtils'
import { profileValidationSchema } from './profileValidationSchema'

interface ProfileDialogProps {
  open: boolean
  initialValues?: ProfileType | null
  onClose: (event?: any) => void
}

export const ProfileDialog: React.FC<ProfileDialogProps> = ({ open, onClose, initialValues: profile }) => {
  const updateProfile = useEditProfile(onClose)

  if (!profile) {
    return null
  }

  const onSubmit = async (values: ProfileType, actions: FormikHelpers<ProfileType>) => {
    await updateProfile(values)
  }

  return (
    <EditDialog
      initialValues={profile}
      onClose={onClose}
      open={open}
      onSubmit={onSubmit}
      title='Profile'
      validationSchema={profileValidationSchema}
      isEditing
    >
      <ProfileFormContent />
    </EditDialog>
  )
}
