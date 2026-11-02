import type { DateTime } from 'luxon'
import { slotDateTimePairsByCount } from '@amber/shared'
import { PDFDocument, type PDFFont, type PDFPage, StandardFonts } from 'pdf-lib'

import type { Context } from '../../context'
import type { ReportPdfData, ReportPdfInput } from '../../contracts/reports'
import { inRlsTransaction } from '../../inRlsTransaction'
import { getRuntimeSettingsTx } from '../runtimeSettings'

export type PlayerBySlotRow = {
  gameName: string
  memberName: string
  room: string | null
  slot: number
}

const pointsPerInch = 72
const pageWidth = 11 * pointsPerInch
const pageHeight = 8.5 * pointsPerInch
const pageMargin = 0.5 * pointsPerInch
const panelCount = 2
const panelGap = 0.3 * pointsPerInch
const panelWidth = (pageWidth - pageMargin * 2 - panelGap) / panelCount
const nameColumnWidth = 1.4 * pointsPerInch
const gameColumnWidth = 2.55 * pointsPerInch
const roomColumnWidth = panelWidth - nameColumnWidth - gameColumnWidth
const headerFontSize = 15
const rowFontSize = 8.5
const rowHeight = 13
const bodyTopOffset = 40
const bodyBottom = pageMargin
const ellipsis = '...'

const formatTime = (date: DateTime) => {
  const formatted = date.toFormat('h:mm a').replace(':00', '').replace(' ', '').toLowerCase()
  return formatted === '12am' ? 'midnight' : formatted
}

const formatSlotHeading = ({ number, start, end }: { end: DateTime; number: number; start: DateTime }) =>
  `Slot: ${number} ${start.toFormat('cccc, LLLL d, yyyy')} - ${formatTime(start)} to ${formatTime(end)}`

const fitText = ({ font, text, width }: { font: PDFFont; text: string; width: number }) => {
  if (font.widthOfTextAtSize(text, rowFontSize) <= width) {
    return text
  }

  let fitted = text
  while (fitted.length > 0 && font.widthOfTextAtSize(`${fitted}${ellipsis}`, rowFontSize) > width) {
    fitted = fitted.slice(0, -1)
  }
  return `${fitted.trimEnd()}${ellipsis}`
}

const drawPanel = ({
  font,
  page,
  rows,
  x,
}: {
  font: PDFFont
  page: PDFPage
  rows: Array<PlayerBySlotRow>
  x: number
}) => {
  const firstRowY = pageHeight - pageMargin - bodyTopOffset
  rows.forEach((row, rowIndex) => {
    const y = firstRowY - rowIndex * rowHeight
    page.drawText(fitText({ font, text: row.memberName, width: nameColumnWidth }), {
      font,
      size: rowFontSize,
      x,
      y,
    })
    page.drawText(fitText({ font, text: row.gameName, width: gameColumnWidth }), {
      font,
      size: rowFontSize,
      x: x + nameColumnWidth,
      y,
    })
    page.drawText(fitText({ font, text: row.room ?? 'N/A', width: roomColumnWidth }), {
      font,
      size: rowFontSize,
      x: x + nameColumnWidth + gameColumnWidth,
      y,
    })
  })
}

const rowsPerPanel = Math.floor((pageHeight - pageMargin - bodyTopOffset - bodyBottom) / rowHeight)

const drawSlotPages = ({
  font,
  heading,
  pdf,
  rows,
}: {
  font: PDFFont
  heading: string
  pdf: PDFDocument
  rows: Array<PlayerBySlotRow>
}) => {
  const rowsPerPage = rowsPerPanel * panelCount
  const pageCount = Math.max(1, Math.ceil(rows.length / rowsPerPage))

  for (let pageIndex = 0; pageIndex < pageCount; pageIndex += 1) {
    const page = pdf.addPage([pageWidth, pageHeight])
    const headingWidth = font.widthOfTextAtSize(heading, headerFontSize)
    page.drawText(heading, {
      font,
      size: headerFontSize,
      x: (pageWidth - headingWidth) / 2,
      y: pageHeight - pageMargin - headerFontSize,
    })

    for (let panelIndex = 0; panelIndex < panelCount; panelIndex += 1) {
      const start = pageIndex * rowsPerPage + panelIndex * rowsPerPanel
      drawPanel({
        font,
        page,
        rows: rows.slice(start, start + rowsPerPanel),
        x: pageMargin + panelIndex * (panelWidth + panelGap),
      })
    }
  }
}

export const renderPlayersBySlotPdf = async ({
  numberOfSlots,
  rows,
  start,
  virtual,
}: {
  numberOfSlots: number
  rows: Array<PlayerBySlotRow>
  start: DateTime
  virtual: boolean
}): Promise<Uint8Array> => {
  const pdf = await PDFDocument.create()
  const font = await pdf.embedFont(StandardFonts.TimesRoman)
  const slotTimes = slotDateTimePairsByCount(start, numberOfSlots, virtual)

  slotTimes.forEach(([slotStart, slotEnd], slotIndex) => {
    const slot = slotIndex + 1
    drawSlotPages({
      font,
      heading: formatSlotHeading({ end: slotEnd, number: slot, start: slotStart }),
      pdf,
      rows: rows.filter((row) => row.slot === slot),
    })
  })

  return pdf.save()
}

export const getPlayersBySlotPdfData = async (ctx: Context, input: ReportPdfInput): Promise<ReportPdfData> =>
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
          COALESCE(NULLIF(u.full_name, ''), u.display_name, u.email) AS "memberName",
          g.name AS "gameName",
          COALESCE(r.description, 'N/A') AS "room"
        FROM game_assignment ga
        JOIN membership m ON
          m.id = ga.member_id
          AND m.year = ${year}
          AND m.attending
        JOIN "user" u ON u.id = m.user_id
        JOIN game g ON
          g.id = ga.game_id
          AND g.year = ${year}
          AND g.category IN ('user', 'no_game')
          AND g.slot_id IS NOT NULL
        LEFT JOIN room r ON r.id = g.room_id
        WHERE ga.year = ${year} AND ga.gm >= 0
        ORDER BY g.slot_id, u.last_name, u.first_name, "memberName", g.name
      `,
    )) as Array<PlayerBySlotRow>

    const pdfBytes = await renderPlayersBySlotPdf({
      numberOfSlots: startDateConfig.slots,
      rows,
      start: startDateConfig.date,
      virtual: startDateConfig.virtual,
    })

    return {
      base64: Buffer.from(pdfBytes).toString('base64'),
      contentType: 'application/pdf',
      filenameLabel: 'players-by-slot',
    }
  })
