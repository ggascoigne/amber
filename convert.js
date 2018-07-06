const readline = require('readline')
const fs = require('fs')
const _ = require('lodash')

const rl = readline.createInterface({
  input: fs.createReadStream('/Users/ggp/dev/git/hapi/dbtest/local_ggascoig_acnw_schema.10122017.1953.sql')
})

const out = fs.createWriteStream('/Users/ggp/dev/git/hapi/dbtest/db/migrations/20171014121205-create-schema.js')

out.write(
  `'use strict'

exports.up = function (knex) {
  return knex
    .schema
    .raw('SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0')
    .raw('SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0')
`)

let inTable = false
let fields = {}
let primary = null
let uniqueKey = {}
let lineNo = 0

rl.on('line', (line) => {
  lineNo += 1
  const table = line.match(/CREATE TABLE `(.*)` \(/i)
  if (table) {
    inTable = true
    fields = {}
    primary = null
    uniqueKey = {}
    out.write(`    .createTable('${table[1]}', function (table) {\n`)
    return
  }
  if (inTable) {
    const pKey = line.match(/PRIMARY KEY \(`(.*)`\)/)
    if (pKey) {
      primary = pKey[1]
      // console.log(`primary key = ${pKey[1]}`)
      return
    }

    const key = line.match(/^\s+KEY `(.*)` \(`(.*)`\)/)
    if (key) {
      fields[key[2]].key = key[1]
      // console.log(`key = ${key[1]} / ${key[2]}`)
      return
    }

    const unique = line.match(/^\s+UNIQUE KEY `(.*)` \(`(.*)`\)/)
    if (unique) {
      uniqueKey[unique[1]] = unique[2]
      // console.log(`${lineNo}: unique = ${unique[1]} / ${unique[2]}`)
      return
    }

    const fKconstraint = line.match(/CONSTRAINT `(.*)` FOREIGN KEY \(`(.*)`\) REFERENCES `(.*)` \(`(.*)`\)/)
    if (fKconstraint) {
      // console.log(`fk = ${fKconstraint[1]} / ${fKconstraint[2]} - ${fKconstraint[3]}:${fKconstraint[4]}`)
      fields[fKconstraint[2]].fk = { table: fKconstraint[3], column: fKconstraint[4] }
      return
    }

    const field = line.match(/`(.*)` ([a-zA-Z0-9(),]*) (.*)/)
    if (field) {
      fields[field[1]] = {
        name: field[1],
        type: field[2],
        rest: field[3]
      }
      return
    }
    const endTableMatch = line.match(/\) ENGINE/)
    if (endTableMatch) {
      inTable = false
      columns(fields, primary, uniqueKey)
      out.write('    })\n')
      return
    }
    console.log(`missed (${lineNo}: ${line}`)
  }
})

const typeFor = (type) => {
  const details = type.match(/([^(]*)(?:\((.*)\))?/)
  let fieldType = null
  let precision = details[2]

  switch (details[1]) {
    case 'bigint':
      fieldType = 'bigInteger'
      break
    case 'bit':
      fieldType = 'bit'
      break
    case 'varchar':
      fieldType = 'string'
      break
    case 'datetime':
      fieldType = 'dateTime'
      break
    case 'longblob':
      fieldType = 'specificType'
      precision = '\'longblob\''
      break
    case 'longtext':
      fieldType = 'text'
      precision = '\'longtext\''
      break
    case 'int':
      fieldType = 'integer'
      break
    case 'decimal':
      fieldType = 'double'
      break
    case 'tinyint':
      fieldType = 'tinyint'
      break
  }
  return {fieldType, precision}
}

const columns = (fields, primary, uniqueKey) => {
  _.forOwn(fields, (fieldInfo) => {
    let {fieldType, precision} = typeFor(fieldInfo.type)
    let precisionString = precision ? `, ${precision}` : ''
    let name = `'${fieldInfo.name}'`
    const isPrimary = fieldInfo.name === primary ? '.primary()' : ''
    let nullable = fieldInfo.rest.match(/NOT NULL/) ? '.notNullable()' : fieldInfo.rest.match(/DEFAULT NULL/) ? '.defaultTo(null)' : ''
    let unique = uniqueKey[fieldInfo.name] && uniqueKey[fieldInfo.name] === fieldInfo.name ? '.unique()' : ''
    let fk = fieldInfo.fk ? `.references('${fieldInfo.fk.table}.${fieldInfo.fk.column}').unsigned()`:''
    let key = fieldInfo.key ? '.index()' : ''
    if (/AUTO_INCREMENT/.test(fieldInfo.rest)) {
      if (fieldType === 'bigInteger') {
        fieldType = 'bigIncrements'
      } else if (fieldType === 'int') {
        fieldType = 'increments'
      }
      precisionString = ''
      nullable = ''
      if (/id/i.test(name)) {
        name = ''
      }
    }

    out.write(`      table.${fieldType}(${name}${precisionString})${isPrimary}${nullable}${unique}${fk}${key}\n`)
  })
  if (primary && /,/.test(primary)) {
    out.write(`      table.primary([\`${primary}\`])\n`)
  }
}

rl.on('close', () => {
  out.write(`    .raw('SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS')
    .raw('SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS')
}

exports.down = function (knex) {
  return knex
    .schema
    .raw('SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0')
    .dropTableIfExists('async_mail_attachment')
    .dropTableIfExists('async_mail_bcc')
    .dropTableIfExists('async_mail_cc')
    .dropTableIfExists('async_mail_header')
    .dropTableIfExists('async_mail_mess')
    .dropTableIfExists('async_mail_to')
    .dropTableIfExists('databasechangelog')
    .dropTableIfExists('databasechangeloglock')
    .dropTableIfExists('email_code')
    .dropTableIfExists('game_assignment')
    .dropTableIfExists('game_choice')
    .dropTableIfExists('game_submission')
    .dropTableIfExists('game')
    .dropTableIfExists('hotel_room')
    .dropTableIfExists('login_record')
    .dropTableIfExists('lookup_value')
    .dropTableIfExists('lookup')
    .dropTableIfExists('membership')
    .dropTableIfExists('profile')
    .dropTableIfExists('registration_code')
    .dropTableIfExists('role')
    .dropTableIfExists('room')
    .dropTableIfExists('setting')
    .dropTableIfExists('shirt_order_item')
    .dropTableIfExists('shirt_order')
    .dropTableIfExists('slot')
    .dropTableIfExists('user_role')
    .dropTableIfExists('user')
    .raw('SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS')
}
`)

  out.end()
})

out.on('finish', () => {
  console.log('wrote all data to file')
})
