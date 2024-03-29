import React, { MouseEventHandler, useCallback, useMemo, useState } from 'react'

import AssignmentIndIcon from '@mui/icons-material/AssignmentInd'
import MailOutlineIcon from '@mui/icons-material/MailOutline'
import { Column, Row, TableInstance, TableState } from 'react-table'
import { BlankNoCell, DateCell, GraphQLError, Loader, notEmpty, Page, Table, useLocalStorage, YesBlankCell } from 'ui'

import { GameAssignmentDialog } from './GameAssignmentDialog'

import {
  useGraphQL,
  useGraphQLMutation,
  DeleteMembershipDocument,
  GetHotelRoomsDocument,
  GetMembershipsByYearDocument,
} from '../../client'
import { useInvalidateMembershipQueries } from '../../client/querySets'
import { ProfileFormType, useProfile } from '../../components/Profile'
import type { TableMouseEventHandler } from '../../types/react-table-config'
import { getSlotDescription, useConfiguration, useSendEmail, useYearFilter } from '../../utils'
import { Membership, MembershipConfirmationItem, MembershipType } from '../../utils/apiTypes'

export interface MembershipWizardProps {
  open: boolean
  onClose: (event?: any) => void
  initialValues?: MembershipType
  profile: ProfileFormType
  short?: boolean
}

const initialState: Partial<TableState<Membership>> = {
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

const memberColumns: Column<Membership>[] = [
  {
    accessor: 'id',
    Header: 'Member ID',
    width: 70,
  },
  {
    id: 'userId',
    accessor: (r: Membership) => r.user?.id,
    Header: 'User ID',
    width: 60,
  },
  {
    id: 'firstName',
    accessor: (r: Membership) => r.user?.firstName,
    width: 70,
    disableGlobalFilter: false,
  },
  {
    id: 'lastName',
    accessor: (r: Membership) => r.user?.lastName,
    width: 100,
    disableGlobalFilter: false,
  },
]

const columns: Column<Membership>[] = [
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

const virtualColumns: Column<Membership>[] = [
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

const Memberships: React.FC<{ newMembershipDialog: React.FC<MembershipWizardProps> }> = React.memo(
  ({ newMembershipDialog }) => {
    const MembershipWizard = newMembershipDialog
    const profile = useProfile()
    const configuration = useConfiguration()
    const [year] = useYearFilter()
    const [, setLastMembershipYear] = useLocalStorage<number>('lastMembershipYear', 0)
    const invalidateMembershipQueries = useInvalidateMembershipQueries()
    const sendEmail = useSendEmail()

    const [showEdit, setShowEdit] = useState(false)
    const [showGameAssignment, setShowGameAssignment] = useState(false)
    const [selection, setSelection] = useState<Membership[]>([])
    const deleteMembership = useGraphQLMutation(DeleteMembershipDocument)
    const { error, data, refetch } = useGraphQL(GetMembershipsByYearDocument, {
      year,
    })

    const { data: roomData } = useGraphQL(GetHotelRoomsDocument)

    const onUpdateGameAssignments = useCallback(
      (instance: TableInstance<Membership>) => async () => {
        setShowGameAssignment(true)
        setSelection(instance.selectedFlatRows.map((r) => r.original))
      },
      [],
    )

    const onSendRegistrationEmail = useCallback(
      (instance: TableInstance<Membership>) => async () => {
        const selected = instance.selectedFlatRows.map((r) => r.original)
        const payload = selected.map((m) => {
          const room = roomData
            ?.hotelRooms!.edges.map((v) => v.node)
            .filter(notEmpty)
            .find((r) => r.id === m.hotelRoomId)

          const slotDescriptions = m.slotsAttending?.split(',').map((i: string) =>
            getSlotDescription(configuration, {
              year: configuration.year,
              slot: parseInt(i, 10),
              local: configuration.virtual,
            }),
          )
          const owed = (m.user?.balance || 0) < 0 ? 0 - m.user!.balance : 0
          return {
            year: configuration.year,
            virtual: configuration.virtual,
            name: m.user?.fullName,
            email: m.user?.email,
            address: m.user?.profiles?.nodes?.[0]?.snailMailAddress ?? undefined,
            phoneNumber: m.user?.profiles?.nodes?.[0]?.phoneNumber ?? undefined,
            update: 'status',
            url: `${window.location.origin}/membership`,
            paymentUrl: `${window.location.origin}/payment`,
            membership: m,
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
      [configuration, roomData?.hotelRooms, sendEmail],
    )

    const commands = useMemo(
      () => [
        {
          label: 'Edit Game Assignments',
          onClick: onUpdateGameAssignments,
          icon: <AssignmentIndIcon />,
          enabled: ({ state }: TableInstance<Membership>) => Object.keys(state.selectedRowIds).length === 1,
          type: 'button' as const,
        },
        {
          label: 'Resend Registration Email',
          onClick: onSendRegistrationEmail,
          icon: <MailOutlineIcon />,
          enabled: ({ state }: TableInstance<Membership>) => Object.keys(state.selectedRowIds).length > 0,
          type: 'button' as const,
        },
      ],
      [onSendRegistrationEmail, onUpdateGameAssignments],
    )

    if (error) {
      return <GraphQLError error={error} />
    }

    if (!data) {
      return <Loader />
    }
    const { memberships } = data

    const list: Membership[] = memberships!.nodes.filter(notEmpty)

    const onAdd: TableMouseEventHandler<Membership> = () => () => {
      setShowEdit(true)
    }

    const onCloseEdit: MouseEventHandler = () => {
      setShowEdit(false)
      setShowGameAssignment(false)
      setSelection([])
    }

    const onDelete = (instance: TableInstance<Membership>) => () => {
      const toDelete = instance.selectedFlatRows.map((r) => r.original)
      const updater = toDelete.map((m) =>
        deleteMembership.mutateAsync(
          {
            input: { id: m.id },
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
    }

    const onEdit = (instance: TableInstance<Membership>) => () => {
      setShowEdit(true)
      setSelection(instance.selectedFlatRows.map((r) => r.original))
    }

    const onClick = (row: Row<Membership>) => {
      setShowEdit(true)
      setSelection([row.original])
    }

    return (
      <Page title='Membership'>
        {showEdit && (
          <MembershipWizard
            open={showEdit}
            onClose={onCloseEdit}
            initialValues={selection[0]}
            profile={profile!}
            short
          />
        )}
        {showGameAssignment && (
          <GameAssignmentDialog open={showGameAssignment} onClose={onCloseEdit} membership={selection[0]} />
        )}
        <Table<Membership>
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
  },
)

export default Memberships
