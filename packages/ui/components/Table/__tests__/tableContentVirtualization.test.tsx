/* eslint-disable import/no-extraneous-dependencies */

import { screen, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

import {
  DataTableHarness,
  installDomMeasurementMocks,
  personColumns,
  renderWithProviders,
  type PersonRow,
} from './testUtils'

describe('table virtualization', () => {
  beforeEach(() => {
    installDomMeasurementMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  test('uses the virtual-row path for large tables without expanded content', async () => {
    renderWithProviders(
      <DataTableHarness
        data={Array.from(
          { length: 30 },
          (_value, index): PersonRow => ({
            id: `${index + 1}`,
            name: `Person ${index + 1}`,
            age: index + 1,
          }),
        )}
        columns={personColumns}
        useVirtualRows
        title='Virtual People'
      />,
    )

    const tableBody = await screen.findByTestId('TableBody')
    const rows = within(tableBody).queryAllByTestId('TableRow')

    expect(rows.length).toBeLessThan(30)
    expect(tableBody).toHaveStyle({ position: 'relative' })
  })

  test('disables the virtual-row path when expanded content is enabled', async () => {
    renderWithProviders(
      <DataTableHarness
        data={Array.from(
          { length: 30 },
          (_value, index): PersonRow => ({
            id: `${index + 1}`,
            name: `Person ${index + 1}`,
            age: index + 1,
            note: `note ${index + 1}`,
          }),
        )}
        columns={personColumns}
        useVirtualRows
        renderExpandedContent={(row) => <div>{row.original.note}</div>}
        title='Expanded People'
      />,
    )

    const tableBody = await screen.findByTestId('TableBody')
    const rows = within(tableBody).getAllByTestId('TableRow')

    expect(rows).toHaveLength(30)
    expect(tableBody).not.toHaveStyle({ position: 'relative' })
    expect(rows[0]).not.toHaveStyle({ position: 'absolute' })
  })
})
