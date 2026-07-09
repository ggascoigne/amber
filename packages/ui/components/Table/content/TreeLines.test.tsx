/**
 * @vitest-environment jsdom
 */

/* eslint-disable import-x/no-extraneous-dependencies */

import { CssBaseline, ThemeProvider } from '@mui/material'
import type { Row } from '@tanstack/react-table'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { TreeLines, treeLineTypes } from './TreeLines'

import { theme } from '../../Theme'

type TestRowData = { id: string }

const renderTreeLines = ({
  expansionDetails,
  onToggle = vi.fn(),
}: {
  expansionDetails: Array<(typeof treeLineTypes)[keyof typeof treeLineTypes]>
  onToggle?: () => void
}) => {
  const row = {
    getCanExpand: () => true,
    getIsExpanded: () => false,
    toggleExpanded: onToggle,
  } as unknown as Row<TestRowData>

  return {
    onToggle,
    ...render(
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <TreeLines row={row} expansionDetails={expansionDetails} />
      </ThemeProvider>,
    ),
  }
}

afterEach(() => {
  cleanup()
})

describe('TreeLines', () => {
  it('renders multiple ancestor slots as one rail', () => {
    const { container } = renderTreeLines({
      expansionDetails: [treeLineTypes.vertical, treeLineTypes.middleCorner, treeLineTypes.lastCorner],
    })

    const rail = screen.getByTestId('TreeLineRail')
    expect(rail).toHaveAttribute('data-tree-line-segments', '|+-')
    expect(screen.getAllByTestId('TreeLineRail')).toHaveLength(1)
    expect(screen.getByTestId('TreeLineSvg')).toBeInTheDocument()
    expect(container.querySelectorAll('path')).toHaveLength(5)
    expect(container.querySelector('path')).toHaveAttribute('stroke', 'var(--table-tree-line-color)')
    expect(
      Array.from(screen.getByTestId('TreeLineSvg').querySelectorAll('path')).map((path) => path.getAttribute('d')),
    ).toStrictEqual(['M 16 0 V 100', 'M 48 0 V 100', 'M 48 50 H 57.6', 'M 80 0 V 50', 'M 80 50 H 89.6'])
  })

  it('does not render a rail for root rows without expansion details', () => {
    renderTreeLines({ expansionDetails: [] })

    expect(screen.queryByTestId('TreeLineRail')).not.toBeInTheDocument()
  })

  it('keeps expandable row toggling on the expansion button', () => {
    const onToggle = vi.fn()
    renderTreeLines({
      expansionDetails: [treeLineTypes.vertical, treeLineTypes.middleExpansion],
      onToggle,
    })

    fireEvent.click(screen.getByRole('button', { name: 'Expand row' }))
    expect(onToggle).toHaveBeenCalledTimes(1)
  })

  it('leaves the expansion-button-sized gap in middle expansion rails', () => {
    renderTreeLines({
      expansionDetails: [treeLineTypes.vertical, treeLineTypes.middleExpansion],
    })

    expect(
      Array.from(screen.getByTestId('TreeLineSvg').querySelectorAll('path')).map((path) => path.getAttribute('d')),
    ).toStrictEqual(['M 16 0 V 100', 'M 48 0 V 22.5', 'M 48 76.5 V 100'])
  })
})
