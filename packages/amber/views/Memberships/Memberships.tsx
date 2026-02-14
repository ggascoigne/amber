import type React from 'react'
import { useCallback, useState } from 'react'

import type { MembershipAndUserAndRoom, UserAndProfile } from '@amber/client'
import { useInvalidateMembershipQueries, useTRPC } from '@amber/client'
import { notEmpty } from '@amber/ui'
import { BlankNoCell, DateCell, YesBlankCell } from '@amber/ui/components/CellFormatters'
import type { Action, TableSelectionMouseEventHandler } from '@amber/ui/components/Table'
import { Table, getSelectedRows } from '@amber/ui/components/Table'
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd'
import MailOutlineIcon from '@mui/icons-material/MailOutline'
import { useMutation, useQuery } from '@tanstack/react-query'
import type { ColumnDef, TableState } from '@tanstack/react-table'

import { GameAssignmentDialog } from './GameAssignmentDialog'

import { Page } from '../../components'
import { useProfile } from '../../components/Profile'
import { TransportError } from '../../components/TransportError'
import { getSlotDescription, useConfiguration, useSendEmail, useYearFilter } from '../../utils'
import type { MembershipConfirmationItem, MembershipType } from '../../utils/apiTypes'
import { toLegacyApiMembership } from '../../utils/membershipUtils'
import { useStandardHandlers } from '../../utils/useStandardHandlers'

export interface MembershipWizardProps {
  open: boolean
  onClose: (event?: any) => void
  initialValues?: MembershipType
  profile: UserAndProfile
  short?: boolean
}

const initialState: Partial<TableState> = {
  sorting: [
    {
      id: 'lastName',
      desc: false,
    },
  ],
  columnVisibility: {
    hotelRoomId: false,
    interestLevel: false,
    message: false,
    offerSubsidy: false,
    requestOldPrice: false,
    roomPreferenceAndNotes: false,
    roomingPreferences: false,
    roomingWith: false,
  },
}

const memberColumns: ColumnDef<MembershipAndUserAndRoom>[] = [
  {
    accessorKey: 'id',
    header: 'Member ID',
    size: 70,
    meta: { align: 'right' as const },
    enableGlobalFilter: false,
  },
  {
    id: 'userId',
    header: 'User ID',
    accessorFn: (row) => row.user?.id,
    size: 60,
    meta: { align: 'right' as const },
    enableGlobalFilter: false,
  },
  {
    id: 'firstName',
    header: 'First Name',
    accessorFn: (row) => row.user?.firstName,
    size: 70,
    enableGlobalFilter: true,
  },
  {
    id: 'lastName',
    header: 'Last Name',
    accessorFn: (row) => row.user?.lastName,
    size: 100,
    enableGlobalFilter: true,
  },
]

const columns: ColumnDef<MembershipAndUserAndRoom>[] = [
  {
    header: 'Member',
    columns: memberColumns,
  },
  {
    header: 'Attendance',
    columns: [
      {
        accessorKey: 'attendance',
        header: 'Attendance',
        size: 60,
        enableGlobalFilter: false,
      },
      {
        accessorKey: 'arrivalDate',
        header: 'Arrival Date',
        cell: DateCell,
        enableGlobalFilter: false,
      },
      {
        accessorKey: 'departureDate',
        header: 'Departure Date',
        cell: DateCell,
        enableGlobalFilter: false,
      },
      {
        accessorKey: 'interestLevel',
        header: 'Interest Level',
        enableGlobalFilter: false,
      },
      {
        accessorKey: 'message',
        header: 'Message',
        enableGlobalFilter: false,
      },
      {
        accessorKey: 'volunteer',
        header: 'Volunteer',
        cell: YesBlankCell,
        size: 65,
        enableGlobalFilter: false,
      },
      {
        accessorKey: 'attending',
        header: 'Attending',
        cell: BlankNoCell,
        size: 65,
        enableGlobalFilter: false,
      },
      {
        accessorKey: 'hotelRoomId',
        header: 'Hotel Room ID',
        meta: { align: 'right' as const },
        enableGlobalFilter: false,
      },
      {
        accessorKey: 'offerSubsidy',
        header: 'Offer Subsidy',
        cell: YesBlankCell,
        enableGlobalFilter: false,
      },
      {
        accessorKey: 'requestOldPrice',
        header: 'Request Old Price',
        cell: YesBlankCell,
        enableGlobalFilter: false,
      },
      {
        accessorKey: 'roomPreferenceAndNotes',
        header: 'Room Preference & Notes',
        enableGlobalFilter: false,
      },
      {
        accessorKey: 'roomingPreferences',
        header: 'Rooming Preferences',
        enableGlobalFilter: false,
      },
      {
        accessorKey: 'roomingWith',
        header: 'Rooming With',
        enableGlobalFilter: false,
      },
    ],
  },
]

