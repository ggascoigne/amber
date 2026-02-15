import type React from 'react'
import { useMemo, useCallback } from 'react'

import type { Setting } from '@amber/client'
import { useTRPC, useInvalidateSettingsQueries } from '@amber/client'
import type { OnCloseHandler } from '@amber/ui'
import { EditDialog, GridContainer, GridItem, Loader, notEmpty, useNotification } from '@amber/ui'
import { Typography } from '@mui/material'
import { useMutation, useQuery } from '@tanstack/react-query'
import debug from 'debug'
import type { FormikHelpers } from 'formik'
import { DateTime } from 'luxon'

import { SettingValue } from './shared'

import { TransportError } from '../../components/TransportError'

const log = debug('amber:amber:settings:addNewYear')
interface AddNewYearDialogProps {
  open: boolean
  onClose: OnCloseHandler
}

type FormValues = Setting[]

const SettingInput: React.FC<{ value: Setting; index: number }> = ({ value, index }) => (
  <GridContainer spacing={2} sx={{ width: '100%' }}>
    <GridItem size={{ xs: 6, md: 6 }}>
      <SettingValue label={value.code} name={`[${index}].value`} value={value} />
    </GridItem>
  </GridContainer>
)

const dateFields = ['config.conventionStartDate', 'config.conventionEndDate']
const deadlines = [
  'config.mondayBeforeCon',
  'config.wednesdayAfterCon',
  'config.registrationOpen',
  'config.registrationDeadline',
  'config.paymentDeadline',
  'config.gameSubmissionDeadline',
  'config.gameGmPreview',
  'config.gameGmFeedbackDeadline',
  'config.gameBookOpen',
  'config.gameChoicesDue',
  'config.gmPreview',
  'config.schedulesSent',
  'config.lastCancellationFullRefund',
  'config.travelCoordination',
]
const flags = ['flag.allow_game_signup', 'flag.allow_registration', 'flag.display_gamebook', 'flag.display_schedule']

const newYearFields = ['config.year', ...dateFields]

const getSetting = (settingList: Setting[] | undefined, key: string) => settingList?.find((f) => f.code === key)

