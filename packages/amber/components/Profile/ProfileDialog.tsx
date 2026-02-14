import type React from 'react'
import { useMemo } from 'react'

import type { UserAndProfile } from '@amber/client'
import { EditDialog } from '@amber/ui'
import type { FormikHelpers } from 'formik'

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
