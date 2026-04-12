/* eslint-disable import/no-extraneous-dependencies */

import { fireEvent, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

import { TableHarness, installDomMeasurementMocks, renderWithProviders, type PersonRow } from './testUtils'

describe('table expansion', () => {
  beforeEach(() => {
    installDomMeasurementMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  test('renders expanded content and filters to expanded rows only', async () => {
    renderWithProviders(
      <TableHarness renderExpandedContent={(row) => <div>{row.original.note}</div>} showExpandedSwitch />,
    )

    expect(await screen.findByText('Alpha')).toBeInTheDocument()
    expect(screen.getByText('Beta')).toBeInTheDocument()

    fireEvent.click(screen.getAllByTestId('row-expansion-toggle')[0])

    expect(await screen.findByText('alpha details')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('switch', { name: 'Show Expanded' }))

    await waitFor(() => {
      expect(screen.getByText('Alpha')).toBeInTheDocument()
      expect(screen.queryByText('Beta')).not.toBeInTheDocument()
      expect(screen.getByText('alpha details')).toBeInTheDocument()
    })
  })

  test('keeps wrapper features working together for selection, expansion, and editing', async () => {
    const onSave = vi.fn().mockResolvedValue(undefined)
    const rows: Array<PersonRow> = [
      { id: '1', name: 'Alpha', age: 10, note: 'alpha details' },
      { id: '2', name: 'Beta', age: 20, note: 'beta details' },
    ]

    renderWithProviders(
      <TableHarness
        data={rows}
        renderExpandedContent={(row) => <div>{row.original.note}</div>}
        cellEditing={{
          enabled: true,
          onSave,
        }}
      />,
    )

    expect((await screen.findAllByRole('checkbox')).length).toBeGreaterThan(0)

    fireEvent.click(screen.getAllByTestId('row-expansion-toggle')[0])
    expect(await screen.findByText('alpha details')).toBeInTheDocument()

    fireEvent.click(screen.getByTestId('cell-1_name'))
    const input = await screen.findByLabelText('Edit Name')
    fireEvent.change(input, { target: { value: 'Alpha Wrapper Edit' } })
    fireEvent.keyDown(input, { key: 'Enter' })

    expect(await screen.findByText('Alpha Wrapper Edit')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled()
  })
})
