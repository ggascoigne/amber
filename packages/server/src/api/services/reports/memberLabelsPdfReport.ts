import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import type { PDFEmbeddedPage, PDFFont, PDFPage } from 'pdf-lib'

import type { Context } from '../../context'
import type { ReportPdfData, ReportPdfInput } from '../../contracts/reports'
import { inRlsTransaction } from '../../inRlsTransaction'

import { getRuntimeSettingsTx } from '../runtimeSettings'

export type MemberLabelRow = {
  gameName: string
  isGm: boolean
  memberId: number
  memberName: string
  room: string | null
  slot: number
}

export type MemberLabelAssignment = {
  gameName: string
  isGm: boolean
  room: string
  slot: number
}

export type MemberLabel = {
  assignments: Array<MemberLabelAssignment>
  memberName: string
}

type FitTextOptions = {
  font: PDFFont
  maxWidth: number
  minSize: number
  size: number
  text: string
}

const pointsPerInch = 72
const pageWidth = 8.5 * pointsPerInch
const pageHeight = 11 * pointsPerInch
const labelsPerPage = 10
const labelColumns = 2
const labelWidth = 4 * pointsPerInch
const labelHeight = 2 * pointsPerInch
const pageLeftMargin = 0.1875 * pointsPerInch
const pageTopMargin = 0.5 * pointsPerInch
const columnGutter = 0.125 * pointsPerInch
const labelInset = 16
const nameBoxHeight = 18
const nameFontSize = 12
const rowFontSize = 8
const minimumRowFontSize = 5.8
const slotColumnWidth = 13
const roomColumnWidth = 72
const columnGap = 4
const ellipsis = '...'
const drawAveryTemplate = false

const rowHeightForSlotCount = (numberOfSlots?: number): number => (numberOfSlots === 8 ? 11 : 12.5)

const normalizeBoolean = (value: boolean | number | string | null): boolean =>
  value === true || value === 1 || value === 't'

const normalizeRow = (row: MemberLabelRow): MemberLabelRow => ({
  ...row,
  isGm: normalizeBoolean(row.isGm),
  room: row.room ?? '',
})

export const groupMemberLabelRows = (rows: Array<MemberLabelRow>, numberOfSlots?: number): Array<MemberLabel> => {
  const labels: Array<MemberLabel> = []
  let currentMemberId: number | null = null
  let currentLabel: MemberLabel | null = null

  rows.forEach((rawRow) => {
    const row = normalizeRow(rawRow)
    if (currentMemberId !== row.memberId || !currentLabel) {
      currentMemberId = row.memberId
      currentLabel = {
        assignments: [],
        memberName: row.memberName,
      }
      labels.push(currentLabel)
    }

    currentLabel.assignments.push({
      gameName: row.gameName,
      isGm: row.isGm,
      room: row.room ?? '',
      slot: row.slot,
    })
  })

  if (!numberOfSlots || numberOfSlots < 1) {
    return labels
  }

  return labels.map((label) => {
    const assignmentsBySlot = new Map(label.assignments.map((assignment) => [assignment.slot, assignment]))

    return {
      ...label,
      assignments: Array.from({ length: numberOfSlots }, (_, index) => {
        const slot = index + 1
        return (
          assignmentsBySlot.get(slot) ?? {
            gameName: '',
            isGm: false,
            room: '',
            slot,
          }
        )
      }),
    }
  })
}

const fitText = ({ font, maxWidth, minSize, size, text }: FitTextOptions): { size: number; text: string } => {
  let fittedSize = size
  while (fittedSize > minSize && font.widthOfTextAtSize(text, fittedSize) > maxWidth) {
    fittedSize -= 0.2
  }

  if (font.widthOfTextAtSize(text, fittedSize) <= maxWidth) {
    return { size: fittedSize, text }
  }

  let fittedText = text
  while (fittedText.length > 0 && font.widthOfTextAtSize(`${fittedText}${ellipsis}`, fittedSize) > maxWidth) {
    fittedText = fittedText.slice(0, -1)
  }

  return {
    size: fittedSize,
    text: `${fittedText.trimEnd()}${ellipsis}`,
  }
}

const loadTemplateBytes = async (): Promise<ArrayBuffer | null> => {
  if (!drawAveryTemplate) {
    return null
  }

  const { avery5163ShippingLabelsTemplateBase64 } = await import('./avery5163ShippingLabelsTemplate')
  const bytes = Buffer.from(avery5163ShippingLabelsTemplateBase64, 'base64')
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength)
}

const loadTemplatePage = async (pdf: PDFDocument): Promise<PDFEmbeddedPage | null> => {
  const templateBytes = await loadTemplateBytes()
  if (!templateBytes) {
    return null
  }

  try {
    const [templatePage] = await pdf.embedPdf(templateBytes, [0])
    return templatePage ?? null
  } catch {
    return null
  }
}

