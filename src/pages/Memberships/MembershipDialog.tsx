import { FormikHelpers } from 'formik'
import React, { useMemo } from 'react'
import { configuration, onCloseHandler, useUser, useYearFilter } from 'utils'

import { useAuth } from '../../components/Auth'
import { EditDialog } from '../../components/EditDialog'
import { ProfileFormType } from '../../components/Profile'
import { MembershipStepVirtual } from './MembershipStepVirtual'
import {
  MembershipType,
  fromSlotsAttending,
  getDefaultMembership,
  membershipValidationSchema,
  toSlotsAttending,
  useEditMembership,
} from './membershipUtils'

type FormValues = MembershipType

interface MembershipDialogProps {
  open: boolean
  onClose: onCloseHandler
  initialValues?: MembershipType
  profile: ProfileFormType
}

// what hard coded lists did the old system map to
// const legacyValueLists = {
//   interestLevel: ['Full', 'Deposit'],
//   attendance: ['Thurs-Sun', 'Fri-Sun'],
//   roomingPreferences: ['room-with', 'assign-me', 'other'],
// }

export const MembershipDialog: React.FC<MembershipDialogProps> = ({ open, onClose, profile, initialValues }) => {
  const { isAuthenticated, user } = useAuth()
  const { userId } = useUser()
  const createOrUpdateMembership = useEditMembership(onClose)
  const [year] = useYearFilter()
  const isVirtual = configuration.startDates[year].virtual

  if (!isAuthenticated || !user) {
    throw new Error('login expired')
  } // todo test this

  const onSubmit = async (values: FormValues, actions: FormikHelpers<FormValues>) => {
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
