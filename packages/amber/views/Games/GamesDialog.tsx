import { Autocomplete, Dialog, TextField as MuiTextField, Typography } from '@mui/material'
import { FormikHelpers } from 'formik'
import React, { useMemo } from 'react'
import {
  CheckboxWithLabel,
  EditDialog,
  GraphQLError,
  GridContainer,
  GridItem,
  Loader,
  notEmpty,
  pick,
  range,
  SelectField,
  TextField,
  TextFieldProps,
  useDisableBackdropClick,
} from 'ui'
import Yup from 'ui/utils/Yup'
import {
  GameFieldsFragment,
  GameGmsFragment,
  useGetGameByIdQuery,
  useGetGameRoomsQuery,
  useGetGamesByAuthorQuery,
} from '../../client'
import { AdminCard } from '../../components/AdminCard'
import { Perms } from '../../components/Auth'
import { Configuration, getSlotDescription, playerPreferenceOptions, useConfiguration, useUser } from '../../utils'
import { GameDialogFormValues, useEditGame } from './gameHooks'

type Game = GameFieldsFragment & GameGmsFragment

interface GamesDialogProps {
  open: boolean
  onClose: (event?: any) => void
  initialValues?: GameDialogFormValues
  id?: number
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

const getEstimatedLengthOptions = (configuration: Configuration) =>
  configuration.virtual
    ? ['3', '3.5', '4', '4.5', '5', '5.5', '6', '6.5', '7', '7.5', '8']
    : ['3', '3.5', '4', '4.5', '5', '5.5', '6', '6.5', '7', '7.5', '8', '8.5', '9', '10', '12+']

const morningGamesOptions = ['Starts on time', 'Starts at 9.30 am', 'Starts at 10.00 am', 'Starts at 10.30 am']

const getDefaultValues = (configuration: Configuration): GameDialogFormValues => ({
  slotId: 0,
  name: '',
  gmNames: '',
  description: '',
  genre: '',
  type: '',
  setting: '',
  charInstructions: '',
  playerMin: configuration.virtual ? 2 : configuration.numberOfSlots === 8 ? 3 : 4,
  playerMax: configuration.virtual ? 7 : configuration.numberOfSlots === 8 ? 6 : 10,
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
})

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
  const configuration = useConfiguration()
  const { select, year, ...rest } = props
  const selectValues = range(configuration.numberOfSlots).reduce(
    (acc, current) => {
      acc.push({
        value: current + 1,
        text: getSlotDescription(configuration, { year, slot: current + 1, local: configuration.virtual }),
      })
      return acc
    },
    [{ value: 0, text: "Any Slot -- Doesn't Matter" }]
  )

  return <SelectField {...rest} selectValues={selectValues} />
}

