import type React from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'

import {
  Attendance,
  ContactEmail,
  ConventionsDatesFull,
  useConfiguration,
  useGetAttendanceOptions,
  useGetSubsidizedAttendanceOptions,
} from '@amber/amber'
import type { MembershipErrorType, MembershipFormContent } from '@amber/amber/utils/membershipUtils'
import { hasMembershipStepErrors } from '@amber/amber/utils/membershipUtils'
import { CheckboxWithLabel, getSafeFloat, RadioGroupFieldWithLabel, TextField } from '@amber/ui'
import {
  Box,
  Card,
  CardContent,
  DialogContentText,
  FormControlLabel,
  FormLabel,
  Grid,
  InputAdornment,
  Radio,
  RadioGroup,
} from '@mui/material'
import type { FormikErrors, FormikValues } from 'formik'
import { useField, useFormikContext } from 'formik'

export const hasConventionStepErrors = (errors: FormikErrors<FormikValues>) =>
  hasMembershipStepErrors(
    'convention',
    errors?.membership as MembershipErrorType,
    'attendance',
    'interestLevel',
    'offerSubsidy',
    'subsidizedAmount',
    'donation',
  )

type DonationChoiceValue = 'full' | 'short' | '100' | '30' | 'other'

const defaultDonationChoice: DonationChoiceValue = '30'

const getDonationChoice = (
  donation: number,
  fullMembershipAmount: number,
  shortMembershipAmount: number,
): DonationChoiceValue => {
  if (donation === fullMembershipAmount) {
    return 'full'
  }
  if (donation === shortMembershipAmount) {
    return 'short'
  }
  if (donation === 100) {
    return '100'
  }
  if (donation === 30) {
    return '30'
  }
  return 'other'
}

const getDonationAmount = (
  choice: Exclude<DonationChoiceValue, 'other'>,
  fullMembershipAmount: number,
  shortMembershipAmount: number,
) => {
  switch (choice) {
    case 'full':
      return fullMembershipAmount
    case 'short':
      return shortMembershipAmount
    case '100':
      return 100
    case '30':
      return 30
    default:
      throw new Error('Unsupported donation choice')
  }
}

