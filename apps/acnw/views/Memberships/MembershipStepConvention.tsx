import React, { useCallback, useState } from 'react'

import {
  Attendance,
  ContactEmail,
  ConventionsDatesFull,
  useConfiguration,
  useGetAttendanceOptions,
  useGetSubsidizedAttendanceOptions,
} from '@amber/amber'
import { MembershipErrorType, MembershipFormContent, hasMembershipStepErrors } from '@amber/amber/utils/membershipUtils'
import {
  CheckboxWithLabel,
  getSafeFloat,
  GridContainer,
  GridItem,
  RadioGroupFieldWithLabel,
  TextField,
} from '@amber/ui'
import { Box, Card, CardContent, DialogContentText, FormLabel, InputAdornment } from '@mui/material'
import { FormikErrors, FormikValues, useField, useFormikContext } from 'formik'

export const hasConventionStepErrors = (errors: FormikErrors<FormikValues>) =>
  hasMembershipStepErrors(
    'convention',
    errors?.membership as MembershipErrorType,
    'attendance',
    'interestLevel',
    'offerSubsidy',
    'subsidizedAmount',
  )

export const MembershipStepConvention = ({ prefix = '' }: MembershipFormContent) => {
  const configuration = useConfiguration()
  const attendanceOptions = useGetAttendanceOptions()
  const subsidizedAttendanceOptions = useGetSubsidizedAttendanceOptions()
  const { setFieldValue } = useFormikContext<FormikValues>()
  const [field] = useField(`${prefix}membership`)

  const [showSubsidizedOptions, setShowSubsidizedOptions] = useState(field.value === Attendance.Subsidized)

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

  return (
    <>
      <DialogContentText>
        Per Edgefield&apos;s room policy, you must be at least 18 or older to register. If you are younger and wish to
        attend, please contact the organizers at <ContactEmail />.
      </DialogContentText>
      <DialogContentText>
        I plan to attend {configuration.title}, <ConventionsDatesFull pre='from' intra='through' post=',' /> at
        McMenamin&apos;s Edgefield Bed & Breakfast in Troutdale, Oregon. I understand that my hotel room is held but not
        reserved until I have paid my membership fee in full and received confirmation from the organizers.
      </DialogContentText>
      <h3>Convention Registration</h3>
      <GridContainer spacing={2} sx={{ mb: 2 }}>
        <GridItem size={{ xs: 12, md: 6 }}>
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
        </GridItem>
        <GridItem size={{ xs: 12, md: 6 }}>
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
        </GridItem>
      </GridContainer>
      <GridContainer spacing={2}>
        <GridItem size={{ xs: 12, md: 12 }}>
          <DialogContentText sx={{ pt: 1 }}>
            Through the extraordinary generosity of our members, {configuration.title} can offer subsidized memberships.
          </DialogContentText>
        </GridItem>
        <GridItem size={{ xs: 12, md: 12 }} sx={{ mb: 2 }}>
          <RadioGroupFieldWithLabel
            aria-label='Select Membership'
            label='Select Membership'
            name={`${prefix}membership`}
            selectValues={subsidizedAttendanceOptions}
            onChange={onChangeMembership}
          />
        </GridItem>
        {showSubsidizedOptions && (
          <Card sx={{ p: 2, ml: 4, mb: 2, width: '100%', display: 'flex', flexDirection: 'column' }} elevation={3}>
            <GridItem size={{ xs: 12, md: 12 }} sx={{ mb: 2 }}>
              <RadioGroupFieldWithLabel
                aria-label='Select Attendance'
                label='Select Attendance'
                name={`${prefix}attendance`}
                selectValues={attendanceOptions}
                row
                onChange={onChangeAttendance}
              />
            </GridItem>
            <GridItem
              container
              size={{ xs: 12, md: 12 }}
              sx={{ mb: 2, mt: -1 }}
              alignItems='flex-start'
              flexDirection='column'
              flexWrap='nowrap'
            >
              <FormLabel sx={{ pr: 2, pb: 1 }}>Amount: enter a value you are comfortable paying, minimum $20</FormLabel>
              <TextField
                name={`${prefix}subsidizedAmount`}
                parse={getSafeFloat}
                InputProps={{
                  startAdornment: <InputAdornment position='start'>$</InputAdornment>,
                }}
                variant='outlined'
              />
            </GridItem>
            <DialogContentText>
              A subsidized membership is the same as the equivalent full priced membership, just at a discount.
            </DialogContentText>
          </Card>
        )}
        {!showSubsidizedOptions && (
          <Card sx={{ p: 2, mx: 4, mb: 2, width: '100%', display: 'flex', flexDirection: 'column' }} elevation={3}>
            <Box component='h4' sx={{ fontWeight: 400 }}>
              Support Subsidized Memberships
            </Box>
            <DialogContentText>
              If you would like to contribute to help others, please check the appropriate box below.
            </DialogContentText>
            <GridContainer spacing={2} sx={{ mb: 2, ml: 1 }}>
              <GridItem size={{ xs: 12, md: 12 }}>
                <CheckboxWithLabel label='To contribute to the fund, check this box' name={`${prefix}offerSubsidy`} />
              </GridItem>
            </GridContainer>
            <DialogContentText>
              While this selection will show to you on your registration page and to us for administration, it will be
              otherwise anonymous.
            </DialogContentText>
          </Card>
        )}
      </GridContainer>
    </>
  )
}
