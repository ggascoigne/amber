import type { Row } from '@tanstack/react-table'
import { describe, expect, it } from 'vitest'

import { getExpansionDetails } from './expansionDetails'
import { treeLineTypes } from './TreeLines'

type TestRowData = { id: string }

type TestRow = {
  depth: number
  getCanExpand: () => boolean
  getParentRow: () => TestRow | undefined
  id: string
  index: number
  parentId?: string
  subRows: Array<TestRow>
}

const updateChildDepths = (parent: TestRow) => {
  parent.subRows.forEach((child, index) => {
    Object.assign(child, {
      depth: parent.depth + 1,
      getParentRow: () => parent,
      index,
      parentId: parent.id,
    })
    updateChildDepths(child)
  })
}

const createRow = (
  id: string,
  {
    canExpand = false,
    children = [],
  }: {
    canExpand?: boolean
    children?: Array<TestRow>
  } = {},
): TestRow => {
  const row = {
    depth: 0,
    getCanExpand: () => canExpand,
    getParentRow: () => undefined,
    id,
    index: 0,
    subRows: children,
  }

  children.forEach((child, index) => {
    Object.assign(child, {
      depth: row.depth + 1,
      getParentRow: () => row,
      index,
      parentId: row.id,
    })
    updateChildDepths(child)
  })

  return row
}

const appendChildren = (parent: TestRow, children: Array<TestRow>) => {
  parent.subRows.push(...children)
  updateChildDepths(parent)
}

describe('getExpansionDetails', () => {
  it('returns no line details when expansion is disabled or the row has no parent', () => {
    const root = createRow('root')
    const child = createRow('child')
    appendChildren(root, [child])

    expect(getExpansionDetails(false, root as Row<TestRowData>, child as Row<TestRowData>)).toStrictEqual([])
    expect(getExpansionDetails(true, undefined, root as Row<TestRowData>)).toStrictEqual([])
  })

  it('marks middle and last leaf rows at the current depth', () => {
    const first = createRow('first')
    const last = createRow('last')
    const root = createRow('root', { children: [first, last] })

    expect(getExpansionDetails(true, root as Row<TestRowData>, first as Row<TestRowData>)).toStrictEqual([
      treeLineTypes.middleCorner,
    ])
    expect(getExpansionDetails(true, root as Row<TestRowData>, last as Row<TestRowData>)).toStrictEqual([
      treeLineTypes.lastCorner,
    ])
  })

  it('uses the current sibling order when rows have been sorted', () => {
    const originalFirst = createRow('originalFirst')
    const originalLast = createRow('originalLast')
    const root = createRow('root', { children: [originalFirst, originalLast] })
    const sortedRoot = {
      ...root,
      subRows: [originalLast, originalFirst],
    }

    const getRowById = (rowId: string) => (rowId === sortedRoot.id ? (sortedRoot as Row<TestRowData>) : undefined)

    expect(
      getExpansionDetails(true, sortedRoot as Row<TestRowData>, originalLast as Row<TestRowData>, getRowById),
    ).toStrictEqual([treeLineTypes.middleCorner])
    expect(
      getExpansionDetails(true, sortedRoot as Row<TestRowData>, originalFirst as Row<TestRowData>, getRowById),
    ).toStrictEqual([treeLineTypes.lastCorner])
  })

  it('marks expandable rows separately from leaf corner rows', () => {
    const expandableMiddle = createRow('expandableMiddle', { canExpand: true })
    const expandableLast = createRow('expandableLast', { canExpand: true })
    const root = createRow('root', { children: [expandableMiddle, expandableLast] })

    expect(getExpansionDetails(true, root as Row<TestRowData>, expandableMiddle as Row<TestRowData>)).toStrictEqual([
      treeLineTypes.middleExpansion,
    ])
    expect(getExpansionDetails(true, root as Row<TestRowData>, expandableLast as Row<TestRowData>)).toStrictEqual([
      treeLineTypes.lastExpansion,
    ])
  })

  it('continues ancestor rails when an ancestor has later siblings', () => {
    const grandchild = createRow('grandchild')
    const firstChild = createRow('firstChild', { canExpand: true, children: [grandchild] })
    const secondChild = createRow('secondChild')
    const otherRootChild = createRow('otherRootChild')
    const root = createRow('root', {
      children: [createRow('branch', { children: [firstChild, secondChild] }), otherRootChild],
    })
    const branch = root.subRows[0]

    expect(getExpansionDetails(true, firstChild as Row<TestRowData>, grandchild as Row<TestRowData>)).toStrictEqual([
      treeLineTypes.vertical,
      treeLineTypes.vertical,
      treeLineTypes.lastCorner,
    ])
    expect(getExpansionDetails(true, branch as Row<TestRowData>, secondChild as Row<TestRowData>)).toStrictEqual([
      treeLineTypes.vertical,
      treeLineTypes.lastCorner,
    ])
  })

  it('leaves ancestor slots empty when the ancestor branch is the last sibling', () => {
    const grandchild = createRow('grandchild')
    const parent = createRow('parent', { canExpand: true, children: [grandchild] })
    createRow('root', { children: [createRow('first'), parent] })

    expect(getExpansionDetails(true, parent as Row<TestRowData>, grandchild as Row<TestRowData>)).toStrictEqual([
      treeLineTypes.space,
      treeLineTypes.lastCorner,
    ])
  })
})
