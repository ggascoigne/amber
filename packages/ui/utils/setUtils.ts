export const SetSubset = <T>(setA: Set<T>, setB: Set<T>) => {
  return Array.from(setA).every((x) => setB.has(x))
}

export const SetSuperset = <T>(setA: Set<T>, setB: Set<T>) => {
  return Array.from(setB).every((x) => setA.has(x))
}

export const SetFilter = <T>(set: Set<T>, func: (value: T, index?: number, array?: T[]) => unknown) => {
  return new Set(Array.from(set).filter(func))
}

export const SetReduce = <T>(
  set: Set<T>,
  func: (previousValue: T, currentValue: T, currentIndex: number, array: T[]) => any,
  initializer?: any,
) => {
  if (initializer === undefined) return Array.from(set).reduce(func)
  return Array.from(set).reduce(func, initializer)
}

export const SetMap = <T>(set: Set<T>, func: (value: T, index?: number, array?: T[]) => unknown) => {
  return new Set(Array.from(set).map(func))
}
