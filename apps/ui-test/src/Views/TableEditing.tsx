import { useCallback, useMemo, useState } from 'react'

import type {
  TableCellValidationParams,
  TableEditOption,
  TableEditRowUpdate,
  TableRowValidationParams,
} from '@amber/ui/components/Table'
import { Table } from '@amber/ui/components/Table'
import { Box, Typography } from '@mui/material'
import { createColumnHelper } from '@tanstack/react-table'
import type { TableState } from '@tanstack/react-table'

import { Page } from '@/Components'
import type { UserType } from '@/utils/queries'
import { useUpdateUserMutation, useUsersQuery } from '@/utils/queries'

const subscriptionOptions: Array<TableEditOption> = [
  { value: 'free', label: 'Free' },
  { value: 'basic', label: 'Basic' },
  { value: 'pro', label: 'Pro' },
  { value: 'enterprise', label: 'Enterprise' },
]

const subscriptionLabels: Record<UserType['subscriptionTier'], string> = {
  free: 'Free',
  basic: 'Basic',
  pro: 'Pro',
  enterprise: 'Enterprise',
}

const columnHelper = createColumnHelper<UserType>()

const columns = [
  columnHelper.accessor('id', {
    meta: {
      align: 'right',
      edit: {
        type: 'number',
        placeholder: 'Id',
      },
    },
  }),
  columnHelper.accessor((row) => row.fullName, {
    id: 'name',
    header: 'Name',
    meta: {
      edit: {
        type: 'text',
        placeholder: 'Name',
        setValue: (row, value) => ({
          ...row,
          fullName: String(value ?? ''),
        }),
      },
    },
  }),
  columnHelper.accessor('subscriptionTier', {
    header: 'Subscription',
    cell: ({ getValue }) => subscriptionLabels[getValue() as UserType['subscriptionTier']],
    meta: {
      edit: {
        type: 'select',
        options: subscriptionOptions,
      },
    },
  }),
  columnHelper.accessor('email', {
    meta: {
      edit: {
        type: 'text',
        placeholder: 'Email',
      },
    },
  }),
]

export const TableEditing = () => {
  const [state, setState] = useState<Partial<TableState> | undefined>(undefined)
  const handleStateChange = useCallback((newState: TableState) => {
    setState({
      pagination: newState?.pagination,
      sorting: newState?.sorting ?? [],
      globalFilter: newState?.globalFilter,
      columnFilters: newState?.columnFilters,
    })
  }, [])

  const { data, isLoading, isFetching, refetch } = useUsersQuery(
    {
      pageIndex: state?.pagination?.pageIndex ?? 0,
      pageSize: state?.pagination?.pageSize ?? 10,
      sorting: state?.sorting ?? [],
      globalFilter: state?.globalFilter ?? '',
      filters: state?.columnFilters,
    },
    { enabled: !!state },
  )

  const updateUser = useUpdateUserMutation()

  const handleSave = useCallback(
    async (updates: Array<TableEditRowUpdate<UserType>>) => {
      await Promise.all(updates.map((update) => updateUser.mutateAsync(update.updated)))
      await refetch()
    },
    [refetch, updateUser],
  )

  const validateCell = useCallback((params: TableCellValidationParams<UserType>) => {
    const { column, value } = params
    if (column.id === 'name') {
      const name = String(value ?? '').trim()
      return name.length > 0 ? null : 'Name is required.'
    }

    if (column.id === 'id') {
      if (value === null || value === undefined || value === '') {
        return 'Id must be a positive number.'
      }
      const idValue = typeof value === 'number' ? value : Number(value)
      return Number.isFinite(idValue) && idValue > 0 ? null : 'Id must be a positive number.'
    }

    return null
  }, [])

  const validateRow = useCallback((params: TableRowValidationParams<UserType>) => {
    const { updatedRow } = params
    if (updatedRow.subscriptionTier === 'enterprise' && updatedRow.fullName.trim().length < 10) {
      return 'Enterprise subscribers must have a full name of at least 10 characters.'
    }
    return null
  }, [])

  const editingConfig = useMemo(
    () => ({
      enabled: true,
      onSave: handleSave,
      validateCell,
      validateRow,
    }),
    [handleSave, validateCell, validateRow],
  )

  return (
    <Page title='Table - Editable Cells'>
      <Box
        sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          minHeight: 0,
          height: '680px',
        }}
      >
        <Typography variant='body2' color='text.secondary'>
          Click a cell to edit. Changes show a left-hand marker and must be saved or discarded before paging.
        </Typography>
        <Table
          title='Table - Editable Cells'
          name='table-editing-demo'
          columns={columns}
          data={data?.rows ?? []}
          keyField='id'
          initialState={{
            sorting: [{ id: 'id', desc: false }],
            pagination: { pageIndex: 0, pageSize: 10 },
          }}
          isLoading={isLoading}
          isFetching={isFetching}
          scrollBehavior='bounded'
          cellEditing={editingConfig}
          displayGutter={false}
          handleStateChange={handleStateChange}
          rowCount={data?.rowCount ?? 0}
          refetch={refetch}
        />
      </Box>
    </Page>
  )
}
