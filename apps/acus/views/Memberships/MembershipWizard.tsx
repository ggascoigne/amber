import { FormikErrors, FormikHelpers, FormikValues } from 'formik'
import React, { useMemo } from 'react'
import Yup from 'ui/utils/Yup'
import { Wizard, WizardPage } from 'ui'
import {
  Perms,
  ProfileFormContent,
  ProfileFormType,
  profileValidationSchema,
  useAuth,
  useConfiguration,
  useEditUserAndProfile,
  useUser,
  useYearFilter,
} from 'amber'
import { MembershipType } from 'amber/utils/apiTypes'
import { IntroStep } from './IntroStep'
import { hasAdminStepErrors, MembershipStepAdmin } from './MembershipAdmin'
import { hasConventionStepErrors, MembershipStepConvention } from './MembershipStepConvention'
import { MembershipStepPayment } from './MembershipStepPayment'
import { hasRoomsStepErrors, MembershipStepRooms } from './MembershipStepRooms'
import { MembershipStepVirtual } from './MembershipStepVirtual'
import {
  fromSlotsAttending,
  getDefaultMembership,
  membershipValidationSchema,
  toSlotsAttending,
  useEditMembership,
} from './membershipUtils'

interface IntroType {
  acceptedPolicies: boolean
}

export interface MembershipWizardFormValues {
  intro: IntroType
  membership: MembershipType
  profile: ProfileFormType
}

interface MembershipWizardProps {
  open: boolean
  onClose: (event?: any) => void
  initialValues?: MembershipType
  profile: ProfileFormType
  short?: boolean
}

// what hard coded lists did the old system map to
// const legacyValueLists = {
//   interestLevel: ['Full', 'Deposit'],
//   attendance: ['Thurs-Sun', 'Fri-Sun'],
//   roomingPreferences: ['room-with', 'assign-me', 'other'],
// }

const validationSchema = Yup.object().shape({
  intro: Yup.object().shape({
    acceptedPolicies: Yup.bool().required().oneOf([true], 'Policies must be accepted'),
  }),
  membership: membershipValidationSchema,
  profile: profileValidationSchema,
})

export const MembershipWizard: React.FC<MembershipWizardProps> = ({
  open,
  onClose,
  profile,
  initialValues,
  short = false,
}) => {
  const configuration = useConfiguration()
  const { user, hasPermissions } = useAuth()
  const isAdmin = hasPermissions(Perms.IsAdmin)

  const { userId } = useUser()
  const createOrUpdateMembership = useEditMembership(onClose)
  const updateProfile = useEditUserAndProfile()
  const [year] = useYearFilter()
  const isVirtual = configuration.startDates[year].virtual

  const pages = useMemo(() => {
    const virtualPages: WizardPage[] = [
      {
        name: 'Registration',
        optional: false,
        hasForm: false,
        render: <IntroStep prefix='intro.' />,
        enabled: !short,
      },
      {
        name: 'Member Information',
        optional: false,
        hasForm: true,
        render: <ProfileFormContent prefix='profile.' />,
        hasErrors: (errors: FormikErrors<FormikValues>) => !!errors.profile,
        enabled: !short, // note that the short page version is on the membership page, and doesn't have access to the member's profile
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
        render: <MembershipStepPayment />,
        enabled: !short,
      },
    ]

    const residentialPages: WizardPage[] = [
      {
        name: 'Registration',
        optional: false,
        hasForm: true,
        render: <IntroStep prefix='intro.' />,
        enabled: !short,
        hasErrors: (errors: FormikErrors<FormikValues>) => !!errors.intro,
      },
      {
        name: 'Member Information',
        optional: false,
        hasForm: true,
        render: <ProfileFormContent prefix='profile.' />,
        hasErrors: (errors: FormikErrors<FormikValues>) => !!errors.profile,
        enabled: !short,
      },
      {
        name: 'Convention',
        optional: false,
        hasForm: true,
        render: <MembershipStepConvention prefix='membership.' />,
        hasErrors: hasConventionStepErrors,
      },
      {
        name: 'Admin',
        optional: false,
        hasForm: true,
        render: <MembershipStepAdmin prefix='membership.' />,
        hasErrors: hasAdminStepErrors,
        enabled: isAdmin,
      },
      {
        name: 'Payment',
        optional: false,
        hasForm: false,
        render: <MembershipStepPayment />,
        enabled: !short,
      },
    ]
    return isVirtual ? virtualPages : residentialPages
  }, [isAdmin, isVirtual, short])

  if (!user) {
    throw new Error('login expired')
  } // todo test this

  const onSubmit = async (values: MembershipWizardFormValues, actions: FormikHelpers<MembershipWizardFormValues>) => {
    const { membership: membershipValues, profile: profileValues } = values
    membershipValues.slotsAttending = toSlotsAttending(membershipValues)
    await updateProfile(profileValues).then(async () => createOrUpdateMembership(membershipValues, profileValues))
  }

  const values = useMemo(() => {
    // note that for ACNW Virtual, we only really care about acceptance and the list of possible slots that they know that they won't attend.
    // everything else is very hotel centric
    const defaultValues: MembershipType = getDefaultMembership(configuration, userId!, isVirtual)
    const _values: MembershipWizardFormValues = {
      intro: { acceptedPolicies: !!initialValues?.id },
      membership: initialValues ? { ...initialValues } : { ...defaultValues },
      profile: { ...profile },
    }
    _values.membership.slotsAttendingData = fromSlotsAttending(_values.membership)
    return _values
  }, [configuration, initialValues, isVirtual, profile, userId])

  return (
    <Wizard
      pages={pages}
      values={values}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      onClose={onClose}
      open={open}
      isEditing={!!initialValues}
    />
  )
}
