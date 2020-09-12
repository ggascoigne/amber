import { Button, Dialog, DialogActions, DialogContent, Typography } from '@material-ui/core'
import { GameFieldsFragment, GameGmsFragment, useGetSlotsQuery } from 'client'
import {
  CheckboxWithLabel,
  DialogTitle,
  GraphQLError,
  GridContainer,
  GridItem,
  Loader,
  LookupField,
  SelectField,
  TextField,
  TextFieldProps,
} from 'components/Acnw'
import { Form, Formik, FormikHelpers } from 'formik'
import React from 'react'
import { configuration } from 'utils'
import Yup from 'utils/Yup'

type FormValues = Omit<GameFieldsFragment & GameGmsFragment, 'nodeId' | 'id' | '__typename' | 'gameAssignments'>

interface GamesDialog {
  open: boolean
  onClose: (event?: any) => void
  initialValues?: FormValues
}

const onSubmit = async (values: FormValues, actions: FormikHelpers<FormValues>) => {
  console.log(JSON.stringify(values))
}

const genreOptions = [
  'Adventure / Heroic',
  'Dark / Grim',
  'Exploration',
  'Horror',
  'Humor / Spoof',
  'Mystery',
  'Sci-Fi / Futuristic',
  'Strategy',
  'Tense / Real-time',
  'Other; N/A',
]

const typeOptions = [
  'Traditional Amber',
  'Throne War',
  'Alternate Amber',
  'Amber with a Twist',
  'Non - Amber',
  'Other; N/A',
]

const estimatedLengthOptions = [
  '3',
  '3.5',
  '4',
  '4.5',
  '5',
  '5.5',
  '6',
  '6.5',
  '7',
  '7.5',
  '8',
  '8.5',
  '9',
  '10',
  '12+',
]

const morningGamesOptions = ['Starts on time', 'Starts at 9.30 am', 'Starts at 10.00 am', 'Starts at 10.30 am']

const defaultValues: FormValues = {
  slotId: 0,
  name: '',
  gmNames: '',
  description: '',
  genre: '',
  type: '',
  setting: '',
  charInstructions: '',
  playerMin: 4,
  playerMax: 10,
  playerPreference: '',
  returningPlayers: '',
  playersContactGm: false,
  gameContactEmail: '',
  estimatedLength: '5',
  slotPreference: 0,
  lateStart: morningGamesOptions[0],
  lateFinish: false,
  slotConflicts: '',
  message: '',
  teenFriendly: false,
  year: configuration.year,
}

const validationSchema = Yup.object().shape({
  name: Yup.string().min(2).max(100).required(),
  gmNames: Yup.string().min(2).max(255).required(),
  description: Yup.string()
    .min(2)
    .max(10 * 1024)
    .required(),
  setting: Yup.string()
    .min(2)
    .max(10 * 1024),
})

export const SlotOptionsSelect: React.ComponentType<TextFieldProps> = (props) => {
  const { select, ...rest } = props
  const { loading, error, data } = useGetSlotsQuery()
  if (error) {
    return <GraphQLError error={error} />
  }
  if (loading) {
    return <Loader />
  }
  const selectValues = data?.slots?.nodes?.reduce(
    (acc, current) => {
      acc.push({
        value: current!.slot,
        text: `Slot ${current!.slot}: ${current!.day} - ${current!.time}`,
      })
      return acc
    },
    [{ value: 0, text: "Any Slot -- Doesn't Matter" }]
  )

  return <SelectField {...rest} selectValues={selectValues!} />
}