export const MembershipStepConvention = ({ prefix = '' }: MembershipFormContent) => {
  const configuration = useConfiguration()
  const attendanceOptions = useGetAttendanceOptions()
  const subsidizedAttendanceOptions = useGetSubsidizedAttendanceOptions()
  const { setFieldValue } = useFormikContext<FormikValues>()
  const [field] = useField(`${prefix}membership`)
  const [offerSubsidyField] = useField<boolean>(`${prefix}offerSubsidy`)
  const [donationField] = useField<number>(`${prefix}donation`)
  const previousOfferSubsidy = useRef(offerSubsidyField.value)

  const [showSubsidizedOptions, setShowSubsidizedOptions] = useState(field.value === Attendance.Subsidized)
  const [donationChoice, setDonationChoice] = useState<DonationChoiceValue>(() =>
    getDonationChoice(donationField.value ?? 0, configuration.fourDayMembership, configuration.threeDayMembership),
  )

  const onChangeAttendance = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>, _checked: boolean): void => {
      const attendance = event.target.value
      if (attendance === Attendance.ThursSun) {
        setFieldValue(`${prefix}subsidizedAmount`, configuration.subsidizedMembership)
      } else if (attendance === Attendance.FriSun) {
        setFieldValue(`${prefix}subsidizedAmount`, configuration.subsidizedMembershipShort)
      }
    },
    [configuration.subsidizedMembership, configuration.subsidizedMembershipShort, prefix, setFieldValue],
  )

  const onChangeMembership = useCallback((event: React.ChangeEvent<HTMLInputElement>, _checked: boolean): void => {
    setShowSubsidizedOptions(event.target.value === Attendance.Subsidized)
  }, [])

  useEffect(() => {
    if (previousOfferSubsidy.current === offerSubsidyField.value) {
      return
    }

    previousOfferSubsidy.current = offerSubsidyField.value

    if (offerSubsidyField.value) {
      const nextDonation = donationField.value && donationField.value > 0 ? donationField.value : 30
      setFieldValue(`${prefix}donation`, nextDonation)
      setDonationChoice(
        getDonationChoice(nextDonation, configuration.fourDayMembership, configuration.threeDayMembership),
      )
      return
    }

    setFieldValue(`${prefix}donation`, 0)
    setDonationChoice(defaultDonationChoice)
  }, [
    configuration.fourDayMembership,
    configuration.threeDayMembership,
    donationField.value,
    offerSubsidyField.value,
    prefix,
    setFieldValue,
  ])

  useEffect(() => {
    if (offerSubsidyField.value) {
      setDonationChoice(
        getDonationChoice(donationField.value ?? 0, configuration.fourDayMembership, configuration.threeDayMembership),
      )
      return
    }

    setDonationChoice(defaultDonationChoice)
  }, [configuration.fourDayMembership, configuration.threeDayMembership, donationField.value, offerSubsidyField.value])

  const onChangeDonationChoice = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const nextChoice = event.target.value as DonationChoiceValue
      setDonationChoice(nextChoice)

      if (nextChoice === 'other') {
        if (
          getDonationChoice(
            donationField.value ?? 0,
            configuration.fourDayMembership,
            configuration.threeDayMembership,
          ) !== 'other'
        ) {
          setFieldValue(`${prefix}donation`, 0)
        }
        return
      }

      setFieldValue(
        `${prefix}donation`,
        getDonationAmount(nextChoice, configuration.fourDayMembership, configuration.threeDayMembership),
      )
    },
    [configuration.fourDayMembership, configuration.threeDayMembership, donationField.value, prefix, setFieldValue],
  )

  return (
    <>
      <DialogContentText>
        Per Edgefield&apos;s room policy, you must be at least 18 or older to register. If you are younger and wish to
        attend, please contact the organizers at <ContactEmail />.
      </DialogContentText>

      <h3>Convention Registration</h3>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card elevation={3}>
            <CardContent sx={{ mb: 0, '&&:last-child': { pb: 1 } }}>
              <strong>Full Membership - ${configuration.fourDayMembership}</strong> includes
              <ul>
                <li>up to all {configuration.numberOfSlots} game slots, Thursday evening through Sunday evening</li>
                <li>a ${configuration.fourDayVoucher} meal card</li>
                <li>3 breakfasts</li>
              </ul>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card elevation={3}>
            <CardContent sx={{ mb: 0, '&&:last-child': { pb: 1 } }}>
              <strong>Short Membership - ${configuration.threeDayMembership}</strong> includes
              <ul>
                <li>up to 4 game slots, Friday evening through Sunday evening, for example</li>
                <li>a ${configuration.threeDayVoucher} meal card</li>
                <li>2 breakfasts</li>
              </ul>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 12 }} sx={{ mb: 2 }}>
          <RadioGroupFieldWithLabel
            aria-label='Select Membership'
            label='Select Membership'
            name={`${prefix}membership`}
            selectValues={subsidizedAttendanceOptions}
            onChange={onChangeMembership}
          />
        </Grid>
        {showSubsidizedOptions && (
          <Card
            sx={{
              p: 2,
              ml: 4,
              mb: 2,
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
            elevation={3}
          >
            <Grid size={{ xs: 12, md: 12 }} sx={{ mb: 2 }}>
              <RadioGroupFieldWithLabel
                aria-label='Select Attendance'
                label='Select Attendance'
                name={`${prefix}attendance`}
                selectValues={attendanceOptions}
                row
                onChange={onChangeAttendance}
              />
            </Grid>
            <Grid
              container
              size={{ xs: 12, md: 12 }}
              sx={{ mb: 2, mt: -1, alignItems: 'flex-start', flexDirection: 'column', flexWrap: 'nowrap' }}
            >
              <FormLabel sx={{ pr: 2, pb: 1 }}>Amount: enter a value you are comfortable paying, minimum $20</FormLabel>
              <TextField
                name={`${prefix}subsidizedAmount`}
                parse={getSafeFloat}
                slotProps={{
                  input: {
                    startAdornment: <InputAdornment position='start'>$</InputAdornment>,
                  },
                }}
                variant='outlined'
              />
            </Grid>
            <DialogContentText>
              A subsidized membership is the same as the equivalent full priced membership, just at a discount.
            </DialogContentText>
          </Card>
        )}
        {!showSubsidizedOptions && (
          <Card
            sx={{
              p: 2,
              mx: 4,
              mb: 2,
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
            elevation={3}
          >
            <Box component='h4' sx={{ fontWeight: 400 }}>
              Support Subsidized Memberships
            </Box>
            <DialogContentText>
              Through the extraordinary generosity of our attendees, AmberCon Northwest is able to offer subsidized
              memberships. Your contribution helps more players join us at the convention, and any amount keeps AmberCon
              accessible to everyone.
            </DialogContentText>
            <Grid container spacing={2} sx={{ mb: 2, ml: 1 }}>
              <Grid size={{ xs: 12, md: 12 }}>
                <CheckboxWithLabel label='Yes, I&#39;d like to contribute.' name={`${prefix}offerSubsidy`} />
              </Grid>
              {offerSubsidyField.value ? (
                <Grid size={{ xs: 12, md: 12 }}>
                  <RadioGroup name={`${prefix}donationChoice`} value={donationChoice} onChange={onChangeDonationChoice}>
                    <FormControlLabel
                      value='full'
                      control={<Radio />}
                      label={`$${configuration.fourDayMembership}, sponsor a Full Membership`}
                    />
                    <FormControlLabel
                      value='short'
                      control={<Radio />}
                      label={`$${configuration.threeDayMembership}, sponsor a Short Membership`}
                    />
                    <FormControlLabel value='100' control={<Radio />} label='$100' />
                    <FormControlLabel value='30' control={<Radio />} label='$30' />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, pl: 0 }}>
                      <FormControlLabel value='other' control={<Radio />} label='Other' />
                      <TextField
                        name={`${prefix}donation`}
                        parse={getSafeFloat}
                        disabled={donationChoice !== 'other'}
                        slotProps={{
                          input: {
                            startAdornment: <InputAdornment position='start'>$</InputAdornment>,
                          },
                        }}
                        variant='outlined'
                      />
                    </Box>
                  </RadioGroup>
                </Grid>
              ) : null}
            </Grid>
            <DialogContentText>
              Your contribution will appear on your registration confirmation and is visible to our administrators, but
              will otherwise remain anonymous.
            </DialogContentText>
          </Card>
        )}
        <DialogContentText>
          <b>
            By confirming my membership, I plan to attend {configuration.title},{' '}
            <ConventionsDatesFull pre='from' intra='through' post=', ' /> at McMenamins Edgefield Bed & Breakfast in
            Troutdale, Oregon. I understand that my hotel room is held but not reserved until I have paid my membership
            fee in full and received confirmation from the organizers.
          </b>
        </DialogContentText>
      </Grid>
    </>
  )
}
