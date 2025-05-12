import React, { useMemo } from 'react'

import { UserAndProfile } from '@amber/client'
import { FormikHelpers } from 'formik'
import { EditDialog } from 'ui'

import { ProfileFormContent } from './ProfileFormContent'
import { fillUserAndProfileValues, useEditUserAndProfile } from './profileUtils'
import { profileValidationSchema } from './profileValidationSchema'

interface ProfileDialogProps {
  open: boolean
  initialValues?: UserAndProfile | null
  onClose: (event?: any) => void
}

export const ProfileDialog: React.FC<ProfileDialogProps> = ({ open, onClose, initialValues }) => {
  const updateProfile = useEditUserAndProfile(onClose)

  const values = useMemo(() => {
    if (!initialValues) {
      return null
    }
    return fillUserAndProfileValues(initialValues)
  }, [initialValues]) as UserAndProfile

  if (!initialValues) {
    return null
  }

  const onSubmit = async (v: UserAndProfile, _actions: FormikHelpers<UserAndProfile>) => {
    await updateProfile(v)
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
