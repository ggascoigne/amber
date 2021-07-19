import { DialogContentText, createStyles, makeStyles } from '@material-ui/core'
import { DatePicker, TextField } from 'components/Form'
import { DateTime } from 'luxon'
import React from 'react'

import { ConfigDate } from '../../components'
import { GridContainer, GridItem } from '../../components/Grid'
import { Important } from '../../components/Typography'
import { configuration } from '../../utils'
import { MembershipFormContent } from './membershipUtils'

const useStyles = makeStyles(() =>
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

export const MembershipStepRooms: React.FC<MembershipFormContent> = ({ prefix = '' }) => {
  const classes = useStyles()

  return (
    <>
      <h3>Room Choice</h3>
      <DialogContentText>
        Please note that all room types are limited in number, and will be filled first-come, first served.
      </DialogContentText>

      <DialogContentText>
        If your preferred room type is sold out, and you wish to be placed on the waiting list, please indicate this in
        the NOTES section below the sign up.
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
          />
        </GridItem>
      </GridContainer>
      <GridContainer spacing={2}>
        <GridItem xs={12} md={12}>
          <TextField name={`${prefix}message`} label='Messages' margin='normal' fullWidth multiline />
        </GridItem>
      </GridContainer>
    </>
  )
}
