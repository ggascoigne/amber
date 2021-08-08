import { DialogContentText, FormControl, RadioGroup, Theme, createStyles, makeStyles } from '@material-ui/core'
import { DatePicker, RadioGroupFieldWithLabel, TextField } from 'components/Form'
import { FormikErrors, FormikValues, useField, useFormikContext } from 'formik'
import { DateTime } from 'luxon'
import React, { useCallback } from 'react'

import { Acnw, ConfigDate } from '../../components'
import { GridContainer, GridItem } from '../../components/Grid'
import { RoomFieldTable } from '../../components/Rooms'
import { Important } from '../../components/Typography'
import { RoomPref, configuration, roomPrefOptions } from '../../utils'
import { MembershipErrorType, MembershipFormContent, hasMembershipStepErrors } from './membershipUtils'
import { MembershipWizardFormValues } from './MembershipWizard'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    important: {
      marginBottom: 12,
    },
    slotSelection: {
      position: 'relative',
      paddingTop: 0,
    },
    slotToggleWrapper: {
      position: 'absolute',
      top: 16,
      right: 50,
    },
  })
)

const DatePickerLabelFn = (date: DateTime | null, invalidLabel: string) =>
  date ? date.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY) : ''

export const hasRoomsStepErrors = (errors: FormikErrors<FormikValues>) =>
  hasMembershipStepErrors(
    'rooms',
    errors?.membership as MembershipErrorType,
    'arrivalDate',
    'departureDate',
    'hotelRoomId',
    'message'
  )

export const MembershipStepRooms: React.FC<MembershipFormContent> = ({ prefix = '' }) => {
  const classes = useStyles()

  const [hotelRoomField, meta, { setValue }] = useField(`${prefix}hotelRoomId`)
  const { touched, error: fieldError } = meta
  const showError = touched && !!fieldError
  const { values } = useFormikContext<MembershipWizardFormValues>()

  const onChange = useCallback(
    (e: React.ChangeEvent<any>) => {
      // needed to convert the string value that is returned by the DOM into the numeric ID we need
      setValue(parseInt(e.target.value))
    },
    [setValue]
  )

  return (
    <>
      <h3>Room Choice</h3>
      <DialogContentText>
        Please note that all room types are limited in number, and will be filled first-come, first served. If your
        preferred room type is sold out, and you wish to be placed on the waiting list, please indicate this in the
        NOTES section below the sign up.
      </DialogContentText>

      <DialogContentText>
        If you plan to arrive before <ConfigDate name='mondayBeforeCon' format={DateTime.DATE_MED_WITH_WEEKDAY} /> or
        extend your stay past
        <ConfigDate name='wednesdayAfterCon' format={DateTime.DATE_MED_WITH_WEEKDAY} skipSpace='after' />, please add
        that information to the NOTES.
      </DialogContentText>

      <DialogContentText>
        The listed price below does not include {configuration.oregonHotelTax} Oregon hotel tax. Also, each person over
        two in a room will incur an additional {configuration.moreThanDoubleOccupancySurcharge} charge per night.
      </DialogContentText>
      <Important component='span' className={classes.important}>
        These rates are subject to change. The latest room rates can be found at{' '}
      </Important>
      <a href='https://www.mcmenamins.com/edgefield/home/about-edgefield' target='_new'>
        https://www.mcmenamins.com/edgefield/home/about-edgefield
      </a>

      <Important className={classes.important}>
        Where there is a difference in price, those on the McMenamins site should always be considered correct.
      </Important>
      <GridContainer spacing={2} direction='row'>
        <GridItem xs={12} md={6}>
          <DatePicker
            label='Hotel Check-in'
            name={`${prefix}arrivalDate`}
            clearable
            autoOk
            disablePast
            initialFocusedDate={null}
            minDate={configuration.mondayBeforeCon}
            maxDate={configuration.conventionEndDate}
            labelFunc={DatePickerLabelFn}
            inputVariant='filled'
          />
        </GridItem>
        <GridItem xs={12} md={6}>
          <DatePicker
            label='Departure Date'
            name={`${prefix}departureDate`}
            clearable
            autoOk
            disablePast
            initialFocusedDate={null}
            minDate={configuration.conventionStartDate}
            maxDate={configuration.wednesdayAfterCon}
            labelFunc={DatePickerLabelFn}
            inputVariant='filled'
          />
        </GridItem>
      </GridContainer>
      <DialogContentText>
        <br />
        The hotel rooms reserved by the convention are subject to a 48 hour cancellation policy. If you must change your
        reservation, contact <Acnw.ContactEmail /> at least 48 hours in advance. Later changes or cancellations may
        result in charges for hotel nights reserved but not used.
      </DialogContentText>

      <Important component='span' className={classes.important}>
        If you are sharing a room, please only have one of you 'book' the room. For everyone else who's sharing the room
        just select the 'sharing' option in this first list. If each of you lists who you are sharing with, we can
        better make sure that there are no mistakes.
      </Important>

      <FormControl component='fieldset' error={showError}>
        <RadioGroup {...hotelRoomField} onChange={onChange}>
          <RoomFieldTable />
        </RadioGroup>
      </FormControl>

      <Important className={classes.important}>
        <br />* Game Rooms: These are suites reserved for game play and the listed price includes a $30 discount from
        ACNW for gaming nights. Be advised that while we will do our best to make sure that the rooms are used for games
        you are actually in, in exchange for the discount the game space will be scheduled{' '}
        <b>at the discretion of the organizers</b>.<br />
        Game rooms are only available for members who are staying at the hotel from
        <b>Thursday</b> until <b>Monday</b>.
      </Important>

      <GridContainer spacing={2}>
        <GridItem xs={12} md={12}>
          <TextField
            name={`${prefix}roomPreferenceAndNotes`}
            label='Room Preference And Notes'
            margin='normal'
            fullWidth
            multiline
          />
        </GridItem>
      </GridContainer>

      <h3>Roommates</h3>
      <GridContainer spacing={2} direction='row'>
        <GridItem xs={12} md={6}>
          <RadioGroupFieldWithLabel
            aria-label='Rooming Preferences'
            label='Rooming Preferences'
            name={`${prefix}roomingPreferences`}
            selectValues={roomPrefOptions}
          />
        </GridItem>
        <GridItem xs={12} md={6}>
          <TextField
            name={`${prefix}roomingWith`}
            label='Rooming with'
            margin='normal'
            fullWidth
            multiline
            disabled={values.membership.roomingPreferences !== RoomPref.RoomWith}
          />
        </GridItem>
      </GridContainer>

      <GridContainer spacing={2}>
        <GridItem xs={12} md={12}>
          <TextField name={`${prefix}message`} label='Any other Message' margin='normal' fullWidth multiline />
        </GridItem>
      </GridContainer>
    </>
  )
}
