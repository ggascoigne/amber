import type { PropsWithChildren, RefObject } from 'react'
import { createContext, useContext } from 'react'

const TableScrollContainerContext = createContext<RefObject<HTMLDivElement | null> | null>(null)

type TableScrollContainerProviderProps = PropsWithChildren<{
  tableContainerRef: RefObject<HTMLDivElement | null>
}>

export const TableScrollContainerProvider = ({ children, tableContainerRef }: TableScrollContainerProviderProps) => (
  <TableScrollContainerContext.Provider value={tableContainerRef}>{children}</TableScrollContainerContext.Provider>
)

export const useTableScrollContainerRef = () => useContext(TableScrollContainerContext)
