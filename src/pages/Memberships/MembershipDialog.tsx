import {
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContentText,
  FormControlLabel,
  FormGroup,
  Switch,
  createStyles,
  makeStyles,
} from '@material-ui/core'
import DialogContent from '@material-ui/core/DialogContent'
import {
  MembershipFieldsFragment,
  Node,
  useCreateMembershipMutation,
  useGetMembershipByYearAndIdQuery,
  useUpdateMembershipByNodeIdMutation,
} from 'client'
import { CheckboxWithLabel, DialogTitle, GridContainer, GridItem, TextField, useProfile } from 'components/Acnw'
import { useAuth } from 'components/Acnw/Auth/Auth0'
import { Form, Formik, FormikHelpers } from 'formik'
import React, { useMemo, useState } from 'react'
import { configuration, getSlotDescription, isNotPacificTime, range } from 'utils'
import Yup from 'utils/Yup'

import { useNotification } from '../../components/Acnw/Notifications'
import { useSendEmail } from '../../utils/useSendEmail'

type FormValues = Omit<MembershipFieldsFragment, 'nodeId' | 'id' | '__typename'> &
  Partial<{ id: number }> &
  Partial<Node> & {
    skipSlotsData?: boolean[]
  }

interface MembershipDialog {
  open: boolean
  onClose: (event?: any) => void
  initialValues?: FormValues
}

// what hard coded lists did the old system map to
// const legacyValueLists = {
//   interestLevel: ['Full', 'Deposit'],
//   attendance: ['Thurs-Sun', 'Fri-Sun'],
//   roomingPreferences: ['room-with', 'assign-me', 'other'],
// }

const validationSchema = Yup.object().shape({
  arrivalDate: Yup.date().required(),
  attendance: Yup.string().max(255).required(),
  departureDate: Yup.date().required(),
  interestLevel: Yup.string().max(255).required(),
  message: Yup.string().max(1024),
  roomPreferenceAndNotes: Yup.string().max(1024),
  roomingPreferences: Yup.string().max(255),
  roomingWith: Yup.string().max(250), // yeah really - schema is super inconsistent here
  skipSlots: Yup.string().max(20),
})

