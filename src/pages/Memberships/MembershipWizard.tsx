import { FormikErrors, FormikHelpers, FormikValues } from 'formik'
import React, { useMemo } from 'react'
import { configuration, useUser, useYearFilter } from 'utils'
import Yup from 'utils/Yup'

import { Perms, useAuth } from '../../components/Auth'
import { ProfileFormContent, ProfileType, profileValidationSchema } from '../../components/Profile'
import { useEditProfile } from '../../components/Profile/profileUtils'
import { Wizard, WizardPage } from '../../components/Wizard'
import { FinalStep } from './FinalStep'
import { IntroStep } from './IntroStep'
import { MembershipStepAdmin } from './MembershipAdmin'
import { MembershipStepConvention } from './MembershipStepConvention'
import { MembershipStepRooms } from './MembershipStepRooms'
import { MembershipStepVirtual } from './MembershipStepVirtual'
import {
  MembershipType,
  fromSlotsAttending,
  getDefaultMembership,
  membershipValidationSchema,
  toSlotsAttending,
  useEditMembership,
} from './membershipUtils'

interface FormValues {
  membership: MembershipType
  profile: ProfileType
}

interface MembershipWizardProps {
  open: boolean
  onClose: (event?: any) => void
  initialValues?: MembershipType
  profile: ProfileType
}

// what hard coded lists did the old system map to
// const legacyValueLists = {
//   interestLevel: ['Full', 'Deposit'],
//   attendance: ['Thurs-Sun', 'Fri-Sun'],
//   roomingPreferences: ['room-with', 'assign-me', 'other'],
// }

const validationSchema = Yup.object().shape({
  membership: membershipValidationSchema,
  profile: profileValidationSchema,
})

export const MembershipWizard: React.FC<MembershipWizardProps> = ({ open, onClose, profile, initialValues }) => {
  const { isAuthenticated, user, hasPermissions } = useAuth()
  const isAdmin = hasPermissions(Perms.IsAdmin)

  const { userId } = useUser()
  const createOrUpdateMembership = useEditMembership(onClose)
  const updateProfile = useEditProfile()
  const [year] = useYearFilter()
  const isVirtual = configuration.startDates[year].virtual

  const pages = useMemo(() => {
    const virtualPages: WizardPage[] = [
      {
        name: 'Registration',
        optional: false,
        hasForm: false,
        render: <IntroStep />,
        hasErrors: (errors: FormikErrors<FormikValues>) => false,
      },
      {
        name: 'Member Information',
        optional: false,
        hasForm: true,
        render: <ProfileFormContent prefix='profile.' />,
        hasErrors: (errors: FormikErrors<FormikValues>) => !!errors.profile,
      },
      {
        name: 'Attendance',
        optional: false,
        hasForm: true,
        render: <MembershipStepVirtual prefix='membership.' />,
        hasErrors: (errors: FormikErrors<FormikValues>) => !!errors.membership,
      },
      {
        name: 'Payment',
        optional: false,
        hasForm: false,
        render: <FinalStep />,
        hasErrors: (errors: FormikErrors<FormikValues>) => false,
      },
    ]

    const residentialPages: WizardPage[] = [
      {
        name: 'Registration',
        optional: false,
        hasForm: false,
        render: <IntroStep />,
        hasErrors: (errors: FormikErrors<FormikValues>) => false,
      },
      {
        name: 'Member Information',
        optional: false,
        hasForm: true,
        render: <ProfileFormContent prefix='profile.' />,
        hasErrors: (errors: FormikErrors<FormikValues>) => !!errors.profile,
      },
      {
        name: 'Convention',
        optional: false,
        hasForm: true,
        render: <MembershipStepConvention prefix='membership.' />,
        hasErrors: (errors: FormikErrors<FormikValues>) => !!errors.membership,
      },
      {
        name: 'Rooms',
        optional: false,
        hasForm: true,
        render: <MembershipStepRooms prefix='membership.' />,
        hasErrors: (errors: FormikErrors<FormikValues>) => !!errors.membership,
      },
      {
        name: 'Admin',
        optional: false,
        hasForm: true,
        render: <MembershipStepAdmin prefix='membership.' />,
        hasErrors: (errors: FormikErrors<FormikValues>) => !!errors.membership,
        enabled: isAdmin,
      },
      {
        name: 'Payment',
        optional: false,
        hasForm: false,
        render: <FinalStep />,
        hasErrors: (errors: FormikErrors<FormikValues>) => false,
      },
    ]
    return isVirtual ? virtualPages : residentialPages
  }, [isAdmin, isVirtual])

  if (!isAuthenticated || !user) {
    throw new Error('login expired')
  } // todo test this

  const onSubmit = async (values: FormValues, actions: FormikHelpers<FormValues>) => {
    const { membership: membershipValues, profile: profileValues } = values
    membershipValues.slotsAttending = toSlotsAttending(membershipValues)
    await updateProfile(profileValues).then(async () => await createOrUpdateMembership(membershipValues, profileValues))
  }

  const values = useMemo(() => {
    // note that for ACNW Virtual, we only really care about acceptance and the list of possible slots that they know that they won't attend.
    // everything else is very hotel centric
    const defaultValues: MembershipType = getDefaultMembership(userId!, isVirtual)
    const _values: FormValues = {
      membership: initialValues ? { ...initialValues } : { ...defaultValues },
      profile: { ...profile },
    }
    _values.membership.slotsAttendingData = fromSlotsAttending(_values.membership)
    return _values
  }, [initialValues, isVirtual, profile, userId])

  return (
    <Wizard
      pages={pages}
      values={values}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      onClose={onClose}
      open={open}
    />
  )
}
