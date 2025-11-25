import { DateTime } from 'luxon'

import { anyUserUpdatePolicy, dropPolicies, enableRls } from '../utils/policyUtils.js'

/**
 * @param {{year: number, month: number, day: number}} param
 * @returns {DateTime}
 */
const pdxDate = ({ year, month, day }) => DateTime.fromObject({ year, month, day }, { zone: 'America/Los_Angeles' })

/**
 * @param {{year: number, month: number, day: number}} param
 * @returns {DateTime}
 */
const dtwDate = ({ year, month, day }) => DateTime.fromObject({ year, month, day }, { zone: 'America/Detroit' })

/**
 * @param {import('knex').Knex} knex
 * @param {Record<string,string>} strings
 * @param {Record<string,number>} numbers
 * @param {Record<string,DateTime>} dates
 * @param {Record<string,boolean>} booleans
 * @param {Record<string,{ date: DateTime, virtual: boolean, slots: number }>} startDates
 * @returns {Promise<void>}
 */
const saveConfig = async (knex, strings, numbers, dates, booleans, startDates) => {
  for await (const val of Object.keys(strings)) {
    await knex.raw(`
        INSERT INTO
          setting (code, type, value)
        VALUES
          ('config.${val}', 'string', '${strings[val] ?? ''}');
        `)
  }
  for await (const val of Object.keys(numbers)) {
    await knex.raw(`
        INSERT INTO
          setting (code, type, value)
        VALUES
          ('config.${val}', 'number', '${numbers[val] ?? ''}');
        `)
  }
  for await (const val of Object.keys(dates)) {
    await knex.raw(`
        INSERT INTO
          setting (code, type, value)
        VALUES
          ('config.${val}', 'date', '${dates[val] ?? ''}');
        `)
  }
  for await (const val of Object.keys(booleans)) {
    await knex.raw(`
        INSERT INTO
          setting (code, type, value)
        VALUES
          ('config.${val}', 'boolean', '${booleans[val] ?? ''}');
        `)
  }
  for await (const val of Object.keys(startDates)) {
    const startDate = startDates[val]
    // can't really be false, but also can't fix it in javascript
    if (startDate) {
      await knex.raw(`
        INSERT INTO
          setting (code, type, value)
        VALUES
          ('config.startDates.${val}.date', 'date', '${startDate.date ?? ''}');
        `)
      await knex.raw(`
        INSERT INTO
          setting (code, type, value)
        VALUES
          ('config.startDates.${val}.virtual', 'boolean', '${startDate.virtual ?? ''}');
        `)
      await knex.raw(`
        INSERT INTO
          setting (code, type, value)
        VALUES
          ('config.startDates.${val}.slots', 'number', '${startDates.slots ?? ''}');
        `)
    }
  }
}