const drawLabel = ({
  boldFont,
  font,
  label,
  page,
  rowHeight,
  x,
  y,
}: {
  boldFont: PDFFont
  font: PDFFont
  label: MemberLabel
  page: PDFPage
  rowHeight: number
  x: number
  y: number
}) => {
  const contentLeft = x + labelInset
  const contentRight = x + labelWidth - labelInset
  const contentTop = y + labelHeight - labelInset
  const nameBoxBottom = contentTop - nameBoxHeight

  page.drawRectangle({
    borderColor: rgb(0.55, 0.55, 0.55),
    borderWidth: 0.6,
    height: nameBoxHeight,
    width: contentRight - contentLeft,
    x: contentLeft,
    y: nameBoxBottom,
  })

  const fittedName = fitText({
    font,
    maxWidth: contentRight - contentLeft - 8,
    minSize: 7,
    size: nameFontSize,
    text: label.memberName,
  })
  page.drawText(fittedName.text, {
    font,
    size: fittedName.size,
    x: contentLeft + 4,
    y: nameBoxBottom + 5,
  })

  const roomRight = contentRight
  const roomLeft = roomRight - roomColumnWidth
  const gameLeft = contentLeft + slotColumnWidth + columnGap
  const gameRight = roomLeft - columnGap

  label.assignments.forEach((assignment, assignmentIndex) => {
    const rowY = nameBoxBottom - 16 - assignmentIndex * rowHeight
    if (rowY < y + labelInset) {
      return
    }

    page.drawText(String(assignment.slot), {
      font,
      size: rowFontSize,
      x: contentLeft,
      y: rowY,
    })

    const gameFont = assignment.isGm ? boldFont : font
    const fittedGame = fitText({
      font: gameFont,
      maxWidth: gameRight - gameLeft,
      minSize: minimumRowFontSize,
      size: rowFontSize,
      text: assignment.gameName,
    })
    page.drawText(fittedGame.text, {
      font: gameFont,
      size: fittedGame.size,
      x: gameLeft,
      y: rowY,
    })

    const fittedRoom = fitText({
      font,
      maxWidth: roomColumnWidth,
      minSize: minimumRowFontSize,
      size: rowFontSize,
      text: assignment.room,
    })
    page.drawText(fittedRoom.text, {
      font,
      size: fittedRoom.size,
      x: roomRight - font.widthOfTextAtSize(fittedRoom.text, fittedRoom.size),
      y: rowY,
    })
  })
}

export const renderMemberLabelsPdf = async (
  labels: Array<MemberLabel>,
  options: { numberOfSlots?: number } = {},
): Promise<Uint8Array> => {
  const pdf = await PDFDocument.create()
  const font = await pdf.embedFont(StandardFonts.Helvetica)
  const boldFont = await pdf.embedFont(StandardFonts.HelveticaBold)
  const templatePage = drawAveryTemplate ? await loadTemplatePage(pdf) : null
  const pageCount = Math.max(1, Math.ceil(labels.length / labelsPerPage))
  const rowHeight = rowHeightForSlotCount(options.numberOfSlots)

  for (let pageIndex = 0; pageIndex < pageCount; pageIndex += 1) {
    const page = pdf.addPage([pageWidth, pageHeight])
    if (templatePage) {
      page.drawPage(templatePage)
    }

    const pageLabels = labels.slice(pageIndex * labelsPerPage, (pageIndex + 1) * labelsPerPage)
    pageLabels.forEach((label, labelIndex) => {
      const column = labelIndex % labelColumns
      const row = Math.floor(labelIndex / labelColumns)
      const x = pageLeftMargin + column * (labelWidth + columnGutter)
      const y = pageHeight - pageTopMargin - (row + 1) * labelHeight

      drawLabel({
        boldFont,
        font,
        label,
        page,
        rowHeight,
        x,
        y,
      })
    })
  }

  return pdf.save()
}

export const getMemberLabelsPdfData = async (ctx: Context, input: ReportPdfInput): Promise<ReportPdfData> =>
  inRlsTransaction(ctx, async (tx) => {
    const settings = await getRuntimeSettingsTx(tx)
    const year = input.year ?? settings.year
    const rows = (await tx.$queryRawUnsafe(
      `
        SELECT
          m.id AS "memberId",
          COALESCE(NULLIF(u.full_name, ''), u.display_name, u.email) AS "memberName",
          g.slot_id AS "slot",
          g.name AS "gameName",
          CASE WHEN ga.gm > 0 THEN TRUE ELSE FALSE END AS "isGm",
          COALESCE(gra_rooms.description, game_room.description, '') AS "room"
        FROM
          membership m
          JOIN "user" u ON m.user_id = u.id
          JOIN game_assignment ga ON m.id = ga.member_id
          JOIN game g ON g.id = ga.game_id
          LEFT JOIN LATERAL (
            SELECT
              STRING_AGG(DISTINCT r.description, ', ' ORDER BY r.description) AS description
            FROM
              game_room_assignment gra
              JOIN room r ON gra.room_id = r.id
            WHERE
              gra.game_id = g.id
              AND gra.slot_id = g.slot_id
              AND gra.year = g.year
          ) gra_rooms ON TRUE
          LEFT JOIN room game_room ON g.room_id = game_room.id
        WHERE
          m.year = ${year}
          AND m.attending
          AND g.year = ${year}
          AND ga.year = ${year}
          AND g.category = 'user'
          AND ga.gm >= 0
        ORDER BY
          u.last_name,
          u.first_name,
          "memberName",
          m.id,
          g.slot_id,
          g.name
      `,
    )) as Array<MemberLabelRow>

    const labels = groupMemberLabelRows(rows, settings.numberOfSlots)
    console.log('number of slots = ', settings.numberOfSlots)
    if (labels.length === 0) {
      throw new Error(`No member labels found for ${year}`)
    }

    const pdfBytes = await renderMemberLabelsPdf(labels, { numberOfSlots: settings.numberOfSlots })

    return {
      base64: Buffer.from(pdfBytes).toString('base64'),
      contentType: 'application/pdf',
      filenameLabel: 'member-labels',
    }
  })
