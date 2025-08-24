#!/usr/bin/env node_modules/.bin/tsx
/* eslint-disable @typescript-eslint/no-unused-vars */

import Table from 'cli-table3'
import { Command } from 'commander'

import { db as prisma } from '../db'

const renderTable = (data: Array<Record<string, any>>, limit?: number): string => {
  if (!data.length) return 'No data.'

  const headers = Object.keys(data[0])
  const table = new Table({ head: headers })

  let count = 0
  for (const row of data) {
    if (limit === undefined || count++ < limit) {
      // console.dir(row)
      table.push(
        headers.map((key) => {
          const val = row[key]
          if (typeof val === 'object' && val !== null) {
            return JSON.stringify(val, null, 2)
          }
          return val
        }),
      )
    }
  }

  return table.toString()
}

export const gameWithGmsAndRoom = {
  // id: true,
  // name: true,
  // gmNames: true,
  // description: true,
  // genre: true,
  // type: true,
  // setting: true,
  // charInstructions: true,
  // playerMax: true,
  // playerMin: true,
  // playerPreference: true,
  // returningPlayers: true,
  // playersContactGm: true,
  // gameContactEmail: true,
  // estimatedLength: true,
  // slotPreference: true,
  // lateStart: true,
  // lateFinish: true,
  // slotConflicts: true,
  // message: true,
  // slotId: true,
  // teenFriendly: true,
  // year: true,
  // full: true,
  // roomId: true,
  room: {
    select: {
      description: true,
    },
  },
  gameAssignment: {
    where: { gm: { lt: 0 } },
    select: {
      gameId: true,
      gm: true,
      memberId: true,
      year: true,
      membership: {
        select: {
          user: {
            select: {
              email: true,
              fullName: true,
            },
          },
        },
      },
    },
  },
}
const runQuery = async ({ limit }: { limit?: number }) => {
  // const result = await prisma.gameAssignment.findMany({
  //   where: {
  //     memberId: 1841,
  //     gm: { gte: 0 },
  //   },
  //   include: {
  //     game: {
  //       include: {
  //         gameAssignment: {
  //           where: { gm: { gte: 0 } },
  //           select: {
  //             gameId: true,
  //             gm: true,
  //             memberId: true,
  //             year: true,
  //             membership: {
  //               select: {
  //                 user: {
  //                   select: {
  //                     email: true,
  //                     fullName: true,
  //                   },
  //                 },
  //               },
  //             },
  //           },
  //         },
  //       },
  //     },
  //     // add other includes if needed
  //   },
  // })

  const result = await prisma.game.findMany({
    where: { authorId: 1 },
    include: gameWithGmsAndRoom,
  })
  // console.log(renderTable(result, limit))
  console.log(result)
}

const program = new Command().name('prisma-repl').description('Dump Prisma query results to the screen')

program.option('-l, --limit <number>', 'Number of lines to display', undefined).action(async (options) => {
  await runQuery({ limit: options.limit })
})

await program.parseAsync(process.argv).finally(() => prisma.$disconnect())
