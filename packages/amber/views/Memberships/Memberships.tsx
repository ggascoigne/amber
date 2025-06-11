import React, { MouseEventHandler, useCallback, useMemo, useState } from 'react'

import { MembershipAndUserAndRoom, useInvalidateMembershipQueries, UserAndProfile, useTRPC } from '@amber/client'
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd'
import MailOutlineIcon from '@mui/icons-material/MailOutline'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Column, Row, TableInstance, TableState } from 'react-table'
import { BlankNoCell, DateCell, Loader, notEmpty, Page, Table, useLocalStorage, YesBlankCell } from 'ui'

import { GameAssignmentDialog } from './GameAssignmentDialog'

import { useProfile } from '../../components/Profile'
import { TransportError } from '../../components/TransportError'
import type { TableMouseEventHandler } from '../../types/react-table-config'
import { getSlotDescription, useConfiguration, useSendEmail, useYearFilter } from '../../utils'
import { MembershipConfirmationItem, MembershipType } from '../../utils/apiTypes'
import { toLegacyApiMembership } from '../../utils/membershipUtils'

export interface MembershipWizardProps {
  open: boolean
  onClose: (event?: any) => void
  initialValues?: MembershipType
  profile: UserAndProfile
  short?: boolean
}

const initialState: Partial<TableState<MembershipAndUserAndRoom>> = {
  sortBy: [
    {
      id: 'lastName',
      desc: false,
    },
  ],
  hiddenColumns: [
    'hotelRoomId',
    'interestLevel',
    'message',
    'offerSubsidy',
    'requestOldPrice',
    'roomPreferenceAndNotes',
    'roomingPreferences',
    'roomingWith',
  ],
}

const memberColumns: Column<MembershipAndUserAndRoom>[] = [
  {
    accessor: 'id',
    Header: 'Member ID',
    width: 70,
  },
  {
    id: 'userId',
    accessor: (r: MembershipAndUserAndRoom) => r.user?.id,
    Header: 'User ID',
    width: 60,
  },
  {
    id: 'firstName',
    accessor: (r: MembershipAndUserAndRoom) => r.user?.firstName,
    width: 70,
    disableGlobalFilter: false,
  },
  {
    id: 'lastName',
    accessor: (r: MembershipAndUserAndRoom) => r.user?.lastName,
    width: 100,
    disableGlobalFilter: false,
  },
]

const columns: Column<MembershipAndUserAndRoom>[] = [
  {
    Header: 'Member',
    columns: memberColumns,
  },
  {
    Header: 'Attendance',
    columns: [
      {
        accessor: 'attendance',
        width: 60,
      },
      {
        accessor: 'arrivalDate',
        Cell: DateCell,
      },
      {
        accessor: 'departureDate',
        Cell: DateCell,
      },
      {
        accessor: 'interestLevel',
      },
      {
        accessor: 'message',
      },
      {
        accessor: 'volunteer',
        Cell: YesBlankCell,
        sortType: 'basic',
        width: 65,
      },
      {
        accessor: 'attending',
        Cell: BlankNoCell,
        sortType: 'basic',
        width: 65,
      },
      { accessor: 'hotelRoomId' },
      { accessor: 'offerSubsidy' },
      { accessor: 'requestOldPrice', Cell: YesBlankCell, sortType: 'basic' },
      { accessor: 'roomPreferenceAndNotes' },
      { accessor: 'roomingPreferences' },
      { accessor: 'roomingWith' },
    ],
  },
]

const virtualColumns: Column<MembershipAndUserAndRoom>[] = [
  {
    Header: 'Member',
    columns: memberColumns,
  },
  {
    Header: 'Attendance',
    columns: [
      {
        accessor: 'slotsAttending',
      },
      {
        accessor: 'message',
      },
      {
        accessor: 'volunteer',
        Cell: YesBlankCell,
        width: 65,
      },
      {
        accessor: 'attending',
        Cell: BlankNoCell,
        width: 65,
      },
    ],
  },
]

