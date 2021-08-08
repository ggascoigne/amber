import {
  FormControlLabel,
  Radio,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Theme,
  createStyles,
  makeStyles,
  useTheme,
} from '@material-ui/core'
import clsx from 'clsx'
import React, { useMemo } from 'react'

import { useGetHotelRoomsQuery } from '../client'
import { useAvailableHotelRooms } from '../pages/HotelRoomDetails/HotelRoomDetails'
import { HotelRoom } from '../pages/HotelRoomTypes/HotelRoomTypes'
import { BathroomType, notEmpty } from '../utils'
import { GraphQLError } from './GraphQLError'
import { Loader } from './Loader'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    titleLine: {
      // see tableCell
    },
    soldOut: {
      color: 'rgba(0,0,0,0.38)',

      '&:after': {
        color: 'black',
        content: ' SOLD OUT',
      },
    },
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
      '&$titleLine': {
        fontWeight: 500,
      },
    },
  })
)

export const getRoomTypeDescription = (type: BathroomType) => {
  switch (type) {
    case BathroomType.Other:
      return ''
    case BathroomType.EnSuite:
      return 'Rooms with en-suite bath facilities'
    case BathroomType.NoEnSuite:
      return "Rooms with bath facilities 'down the hall', bed & breakfast style"
  }
}

export interface RoomsProps {
  rooms?: HotelRoom[]
  type: BathroomType
}

// extracted to make debugging easier
const roomCountThreshold = 0

export const RoomsFields: React.FC<RoomsProps> = ({ rooms, type }) => {
  const classes = useStyles()
  const { getAvailable } = useAvailableHotelRooms()
  const theme = useTheme()
  const description = getRoomTypeDescription(type)
  const roomsOfType = useMemo(
    () =>
      rooms?.filter((room) => room.bathroomType === type)?.filter((room) => getAvailable(room) > roomCountThreshold),
    [getAvailable, rooms, type]
  )

  if (roomsOfType?.length) {
    return (
      <>
        {description ? (
          <TableRow key={`${type}_0`} className={classes.tableRow}>
            <TableCell className={clsx(classes.tableCell, classes.titleLine)} colSpan={3}>
              {getRoomTypeDescription(type)}
            </TableCell>
          </TableRow>
        ) : null}
        {roomsOfType?.map((room, index) => {
          const available = getAvailable(room)
          const disabled = available <= roomCountThreshold
          const label = (
            <span
              /* eslint-disable-next-line risxss/catch-potential-xss-react */
              dangerouslySetInnerHTML={{
                __html: room.description.replaceAll(
                  /\*/g,
                  `<span style='color:${theme.palette.error.main};font-weight:bold;font-size:larger'>*</span>`
                ),
              }}
            />
          )
          return (
            <TableRow key={`${type}_${index}`} className={clsx(classes.tableRow, { [classes.soldOut]: disabled })}>
              <TableCell className={clsx(classes.tableCell, { [classes.soldOut]: disabled })} scope='row'>
                <FormControlLabel value={room.id} control={<Radio />} label={label} disabled={disabled} />
              </TableCell>
              <TableCell
                className={clsx(classes.tableCell, { [classes.soldOut]: disabled })}
                scope='row'
                /* eslint-disable-next-line risxss/catch-potential-xss-react */
                dangerouslySetInnerHTML={{
                  __html: room.rate.replaceAll(
                    /(\$\d+ \/ night T.*Sat\*)/g,
                    `<span style='color:${theme.palette.error.main};'>$1</span>`
                  ),
                }}
              />
              <TableCell className={clsx(classes.tableCell, { [classes.soldOut]: disabled })} scope='row'>
                {room.occupancy}
              </TableCell>
              {/*
              <TableCell className={clsx(classes.tableCell, { [classes.soldOut]: disabled })} scope='row'>
                {available}
              </TableCell>
              <TableCell className={clsx(classes.tableCell, { [classes.soldOut]: disabled })} scope='row'>
                {room.id}
              </TableCell>
*/}
            </TableRow>
          )
        })}
      </>
    )
  } else {
    return null
  }
}

