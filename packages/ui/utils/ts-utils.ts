import { ReactElement, ReactNode, forwardRef } from 'react'

import { O, F } from 'ts-toolbelt'
import { Key } from 'ts-toolbelt/out/Any/Key'
import { List } from 'ts-toolbelt/out/List/List'

export type Maybe<T> = T | null

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
export type Merge<M, N> = Omit<M, Extract<keyof M, keyof N>> & N

// from https://stackoverflow.com/questions/57683303/how-can-i-see-the-full-expanded-contract-of-a-typescript-type
// expands object types one level deep

export type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never

// from https://twitter.com/mattpocockuk/status/1622730173446557697
export type Prettify<T> = { [K in keyof T]: T[K] } & {}

type SelfProp<T extends string> = { [U in T]: U }

// export convert a string array [ 'a', 'b', 'c' ] to a correctly typed object { a: 'a', b: 'b', c: 'c' }
export const asEnumLike = <T extends readonly string[]>(v: F.Narrow<T>) =>
  Object.fromEntries(v.map((k) => [k, k])) as Expand<SelfProp<T[number]>>

// expands object types recursively
export type ExpandRecursively<T> =
  T extends Record<string, unknown> ? (T extends infer O ? { [K in keyof O]: ExpandRecursively<O[K]> } : never) : T

// Cool trick
// eslint-disable-next-line @typescript-eslint/naming-convention
type _<T> = T
export type FlattenTypes<T> = _<{ [k in keyof T]: T[k] }>

export type MaybeNodes<T> = Array<Maybe<T>> | undefined

export type Nodes<T> = Array<Maybe<T>>

export type Edges<T> = Array<{ node: Maybe<T> }>

export type ThenArg<T> = T extends PromiseLike<infer U> ? U : T

export function keys<O extends Record<string, unknown>>(obj: O): Array<keyof O> {
  return Object.keys(obj) as Array<keyof O>
}

export function entries<T extends Record<PropertyKey, unknown>, K extends keyof T, V extends T[K]>(o: T) {
  return Object.entries(o) as [K, V][]
}

export function values<T extends Record<PropertyKey, unknown>, K extends keyof T, V extends T[K]>(o: T) {
  return Object.values(o) as V[]
}

// extract the type from an array
export type UnpackArray<T> = T extends (infer U)[] ? U : T

// extract the type of an object property
export type PropType<TObj, TProp extends keyof TObj> = TObj[TProp]

// typesafe filter to use in .filter(notEmpty) dropping nulls in a type safe manner
export function notEmpty<T>(value: T): value is NonNullable<T> {
  return value !== null && value !== undefined
}

type NonEmptyArray<T> = readonly [T, ...ReadonlyArray<T>]

export const isNonEmpty = <T>(array: ReadonlyArray<T> | undefined): array is NonEmptyArray<T> =>
  !!array && array.length > 0

export type ContentsOf<T, K extends keyof T> = NonNullable<UnpackArray<T[K]>>

// https://realfiction.net/2019/02/03/typescript-type-shenanigans-2-specify-at-least-one-property
export type RequireOnlyOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Record<Exclude<Keys, K>, undefined>>
  }[Keys]

// https://stackoverflow.com/questions/48230773/how-to-create-a-partial-like-that-requires-a-single-property-to-be-set
export type AtLeastOne<T, U = { [K in keyof T]: Pick<T, K> }> = Partial<T> & U[keyof U]

export type GqlType<T, V extends List<Key>> = NonNullable<O.Path<T, V>>

export type ToFormValuesGql<T extends { __typename: string; id?: number; nodeId?: string }> = Omit<
  T,
  'nodeId' | 'id' | '__typename'
> &
  Partial<Pick<T, 'nodeId' | 'id'>>

export type ToFormValues<T extends { id?: number }> = Omit<T, 'id'> & Partial<Pick<T, 'id'>>

// There are a lot of places where the obvious change would be to reference Record<string,unknown> but we pass objects
// defined by interface rather than by type in a lot of places (in generated code that's tricky to change) When you do
// that, you get tsc errors about Index Signatures missing. This is an issue with TypeScript interfaces in general: a
// specific interface cannot be saved into a more generic interface. However, a specific type can be saved into a more
// generic type.  Using the ObjectOf construct enforces the object extension without falling into this trap.

export type ObjectOf<T> = { [P in keyof T]: T[P] }

export interface Children {
  children?: ReactElement<any, any> | ReactNode | undefined | null
}

// see https://twitter.com/mattpocockuk/status/1683414495291486208
// declare a type that works with generic components
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type FixedForwardRef = <T, P = {}>(
  render: (props: P, ref: React.Ref<T>) => React.ReactNode,
) => (props: P & React.RefAttributes<T>) => React.ReactNode

// Cast the old forwardRef to the new one
export const fixedForwardRef = forwardRef as FixedForwardRef

export const isFulfilled = <T>(value: PromiseSettledResult<T>): value is PromiseFulfilledResult<T> =>
  value.status === 'fulfilled'

export const isRejected = <T>(value: PromiseSettledResult<T>): value is PromiseRejectedResult =>
  value.status === 'rejected'
