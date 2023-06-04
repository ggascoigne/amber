export const updateArray = <T, K extends keyof T>(array: T[], idField: K, newValue: T) => {
  const index = array.findIndex((item) => item[idField] === newValue[idField])
  if (index !== -1) {
    // Entry exists in the array, update the value
    return array.map((item, i) => {
      if (i === index) {
        return newValue
      }
      return item
    })
  }

  // Entry doesn't exist, add a new entry
  return [...array, newValue]
}

export const deleteArrayEntry = <T, K extends keyof T>(array: T[], idField: K, idValue: T[K]): T[] => {
  const index = array.findIndex((item) => item[idField] === idValue)
  if (index !== -1) {
    return [...array.slice(0, index), ...array.slice(index + 1)]
  }
  return array
}
