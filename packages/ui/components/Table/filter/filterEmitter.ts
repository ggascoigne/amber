export const emitter = new EventTarget()
export const CLEAR_FILTERS_MESSAGE = 'clearSearchAndAllFilters'

export const clearSearchAndAllFilters = () => emitter.dispatchEvent(new Event(CLEAR_FILTERS_MESSAGE))

export const CLEAR_SEARCH_MESSAGE = 'clearSearch'
export const clearSearch = () => emitter.dispatchEvent(new Event(CLEAR_SEARCH_MESSAGE))