const useStyles = makeStyles(() =>
  createStyles({
    card: {
      position: 'relative',
      // padding: 20,
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

export const MembershipDialog: React.FC<MembershipDialog> = ({ open, onClose, initialValues }) => {
  const { isAuthenticated, user } = useAuth()
  const classes = useStyles()
  const [showPT, setShowPT] = useState(false)
  const [createMembership] = useCreateMembershipMutation()
  const [updateMembership] = useUpdateMembershipByNodeIdMutation()
  const [notify] = useNotification()
  const [sendEmail] = useSendEmail()
  const profile = useProfile()

  if (!isAuthenticated || !user) throw new Error('login expired') // todo test this

  // note that for ACNW Virtual, we only really care about acceptance and the list of possible slots that they know that they won't attend.
  // everything else is very hotel centric
  const defaultValues: FormValues = useMemo(
    () => ({
      userId: user.userId!,
      arrivalDate: configuration.conventionStartDate.toISO(),
      attendance: 'Thurs-Sun',
      attending: true,
      hotelRoomId: 13, // no room required
      departureDate: configuration.conventionEndDate.toISO(),
      interestLevel: 'Full',
      message: '',
      offerSubsidy: false,
      requestOldPrice: false,
      roomPreferenceAndNotes: '',
      roomingPreferences: 'other',
      roomingWith: '',
      volunteer: false,
      year: configuration.year,
      skipSlots: '',
      amountOwed: 0,
      amountPaid: 0,
    }),
    [user.userId]
  )

  const onSubmit = async (values: FormValues, actions: FormikHelpers<FormValues>) => {
    // convert an array of booleans to a comma separate list of slot numbers
    values.skipSlots =
      values?.skipSlotsData
        ?.map((v, i) => (v ? i + 1 : 0))
        .filter((v) => !!v)
        .join(',') || ''
    console.log(JSON.stringify(values))

    if (values.nodeId) {
      await updateMembership({
        variables: {
          input: {
            nodeId: values.nodeId!,
            patch: {
              userId: values.userId,
              arrivalDate: values.arrivalDate,
              attendance: values.attendance,
              attending: values.attending,
              hotelRoomId: values.hotelRoomId,
              departureDate: values.departureDate,
              interestLevel: values.interestLevel,
              message: values.message,
              offerSubsidy: values.offerSubsidy,
              requestOldPrice: values.requestOldPrice,
              roomPreferenceAndNotes: values.roomPreferenceAndNotes,
              roomingPreferences: values.roomingPreferences,
              roomingWith: values.roomingWith,
              volunteer: values.volunteer,
              year: values.year,
              skipSlots: values.skipSlots,
              amountOwed: values.amountOwed,
              amountPaid: values.amountPaid,
            },
          },
        },
        refetchQueries: ['getMembershipsByYear'],
      })
        .then(() => {
          notify({ text: 'Membership updated', variant: 'success' })
          sendEmail({
            type: 'membershipConfirmation',
            body: JSON.stringify({
              year: configuration.year,
              name: profile?.fullName,
              email: profile?.email,
              url: `${window.location.origin}/members/${values.id}`,
              membership: values,
            }),
          })
          onClose()
        })
        .catch((error) => {
          notify({ text: error.message, variant: 'error' })
        })
    } else {
      await createMembership({
        variables: {
          input: {
            membership: {
              userId: values.userId,
              arrivalDate: values.arrivalDate,
              attendance: values.attendance,
              attending: values.attending,
              hotelRoomId: values.hotelRoomId,
              departureDate: values.departureDate,
              interestLevel: values.interestLevel,
              message: values.message,
              offerSubsidy: values.offerSubsidy,
              requestOldPrice: values.requestOldPrice,
              roomPreferenceAndNotes: values.roomPreferenceAndNotes,
              roomingPreferences: values.roomingPreferences,
              roomingWith: values.roomingWith,
              volunteer: values.volunteer,
              year: values.year,
              skipSlots: values.skipSlots,
              amountOwed: values.amountOwed,
              amountPaid: values.amountPaid,
            },
          },
        },
        refetchQueries: ['getMembershipsByYear', 'getMembershipByYearAndId'],
      })
        .then((res) => {
          const membershipId = res?.data?.createMembership?.membership?.id
          notify({ text: 'Membership created', variant: 'success' })
          sendEmail({
            type: 'membershipConfirmation',
            body: JSON.stringify({
              year: configuration.year,
              name: profile?.fullName,
              email: profile?.email,
              url: `${window.location.origin}/members/${membershipId}`,
              membership: values,
            }),
          })
          onClose()
        })
        .catch((error) => {
          notify({ text: error.message, variant: 'error' })
        })
    }
  }

  const values = initialValues ? { ...initialValues } : { ...defaultValues }
  values.skipSlotsData = Array(7).fill(false)
  // @ts-ignore
  values?.skipSlots?.split(',').forEach((i) => (values.skipSlotsData[i - 1] = true))

  return (
    <Dialog disableBackdropClick open={open} onClose={onClose}>
      <Formik initialValues={values} validationSchema={validationSchema} onSubmit={onSubmit}>
        {({ isSubmitting }) => (
          <Form>
            <DialogTitle onClose={onClose}>
              {!!initialValues ? 'Edit Membership' : 'Register for the Convention'}
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                By registering for the convention, you are indicating that you are interested in running and playing
                games at <strong>AmberCon NW {configuration.year}</strong>.
              </DialogContentText>
              <Card elevation={3} className={classes.card}>
                <CardContent>
                  Scheduling a virtual AmberCon is a little different when compared to scheduling the residential
                  version, as such can you select all of the slots that you know you want to <strong>skip</strong>? It
                  will make the planning a bit easier. Thank you.
                </CardContent>
                <CardContent className={classes.slotSelection}>
                  {isNotPacificTime && (
                    <div>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={showPT}
                            onChange={() => setShowPT((old) => !old)}
                            name='showLocal'
                            color='primary'
                          />
                        }
                        label='Show slot times in Pacific time'
                      />
                    </div>
                  )}
                  <FormGroup>
                    {range(0, 7).map((i) => (
                      <CheckboxWithLabel
                        key={i}
                        Label={{
                          label: getSlotDescription({
                            year: 2020,
                            slot: i + 1,
                            local: !showPT,
                          }),
                        }}
                        name={`skipSlotsData[${i}]`}
                      />
                    ))}
                  </FormGroup>
                </CardContent>
              </Card>
              <GridContainer spacing={2}>
                <GridItem xs={12} md={12}>
                  <TextField name='message' label='Messages' margin='normal' fullWidth multiline />
                </GridItem>
              </GridContainer>
            </DialogContent>
            <DialogActions className='modalFooterButtons'>
              <Button onClick={onClose} variant='outlined'>
                Cancel
              </Button>
              <Button disabled={isSubmitting} type='submit' variant='contained' color='primary'>
                Save
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  )
}
