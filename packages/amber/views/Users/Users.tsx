import type { UserAndProfile } from '@amber/client'
import { useTRPC } from '@amber/client'
import { Table } from '@amber/ui/components/Table'
import { useQuery } from '@tanstack/react-query'
import type { ColumnDef } from '@tanstack/react-table'

import { Page } from '../../components'
import { ProfileDialog } from '../../components/Profile'
import { TransportError } from '../../components/TransportError'
import { useStandardHandlers } from '../../utils/useStandardHandlers'

const columns: ColumnDef<UserAndProfile>[] = [
  { accessorKey: 'fullName' },
  { accessorKey: 'firstName' },
  { accessorKey: 'lastName' },
  { accessorKey: 'displayName' },
  { accessorKey: 'email' },
  {
    id: 'snailMailAddress',
    accessorFn: (originalRow) => originalRow?.profile?.[0]?.snailMailAddress,
  },
  {
    id: 'phoneNumber',
    accessorFn: (originalRow) => originalRow?.profile?.[0]?.phoneNumber,
  },
  { accessorKey: 'balance' },
]

const Users = () => {
  const trpc = useTRPC()
  const { error, data, refetch, isFetching, isLoading } = useQuery(trpc.users.getAllUsersAndProfiles.queryOptions())
  const { showEdit, selection, handleCloseEdit, onEdit, onRowClick } = useStandardHandlers<UserAndProfile>({
    invalidateQueries: refetch,
  })

  if (error) {
    return <TransportError error={error} />
  }

  return (
    <Page variant='fill' title='Users 2' hideTitle>
      {showEdit && <ProfileDialog open={showEdit} onClose={handleCloseEdit} initialValues={selection[0]} />}
      <Table
        title='Users'
        name='users'
        data={data ?? []}
        enableGrouping={false}
        columns={columns}
        isLoading={isLoading}
        isFetching={isFetching}
        onRowClick={onRowClick}
        refetch={refetch}
        onEdit={onEdit}
      />
    </Page>
  )
}

export default Users
