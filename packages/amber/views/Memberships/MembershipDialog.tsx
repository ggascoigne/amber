import { FormikHelpers } from 'formik'
import React, { useMemo } from 'react'
import { EditDialog, OnCloseHandler } from 'ui'
import { configuration, useUser, useYearFilter } from '../../utils'

import { useAuth } from '../../components/Auth'
import { ProfileFormType } from '../../components/Profile'
import { MembershipStepVirtual } from './MembershipStepVirtual'
import {
  fromSlotsAttending,
  getDefaultMembership,
  membershipValidationSchema,
  toSlotsAttending,
  useEditMembership,
} from './membershipUtils'
import type { MembershipType } from '../../utils/apiTypes'

type FormValues = MembershipType

interface MembershipDialogProps {
  open: boolean
  onClose: OnCloseHandler
  initialValues?: MembershipType
  profile: ProfileFormType
}

export const MembershipDialog: React.FC<MembershipDialogProps> = ({ open, onClose, profile, initialValues }) => {
  const { user } = useAuth()
  const { userId } = useUser()
  const createOrUpdateMembership = useEditMembership(onClose)
  const [year] = useYearFilter()
  const isVirtual = configuration.startDates[year].virtual

  if (!user) {
    throw new Error('login expired')
  } // todo test this

  const onSubmit = async (values: FormValues, actions: FormikHelpers<FormValues>) => {
    // eslint-disable-next-line no-param-reassign
    values.slotsAttending = toSlotsAttending(values)
    await createOrUpdateMembership(values, profile)
  }

  const values = useMemo(() => {
    // note that for ACNW Virtual, we only really care about acceptance and the list of possible slots that they know that they won't attend.
    // everything else is very hotel centric
    const defaultValues: MembershipType = getDefaultMembership(userId!, isVirtual)
    const _values = initialValues ? { ...initialValues } : { ...defaultValues }
    _values.slotsAttendingData = fromSlotsAttending(_values)
    return _values
  }, [initialValues, isVirtual, userId])

  return (
    <EditDialog
      initialValues={values}
      onClose={onClose}
      open={open}
      onSubmit={onSubmit}
      title='Membership'
      validationSchema={membershipValidationSchema}
      isEditing
    >
      <MembershipStepVirtual />
    </EditDialog>
  )
}
