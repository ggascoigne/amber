import React, { useMemo } from 'react'

import { FormControlLabel, Radio, Table, TableBody, TableCell, TableHead, TableRow, Theme } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { makeStyles } from 'tss-react/mui'
import { Loader, notEmpty } from 'ui'

import { HasPermission, Perms } from './Auth'
import { TransportError } from './TransportError'

import { useGraphQL, GetHotelRoomsDocument } from '../client'
import { BathroomType } from '../utils'
import { useAvailableHotelRooms } from '../views/HotelRoomDetails/HotelRoomDetails'
import { HotelRoom } from '../views/HotelRoomTypes/HotelRoomTypes'

const useStyles = makeStyles<void, 'titleLine' | 'soldOut'>()((theme: Theme, _params, classes) => ({
  titleLine: {
    // see tableCell
  },
  disabled: {
    color: 'rgba(0,0,0,0.38)',
  },
  soldOut: {},
  tableRow: {
    color: 'inherit',
    outline: 0,
    verticalAlign: 'middle',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.07)',
    },
  },
  tableLabel: {},
  tableCell: {
    padding: '8px 16px',
    fontSize: '0.875rem',
    textAlign: 'left',
    fontWeight: 300,
    lineHeight: 1.3,
    verticalAlign: 'inherit',
    // color: theme.palette.text.primary,
    [`&.${classes.titleLine}`]: {
      fontWeight: 500,
    },
    [`&.${classes.soldOut}`]: {
      '&:after': {
        color: 'black',
        content: '" SOLD OUT"',
        fontSize: '14px',
        lineHeight: 1.42857,
        verticalAlign: 'middle',
      },
    },
  },
}))

const getRoomTypeDescription = (type: BathroomType) => {
  switch (type) {
    case BathroomType.Other:
      return ''
    case BathroomType.EnSuite:
      return 'Rooms with en-suite bath facilities'
    case BathroomType.NoEnSuite:
      return "Rooms with bath facilities 'down the hall', bed & breakfast style"
  }
  return undefined
}

const FancyDescription: React.FC<{ room: HotelRoom }> = ({ room }) => {
  const theme = useTheme()
  return (
    <span
      /* eslint-disable-next-line risxss/catch-potential-xss-react */
      dangerouslySetInnerHTML={{
        __html: room.description.replaceAll(
          /\*/g,
          `<span style='color:${theme.palette.error.main};font-weight:bold;font-size:larger'>*</span>`,
        ),
      }}
    />
  )
}

const FancyRate: React.FC<{ room: HotelRoom }> = ({ room }) => {
  const theme = useTheme()
  return (
    <span
      /* eslint-disable-next-line risxss/catch-potential-xss-react */
      dangerouslySetInnerHTML={{
        __html: room.rate.replaceAll(
          /(\$\d+ \/ night T.*S??\*)/g,
          `<span style='color:${theme.palette.error.main};'>$1</span>`,
        ),
      }}
    />
  )
}

interface RoomsFieldProps {
  rooms?: HotelRoom[]
  type: BathroomType
  currentValue: number
}

// extracted to make debugging easier
const roomCountThreshold = 0

const useGetAvailableRoomsOfType = (type: BathroomType, rooms?: HotelRoom[]) =>
  useMemo(
    () =>
      rooms?.filter((room) => room.bathroomType === type).sort((a, b) => -b.description.localeCompare(a.description)),
    [rooms, type],
  )

const RoomsFields: React.FC<RoomsFieldProps> = ({ rooms, type, currentValue }) => {
  const { classes, cx } = useStyles()
  const { getRoomAvailable } = useAvailableHotelRooms()
  const description = getRoomTypeDescription(type)
  const roomsOfType = useGetAvailableRoomsOfType(type, rooms)

  if (roomsOfType?.length) {
    return (
      <>
        {description ? (
          <TableRow key={`${type}_0`} className={classes.tableRow}>
            <TableCell className={cx(classes.tableCell, classes.titleLine)} colSpan={3}>
              {description}
            </TableCell>
          </TableRow>
        ) : null}
        {roomsOfType?.map((room, index) => {
          // this fiddle ensures that if the currently displayed room has already been selected, that it's
          // displayed as available for that user (since they already one of the allocation)
          const available = currentValue === room.id ? getRoomAvailable(room) + 1 : getRoomAvailable(room)
          const disabled = room.quantity <= 0
          const soldOut = available <= roomCountThreshold && !disabled
          const label = <FancyDescription room={room} />
          return (
            <TableRow
              key={`${type}_${index}`}
              className={cx(classes.tableRow, {
                [classes.disabled]: disabled,
                [classes.soldOut]: soldOut,
              })}
            >
              <TableCell
                className={cx(classes.tableCell, { [classes.disabled]: disabled, [classes.soldOut]: soldOut })}
                scope='row'
              >
                <FormControlLabel value={room.id} control={<Radio />} label={label} disabled={soldOut} />
              </TableCell>
              <TableCell className={cx(classes.tableCell, { [classes.disabled]: disabled || soldOut })} scope='row'>
                <FancyRate room={room} />
              </TableCell>
              <HasPermission
                permission={Perms.IsAdmin}
                denied={() => (
                  <TableCell className={cx(classes.tableCell, { [classes.disabled]: disabled || soldOut })} scope='row'>
                    {room.occupancy}
                  </TableCell>
                )}
              >
                <TableCell className={cx(classes.tableCell, { [classes.disabled]: disabled || soldOut })} scope='row'>
                  {available}
                </TableCell>
              </HasPermission>
            </TableRow>
          )
        })}
      </>
    )
  }
  return null
}

