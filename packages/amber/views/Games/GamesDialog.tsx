import type React from 'react'
import { useMemo } from 'react'

import type { Game } from '@amber/client'
import { useTRPC } from '@amber/client'
import type { TextFieldProps } from '@amber/ui'
import {
  CheckboxWithLabel,
  EditDialog,
  GridContainer,
  GridItem,
  Loader,
  pick,
  range,
  SelectField,
  TextField,
  useDisableBackdropClick,
} from '@amber/ui'
import Yup from '@amber/ui/utils/Yup'
import { Autocomplete, Dialog, TextField as MuiTextField, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import type { FormikHelpers } from 'formik'

import type { GameDialogFormValues } from './gameHooks'
import { useEditGame } from './gameHooks'

import { AdminCard } from '../../components/AdminCard'
import { Perms } from '../../components/Auth'
import { TransportError } from '../../components/TransportError'
import type { Configuration } from '../../utils'
import { getSlotDescription, playerPreferenceOptions, useConfiguration, useUser } from '../../utils'

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

const morningGamesOptions = [
  'Starts on time',
  'Starts at 9.30 am',
  'Starts at 10.00 am',
  'Starts at 10.30 am',
  'Starts at 11.00 am',
  'Starts at 11.30 am',
  'Starts at 12.00 pm',
]

const getDefaultValues = (configuration: Configuration): GameDialogFormValues => ({
  slotId: 0,
  name: '',
  gmNames: '',
  description: '',
  genre: '',
  type: '',
  setting: '',
  charInstructions: '',
  playerMin: configuration.playerMin,
  playerMax: configuration.playerMax,
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
  category: 'user',
  full: false,
  roomId: null,
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
  const { select: _select, year, ...rest } = props
  const selectValues = range(configuration.numberOfSlots).reduce(
    (acc, current) => {
      acc.push({
        value: current + 1,
        text: getSlotDescription(configuration, {
          year,
          slot: current + 1,
          local: configuration.virtual,
        }),
      })
      return acc
    },
    [{ value: 0, text: "Any Slot -- Doesn't Matter" }],
  )

  return <SelectField {...rest} selectValues={selectValues} />
}

export const GamesDialog = ({ open, onClose, initialValues: userInitialValues }: GamesDialogProps) => {
  const configuration = useConfiguration()
  const trpc = useTRPC()
  const defaultValues = useMemo(() => getDefaultValues(configuration), [configuration])
  const initialValues = userInitialValues ?? defaultValues
  const editing = initialValues !== defaultValues
  const { userId } = useUser()
  const createOrUpdateGame = useEditGame(onClose, initialValues)
  const handleClose = useDisableBackdropClick(onClose)
  const estimatedLengthOptions = useMemo(() => getEstimatedLengthOptions(configuration), [configuration])

  const onSubmit = async (values: GameDialogFormValues, _actions: FormikHelpers<GameDialogFormValues>) => {
    await createOrUpdateGame(values)
  }

  const { error: gameError, data: gameData } = useQuery(
    trpc.games.getGamesByAuthor.queryOptions({
      id: userId!,
    }),
  )

  const { error: roomError, data: roomData } = useQuery(trpc.gameRooms.getGameRooms.queryOptions())

  if (gameError || roomError) {
    return <TransportError error={gameError ?? roomError} />
  }
  if (!gameData || !roomData) {
    return (
      <Dialog fullWidth maxWidth='md' open onClose={handleClose}>
        <Loader />
      </Dialog>
    )
  }

  // const unsorted: Game[] = gameData.user?.authoredGames.nodes.filter(notEmpty) as Game[]
  const priorGamesList = gameData
    .concat()
    .sort(
      (a, b) =>
        b.year - a.year ||
        (a.slotId ?? a.slotPreference ?? 0) - (b.slotId ?? b.slotPreference ?? 0) ||
        -b.name.localeCompare(a.name),
    )

  const rooms = roomData ?? []

  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  if (initialValues.slotId === null) initialValues.slotId = 0

  const onCopyGameChange =
    (values: GameDialogFormValues, setValues: (val: GameDialogFormValues, shouldValidate?: boolean) => void) =>
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
          'teenFriendly',
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
        <GridContainer spacing={2}>
          {!!priorGamesList.length && (
            <GridItem size={{ xs: 12, md: 12 }}>
              <Autocomplete
                id='prior-games'
                options={priorGamesList}
                groupBy={(game) => `${game.year}`}
                getOptionLabel={(game) => `${game.slotId ?? `(${game.slotPreference})`}: ${game.name}`}
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
          <GridItem size={{ xs: 12, md: 12 }}>
            <TextField name='name' label='Game Title' margin='normal' fullWidth required autoFocus />
          </GridItem>
          <AdminCard permission={Perms.GameAdmin}>
            <GridItem size={{ xs: 12, md: 12 }}>
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
          <GridItem size={{ xs: 12, md: 12 }}>
            <TextField
              name='gmNames'
              label='Game Master(s), one per line'
              margin='normal'
              fullWidth
              multiline
              required
            />
          </GridItem>
          <GridItem size={{ xs: 12, md: 12 }}>
            <TextField name='description' label='Game Description' margin='normal' fullWidth multiline required />
          </GridItem>
          {configuration.isAcnw && (
            <GridItem container spacing={2} size={{ xs: 12, md: 12 }} style={{ paddingRight: 0 }}>
              <GridItem size={{ xs: 12, md: 6 }}>
                <SelectField
                  required
                  name='genre'
                  label='Genre'
                  margin='normal'
                  fullWidth
                  selectValues={genreOptions}
                />
              </GridItem>
              <GridItem size={{ xs: 12, md: 6 }} style={{ paddingRight: 0 }}>
                <SelectField required name='type' label='Type' margin='normal' fullWidth selectValues={typeOptions} />
              </GridItem>
            </GridItem>
          )}
          <GridItem size={{ xs: 12, md: 12 }}>
            <CheckboxWithLabel label='Is the game Teen Friendly?' name='teenFriendly' />
          </GridItem>
          {configuration.isAcnw && (
            <>
              <GridItem size={{ xs: 12, md: 12 }}>
                <TextField
                  name='setting'
                  label='Setting - Where/When in the Multiverse'
                  margin='normal'
                  fullWidth
                  multiline
                />
              </GridItem>
              <GridItem size={{ xs: 12, md: 12 }}>
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
          <GridItem size={{ xs: 12, md: 12 }}>
            <Typography className='MuiFormControlLabel-label MuiFormLabel-root'>Number of Players</Typography>
          </GridItem>
          <GridItem container spacing={2} size={{ xs: 12, md: 12 }} style={{ paddingRight: 0 }}>
            <GridItem size={{ xs: 12, md: 6 }}>
              <TextField
                name='playerMin'
                label='Min'
                margin='normal'
                fullWidth
                type='number'
                required
                InputProps={{
                  inputProps: {
                    min: configuration.minPlayersFloor,
                    max: configuration.minPlayersCeiling,
                  },
                }}
              />
            </GridItem>
            <GridItem size={{ xs: 12, md: 6 }} style={{ paddingRight: 0 }}>
              <TextField
                name='playerMax'
                label='Max'
                margin='normal'
                fullWidth
                type='number'
                required
                InputProps={{
                  inputProps: {
                    min: configuration.maxPlayersFloor,
                    max: configuration.maxPlayersCeiling,
                  },
                }}
              />
            </GridItem>
          </GridItem>
          <GridItem size={{ xs: 12, md: 12 }}>
            <SelectField
              name='playerPreference'
              label='Player Preference'
              margin='normal'
              fullWidth
              selectValues={playerPreferenceOptions}
            />
          </GridItem>
          <GridItem size={{ xs: 12, md: 12 }}>
            <TextField
              name='returningPlayers'
              label='If you have Returning Players, please list them here'
              margin='normal'
              fullWidth
              multiline
            />
          </GridItem>
          <GridItem size={{ xs: 12, md: 12 }}>
            <CheckboxWithLabel label='Should your players contact you before the con?' name='playersContactGm' />
          </GridItem>
          <GridItem size={{ xs: 12, md: 12 }}>
            <TextField
              name='gameContactEmail'
              label='Game Contact email'
              margin='normal'
              fullWidth
              inputProps={{ autoCapitalize: 'none' }}
            />
          </GridItem>
          {configuration.isAcnw && (
            <GridItem size={{ xs: 12, md: 12 }}>
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
          )}
          <GridItem size={{ xs: 12, md: 12 }}>
            <SlotOptionsSelect
              name='slotPreference'
              label='Slot Preference'
              year={values.year}
              margin='normal'
              required
              fullWidth
            />
          </GridItem>
          {!configuration.startDates[values.year]!.virtual && (
            <>
              <GridItem size={{ xs: 12, md: 12 }}>
                <SelectField
                  name='lateStart'
                  label='Morning Games'
                  margin='normal'
                  fullWidth
                  selectValues={morningGamesOptions}
                />
              </GridItem>
              <GridItem size={{ xs: 12, md: 12 }}>
                <CheckboxWithLabel name='lateFinish' label='Evening Game: Game may run late into the evening' />
              </GridItem>
            </>
          )}
          <GridItem size={{ xs: 12, md: 12 }}>
            <Typography className='MuiFormControlLabel-label MuiFormLabel-root'>
              To schedule, or in the event we have to change your requested slot, list any and all known slot conflicts
              (other games you are running, returning or ongoing games, and any slots you are taking off). If you have
              any constraints or if there is anything else the organizers need to know to schedule your game, and
              schedule players to your game, please let us know:
            </Typography>
          </GridItem>
          {configuration.isAcnw && (
            <GridItem size={{ xs: 12, md: 12 }}>
              <TextField name='slotConflicts' label='Slot Conflicts' margin='normal' fullWidth multiline />
            </GridItem>
          )}
          <GridItem size={{ xs: 12, md: 12 }}>
            <TextField name='message' label='Messages for the Organizers' margin='normal' fullWidth multiline />
          </GridItem>
        </GridContainer>
      )}
    </EditDialog>
  )
}

export const GamesDialogEdit = (props: GamesDialogProps) => {
  const { id, initialValues } = props
  const trpc = useTRPC()
  const { isLoading, error, data } = useQuery(
    trpc.games.getGameById.queryOptions({ id: id ?? 0 }, { enabled: !initialValues && !!id }),
  )
  if (initialValues) {
    return <GamesDialog {...props} />
  }
  if (error) {
    return <TransportError error={error} />
  }
  if (isLoading || !data) {
    return <Loader />
  }
  return data ? <GamesDialog {...props} initialValues={data} /> : null
}
