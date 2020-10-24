import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  TextField as MuiTextField,
  Typography,
  useTheme,
} from '@material-ui/core'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { Autocomplete } from '@material-ui/lab'
import { Game, useGetGamesByAuthorQuery } from 'client'
import {
  CheckboxWithLabel,
  DialogTitle,
  GraphQLError,
  GridContainer,
  GridItem,
  HasPermission,
  Loader,
  Perms,
  SelectField,
  TextField,
  TextFieldProps,
} from 'components/Acnw'
import { Form, Formik, FormikHelpers } from 'formik'
import React from 'react'
import { configuration, getSlotDescription, notEmpty, pick, playerPreferenceOptions, range, useUser } from 'utils'
import Yup from 'utils/Yup'

import { dangerColor } from '../../assets/jss/material-kit-react'
import { GameDialogFormValues, useEditGame } from './gameHooks'

interface GamesDialogProps {
  open: boolean
  onClose: (event?: any) => void
  initialValues?: GameDialogFormValues
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

const estimatedLengthOptions = configuration.virtual
  ? ['3', '3.5', '4', '4.5', '5', '5.5', '6', '6.5', '7', '7.5', '8']
  : ['3', '3.5', '4', '4.5', '5', '5.5', '6', '6.5', '7', '7.5', '8', '8.5', '9', '10', '12+']

const morningGamesOptions = ['Starts on time', 'Starts at 9.30 am', 'Starts at 10.00 am', 'Starts at 10.30 am']

const defaultValues: GameDialogFormValues = {
  slotId: 0,
  name: '',
  gmNames: '',
  description: '',
  genre: '',
  type: '',
  setting: '',
  charInstructions: '',
  playerMin: configuration.virtual ? 2 : 4,
  playerMax: configuration.virtual ? 7 : 10,
  playerPreference: '',
  returningPlayers: '',
  playersContactGm: false,
  gameContactEmail: '',
  estimatedLength: configuration.virtual ? '4' : '5',
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

export const SlotOptionsSelect: React.ComponentType<TextFieldProps & { year: number }> = (props) => {
  const { select, year, ...rest } = props
  const selectValues = range(1, 8).reduce(
    (acc, current) => {
      acc.push({
        value: current,
        text: getSlotDescription({ year, slot: current, local: true }),
      })
      return acc
    },
    [{ value: 0, text: "Any Slot -- Doesn't Matter" }]
  )

  return <SelectField {...rest} selectValues={selectValues!} />
}

export const GamesDialog: React.FC<GamesDialogProps> = ({ open, onClose, initialValues = defaultValues }) => {
  const editing = initialValues !== defaultValues
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const { userId } = useUser()
  const createOrUpdateGame = useEditGame(onClose, initialValues)

  const onSubmit = async (values: GameDialogFormValues, actions: FormikHelpers<GameDialogFormValues>) => {
    await createOrUpdateGame(values)
  }

  const { loading, error, data } = useGetGamesByAuthorQuery({
    variables: {
      id: userId!,
    },
  })

  if (error) {
    return <GraphQLError error={error} />
  }
  if (loading || !data) {
    return (
      <Dialog disableBackdropClick fullWidth maxWidth='md' open>
        <Loader />
      </Dialog>
    )
  }

  const unsorted: Game[] = (data!.user?.authoredGames?.nodes?.filter(notEmpty) as Game[]) || []
  const priorGamesList = unsorted.sort(
    (a, b) => b.year - a.year || (a.slotId ?? 0) - (b.slotId ?? 0) || -b.name.localeCompare(a.name)
  )

  const onCopyGameChange = (
    values: GameDialogFormValues,
    setValues: (values: GameDialogFormValues, shouldValidate?: boolean) => void
  ) => (_: any, value: Game | null): void => {
    if (!value) return
    setValues({
      ...values,
      ...pick(
        value!,
        'name',
        'gmNames',
        'description',
        'genre',
        'type',
        'setting',
        'charInstructions',
        'playerMin',
        'playerMax',
        'playerPreference',
        'returningPlayers',
        'playersContactGm',
        'gameContactEmail',
        'estimatedLength',
        'slotPreference',
        'lateStart',
        'lateFinish',
        'slotConflicts',
        'message',
        'teenFriendly'
      ),
    })
  }

  return (
    <Dialog disableBackdropClick fullWidth maxWidth='md' open={open} onClose={onClose} fullScreen={fullScreen}>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
        {({ isSubmitting, values, setValues }) => (
          <Form>
            <DialogTitle onClose={onClose}>{editing ? 'Edit' : 'Create'} Game</DialogTitle>
            <DialogContent>
              <HasPermission permission={Perms.FullGameBook}>
                <DialogContentText style={{ color: dangerColor }}>Admin Mode</DialogContentText>
              </HasPermission>
              <GridContainer spacing={2}>
                {!!priorGamesList?.length && (
                  <GridItem xs={12} md={12}>
                    <Autocomplete
                      id='prior-games'
                      options={priorGamesList}
                      groupBy={(game) => `${game.year}`}
                      getOptionLabel={(game) => `${game.slotId ?? 0}: ${game.name}`}
                      fullWidth
                      renderInput={(params) => (
                        <MuiTextField
                          {...params}
                          label="Copy game definition from a previous year's game"
                          variant='outlined'
                        />
                      )}
                      onChange={onCopyGameChange(values, setValues)}
                    />
                  </GridItem>
                )}
                <GridItem xs={12} md={12}>
                  <TextField name='name' label='Game Title' margin='normal' fullWidth required autoFocus />
                </GridItem>
                <HasPermission permission={Perms.FullGameBook}>
                  <GridItem xs={12} md={12}>
                    <TextField name='slotId' label='Slot' margin='normal' fullWidth type='number' />
                  </GridItem>
                  <CheckboxWithLabel
                    Label={{ label: 'Game Full?', labelPlacement: 'start', style: { marginLeft: 0 } }}
                    name='full'
                  />
                </HasPermission>
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
                    <SelectField
                      required
                      name='genre'
                      label='Genre'
                      margin='normal'
                      fullWidth
                      selectValues={genreOptions}
                    />
                  </GridItem>
                  <GridItem xs={12} md={6} style={{ paddingRight: 0 }}>
                    <SelectField
                      required
                      name='type'
                      label='Type'
                      margin='normal'
                      fullWidth
                      selectValues={typeOptions}
                    />
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
                  <SelectField
                    name='playerPreference'
                    label='Player Preference'
                    margin='normal'
                    fullWidth
                    selectValues={playerPreferenceOptions}
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
                  <TextField
                    name='gameContactEmail'
                    label='Game Contact email'
                    margin='normal'
                    fullWidth
                    inputProps={{ autoCapitalize: 'none' }}
                  />
                </GridItem>
                <GridItem xs={12} md={12}>
                  <p>
                    You are welcome to start and end the game at any time (within reason), but if the game overlaps two
                    slots, please enter two games and mark them as parts one and two.
                  </p>
                  <p>Please keep in mind that you might have players from multiple time zones in your game.</p>
                  <SelectField
                    name='estimatedLength'
                    label='Estimated Length'
                    margin='normal'
                    fullWidth
                    selectValues={estimatedLengthOptions}
                  />
                </GridItem>
                <GridItem xs={12} md={12}>
                  <SlotOptionsSelect
                    name='slotPreference'
                    label='Slot Preference'
                    year={values.year}
                    margin='normal'
                    required
                    fullWidth
                  />
                </GridItem>
                {!configuration.virtual && (
                  <>
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
                  </>
                )}
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
                  <TextField name='message' label='Messages for the Organizers' margin='normal' fullWidth multiline />
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
