import { GameEntry } from '../client-graphql'

export type GameDecoratorParams = Record<string, unknown>
export type GameDecorator = { year: number; slot: number; game: GameEntry } & GameDecoratorParams

export type SlotDecoratorParams = Record<string, unknown>
export type SlotDecorator = { year: number; slot: number } & SlotDecoratorParams
