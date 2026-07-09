import type { Row, RowData } from '@tanstack/react-table'

import { treeLineTypes } from './TreeLines'
import type { TreeLineType } from './TreeLines'

type GetRowById<TData extends RowData> = (rowId: string) => Row<TData> | undefined

const getCurrentParentRow = <TData extends RowData>(row: Row<TData> | undefined, getRowById?: GetRowById<TData>) =>
  row?.parentId ? (getRowById?.(row.parentId) ?? row.getParentRow()) : undefined

const isLastChild = <TData extends RowData>(row: Row<TData> | undefined, getRowById?: GetRowById<TData>) => {
  const siblings = getCurrentParentRow(row, getRowById)?.subRows
  return !!(row && siblings?.[siblings.length - 1]?.id === row.id)
}

const getExpansionDetailsImpl = <TData extends RowData>(
  parent: Row<TData> | undefined,
  lastChild: Row<TData>,
  child: Row<TData>,
  getRowById?: GetRowById<TData>,
): Array<TreeLineType> => {
  const isLast = isLastChild(child, getRowById)

  let details: TreeLineType
  if (getCurrentParentRow(child, getRowById) !== parent) {
    details = parent && !isLastChild(lastChild, getRowById) ? treeLineTypes.vertical : treeLineTypes.space
  } else if (child.getCanExpand()) {
    details = isLast ? treeLineTypes.lastExpansion : treeLineTypes.middleExpansion
  } else if (isLast) {
    details = treeLineTypes.lastCorner
  } else {
    details = treeLineTypes.middleCorner
  }

  const grandParent = getCurrentParentRow(parent, getRowById)
  const parentDetails = parent && grandParent ? getExpansionDetailsImpl(grandParent, parent, child, getRowById) : []
  return parentDetails.concat([details])
}

export const getExpansionDetails = <TData extends RowData>(
  enableExpanding: boolean,
  parent: Row<TData> | undefined,
  child: Row<TData>,
  getRowById?: GetRowById<TData>,
): Array<TreeLineType> => {
  if (!enableExpanding || !parent) return []

  return getExpansionDetailsImpl(parent, parent, child, getRowById)
}