const virtualColumns: ColumnDef<MembershipAndUserAndRoom>[] = [
  {
    header: 'Member',
    columns: memberColumns,
  },
  {
    header: 'Attendance',
    columns: [
      {
        accessorKey: 'slotsAttending',
        header: 'Slots Attending',
        enableGlobalFilter: false,
      },
      {
        accessorKey: 'message',
        header: 'Message',
        enableGlobalFilter: false,
      },
      {
        accessorKey: 'volunteer',
        header: 'Volunteer',
        cell: YesBlankCell,
        size: 65,
        enableGlobalFilter: false,
      },
      {
        accessorKey: 'attending',
        header: 'Attending',
        cell: BlankNoCell,
        size: 65,
        enableGlobalFilter: false,
      },
    ],
  },
]

const Memberships: React.FC<{
  newMembershipDialog: React.FC<MembershipWizardProps>
}> = ({ newMembershipDialog }) => {
  const trpc = useTRPC()
  const MembershipWizard = newMembershipDialog
  const profile = useProfile()
  const configuration = useConfiguration()
  const [year] = useYearFilter()
  const invalidateMembershipQueries = useInvalidateMembershipQueries()
  const sendEmail = useSendEmail()

  const [showGameAssignment, setShowGameAssignment] = useState(false)
  const deleteMembership = useMutation(trpc.memberships.deleteMembership.mutationOptions())
  const {
    error,
    data: memberships = [],
    refetch,
    isLoading,
    isFetching,
  } = useQuery(
    trpc.memberships.getMembershipsByYear.queryOptions({
      year,
    }),
  )

  const { data: roomData } = useQuery(trpc.hotelRooms.getHotelRooms.queryOptions())

  const { showEdit, selection, handleCloseEdit, onAdd, onEdit, onRowClick, onDelete, updateSelection } =
    useStandardHandlers<MembershipAndUserAndRoom>({
      deleteHandler: (selectedRows) => selectedRows.map((row) => deleteMembership.mutateAsync({ id: row.id })),
      invalidateQueries: invalidateMembershipQueries,
      onCloseCallback: () => {
        setShowGameAssignment(false)
      },
    })

  const handleUpdateGameAssignments: TableSelectionMouseEventHandler<MembershipAndUserAndRoom> = useCallback(
    (table, selectedKeys) => {
      const selected = updateSelection(table, selectedKeys)
      if (!selected.length) return
      setShowGameAssignment(true)
    },
    [updateSelection],
  )

  const handleSendRegistrationEmail: TableSelectionMouseEventHandler<MembershipAndUserAndRoom> = useCallback(
    (table, selectedKeys) => {
      const selected = getSelectedRows(table, selectedKeys)
      if (!selected.length) return
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
    [roomData, configuration, sendEmail],
  )

  const toolbarActions: Action<MembershipAndUserAndRoom>[] = [
    {
      label: 'Edit Game Assignments',
      onClick: handleUpdateGameAssignments,
      icon: <AssignmentIndIcon />,
      enabled: (_table, selectedKeys) => selectedKeys.length === 1,
    },
    {
      label: 'Resend Registration Email',
      onClick: handleSendRegistrationEmail,
      icon: <MailOutlineIcon />,
      enabled: (_table, selectedKeys) => selectedKeys.length > 0,
    },
  ]

  if (error) {
    return <TransportError error={error} />
  }

  const tableColumns = configuration.startDates[year].virtual ? virtualColumns : columns

  return (
    <Page title='Membership' variant='fill' hideTitle>
      {showEdit && (
        <MembershipWizard
          open={showEdit}
          onClose={handleCloseEdit}
          initialValues={selection[0]}
          profile={profile!}
          short
        />
      )}
      {showGameAssignment && (
        <GameAssignmentDialog open={showGameAssignment} onClose={handleCloseEdit} membership={selection[0]} />
      )}
      <Table<MembershipAndUserAndRoom>
        title='Membership'
        name='members'
        data={memberships}
        columns={tableColumns}
        initialState={initialState}
        isLoading={isLoading}
        isFetching={isFetching}
        onRowClick={onRowClick}
        onAdd={onAdd}
        onEdit={onEdit}
        onDelete={onDelete}
        refetch={refetch}
        additionalToolbarActions={toolbarActions}
        enableGrouping={false}
      />
    </Page>
  )
}

export default Memberships