const Memberships: React.FC<{ newMembershipDialog: React.FC<MembershipWizardProps> }> = ({ newMembershipDialog }) => {
  const trpc = useTRPC()
  const MembershipWizard = newMembershipDialog
  const profile = useProfile()
  const configuration = useConfiguration()
  const [year] = useYearFilter()
  const [, setLastMembershipYear] = useLocalStorage<number>('lastMembershipYear', 0)
  const invalidateMembershipQueries = useInvalidateMembershipQueries()
  const sendEmail = useSendEmail()

  const [showEdit, setShowEdit] = useState(false)
  const [showGameAssignment, setShowGameAssignment] = useState(false)
  const [selection, setSelection] = useState<MembershipAndUserAndRoom[]>([])
  const deleteMembership = useMutation(trpc.memberships.deleteMembership.mutationOptions())
  const {
    error,
    data: memberships,
    refetch,
  } = useQuery(
    trpc.memberships.getMembershipsByYear.queryOptions({
      year,
    }),
  )

  const { data: roomData } = useQuery(trpc.hotelRooms.getHotelRooms.queryOptions())

  const onUpdateGameAssignments = useCallback(
    (instance: TableInstance<MembershipAndUserAndRoom>) => async () => {
      setShowGameAssignment(true)
      setSelection(instance.selectedFlatRows.map((r) => r.original))
    },
    [],
  )

  const onSendRegistrationEmail = useCallback(
    (instance: TableInstance<MembershipAndUserAndRoom>) => async () => {
      const selected = instance.selectedFlatRows.map((r) => r.original)
      const payload = selected.map((m) => {
        const room = roomData?.filter(notEmpty).find((r) => r.id === m.hotelRoomId)

        const slotDescriptions = m.slotsAttending?.split(',').map((i: string) =>
          getSlotDescription(configuration, {
            year: configuration.year,
            slot: parseInt(i, 10),
            local: configuration.virtual,
          }),
        )
        const owed = (m.user?.balance ?? 0) < 0 ? 0 - m.user!.balance : 0
        return {
          year: configuration.year,
          virtual: configuration.virtual,
          name: m.user?.fullName,
          email: m.user?.email,
          address: m.user?.profile?.[0]?.snailMailAddress ?? undefined,
          phoneNumber: m.user?.profile?.[0]?.phoneNumber ?? undefined,
          update: 'status',
          url: `${window.location.origin}/membership`,
          paymentUrl: `${window.location.origin}/payment`,
          membership: toLegacyApiMembership(m),
          slotDescriptions,
          owed,
          room,
        } as MembershipConfirmationItem
      })

      sendEmail({
        type: 'membershipConfirmation',
        body: payload,
      })
    },
    [configuration, roomData, sendEmail],
  )

  const commands = useMemo(
    () => [
      {
        label: 'Edit Game Assignments',
        onClick: onUpdateGameAssignments,
        icon: <AssignmentIndIcon />,
        enabled: ({ state }: TableInstance<MembershipAndUserAndRoom>) => Object.keys(state.selectedRowIds).length === 1,
        type: 'button' as const,
      },
      {
        label: 'Resend Registration Email',
        onClick: onSendRegistrationEmail,
        icon: <MailOutlineIcon />,
        enabled: ({ state }: TableInstance<MembershipAndUserAndRoom>) => Object.keys(state.selectedRowIds).length > 0,
        type: 'button' as const,
      },
    ],
    [onSendRegistrationEmail, onUpdateGameAssignments],
  )

  const onDelete = useCallback(
    (instance: TableInstance<MembershipAndUserAndRoom>) => () => {
      const toDelete = instance.selectedFlatRows.map((r) => r.original)
      const updater = toDelete.map((m) =>
        deleteMembership.mutateAsync(
          {
            id: m.id,
          },
          {
            onSuccess: invalidateMembershipQueries,
          },
        ),
      )
      Promise.allSettled(updater).then(() => {
        console.log('deleted')
        instance.toggleAllRowsSelected(false)
        setSelection([])
        setLastMembershipYear(0) // flush membership cache, not really correct, but it makes testing so much easier
      })
    },
    [deleteMembership, invalidateMembershipQueries, setLastMembershipYear],
  )

  if (error) {
    return <TransportError error={error} />
  }

  if (!memberships) {
    return <Loader />
  }

  const list: MembershipAndUserAndRoom[] = memberships!.filter(notEmpty)

  const onAdd: TableMouseEventHandler<MembershipAndUserAndRoom> = () => () => {
    setShowEdit(true)
  }

  const onCloseEdit: MouseEventHandler = () => {
    setShowEdit(false)
    setShowGameAssignment(false)
    setSelection([])
  }

  const onEdit = (instance: TableInstance<MembershipAndUserAndRoom>) => () => {
    setShowEdit(true)
    setSelection(instance.selectedFlatRows.map((r) => r.original))
  }

  const onClick = (row: Row<MembershipAndUserAndRoom>) => {
    setShowEdit(true)
    setSelection([row.original])
  }

  return (
    <Page title='Membership'>
      {showEdit && (
        <MembershipWizard open={showEdit} onClose={onCloseEdit} initialValues={selection[0]} profile={profile!} short />
      )}
      {showGameAssignment && (
        <GameAssignmentDialog open={showGameAssignment} onClose={onCloseEdit} membership={selection[0]} />
      )}
      <Table<MembershipAndUserAndRoom>
        name='members'
        data={list}
        columns={configuration.startDates[year].virtual ? virtualColumns : columns}
        onAdd={onAdd}
        disableGroupBy
        onDelete={onDelete}
        onEdit={onEdit}
        onClick={onClick}
        initialState={initialState}
        extraCommands={commands}
        onRefresh={() => refetch()}
        defaultColumnDisableGlobalFilter
      />
    </Page>
  )
}

export default Memberships