/**
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
export async function up(knex) {
  if (process.env.DB_ENV === 'acnw') {
    const startDates = {
      2012: {
        date: pdxDate({ year: 2012, month: 11, day: 8 }),
        virtual: false,
        slots: 7,
      },
      2013: {
        date: pdxDate({ year: 2013, month: 11, day: 7 }),
        virtual: false,
        slots: 7,
      },
      2014: {
        date: pdxDate({ year: 2014, month: 11, day: 6 }),
        virtual: false,
        slots: 7,
      },
      2015: {
        date: pdxDate({ year: 2015, month: 11, day: 12 }),
        virtual: false,
        slots: 7,
      },
      2016: {
        date: pdxDate({ year: 2016, month: 11, day: 3 }),
        virtual: false,
        slots: 7,
      },
      2017: {
        date: pdxDate({ year: 2017, month: 11, day: 2 }),
        virtual: false,
        slots: 7,
      },
      2018: {
        date: pdxDate({ year: 2018, month: 11, day: 1 }),
        virtual: false,
        slots: 7,
      },
      2019: {
        date: pdxDate({ year: 2019, month: 10, day: 31 }),
        virtual: false,
        slots: 7,
      },
      2020: {
        date: pdxDate({ year: 2020, month: 11, day: 5 }),
        virtual: true,
        slots: 7,
      },
      2021: {
        date: pdxDate({ year: 2021, month: 11, day: 4 }),
        virtual: true,
        slots: 7,
      },
      2022: {
        date: pdxDate({ year: 2022, month: 11, day: 3 }),
        virtual: false,
        slots: 7,
      },
    }

    const THIS_YEAR = 2022

    const conventionStartDate = startDates[THIS_YEAR].date

    const strings = {
      title: 'Ambercon NW',
      name: 'ACNW',
      abbr: 'acnw',
      contactEmail: 'acnw@wyrdrune.com',
      gameEmail: 'game@wyrdrune.com',
      webEmail: 'guy@wyrdrune.com',
      baseTimeZone: 'America/Los_Angeles',
      oregonHotelTax: '13.95%',
      virtualCost: '',
      moreThanDoubleOccupancySurcharge: '$15',
      gameRoomCredit: '$120',
    }

    const numbers = {
      year: THIS_YEAR,
      firstDataYear: 2012,
      startYear: 1997,
      fourDayMembership: 220,
      fourDayVoucher: 70,
      threeDayMembership: 170,
      threeDayVoucher: 50,
      subsidizedMembership: 150,
      subsidizedMembershipShort: 120,
      deposit: 50,
      numberOfSlots: startDates[THIS_YEAR].slots,
    }

    const dates = {
      conventionStartDate,
      conventionEndDate: conventionStartDate.plus({ days: 3 }),
      mondayBeforeCon: conventionStartDate.minus({ days: 3 }),
      wednesdayAfterCon: conventionStartDate.plus({ days: 6 }),

      registrationOpen: pdxDate({ year: THIS_YEAR, month: 7, day: 15 }),
      registrationDeadline: pdxDate({ year: THIS_YEAR, month: 9, day: 2 }),
      paymentDeadline: pdxDate({ year: THIS_YEAR, month: 8, day: 12 }),
      gameSubmissionDeadline: pdxDate({ year: THIS_YEAR, month: 8, day: 15 }),
      gameGmPreview: pdxDate({ year: THIS_YEAR, month: 9, day: 2 }),
      gameGmFeedbackDeadline: pdxDate({ year: THIS_YEAR, month: 9, day: 23 }),
      gameBookOpen: pdxDate({ year: THIS_YEAR, month: 9, day: 5 }),
      gameChoicesDue: pdxDate({ year: THIS_YEAR, month: 9, day: 25 }),
      gmPreview: pdxDate({ year: THIS_YEAR, month: 9, day: 28 }),
      schedulesSent: pdxDate({ year: THIS_YEAR, month: 9, day: 30 }),
      lastCancellationFullRefund: pdxDate({
        year: THIS_YEAR,
        month: 10,
        day: 19,
      }),
      travelCoordination: pdxDate({ year: THIS_YEAR, month: 10, day: 19 }),
    }

    const booleans = {
      virtual: startDates[THIS_YEAR].virtual,
      useUsAttendanceOptions: false,
    }

    await saveConfig(knex, strings, numbers, dates, booleans, startDates)

    await knex.raw(dropPolicies('setting'))
    await knex.raw(anyUserUpdatePolicy('setting'))
    await knex.raw(enableRls('setting'))
  }

  if (process.env.DB_ENV === 'acus') {
    const startDates = {
      2017: {
        date: dtwDate({ year: 2017, month: 4, day: 6 }),
        virtual: false,
        slots: 8,
      },
      2018: {
        date: dtwDate({ year: 2018, month: 3, day: 22 }),
        virtual: false,
        slots: 8,
      },
      2019: {
        date: dtwDate({ year: 2019, month: 4, day: 11 }),
        virtual: false,
        slots: 8,
      },
      2020: {
        date: dtwDate({ year: 2020, month: 4, day: 2 }),
        virtual: true,
        slots: 8,
      },
      2021: {
        date: dtwDate({ year: 2021, month: 3, day: 25 }),
        virtual: true,
        slots: 8,
      },
      2022: {
        date: dtwDate({ year: 2022, month: 4, day: 7 }),
        virtual: true,
        slots: 8,
      },
      2023: {
        date: dtwDate({ year: 2023, month: 3, day: 16 }),
        virtual: false,
        slots: 8,
      },
    }

    const THIS_YEAR = 2023

    const conventionStartDate = startDates[THIS_YEAR].date

    const strings = {
      title: 'Ambercon US',
      name: 'Ambercon',
      abbr: 'acus',
      contactEmail: 'organizer@ambercon.com',
      gameEmail: 'games@ambercon.com',
      webEmail: 'guy@wyrdrune.com',
      baseTimeZone: 'America/Detroit',
      oregonHotelTax: '13.95%',
      virtualCost: '',
      moreThanDoubleOccupancySurcharge: '$15',
      gameRoomCredit: '$120',
    }

    const numbers = {
      year: THIS_YEAR,
      firstDataYear: 2017,
      startYear: 1991,
      fourDayMembership: 220,
      fourDayVoucher: 70,
      threeDayMembership: 170,
      threeDayVoucher: 50,
      subsidizedMembership: 150,
      subsidizedMembershipShort: 120,
      deposit: 50,
      numberOfSlots: startDates[THIS_YEAR].slots,
    }

    const dates = {
      conventionStartDate,
      conventionEndDate: conventionStartDate.plus({ days: 3 }),
      mondayBeforeCon: conventionStartDate.minus({ days: 3 }),
      wednesdayAfterCon: conventionStartDate.plus({ days: 6 }),

      registrationOpen: dtwDate({ year: THIS_YEAR, month: 1, day: 1 }),
      registrationDeadline: dtwDate({ year: THIS_YEAR, month: 2, day: 15 }),
      paymentDeadline: dtwDate({ year: THIS_YEAR, month: 2, day: 15 }),
      gameSubmissionDeadline: dtwDate({ year: THIS_YEAR, month: 1, day: 27 }),
      gameGmPreview: dtwDate({ year: THIS_YEAR, month: 2, day: 6 }),
      gameGmFeedbackDeadline: dtwDate({ year: THIS_YEAR, month: 2, day: 12 }),
      gameBookOpen: dtwDate({ year: THIS_YEAR, month: 2, day: 13 }),
      gameChoicesDue: dtwDate({ year: THIS_YEAR, month: 2, day: 20 }),
      gmPreview: dtwDate({ year: THIS_YEAR, month: 2, day: 24 }),
      schedulesSent: dtwDate({ year: THIS_YEAR, month: 2, day: 26 }),
      lastCancellationFullRefund: dtwDate({
        year: THIS_YEAR,
        month: 2,
        day: 28,
      }),
      travelCoordination: dtwDate({ year: THIS_YEAR, month: 10, day: 19 }),
    }

    const booleans = {
      virtual: startDates[THIS_YEAR].virtual,
      useUsAttendanceOptions: true,
    }

    // somehow this sequence has become broken, this repairs it
    await knex.raw(`SELECT setval('public.setting_id_seq', (SELECT MAX(id) FROM setting) + 1);`)

    await saveConfig(knex, strings, numbers, dates, booleans, startDates)

    await knex.raw(dropPolicies('setting'))
    await knex.raw(anyUserUpdatePolicy('setting'))
    await knex.raw(enableRls('setting'))
  }
}

/**
 * @param {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
export async function down(knex) {
  // No down migration
}
