declare module 'zet' {
  export default class Zet<T> extends Set<T> {
    static union<T>(...sets: Set<T>[]): Zet<T>

    static intersection<T>(...sets: Set<T>[]): Zet<T>

    static difference<T>(...sets: Set<T>[]): Zet<T>

    static symmetricDifference<T>(setA?: Zet<T>, setB?: Zet<T>): Zet<T>

    static subset<T>(setA: Set<T>, setB: Set<T>): boolean

    static superset<T>(setA: Set<T>, setB: Set<T>): boolean

    static map<T>(set: Set<T>, func: (value: T, index?: number, array?: T[]) => unknown): Zet<unknown>

    static filter<T>(set: Set<T>, func: (value: T, index?: number, array?: T[]) => unknown): Zet<T>

    static reduce<T>(
      set: Set<T>,
      func: (previousValue: T, currentValue: T, currentIndex: number, array: T[]) => any,
      initializer?: any
    ): T

    union(...sets: Set<T>[]): Zet<T>

    intersection(...sets: Set<T>[]): Zet<T>

    difference(...sets: Set<T>[]): Zet<T>

    symmetricDifference(other?: Zet<T>): Zet<T>

    subset(other: Set<T>): boolean

    superset(other: Set<T>): boolean

    map(func: (value: T, index?: number, array?: T[]) => unknown): Zet<unknown>

    filter(func: (value: T, index?: number, array?: T[]) => unknown): Zet<T>

    reduce(func: (previousValue: T, currentValue: T, currentIndex: number, array: T[]) => any, initializer?: any): T
  }
}
