/* eslint-disable no-await-in-loop */
import { Command, Flags } from '@oclif/core'
import { PoolClient } from 'pg'
import alasql from 'alasql'

import { getPool, PoolType } from '../../shared/config'

const config = {
  '2017': {
    file: '/Users/ggp/Desktop/ACUSData/ACUS2017.xlsx',
    memberSheet: 'Members',
  },
}

const query = async (client: PoolClient, q: string) =>
  // console.log(`query = ${JSON.stringify(query?.replace(/\s+/g, ' '), null, 2)}`)
  client.query(q)

const esc = (q: string) => q?.replace(/'/g, "''")

const q = (s: string | null | undefined) => (s ? `'${esc(s)}'` : null)

export default class Import extends Command {
  static description = 'Import data from shared Excel spreadsheet.'

  static flags = {
    year: Flags.string({ char: 'y' }),
  }

  // eslint-disable-next-line class-methods-use-this
  async run() {
    const { flags, args } = await this.parse(Import)

    if (!flags.year) {
      throw new Error('a year is required')
    }
    // eslint-disable-next-line no-prototype-builtins
    if (!config.hasOwnProperty(flags.year)) {
      throw new Error(`Script not configured for year ${flags.year}`)
    }

    // @ts-ignore
    const conf = config[flags.year]

    const memberData = await alasql.promise(`select * from xlsx("${conf.file}", {sheetid: "${conf.memberSheet}"})`)
    console.log(memberData)
    const pool = await getPool(PoolType.ADMIN)

    const client: PoolClient = await pool.connect()

    // for (const drink of drinks) {
    //   await create(client, drink)
    // }

    client.release()
    console.log('Done')
    process.exit(0)
  }
}
