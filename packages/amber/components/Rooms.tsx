import React, { useMemo } from 'react'

import { HotelRoom, useTRPC } from '@amber/client'
import { Loader, notEmpty } from '@amber/ui'
import { FormControlLabel, Radio, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useQuery } from '@tanstack/react-query'

import { HasPermission, Perms } from './Auth'
import { TransportError } from './TransportError'

import { BathroomType } from '../utils'
import { useAvailableHotelRooms } from '../views/HotelRoomDetails/HotelRoomDetails'

const getRoomTypeDescription = (type: BathroomType) => {
  switch (type) {
    case BathroomType.Other:
      return ''
    case BathroomType.EnSuite:
      return 'Rooms with en-suite bath facilities'
    case BathroomType.NoEnSuite:
      return "Rooms with bath facilities 'down the hall', bed & breakfast style"
    default:
      return undefined
  }
}

const FancyDescription: React.FC<{ room: HotelRoom }> = ({ room }) => {
  const theme = useTheme()
  return (
    <span
      /* eslint-disable-next-line risxss/catch-potential-xss-react, react/no-danger */
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
      /* eslint-disable-next-line risxss/catch-potential-xss-react, react/no-danger */
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
  const { getRoomAvailable } = useAvailableHotelRooms()
  const description = getRoomTypeDescription(type)
  const roomsOfType = useGetAvailableRoomsOfType(type, rooms)

  if (roomsOfType?.length) {
    return (
      <>
        {description ? (
          <TableRow
            key={`${type}_0`}
            sx={{
              color: 'inherit',
              outline: 0,
              verticalAlign: 'middle',
              '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.07)' },
            }}
          >
            <TableCell
              sx={{
                p: '8px 16px',
                fontSize: '0.875rem',
                textAlign: 'left',
                fontWeight: 500,
                lineHeight: 1.3,
                verticalAlign: 'inherit',
              }}
              colSpan={3}
            >
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
              sx={{
                color: 'inherit',
                outline: 0,
                verticalAlign: 'middle',
                '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.07)' },
              }}
            >
              <TableCell
                sx={{
                  p: '8px 16px',
                  fontSize: '0.875rem',
                  textAlign: 'left',
                  fontWeight: 300,
                  lineHeight: 1.3,
                  verticalAlign: 'inherit',
                  color: disabled || soldOut ? 'rgba(0,0,0,0.38)' : 'inherit',
                  '&:after': soldOut
                    ? {
                        color: 'black',
                        content: '" SOLD OUT"',
                        fontSize: '14px',
                        lineHeight: 1.42857,
                        verticalAlign: 'middle',
                      }
                    : undefined,
                }}
                scope='row'
              >
                <FormControlLabel value={room.id} control={<Radio />} label={label} disabled={soldOut} />
              </TableCell>
              <TableCell
                sx={{
                  p: '8px 16px',
                  fontSize: '0.875rem',
                  textAlign: 'left',
                  fontWeight: 300,
                  lineHeight: 1.3,
                  verticalAlign: 'inherit',
                  color: disabled || soldOut ? 'rgba(0,0,0,0.38)' : 'inherit',
                }}
                scope='row'
              >
                <FancyRate room={room} />
              </TableCell>
              <HasPermission
                permission={Perms.IsAdmin}
                denied={() => (
                  <TableCell
                    sx={{
                      p: '8px 16px',
                      fontSize: '0.875rem',
                      textAlign: 'left',
                      fontWeight: 300,
                      lineHeight: 1.3,
                      verticalAlign: 'inherit',
                      color: disabled || soldOut ? 'rgba(0,0,0,0.38)' : 'inherit',
                    }}
                    scope='row'
                  >
                    {room.occupancy}
                  </TableCell>
                )}
              >
                <TableCell
                  sx={{
                    p: '8px 16px',
                    fontSize: '0.875rem',
                    textAlign: 'left',
                    fontWeight: 300,
                    lineHeight: 1.3,
                    verticalAlign: 'inherit',
                    color: disabled || soldOut ? 'rgba(0,0,0,0.38)' : 'inherit',
                  }}
                  scope='row'
                >
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
  const trpc = useTRPC()
  const { isLoading, error, data } = useQuery(trpc.hotelRooms.getHotelRooms.queryOptions())
  const rooms: HotelRoom[] | undefined = useMemo(
    () => data?.filter(notEmpty).filter((r) => r.quantity > 0), // filter out rooms that we're not allowing this year
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
            <TableRow
              key={`${type}_${index}`}
              sx={{
                color: 'inherit',
                outline: 0,
                verticalAlign: 'middle',
                '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.07)' },
              }}
            >
              <TableCell
                sx={{
                  p: '8px 16px',
                  fontSize: '0.875rem',
                  textAlign: 'left',
                  fontWeight: 300,
                  lineHeight: 1.3,
                  verticalAlign: 'inherit',
                  '&:after': disabled
                    ? {
                        color: 'black',
                        content: '" SOLD OUT"',
                        fontSize: '14px',
                        lineHeight: 1.42857,
                        verticalAlign: 'middle',
                      }
                    : undefined,
                }}
                scope='row'
              >
                {label}
              </TableCell>
              <TableCell
                sx={{
                  p: '8px 16px',
                  fontSize: '0.875rem',
                  textAlign: 'left',
                  fontWeight: 300,
                  lineHeight: 1.3,
                  verticalAlign: 'inherit',
                  '&:after': disabled
                    ? {
                        color: 'black',
                        content: '" SOLD OUT"',
                        fontSize: '14px',
                        lineHeight: 1.42857,
                        verticalAlign: 'middle',
                      }
                    : undefined,
                }}
                scope='row'
              >
                <FancyRate room={room} />
              </TableCell>
              <TableCell
                sx={{
                  p: '8px 16px',
                  fontSize: '0.875rem',
                  textAlign: 'left',
                  fontWeight: 300,
                  lineHeight: 1.3,
                  verticalAlign: 'inherit',
                  '&:after': disabled
                    ? {
                        color: 'black',
                        content: '" SOLD OUT"',
                        fontSize: '14px',
                        lineHeight: 1.42857,
                        verticalAlign: 'middle',
                      }
                    : undefined,
                }}
                scope='row'
              >
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
  const trpc = useTRPC()
  const { isLoading, error, data } = useQuery(trpc.hotelRooms.getHotelRooms.queryOptions())
  if (error) {
    return <TransportError error={error} />
  }
  if (isLoading || !data) {
    return <Loader />
  }

  const rooms: HotelRoom[] = data.filter(notEmpty).filter((r) => r.quantity > 0)

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
