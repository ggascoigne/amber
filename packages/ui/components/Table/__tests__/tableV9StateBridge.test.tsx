/**
 * @vitest-environment jsdom
 */

/* eslint-disable import-x/no-extraneous-dependencies */

import { fireEvent, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

import { installDomMeasurementMocks, renderWithProviders, TableHarness } from './testUtils'

import type { TableState } from '../tableTypes'

describe('TanStack Table v9 state bridge', () => {
  beforeEach(() => {
    installDomMeasurementMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  test('publishes complete state and resets pagination when global filtering changes', async () => {
    const handleStateChange = vi.fn<(state: TableState) => void>()

    renderWithProviders(
      <TableHarness
        data={[
          { id: '1', name: 'Alpha', age: 10 },
          { id: '2', name: 'Beta', age: 20 },
          { id: '3', name: 'Gamma', age: 30 },
        ]}
        handleStateChange={handleStateChange}
        initialState={{
          pagination: {
            pageIndex: 1,
            pageSize: 1,
          },
        }}
      />,
    )

    await waitFor(() => {
      expect(handleStateChange).toHaveBeenCalledWith(
        expect.objectContaining({
          pagination: { pageIndex: 1, pageSize: 1 },
          globalFilter: undefined,
          sorting: expect.any(Array),
        }),
      )
    })

    fireEvent.change(screen.getByPlaceholderText('Search'), { target: { value: 'Beta' } })

    await waitFor(() => {
      expect(handleStateChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          pagination: { pageIndex: 0, pageSize: 1 },
          globalFilter: 'Beta',
        }),
      )
    })
  })
})