export const GamesDialog: React.FC<GamesDialogProps> = ({ open, onClose, initialValues: userInitialValues }) => {
  const configuration = useConfiguration()
  const defaultValues = useMemo(() => getDefaultValues(configuration), [configuration])
  const initialValues = userInitialValues === undefined ? defaultValues : userInitialValues
  const editing = initialValues !== defaultValues
  const { userId } = useUser()
  const createOrUpdateGame = useEditGame(onClose, initialValues)
  const handleClose = useDisableBackdropClick(onClose)
  const estimatedLengthOptions = useMemo(() => getEstimatedLengthOptions(configuration), [configuration])

  const slim = configuration.numberOfSlots === 8
  const minPlayersFloor = slim ? 1 : 1
  const minPlayersCeiling = slim ? 3 : 10
  const maxPlayersFloor = slim ? 4 : 1
  const maxPlayersCeiling = slim ? 20 : 150

  const onSubmit = async (values: GameDialogFormValues, actions: FormikHelpers<GameDialogFormValues>) => {
    await createOrUpdateGame(values)
  }

  const { error: gameError, data: gameData } = useGetGamesByAuthorQuery({
    id: userId!,
  })

  const { error: roomError, data: roomData } = useGetGameRoomsQuery()

  if (gameError || roomError) {
    return <GraphQLError error={gameError ?? roomError} />
  }
  if (!gameData || !roomData) {
    return (
      <Dialog fullWidth maxWidth='md' open onClose={handleClose}>
        <Loader />
      </Dialog>
    )
  }

  const unsorted: Game[] = gameData.user?.authoredGames.nodes.filter(notEmpty) as Game[]
  const priorGamesList = unsorted
    .concat()
    .sort(
      (a, b) =>
        b.year - a.year ||
        (a.slotId ?? a.slotPreference ?? 0) - (b.slotId ?? b.slotPreference ?? 0) ||
        -b.name.localeCompare(a.name)
    )

  const rooms = roomData?.rooms?.nodes.filter(notEmpty) ?? []

  // eslint-disable-next-line no-param-reassign
  if (initialValues.slotId === null) initialValues.slotId = 0

  const onCopyGameChange =
    (values: GameDialogFormValues, setValues: (values: GameDialogFormValues, shouldValidate?: boolean) => void) =>
    (_: any, value: Game | null): void => {
      if (!value) return
      setValues({
        ...values,
        ...pick(
          value,
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
    <EditDialog
      initialValues={initialValues}
      onClose={onClose}
      open={open}
      onSubmit={onSubmit}
      title='Game'
      validationSchema={validationSchema}
      isEditing={editing}
    >
      {({ values, setValues, setFieldValue }) => (
        <>
          <GridContainer spacing={2}>
            {!!priorGamesList.length && (
              <GridItem xs={12} md={12}>
                <Autocomplete
                  id='prior-games'
                  options={priorGamesList}
                  groupBy={(game) => `${game.year}`}
                  getOptionLabel={(game) => `${game.slotId ?? `(${game.slotPreference})` ?? 0}: ${game.name}`}
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
            <AdminCard permission={Perms.GameAdmin}>
              <GridItem xs={12} md={12}>
                <TextField name='slotId' label='Slot' margin='normal' fullWidth type='number' />
              </GridItem>
              <CheckboxWithLabel label='Game Full?' name='full' />
              <Autocomplete
                id='room'
                options={rooms}
                getOptionLabel={(room) =>
                  `${room.description} (size ${room.size})${
                    room.type && room.type !== room.description ? `, ${room.type}` : ''
                  }`
                }
                fullWidth
                value={rooms.find((r) => r.id === initialValues?.roomId)}
                renderInput={(params) => <MuiTextField {...params} label='Room' variant='outlined' />}
                onChange={(e, value) => setFieldValue('roomId', value?.id)}
              />
            </AdminCard>
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
            {!slim && (
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
                  <SelectField required name='type' label='Type' margin='normal' fullWidth selectValues={typeOptions} />
                </GridItem>
              </GridItem>
            )}
            <GridItem xs={12} md={12}>
              <CheckboxWithLabel label='Is the game Teen Friendly?' name='teenFriendly' />
            </GridItem>
            {!slim && (
              <>
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
              </>
            )}
            <GridItem xs={12} md={12}>
              <Typography className='MuiFormControlLabel-label MuiFormLabel-root'>Number of Players</Typography>
            </GridItem>
            <GridItem container spacing={2} xs={12} md={12} style={{ paddingRight: 0 }}>
              <GridItem xs={12} md={6}>
                <TextField
                  name='playerMin'
                  label='Min'
                  margin='normal'
                  fullWidth
                  type='number'
                  required
                  InputProps={{ inputProps: { min: minPlayersFloor, max: minPlayersCeiling } }}
                />
              </GridItem>
              <GridItem xs={12} md={6} style={{ paddingRight: 0 }}>
                <TextField
                  name='playerMax'
                  label='Max'
                  margin='normal'
                  fullWidth
                  type='number'
                  required
                  InputProps={{ inputProps: { min: maxPlayersFloor, max: maxPlayersCeiling } }}
                />
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
              <CheckboxWithLabel label='Should your players contact you before the con?' name='playersContactGm' />
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
            {!slim && (
              <>
                <GridItem xs={12} md={12}>
                  <p>
                    You are welcome to start and end the game at any time (within reason), but if the game overlaps two
                    slots, please enter two games and mark them as parts one and two.
                  </p>
                  {configuration.virtual && (
                    <p>Please keep in mind that you might have players from multiple time zones in your game.</p>
                  )}
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
              </>
            )}
            {!configuration.startDates[values.year].virtual && (
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
                  <CheckboxWithLabel name='lateFinish' label='Evening Game: Game may run late into the evening' />
                </GridItem>
              </>
            )}
            <GridItem xs={12} md={12}>
              <Typography className='MuiFormControlLabel-label MuiFormLabel-root'>
                To schedule, or in the event we have to change your requested slot, list any and all known slot
                conflicts (other games you are running, returning or ongoing games, and any slots you are taking off).
                If you have any constraints or if there is anything else the organizers need to know th schedule your
                game, and schedule players to your game, please let us know:
              </Typography>
            </GridItem>
            {!slim && (
              <GridItem xs={12} md={12}>
                <TextField name='slotConflicts' label='Slot Conflicts' margin='normal' fullWidth multiline />
              </GridItem>
            )}
            <GridItem xs={12} md={12}>
              <TextField name='message' label='Messages for the Organizers' margin='normal' fullWidth multiline />
            </GridItem>
          </GridContainer>
        </>
      )}
    </EditDialog>
  )
}

export const GamesDialogEdit: React.FC<GamesDialogProps> = (props) => {
  const { id, initialValues } = props
  const { isLoading, error, data } = useGetGameByIdQuery({ id: id ?? 0 }, { enabled: !initialValues && !!id })
  if (initialValues) {
    return <GamesDialog {...props} />
  }
  if (error) {
    return <GraphQLError error={error} />
  }
  if (isLoading || !data) {
    return <Loader />
  }
  const values = data.game
  return values ? <GamesDialog {...props} initialValues={values} /> : null
}
