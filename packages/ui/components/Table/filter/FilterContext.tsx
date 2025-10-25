import { createContext, useContext } from 'react'

export type FilterContextInfo = {
  clear?: () => void
  preClear: () => void
  autoOpen: boolean
}

export const filterContext = createContext<FilterContextInfo | undefined>(undefined)

export const FilterContextProvider = filterContext.Provider

export const useFilterContext = () => useContext(filterContext)!
