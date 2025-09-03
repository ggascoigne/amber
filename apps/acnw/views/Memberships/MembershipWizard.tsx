import React, { createContext, ReactNode, useContext, useMemo, useState } from 'react'

import {
  Perms,
  ProfileFormContent,
  profileValidationSchema,
  useAuth,
  useConfiguration,
  useEditUserAndProfile,
  useUser,
  useYearFilter,
  Configuration,
  Attendance,
} from '@amber/amber'
import {
  toSlotsAttending,
  fromSlotsAttending,
  useEditMembership,
  MembershipFormType,
} from '@amber/amber/utils/membershipUtils'
import { hasAdminStepErrors, MembershipStepAdmin } from '@amber/amber/views/Memberships/MembershipAdmin'
import {
  getDefaultMembership,
  membershipValidationSchemaNW as membershipValidationSchema,
} from '@amber/amber/views/Memberships/membershipUtils'
import { UserAndProfile, useTRPC } from '@amber/client'
import { Wizard, WizardPage } from '@amber/ui'
import Yup from '@amber/ui/utils/Yup'
import LoadingButton from '@mui/lab/LoadingButton'
import { useQuery } from '@tanstack/react-query'
import debug from 'debug'
import { FormikErrors, FormikHelpers, FormikValues } from 'formik'
import { useRouter } from 'next/router'

import { IntroStep } from './IntroStep'
import { hasConventionStepErrors, MembershipStepConvention } from './MembershipStepConvention'
import { MembershipStepPayment } from './MembershipStepPayment'
import { hasRoomsStepErrors, MembershipStepRooms } from './MembershipStepRooms'
import { MembershipStepVirtual } from './MembershipStepVirtual'

const log = debug('amber:acnw:MembershipWizard')

interface IntroType {
  acceptedPolicies: boolean
}

export interface MembershipWizardFormValues {
  intro: IntroType
  membership: MembershipFormType
  profile: UserAndProfile
}

interface MembershipWizardProps {
  open: boolean
  onClose: (event?: any) => void
  initialValues?: MembershipFormType
  profile: UserAndProfile
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

export const SaveButton = ({
  disabled,
  validateForm,
  submitForm,
}: {
  disabled: boolean
  validateForm: (values?: any) => Promise<FormikErrors<any>>
  submitForm: (() => Promise<void>) & (() => Promise<any>)
  children: ReactNode
}) => {
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
        Confirm
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
        Confirm & Pay
      </LoadingButton>
    </>
  )
}

const getCostsAndAttendance = (
  configuration: Configuration,
  membershipValues: MembershipFormType,
): Partial<MembershipFormType> => {
  const { attendance, membership, subsidizedAmount } = membershipValues
  if (membership === Attendance.Subsidized) {
    return {
      cost: subsidizedAmount ?? null,
      membership,
      attendance,
      requestOldPrice: true,
    }
  } else {
    return {
      cost: membership === Attendance.ThursSun ? configuration.fourDayMembership : configuration.threeDayMembership,
      membership,
      attendance: membership,
      requestOldPrice: false,
      subsidizedAmount:
        membership === Attendance.ThursSun
          ? configuration.subsidizedMembership
          : configuration.subsidizedMembershipShort,
    }
  }
}

const setCostsAndAttendance = (
  configuration: Configuration,
  membershipValues: MembershipFormType,
): MembershipFormType => {
  const { attendance, cost, requestOldPrice } = membershipValues
  if (requestOldPrice) {
    return {
      ...membershipValues,
      membership: Attendance.Subsidized,
      subsidizedAmount:
        (cost ?? 0) > 0
          ? cost!
          : attendance === Attendance.ThursSun
            ? configuration.subsidizedMembership
            : configuration.subsidizedMembershipShort,
    }
  }
  return {
    ...membershipValues,
    membership: attendance,
    attendance,
    subsidizedAmount:
      attendance === Attendance.ThursSun ? configuration.subsidizedMembership : configuration.subsidizedMembershipShort,
  }
}

export const MembershipWizard = ({ open, onClose, profile, initialValues, short = false }: MembershipWizardProps) => {
  const configuration = useConfiguration()
  const { user, hasPermissions } = useAuth()
  const isAdmin = hasPermissions(Perms.IsAdmin)
  const trpc = useTRPC()

  const { userId } = useUser()
  const createOrUpdateMembership = useEditMembership(onClose)
  const updateProfile = useEditUserAndProfile()
  const [year] = useYearFilter()
  const isVirtual = configuration.startDates[year].virtual
  const router = useRouter()
  const redirectContextState = useState<RedirectInfo>({ shouldRedirect: false })
  const [redirectInfo] = redirectContextState

  const { data: usersTransactions } = useQuery(
    trpc.transactions.getTransactionsByUser.queryOptions(
      {
        userId: initialValues?.userId ?? -1,
      },
      { enabled: !!initialValues?.userId },
    ),
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
  } // TODO test this

  const onSubmit = async (values: MembershipWizardFormValues, _actions: FormikHelpers<MembershipWizardFormValues>) => {
    const { membership: membershipValues, profile: profileValues } = values
    const newMembershipValues = {
      ...membershipValues,
      slotsAttending: toSlotsAttending(membershipValues),
      ...getCostsAndAttendance(configuration, membershipValues),
    }

    console.log('MembershipWizard:', newMembershipValues)
    await updateProfile(profileValues).then(async () => {
      await createOrUpdateMembership(newMembershipValues, profileValues, usersTransactions!)
      if (!short && redirectInfo.shouldRedirect) {
        router.push('/payment')
      }
    })
  }

  const values = useMemo(() => {
    // note that for ACNW Virtual, we only really care about acceptance and the list of possible slots that they know that they won't attend.
    // everything else is very hotel centric
    const defaultValues: MembershipFormType = getDefaultMembership(configuration, userId!, isVirtual)
    const _values: MembershipWizardFormValues = {
      intro: { acceptedPolicies: !!initialValues?.id },
      membership: initialValues ? { ...setCostsAndAttendance(configuration, initialValues) } : { ...defaultValues },
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
