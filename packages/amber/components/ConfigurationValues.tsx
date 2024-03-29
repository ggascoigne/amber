import React, { PropsWithChildren } from 'react'

import { ConfigurationNonDates, ConfigurationDates } from '@amber/api'
import { DateTime, DateTimeFormatOptions } from 'luxon'

import { getOrdinalWord, useConfiguration } from '../utils'

interface SpacingProps {
  skipSpace?: 'before' | 'after' | 'both' | 'neither'
}

const Spacing: React.FC<PropsWithChildren<SpacingProps>> = ({ children, skipSpace }) => (
  <>
    {skipSpace !== 'before' && skipSpace !== 'both' && ' '}
    {children}
    {skipSpace !== 'after' && skipSpace !== 'both' && ' '}
  </>
)

// common Date Formats
export const WMD = 'cccc, LLLL d'
export const WMDY = 'cccc, LLLL d yyyy'
export const MDY = DateTime.DATE_FULL

interface ConfigDateProps extends SpacingProps {
  name: keyof ConfigurationDates
  format?: DateTimeFormatOptions | string
}

export const ConfigDate = ({ name, format, skipSpace = 'neither' }: ConfigDateProps) => {
  const configuration = useConfiguration()
  const configDate =
    typeof format === 'string'
      ? configuration[name].setZone(configuration.baseTimeZone).toFormat(format)
      : configuration[name].setZone(configuration.baseTimeZone).toLocaleString(format)
  return <Spacing skipSpace={skipSpace}>{configDate}</Spacing>
}

export const ConventionsDatesFull: React.FC<{ pre?: string; intra?: string; post?: string }> = ({
  pre,
  intra,
  post,
}) => (
  <>
    {' '}
    {pre ?? null}
    <ConfigDate name='conventionStartDate' format={WMD} />
    {intra ?? null}
    <ConfigDate name='conventionEndDate' format={WMDY} skipSpace='after' />
    {post ?? null}
  </>
)

export const ConventionOrdinal = ({ skipSpace = 'neither' }: SpacingProps) => {
  const configuration = useConfiguration()
  return <Spacing skipSpace={skipSpace}>{getOrdinalWord(1 + configuration.year - configuration.startYear)} </Spacing>
}

export const ConventionYear = ({ skipSpace = 'neither' }: SpacingProps) => {
  const configuration = useConfiguration()
  return <Spacing skipSpace={skipSpace}>{configuration.year}</Spacing>
}

export const ContactEmail = ({ skipSpace = 'neither' }: SpacingProps) => {
  const configuration = useConfiguration()
  return <Spacing skipSpace={skipSpace}>{configuration.contactEmail} </Spacing>
}

export const ConfigurationValue = ({
  skipSpace = 'neither',
  field,
}: SpacingProps & { field: keyof ConfigurationNonDates }) => {
  const configuration = useConfiguration()
  return <Spacing skipSpace={skipSpace}>{configuration[field]} </Spacing>
}
