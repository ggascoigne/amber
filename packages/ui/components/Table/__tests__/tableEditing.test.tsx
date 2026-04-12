/* eslint-disable import/no-extraneous-dependencies */

import { fireEvent, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

import {
  DataTableHarness,
  installDomMeasurementMocks,
  personColumns,
  renderWithProviders,
  type PersonRow,
} from './testUtils'

import type { TableEditRowUpdate } from '../editing/types'

describe('table editing', () => {
  beforeEach(() => {
    installDomMeasurementMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  test('commits edits, saves updates, and discards pending changes', async () => {
    const onSave = vi
      .fn<(updates: Array<TableEditRowUpdate<PersonRow>>) => Promise<void>>()
      .mockResolvedValue(undefined)
    const onDiscard = vi.fn()

    renderWithProviders(
      <DataTableHarness
        data={[
          { id: '1', name: 'Alpha', age: 10 },
          { id: '2', name: 'Beta', age: 20 },
        ]}
        columns={personColumns}
        cellEditing={{
          enabled: true,
          onSave,
          onDiscard,
        }}
        title='Editable People'
      />,
    )

    fireEvent.click(screen.getByTestId('cell-1_name'))
    const nameInput = await screen.findByLabelText('Edit Name')
    fireEvent.change(nameInput, { target: { value: 'Alpha Updated' } })
    fireEvent.keyDown(nameInput, { key: 'Enter' })

    expect(await screen.findByText('Alpha Updated')).toBeInTheDocument()
    expect(screen.getByText('You have unsaved changes (1 row)')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Save' }))

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith([
        {
          rowId: '1',
          original: { id: '1', name: 'Alpha', age: 10 },
          updated: { id: '1', name: 'Alpha Updated', age: 10 },
          changes: { name: 'Alpha Updated' },
        },
      ])
    })

    await waitFor(() => {
      expect(screen.queryByText('You have unsaved changes (1 row)')).not.toBeInTheDocument()
    })

    fireEvent.click(screen.getByTestId('cell-1_name'))
    const secondInput = await screen.findByLabelText('Edit Name')
    fireEvent.change(secondInput, { target: { value: 'Temporary Value' } })
    fireEvent.keyDown(secondInput, { key: 'Enter' })
    expect(screen.getByText('You have unsaved changes (1 row)')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Discard' }))

    await waitFor(() => {
      expect(onDiscard).toHaveBeenCalledTimes(1)
      expect(screen.queryByText('You have unsaved changes (1 row)')).not.toBeInTheDocument()
    })

    expect(screen.getByText('Alpha Updated')).toBeInTheDocument()
    expect(screen.queryByText('Temporary Value')).not.toBeInTheDocument()
  })

  test('surfaces validation errors and disables save', async () => {
    const onSave = vi
      .fn<(updates: Array<TableEditRowUpdate<PersonRow>>) => Promise<void>>()
      .mockResolvedValue(undefined)

    renderWithProviders(
      <DataTableHarness
        data={[
          { id: '1', name: 'Alpha', age: 10 },
          { id: '2', name: 'Beta', age: 20 },
        ]}
        columns={personColumns}
        cellEditing={{
          enabled: true,
          onSave,
          validateCell: ({ column, value }) => {
            if (column.id === 'name' && String(value).trim() === '') {
              return 'Name is required'
            }

            return null
          },
        }}
      />,
    )

    fireEvent.click(screen.getByTestId('cell-1_name'))
    const nameInput = await screen.findByLabelText('Edit Name')
    fireEvent.change(nameInput, { target: { value: '' } })
    fireEvent.keyDown(nameInput, { key: 'Enter' })

    expect(await screen.findByText('Fix validation errors before saving.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled()
    expect(screen.getByTestId('cell-1_name')).toHaveAttribute('data-invalid', 'true')

    fireEvent.click(screen.getByRole('button', { name: 'Save' }))

    expect(onSave).not.toHaveBeenCalled()
  })
})
