import type { ReactNode, Dispatch, SetStateAction } from 'react'
import { createContext, useContext, useState } from 'react'

import { SharedTooltip } from './SharedTooltip'

export type TableContextInfo = {
  tableIndex: number
  debugIsOpen: boolean
  trace: boolean
}

type TableContextType = [TableContextInfo, Dispatch<SetStateAction<TableContextInfo>>] | undefined

const tableContext = createContext<TableContextType>(undefined)

const InternalTableContextProvider = tableContext.Provider

export const useTableContext = () => useContext(tableContext)!

export const getTooltipId = (index: number) => `table-tooltip-${index}`

export const WrappedSharedToolTip = () => {
  const [{ tableIndex }] = useTableContext()
  const id = getTooltipId(tableIndex)
  return <SharedTooltip id={id} />
}

// create a number that can be used to uniquely identify each table scope
// mostly here to facilitate linking cells and the shared tooltip object
let tableId = 0

type TooltipProviderProps = {
  trace?: boolean
  children: ReactNode
}

export const TableContextProvider = ({ trace = false, children }: TooltipProviderProps) => {
  const contextState = useState<TableContextInfo>(() => ({
    tableIndex: tableId++,
    debugIsOpen: false,
    trace,
  }))
  return (
    <InternalTableContextProvider value={contextState}>
      <WrappedSharedToolTip />
      {children}
    </InternalTableContextProvider>
  )
}
