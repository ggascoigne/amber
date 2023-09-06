import React, { createContext, ReactNode, useContext, useMemo, useState } from 'react'

import LoadingButton from '@mui/lab/LoadingButton'
import {
  Perms,
  ProfileFormContent,
  ProfileFormType,
  profileValidationSchema,
  useAuth,
  useConfiguration,
  useEditUserAndProfile,
  useGetTransactionByUserQuery,
  useUser,
  useYearFilter,
} from 'amber'
import { MembershipType } from 'amber/utils/apiTypes'
import { toSlotsAttending, fromSlotsAttending, useEditMembership } from 'amber/utils/membershipUtils'
import { hasAdminStepErrors, MembershipStepAdmin } from 'amber/views/Memberships/MembershipAdmin'
import {
  getDefaultMembership,
  membershipValidationSchemaNW as membershipValidationSchema,
} from 'amber/views/Memberships/membershipUtils'
import { FormikErrors, FormikHelpers, FormikValues } from 'formik'
import { useRouter } from 'next/router'
import { Wizard, WizardPage } from 'ui'
import Yup from 'ui/utils/Yup'

import { IntroStep } from './IntroStep'
import { hasConventionStepErrors, MembershipStepConvention } from './MembershipStepConvention'
import { MembershipStepPayment } from './MembershipStepPayment'
import { hasRoomsStepErrors, MembershipStepRooms } from './MembershipStepRooms'
import { MembershipStepVirtual } from './MembershipStepVirtual'

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

const validationSchema = Yup.object().shape({
  intro: Yup.object().shape({
    acceptedPolicies: Yup.bool().required().oneOf([true], 'Policies must be accepted'),
  }),
  membership: membershipValidationSchema,
  profile: profileValidationSchema,
})

type RedirectInfo = {
  shouldRedirect: boolean
}

export const redirectContext = createContext<
  [RedirectInfo, React.Dispatch<React.SetStateAction<RedirectInfo>>] | undefined
>(undefined)
const RedirectProvider = redirectContext.Provider

export const SaveButton: React.FC<{
  disabled: boolean
  validateForm: (values?: any) => Promise<FormikErrors<any>>
  submitForm: (() => Promise<void>) & (() => Promise<any>)
  children: ReactNode
}> = ({ disabled, validateForm, submitForm }) => {
  const [isLoading, setIsLoading] = useState<'now' | 'later' | undefined>(undefined)
  const [, setShouldRedirect] = useContext(redirectContext)!
  return (
    <>
      <LoadingButton
        onClick={() =>
          validateForm().then(() => {
            submitForm()
            setIsLoading('later')
            setShouldRedirect({ shouldRedirect: false })
          })
        }
        variant='outlined'
        color='primary'
        loading={isLoading === 'later'}
        disabled={disabled || isLoading !== undefined}
      >
        Pay Later
      </LoadingButton>
      <LoadingButton
        onClick={() =>
          validateForm().then(() => {
            submitForm()
            setIsLoading('now')
            setShouldRedirect({ shouldRedirect: true })
          })
        }
        variant='contained'
        color='primary'
        loading={isLoading === 'now'}
        disabled={disabled || isLoading !== undefined}
      >
        Pay Now
      </LoadingButton>
    </>
  )
}

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
  const router = useRouter()
  const redirectContextState = useState<RedirectInfo>({ shouldRedirect: false })
  const [redirectInfo] = redirectContextState

  const { data: usersTransactions } = useGetTransactionByUserQuery(
    {
      userId: initialValues?.userId ?? -1,
    },
    { enabled: !!initialValues?.userId },
  )

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
        name: 'Summary',
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
        name: 'Rooms',
        optional: false,
        hasForm: true,
        render: <MembershipStepRooms prefix='membership.' />,
        hasErrors: hasRoomsStepErrors,
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
        name: 'Summary',
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

  const onSubmit = async (values: MembershipWizardFormValues, _actions: FormikHelpers<MembershipWizardFormValues>) => {
    const { membership: membershipValues, profile: profileValues } = values
    membershipValues.slotsAttending = toSlotsAttending(membershipValues)
    await updateProfile(profileValues).then(async () => {
      await createOrUpdateMembership(membershipValues, profileValues, usersTransactions!)
      if (!short && redirectInfo.shouldRedirect) {
        router.push('/payment')
      }
    })
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
    _values.membership.slotsAttendingData = fromSlotsAttending(configuration, _values.membership)
    return _values
  }, [configuration, initialValues, isVirtual, profile, userId])

  return (
    <RedirectProvider value={redirectContextState}>
      <Wizard
        pages={pages}
        values={values}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        onClose={onClose}
        open={open}
        isEditing={!!initialValues}
        SaveButton={SaveButton}
      />
    </RedirectProvider>
  )
}