export const AddNewYearDialog: React.FC<AddNewYearDialogProps> = ({ open, onClose }) => {
  const trpc = useTRPC()
  const { isLoading, error, data } = useQuery(
    trpc.settings.getSettings.queryOptions(undefined, {
      staleTime: 60 * 60 * 1000, // 1 hour - settings rarely change
      refetchOnMount: false,
      refetchOnReconnect: false,
    }),
  )
  const createSetting = useMutation(trpc.settings.createSetting.mutationOptions())
  const updateSetting = useMutation(trpc.settings.updateSetting.mutationOptions())
  const ensureSpecialGamesForYear = useMutation(trpc.games.ensureSpecialGamesForYear.mutationOptions())
  const invalidateSettingsQueries = useInvalidateSettingsQueries()
  const notify = useNotification()

  const allFields: Setting[] | undefined = data?.filter(notEmpty)
  const oldYear = parseInt(getSetting(allFields, 'config.year')?.value ?? '0', 10)
  const newYear = oldYear + 1
  const timeZone = getSetting(allFields, 'config.baseTimeZone')?.value ?? ''

  const newList = useMemo(() => {
    if (!allFields) {
      return null
    }
    return allFields
      ?.filter((s) => newYearFields.includes(s.code))
      .map((v) => {
        const newValue = { ...v }
        if (newValue.code === 'config.year') {
          newValue.value = `${newYear}`
        }
        if (dateFields.includes(newValue.code)) {
          newValue.value = DateTime.fromISO(newValue.value).plus({ year: 1 })?.setZone(timeZone)?.toISO() ?? ''
        }
        return newValue
      })
  }, [allFields, newYear, timeZone])

  const onSubmit = useCallback(
    async (values: FormValues, actions: FormikHelpers<FormValues>) => {
      const startDate = DateTime.fromISO(getSetting(values, 'config.conventionStartDate')!.value)
      const newValues = [...values]
        .concat([
          {
            id: 0,
            code: `config.startDates.${newYear}.slots`,
            type: 'number',
            value: getSetting(allFields, 'config.numberOfSlots')?.value ?? '',
          },
          {
            id: 0,
            code: `config.startDates.${newYear}.virtual`,
            type: 'boolean',
            value: 'false',
          },
          {
            id: 0,
            code: `config.startDates.${newYear}.date`,
            type: 'date',
            value: getSetting(values, 'config.conventionStartDate')!.value,
          },
        ])
        .concat(
          allFields
            ?.filter((s) => deadlines.includes(s.code))
            .map((v) => {
              const newValue = { ...v }
              if (newValue.code === 'config.mondayBeforeCon' || newValue.code === 'config.wednesdayAfterCon') {
                if (newValue.code === 'config.mondayBeforeCon') {
                  newValue.value = startDate.minus({ days: 3 }).setZone(timeZone).toISO()!
                }
                if (newValue.code === 'config.wednesdayAfterCon') {
                  newValue.value = startDate.plus({ days: 6 }).setZone(timeZone).toISO()!
                }
              } else if (deadlines.includes(newValue.code)) {
                newValue.value = DateTime.fromISO(newValue.value).plus({ year: 1 })?.setZone(timeZone)?.toISO() ?? ''
              }
              return newValue
            }) ?? [],
        )
        .concat(allFields?.filter((s) => flags.includes(s.code)).map((v) => ({ ...v, value: 'No' })) ?? [])

      // log(newValues)

      const updaters = newValues.reduce((acc: Promise<any>[], v) => {
        if (v) {
          if (v.id) {
            acc.push(
              updateSetting.mutateAsync({
                id: v.id,
                code: v.code,
                value: v.value,
                type: v.type,
              }),
            )
          } else {
            acc.push(
              createSetting.mutateAsync({
                code: v.code,
                value: v.value,
                type: v.type,
              }),
            )
          }
        }
        return acc
      }, [])

      const settingResults = await Promise.allSettled(updaters)
      const failedSettings = settingResults.filter((result) => result.status !== 'fulfilled').length
      if (failedSettings) {
        console.warn('Some updates failed', settingResults)
      }

      let failedSpecialGameBootstrap = false
      try {
        await ensureSpecialGamesForYear.mutateAsync({ year: newYear })
      } catch (specialGameError) {
        failedSpecialGameBootstrap = true
        log('failed to ensure special games for new year', specialGameError)
      }

      actions.setSubmitting(false)

      if (failedSpecialGameBootstrap) {
        notify({ text: 'Settings created, but No/Any Game setup failed', variant: 'error' })
      } else {
        notify({ text: 'Settings created', variant: 'success' })
      }

      invalidateSettingsQueries()
      onClose(null)
    },
    [
      allFields,
      createSetting,
      ensureSpecialGamesForYear,
      invalidateSettingsQueries,
      newYear,
      notify,
      onClose,
      timeZone,
      updateSetting,
    ],
  )

  if (error) {
    return <TransportError error={error} />
  }
  if (isLoading || !data || !newList) {
    return <Loader />
  }

  return (
    <EditDialog initialValues={newList} onClose={onClose} open={open} onSubmit={onSubmit} title='New Year'>
      <Typography variant='subtitle2'>Only use this if you want to kick off a new year for the convention.</Typography>
      <Typography variant='subtitle2' gutterBottom>
        It creates a batch of edits based on the newly chosen year, that will definitely break things if you do it more
        than once.
      </Typography>
      <Typography variant='body1' gutterBottom>
        That said, you don&apos;t actually need to edit too much on this page, it lists every field that&apos;s added or
        changed by adding a new year, and guarantees that all the required settings are created, after this point the
        items can be safely edited individually.
      </Typography>
      <GridContainer spacing={2} sx={{ pt: 2 }}>
        {newList.map((s, index) => (
          <SettingInput key={s.code} value={s} index={index} />
        ))}
      </GridContainer>
    </EditDialog>
  )
}
