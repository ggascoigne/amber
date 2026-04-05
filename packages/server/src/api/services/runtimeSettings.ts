import { DateTime } from 'luxon'

import type { TransactionClient } from '../inRlsTransaction'

type SettingRecord = {
  code: string
  value: string
}

type StartDateConfig = {
  date: DateTime
  slots: number
  virtual: boolean
}

export type RuntimeSettings = {
  abbr: 'acnw' | 'acus'
  contactEmail: string
  deposit: number
  flags: Record<string, string>
  gameEmail: string
  numberOfSlots: number
  paymentDeadline: DateTime
  startDates: Record<number, StartDateConfig>
  virtual: boolean
  year: number
}

const setValueAtPath = (target: Record<string, unknown>, path: string, value: string) => {
  const parts = path.split('.')
  const key = parts.at(-1)
  if (!key) {
    return
  }

  let current: Record<string, unknown> = target
  for (const part of parts.slice(0, -1)) {
    const existing = current[part]
    if (typeof existing === 'object' && existing !== null) {
      current = existing as Record<string, unknown>
    } else {
      const next: Record<string, unknown> = {}
      current[part] = next
      current = next
    }
  }

  current[key] = value
}

const toBoolean = (value: unknown) => value === 'true'
const toNumber = (value: unknown) => {
  const text = typeof value === 'string' ? value : ''
  return text ? parseInt(text, 10) : 0
}

const parseStartDates = (value: unknown) => {
  if (typeof value !== 'object' || value === null) {
    return {}
  }

  return Object.fromEntries(
    Object.entries(value as Record<string, Record<string, string>>).map(([year, entry]) => [
      parseInt(year, 10),
      {
        date: DateTime.fromISO(entry.date),
        slots: toNumber(entry.slots),
        virtual: toBoolean(entry.virtual),
      },
    ]),
  )
}

const buildSettingsObject = (rows: Array<SettingRecord>) => {
  const result: Record<string, unknown> = {}
  rows.forEach((row) => setValueAtPath(result, row.code, row.value))
  return result
}

export const getRuntimeSettingsTx = async (tx: TransactionClient): Promise<RuntimeSettings> => {
  const rows = await tx.setting.findMany({
    select: {
      code: true,
      value: true,
    },
  })

  const settings = buildSettingsObject(rows)
  const config = (settings.config ?? {}) as Record<string, unknown>
  const flags = (settings.flag ?? {}) as Record<string, string>
  const abbr = config.abbr === 'acus' ? 'acus' : 'acnw'

  return {
    abbr,
    contactEmail: typeof config.contactEmail === 'string' ? config.contactEmail : '',
    deposit: toNumber(config.deposit),
    flags,
    gameEmail: typeof config.gameEmail === 'string' ? config.gameEmail : '',
    numberOfSlots: toNumber(config.numberOfSlots),
    paymentDeadline: DateTime.fromISO(typeof config.paymentDeadline === 'string' ? config.paymentDeadline : ''),
    startDates: parseStartDates(config.startDates),
    virtual: toBoolean(config.virtual),
    year: toNumber(config.year),
  }
}
