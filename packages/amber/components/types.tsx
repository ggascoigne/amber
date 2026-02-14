import type { Game } from '@amber/client'

export type GameDecoratorParams = Record<string, unknown>
export type GameDecorator = {
  year: number
  slot: number
  game: Game
} & GameDecoratorParams

export type SlotDecoratorParams = Record<string, unknown>
export type SlotDecorator = {
  year: number
  slot: number
} & SlotDecoratorParams