export const RoomFieldTable: React.FC = () => {
  const { isLoading, error, data } = useGetHotelRoomsQuery()

  if (error) {
    return <GraphQLError error={error} />
  }
  if (isLoading || !data) {
    return <Loader />
  }

  // todo: fix correctly
  const rooms: HotelRoom[] = data
    .hotelRooms!.edges.map((v) => v.node)
    .filter(notEmpty)
    .filter((r) => r.type !== 'hostel')

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
        <RoomsFields rooms={rooms} type={BathroomType.Other} />
        <RoomsFields rooms={rooms} type={BathroomType.NoEnSuite} />
        <RoomsFields rooms={rooms} type={BathroomType.EnSuite} />
      </TableBody>
    </Table>
  )
}

export const RoomsRow: React.FC<RoomsProps> = ({ rooms, type }) => {
  const classes = useStyles()
  const { getAvailable } = useAvailableHotelRooms()
  const theme = useTheme()
  // const description = getRoomTypeDescription(type)
  const roomsOfType = useMemo(
    () =>
      rooms?.filter((room) => room.bathroomType === type)?.filter((room) => getAvailable(room) > roomCountThreshold),
    [getAvailable, rooms, type]
  )

  if (roomsOfType?.length) {
    return (
      <>
        {/*{description ? (*/}
        {/*  <TableRow key={`${type}_0`} className={classes.tableRow}>*/}
        {/*    <TableCell className={clsx(classes.tableCell, classes.titleLine)} colSpan={3}>*/}
        {/*      {getRoomTypeDescription(type)}*/}
        {/*    </TableCell>*/}
        {/*  </TableRow>*/}
        {/*) : null}*/}
        {roomsOfType?.map((room, index) => {
          const available = getAvailable(room)
          const disabled = available <= roomCountThreshold
          const label = (
            <span
              /* eslint-disable-next-line risxss/catch-potential-xss-react */
              dangerouslySetInnerHTML={{
                __html: room.description.replaceAll(
                  /\*/g,
                  `<span style='color:${theme.palette.error.main};font-weight:bold;font-size:larger'>*</span>`
                ),
              }}
            />
          )
          return (
            <TableRow key={`${type}_${index}`} className={clsx(classes.tableRow, { [classes.soldOut]: disabled })}>
              <TableCell className={clsx(classes.tableCell, { [classes.soldOut]: disabled })} scope='row'>
                {label}
              </TableCell>
              <TableCell
                className={clsx(classes.tableCell, { [classes.soldOut]: disabled })}
                scope='row'
                /* eslint-disable-next-line risxss/catch-potential-xss-react */
                dangerouslySetInnerHTML={{
                  __html: room.rate.replaceAll(
                    /(\$\d+ \/ night T.*S??\*)/g,
                    `<span style='color:${theme.palette.error.main};'>$1</span>`
                  ),
                }}
              />
              <TableCell className={clsx(classes.tableCell, { [classes.soldOut]: disabled })} scope='row'>
                {room.occupancy}
              </TableCell>
              {/*
              <TableCell className={clsx(classes.tableCell, { [classes.soldOut]: disabled })} scope='row'>
                {available}
              </TableCell>
              <TableCell className={clsx(classes.tableCell, { [classes.soldOut]: disabled })} scope='row'>
                {room.id}
              </TableCell>
*/}
            </TableRow>
          )
        })}
      </>
    )
  } else {
    return null
  }
}

export interface RoomsTableProps {
  type: BathroomType
}

export const RoomsTable: React.FC<RoomsTableProps> = ({ type }) => {
  const { isLoading, error, data } = useGetHotelRoomsQuery()

  if (error) {
    return <GraphQLError error={error} />
  }
  if (isLoading || !data) {
    return <Loader />
  }

  // todo: fix correctly
  const rooms: HotelRoom[] = data
    .hotelRooms!.edges.map((v) => v.node)
    .filter(notEmpty)
    .filter((r) => r.type !== 'hostel')

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
