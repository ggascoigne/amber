export const SetSubset = <T>(setA: Set<T>, setB: Set<T>) => Array.from(setA).every((x) => setB.has(x))

export const SetSuperset = <T>(setA: Set<T>, setB: Set<T>) => Array.from(setB).every((x) => setA.has(x))

export const SetFilter = <T>(set: Set<T>, func: (value: T, index?: number, array?: T[]) => unknown) =>
  new Set(Array.from(set).filter(func))

export const SetReduce = <T>(
  set: Set<T>,
  func: (previousValue: T, currentValue: T, currentIndex: number, array: T[]) => any,
  initializer?: any,
) => (initializer === undefined ? Array.from(set).reduce(func) : Array.from(set).reduce(func, initializer))

export const SetMap = <T>(set: Set<T>, func: (value: T, index?: number, array?: T[]) => unknown) =>
  new Set(Array.from(set).map(func))
