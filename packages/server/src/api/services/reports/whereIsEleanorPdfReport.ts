import type { DateTime } from 'luxon'
import { slotDateTimePairsByCount } from '@amber/shared'
import { PDFDocument, type PDFFont, type PDFPage, StandardFonts } from 'pdf-lib'

import type { Context } from '../../context'
import type { ReportPdfData, ReportPdfInput } from '../../contracts/reports'
import { inRlsTransaction } from '../../inRlsTransaction'
import { getRuntimeSettingsTx } from '../runtimeSettings'

export type WhereIsEleanorRow = {
  gameName: string | null
  room: string | null
  slot: number
}

export type EleanorScheduleEntry = {
  gameName: string
  room: string
  slot: number
}

const pointsPerInch = 72
const pageWidth = 11 * pointsPerInch
const pageHeight = 8.5 * pointsPerInch
const pageMargin = 0.75 * pointsPerInch
const title = 'Where is Eleanor?'
const titleFontSize = 16
const slotFontSize = 12
const detailsFontSize = 10
const slotBlockHeight = 39
const detailsIndent = 10
const roomLeft = 6.25 * pointsPerInch

const formatTime = (date: DateTime) => {
  const formatted = date.toFormat('h:mm a').replace(':00', '').replace(' ', '').toLowerCase()
  return formatted === '12am' ? 'midnight' : formatted
}

const formatSlotHeading = ({ end, slot, start }: { end: DateTime; slot: number; start: DateTime }) =>
  `Slot: ${slot} ${start.toFormat('cccc, LLLL d, yyyy')} - ${formatTime(start)} to ${formatTime(end)}`

export const groupWhereIsEleanorRows = ({
  numberOfSlots,
  rows,
}: {
  numberOfSlots: number
  rows: Array<WhereIsEleanorRow>
}): Array<EleanorScheduleEntry> => {
  const assignmentsBySlot = new Map(rows.map((row) => [row.slot, row]))

  return Array.from({ length: numberOfSlots }, (_, index) => {
    const slot = index + 1
    const assignment = assignmentsBySlot.get(slot)
    return {
      gameName: assignment?.gameName ?? '',
      room: assignment?.room ?? '',
      slot,
    }
  })
}

const drawScheduleEntry = ({
  boldFont,
  entry,
  font,
  page,
  slotEnd,
  slotStart,
  y,
}: {
  boldFont: PDFFont
  entry: EleanorScheduleEntry
  font: PDFFont
  page: PDFPage
  slotEnd: DateTime
  slotStart: DateTime
  y: number
}) => {
  page.drawText(formatSlotHeading({ end: slotEnd, slot: entry.slot, start: slotStart }), {
    font: boldFont,
    size: slotFontSize,
    x: pageMargin,
    y,
  })

  if (entry.gameName) {
    page.drawText(entry.gameName, {
      font,
      size: detailsFontSize,
      x: pageMargin + detailsIndent,
      y: y - 21,
    })
  }
  if (entry.room) {
    page.drawText(entry.room, {
      font: boldFont,
      size: detailsFontSize,
      x: roomLeft,
      y: y - 21,
    })
  }
}

export const renderWhereIsEleanorPdf = async ({
  entries,
  start,
  virtual,
}: {
  entries: Array<EleanorScheduleEntry>
  start: DateTime
  virtual: boolean
}): Promise<Uint8Array> => {
  const pdf = await PDFDocument.create()
  const font = await pdf.embedFont(StandardFonts.TimesRoman)
  const boldFont = await pdf.embedFont(StandardFonts.TimesRomanBold)
  const page = pdf.addPage([pageWidth, pageHeight])

  page.drawText(title, { font: boldFont, size: titleFontSize, x: pageMargin, y: pageHeight - pageMargin })

  const slotTimes = slotDateTimePairsByCount(start, entries.length, virtual)
  entries.forEach((entry, index) => {
    const [slotStart, slotEnd] = slotTimes[index]!
    drawScheduleEntry({
      boldFont,
      entry,
      font,
      page,
      slotEnd,
      slotStart,
      y: pageHeight - pageMargin - 42 - index * slotBlockHeight,
    })
  })

  return pdf.save()
}

export const getWhereIsEleanorPdfData = async (ctx: Context, input: ReportPdfInput): Promise<ReportPdfData> =>
  inRlsTransaction(ctx, async (tx) => {
    const settings = await getRuntimeSettingsTx(tx)
    const year = input.year ?? settings.year
    const startDateConfig = settings.startDates[year]
    if (!startDateConfig) {
      throw new Error(`No convention dates found for ${year}`)
    }

    const rows = (await tx.$queryRawUnsafe(
      `
        SELECT
          g.slot_id AS "slot",
          g.name AS "gameName",
          COALESCE(gra_rooms.description, game_room.description, '') AS "room"
        FROM membership m
        JOIN "user" u ON u.id = m.user_id AND u.full_name = 'Eleanor Todd'
        LEFT JOIN game_assignment ga ON ga.member_id = m.id AND ga.year = ${year} AND ga.gm >= 0
        LEFT JOIN game g ON g.id = ga.game_id AND g.year = ${year} AND g.category = 'user'
        LEFT JOIN LATERAL (
          SELECT STRING_AGG(DISTINCT r.description, ', ' ORDER BY r.description) AS description
          FROM game_room_assignment gra
          JOIN room r ON r.id = gra.room_id
          WHERE gra.game_id = g.id AND gra.slot_id = g.slot_id AND gra.year = g.year
        ) gra_rooms ON TRUE
        LEFT JOIN room game_room ON game_room.id = g.room_id
        WHERE m.year = ${year} AND m.attending
        ORDER BY g.slot_id, g.name
      `,
    )) as Array<WhereIsEleanorRow>

    if (rows.length === 0) {
      throw new Error(`No attending membership found for Eleanor Todd in ${year}`)
    }

    const entries = groupWhereIsEleanorRows({ numberOfSlots: startDateConfig.slots, rows })
    const pdfBytes = await renderWhereIsEleanorPdf({
      entries,
      start: startDateConfig.date,
      virtual: startDateConfig.virtual,
    })
    return {
      base64: Buffer.from(pdfBytes).toString('base64'),
      contentType: 'application/pdf',
      filenameLabel: 'where-is-eleanor',
    }
  })