export const GamesDialog: React.FC<GamesDialog> = ({ open, onClose, initialValues = defaultValues }) => {
  const editing = initialValues !== defaultValues

  return (
    <Dialog disableBackdropClick fullWidth maxWidth='md' open={open} onClose={onClose}>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        {({ isSubmitting }) => (
          <Form>
            <DialogTitle onClose={onClose}>{editing ? 'Edit' : 'Add'} Game</DialogTitle>
            <DialogContent>
              <GridContainer spacing={2}>
                <GridItem xs={12} md={12}>
                  <TextField name='name' label='Game Title' margin='normal' fullWidth required />
                </GridItem>
                <GridItem xs={12} md={12}>
                  <TextField
                    name='gmNames'
                    label='Game Master(s), one per line'
                    margin='normal'
                    fullWidth
                    multiline
                    required
                  />
                </GridItem>
                <GridItem xs={12} md={12}>
                  <TextField name='description' label='Game Description' margin='normal' fullWidth multiline required />
                </GridItem>
                <GridItem container spacing={2} xs={12} md={12} style={{ paddingRight: 0 }}>
                  <GridItem xs={12} md={6}>
                    <SelectField name='genre' label='Genre' margin='normal' fullWidth selectValues={genreOptions} />
                  </GridItem>
                  <GridItem xs={12} md={6} style={{ paddingRight: 0 }}>
                    <SelectField name='type' label='Type' margin='normal' fullWidth selectValues={typeOptions} />
                  </GridItem>
                </GridItem>
                <GridItem xs={12} md={12}>
                  <CheckboxWithLabel
                    Label={{ label: 'Is the game Teen Friendly?', labelPlacement: 'start', style: { marginLeft: 0 } }}
                    name='teenFriendly'
                  />
                </GridItem>
                <GridItem xs={12} md={12}>
                  <TextField
                    name='setting'
                    label='Setting - Where/When in the Multiverse'
                    margin='normal'
                    fullWidth
                    multiline
                  />
                </GridItem>
                <GridItem xs={12} md={12}>
                  <TextField
                    name='charInstructions'
                    label='Character/Player Instructions & Restrictions'
                    margin='normal'
                    fullWidth
                    multiline
                  />
                </GridItem>
                <GridItem xs={12} md={12}>
                  <Typography className='MuiFormControlLabel-label MuiFormLabel-root'>Number of Players</Typography>
                </GridItem>
                <GridItem container spacing={2} xs={12} md={12} style={{ paddingRight: 0 }}>
                  <GridItem xs={12} md={6}>
                    <TextField name='playerMin' label='Min' margin='normal' fullWidth type='number' required />
                  </GridItem>
                  <GridItem xs={12} md={6} style={{ paddingRight: 0 }}>
                    <TextField name='playerMax' label='Max' margin='normal' fullWidth type='number' required />
                  </GridItem>
                </GridItem>
                <GridItem xs={12} md={12}>
                  <LookupField
                    name='playerPreference'
                    label='Player Preference'
                    margin='normal'
                    fullWidth
                    realm='gamePlayerPref'
                  />
                </GridItem>
                <GridItem xs={12} md={12}>
                  <TextField
                    name='returningPlayers'
                    label='If you have Returning Players, please list them here'
                    margin='normal'
                    fullWidth
                    multiline
                  />
                </GridItem>
                <GridItem xs={12} md={12}>
                  <CheckboxWithLabel
                    Label={{
                      label: 'Should your players contact you before the con?',
                      labelPlacement: 'start',
                      style: { marginLeft: 0 },
                    }}
                    name='playersContactGm'
                  />
                </GridItem>
                <GridItem xs={12} md={12}>
                  <TextField name='gameContactEmail' label='Game Contact email' margin='normal' fullWidth />
                </GridItem>
                <GridItem xs={12} md={12}>
                  <SelectField
                    name='estimatedLength'
                    label='Estimated Length'
                    margin='normal'
                    fullWidth
                    selectValues={estimatedLengthOptions}
                  />
                </GridItem>
                <GridItem xs={12} md={12}>
                  <SlotOptionsSelect name='slotPreference' label='Slot Preference' margin='normal' required fullWidth />
                </GridItem>
                <GridItem xs={12} md={12}>
                  <SelectField
                    name='lateStart'
                    label='Morning Games'
                    margin='normal'
                    fullWidth
                    selectValues={morningGamesOptions}
                  />
                </GridItem>
                <GridItem xs={12} md={12}>
                  <CheckboxWithLabel
                    name='lateFinish'
                    Label={{
                      label: 'Evening Game: Game may run late into the evening',
                      labelPlacement: 'start',
                      style: { marginLeft: 0 },
                    }}
                  />
                </GridItem>
                <GridItem xs={12} md={12}>
                  <Typography className='MuiFormControlLabel-label MuiFormLabel-root'>
                    In the event we have to change your slot, list any and all known slot conflicts including other
                    games you are running, returning or ongoing games, and any slots you are taking off.
                  </Typography>
                </GridItem>
                <GridItem xs={12} md={12}>
                  <TextField name='slotConflicts' label='Slot Conflicts' margin='normal' fullWidth multiline />
                </GridItem>
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
