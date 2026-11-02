import { PDFDocument, type PDFFont, type PDFPage, StandardFonts } from 'pdf-lib'

import type { Context } from '../../context'
import type { ReportPdfData, ReportPdfInput } from '../../contracts/reports'
import { inRlsTransaction } from '../../inRlsTransaction'
import { getRuntimeSettingsTx } from '../runtimeSettings'

export type ScheduleByPlayerRow = {
  gameName: string | null
  memberId: number
  memberName: string
  room: string | null
  slot: number | null
}

export type PlayerSchedule = {
  assignments: Array<{ gameName: string; room: string; slot: number }>
  memberName: string
}

const pointsPerInch = 72
const pageWidth = 8.5 * pointsPerInch
const pageHeight = 11 * pointsPerInch
const pageMargin = 0.75 * pointsPerInch
const pageTitle = 'Who is doing what and where'
const titleFontSize = 14
const memberFontSize = 11
const rowFontSize = 8
const rowHeight = 14
const memberHeaderHeight = 23
const memberBlockGap = 8
const columns = 2
const columnGap = 0.35 * pointsPerInch
const columnWidth = (pageWidth - pageMargin * 2 - columnGap) / columns
const slotColumnWidth = 14
const roomColumnWidth = 70
const columnInnerGap = 4
const ellipsis = '...'
const membersPerColumn = 5
const membersPerPage = membersPerColumn * columns

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

export const groupScheduleByPlayerRows = ({
  numberOfSlots,
  rows,
}: {
  numberOfSlots: number
  rows: Array<ScheduleByPlayerRow>
}): Array<PlayerSchedule> => {
  const schedules: Array<PlayerSchedule> = []
  let currentMemberId: number | null = null
  let currentSchedule: PlayerSchedule | null = null

  rows.forEach((row) => {
    if (row.memberId !== currentMemberId || !currentSchedule) {
      currentMemberId = row.memberId
      currentSchedule = { assignments: [], memberName: row.memberName }
      schedules.push(currentSchedule)
    }

    if (row.slot && row.gameName) {
      currentSchedule.assignments.push({ gameName: row.gameName, room: row.room ?? '', slot: row.slot })
    }
  })

  return schedules.map((schedule) => {
    const assignmentBySlot = new Map(schedule.assignments.map((assignment) => [assignment.slot, assignment]))
    return {
      ...schedule,
      assignments: Array.from({ length: numberOfSlots }, (_, index) => {
        const slot = index + 1
        return assignmentBySlot.get(slot) ?? { gameName: '', room: '', slot }
      }),
    }
  })
}

const drawPlayerSchedule = ({
  boldFont,
  font,
  page,
  schedule,
  x,
  y,
}: {
  boldFont: PDFFont
  font: PDFFont
  page: PDFPage
  schedule: PlayerSchedule
  x: number
  y: number
}) => {
  const roomRight = x + columnWidth
  const roomLeft = roomRight - roomColumnWidth
  const gameLeft = x + slotColumnWidth + columnInnerGap
  const gameWidth = roomLeft - gameLeft - columnInnerGap

  page.drawText(schedule.memberName, { font: boldFont, size: memberFontSize, x, y })
  schedule.assignments.forEach((assignment, index) => {
    const rowY = y - memberHeaderHeight - index * rowHeight
    page.drawText(String(assignment.slot), { font, size: rowFontSize, x, y: rowY })
    page.drawText(fitText({ font, text: assignment.gameName, width: gameWidth }), {
      font,
      size: rowFontSize,
      x: gameLeft,
      y: rowY,
    })
    const roomText = fitText({ font, text: assignment.room, width: roomColumnWidth })
    page.drawText(roomText, {
      font,
      size: rowFontSize,
      x: roomRight - font.widthOfTextAtSize(roomText, rowFontSize),
      y: rowY,
    })
  })
}

export const renderScheduleByPlayerPdf = async ({
  numberOfSlots,
  schedules,
}: {
  numberOfSlots: number
  schedules: Array<PlayerSchedule>
}): Promise<Uint8Array> => {
  const pdf = await PDFDocument.create()
  const font = await pdf.embedFont(StandardFonts.TimesRoman)
  const boldFont = await pdf.embedFont(StandardFonts.TimesRomanBold)
  const pageCount = Math.max(1, Math.ceil(schedules.length / membersPerPage))
  const blockHeight = memberHeaderHeight + numberOfSlots * rowHeight + memberBlockGap

  for (let pageIndex = 0; pageIndex < pageCount; pageIndex += 1) {
    const page = pdf.addPage([pageWidth, pageHeight])
    const titleWidth = boldFont.widthOfTextAtSize(pageTitle, titleFontSize)
    page.drawText(pageTitle, {
      font: boldFont,
      size: titleFontSize,
      x: (pageWidth - titleWidth) / 2,
      y: pageHeight - pageMargin,
    })

    const pageSchedules = schedules.slice(pageIndex * membersPerPage, (pageIndex + 1) * membersPerPage)
    pageSchedules.forEach((schedule, scheduleIndex) => {
      const column = Math.floor(scheduleIndex / membersPerColumn)
      const row = scheduleIndex % membersPerColumn
      drawPlayerSchedule({
        boldFont,
        font,
        page,
        schedule,
        x: pageMargin + column * (columnWidth + columnGap),
        y: pageHeight - pageMargin - 36 - row * blockHeight,
      })
    })
  }

  return pdf.save()
}

export const getScheduleByPlayerPdfData = async (ctx: Context, input: ReportPdfInput): Promise<ReportPdfData> =>
  inRlsTransaction(ctx, async (tx) => {
    const settings = await getRuntimeSettingsTx(tx)
    const year = input.year ?? settings.year
    const numberOfSlots = settings.startDates[year]?.slots ?? settings.numberOfSlots
    const rows = (await tx.$queryRawUnsafe(
      `
        SELECT
          m.id AS "memberId",
          COALESCE(NULLIF(u.full_name, ''), u.display_name, u.email) AS "memberName",
          g.slot_id AS "slot",
          g.name AS "gameName",
          COALESCE(gra_rooms.description, game_room.description, '') AS "room"
        FROM membership m
        JOIN "user" u ON u.id = m.user_id
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
        ORDER BY u.last_name, u.first_name, "memberName", m.id, g.slot_id, g.name
      `,
    )) as Array<ScheduleByPlayerRow>

    const schedules = groupScheduleByPlayerRows({ numberOfSlots, rows })
    if (schedules.length === 0) {
      throw new Error(`No attending members found for ${year}`)
    }

    const pdfBytes = await renderScheduleByPlayerPdf({ numberOfSlots, schedules })
    return {
      base64: Buffer.from(pdfBytes).toString('base64'),
      contentType: 'application/pdf',
      filenameLabel: 'schedule-by-player',
    }
  })