export const RoomFieldTable: React.FC<{ currentValue: number }> = ({ currentValue }) => {
  const { isLoading, error, data } = useGraphQL(GetHotelRoomsDocument)
  const rooms: HotelRoom[] | undefined = useMemo(
    () =>
      data
        ?.hotelRooms!.edges.map((v) => v.node)
        .filter(notEmpty)
        .filter((r) => r.quantity > 0), // filter out rooms that we're not allowing this year
    [data],
  )

  if (error) {
    return <TransportError error={error} />
  }
  if (isLoading || !data) {
    return <Loader />
  }

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Room</TableCell>
          <TableCell>Cost</TableCell>
          <HasPermission permission={Perms.IsAdmin} denied={() => <TableCell>Occupancy</TableCell>}>
            <TableCell>Available</TableCell>
          </HasPermission>
        </TableRow>
      </TableHead>
      <TableBody>
        <RoomsFields rooms={rooms} type={BathroomType.Other} currentValue={currentValue} />
        <RoomsFields rooms={rooms} type={BathroomType.NoEnSuite} currentValue={currentValue} />
        <RoomsFields rooms={rooms} type={BathroomType.EnSuite} currentValue={currentValue} />
      </TableBody>
    </Table>
  )
}

interface RoomsProps {
  rooms?: HotelRoom[]
  type: BathroomType
}

const RoomsRow: React.FC<RoomsProps> = ({ rooms, type }) => {
  const { classes, cx } = useStyles()
  const { getRoomAvailable } = useAvailableHotelRooms()
  const roomsOfType = useGetAvailableRoomsOfType(type, rooms)

  if (roomsOfType?.length) {
    return (
      <>
        {roomsOfType?.map((room, index) => {
          const available = getRoomAvailable(room)
          // fyi we chose to hide sold out rooms - so this bit of code never triggers, but we might put it back :)
          const disabled = available <= roomCountThreshold
          const label = <FancyDescription room={room} />
          return (
            <TableRow key={`${type}_${index}`} className={cx(classes.tableRow, { [classes.soldOut]: disabled })}>
              <TableCell className={cx(classes.tableCell, { [classes.soldOut]: disabled })} scope='row'>
                {label}
              </TableCell>
              <TableCell className={cx(classes.tableCell, { [classes.soldOut]: disabled })} scope='row'>
                <FancyRate room={room} />
              </TableCell>
              <TableCell className={cx(classes.tableCell, { [classes.soldOut]: disabled })} scope='row'>
                {room.occupancy}
              </TableCell>
              {/*
              <TableCell className={cx(classes.tableCell, { [classes.soldOut]: disabled })} scope='row'>
                {available}
              </TableCell>
              <TableCell className={cx(classes.tableCell, { [classes.soldOut]: disabled })} scope='row'>
                {room.id}
              </TableCell>
              */}
            </TableRow>
          )
        })}
      </>
    )
  }
  return null
}

export interface RoomsTableProps {
  type: BathroomType
}

export const RoomsTable: React.FC<RoomsTableProps> = ({ type }) => {
  const { isLoading, error, data } = useGraphQL(GetHotelRoomsDocument)

  if (error) {
    return <TransportError error={error} />
  }
  if (isLoading || !data) {
    return <Loader />
  }

  const rooms: HotelRoom[] = data
    .hotelRooms!.edges.map((v) => v.node)
    .filter(notEmpty)
    .filter((r) => r.quantity > 0)

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Room</TableCell>
          <TableCell>Cost</TableCell>
          <TableCell>Occupancy</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <RoomsRow rooms={rooms} type={type} />
      </TableBody>
    </Table>
  )
}
