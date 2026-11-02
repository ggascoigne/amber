import { PDFDocument, type PDFFont, StandardFonts } from 'pdf-lib'

import type { Context } from '../../context'
import type { ReportPdfData, ReportPdfInput } from '../../contracts/reports'
import { inRlsTransaction } from '../../inRlsTransaction'
import { getRuntimeSettingsTx } from '../runtimeSettings'

export type RoomAndChairRow = {
  description: string
  members: string
  size: number
}

const pointsPerInch = 72
const pageWidth = 8.5 * pointsPerInch
const pageHeight = 11 * pointsPerInch
const pageMargin = 0.5 * pointsPerInch
const titleLeftMargin = 0.3 * pointsPerInch
const titleFontSize = 19
const headingFontSize = 10
const rowFontSize = 10
const rowHeight = 33
const descriptionX = pageMargin
const sizeX = 2.3 * pointsPerInch
const membersX = 2.58 * pointsPerInch
const membersHeadingX = 2.65 * pointsPerInch
const firstRowY = pageHeight - 1.45 * pointsPerInch
const rowsPerPage = Math.floor((firstRowY - pageMargin) / rowHeight)

const fitText = ({ font, text, width }: { font: PDFFont; text: string; width: number }) => {
  const ellipsis = '...'
  if (font.widthOfTextAtSize(text, rowFontSize) <= width) {
    return text
  }

  let fitted = text
  while (fitted.length > 0 && font.widthOfTextAtSize(`${fitted}${ellipsis}`, rowFontSize) > width) {
    fitted = fitted.slice(0, -1)
  }
  return `${fitted.trimEnd()}${ellipsis}`
}

const drawPage = ({
  font,
  page,
  rows,
}: {
  font: PDFFont
  page: ReturnType<PDFDocument['addPage']>
  rows: Array<RoomAndChairRow>
}) => {
  page.drawText('Chair List', {
    font,
    size: titleFontSize,
    x: titleLeftMargin,
    y: pageHeight - titleLeftMargin - titleFontSize,
  })
  page.drawText('Description', { font, size: headingFontSize, x: descriptionX, y: firstRowY + 23 })
  page.drawText('Size', { font, size: headingFontSize, x: sizeX, y: firstRowY + 23 })
  page.drawText('Members', { font, size: headingFontSize, x: membersHeadingX, y: firstRowY + 23 })

  rows.forEach((row, index) => {
    const y = firstRowY - index * rowHeight
    page.drawText(fitText({ font, text: row.description, width: sizeX - descriptionX - 10 }), {
      font,
      size: rowFontSize,
      x: descriptionX,
      y,
    })
    page.drawText(String(row.size), { font, size: rowFontSize, x: sizeX, y })
    page.drawText(fitText({ font, text: row.members, width: pageWidth - membersX - pageMargin }), {
      font,
      size: rowFontSize,
      x: membersX,
      y,
    })
  })
}

export const renderRoomsAndChairsPdf = async (rows: Array<RoomAndChairRow>): Promise<Uint8Array> => {
  const pdf = await PDFDocument.create()
  const font = await pdf.embedFont(StandardFonts.Helvetica)
  const pageCount = Math.max(1, Math.ceil(rows.length / rowsPerPage))

  for (let pageIndex = 0; pageIndex < pageCount; pageIndex += 1) {
    const page = pdf.addPage([pageWidth, pageHeight])
    drawPage({
      font,
      page,
      rows: rows.slice(pageIndex * rowsPerPage, (pageIndex + 1) * rowsPerPage),
    })
  }

  return pdf.save()
}

export const getRoomsAndChairsPdfData = async (ctx: Context, input: ReportPdfInput): Promise<ReportPdfData> =>
  inRlsTransaction(ctx, async (tx) => {
    const settings = await getRuntimeSettingsTx(tx)
    const year = input.year ?? settings.year
    const rows = (await tx.$queryRawUnsafe(
      `
        SELECT
          r.description AS "description",
          r.size AS "size",
          CONCAT(r.type, ' (', STRING_AGG(u.full_name, ', ' ORDER BY u.full_name), ')') AS "members"
        FROM room r
        JOIN member_room_assignment mra ON mra.room_id = r.id AND mra.year = ${year}
        JOIN membership m ON m.id = mra.member_id AND m.year = ${year} AND m.attending
        JOIN "user" u ON u.id = m.user_id AND NULLIF(u.full_name, '') IS NOT NULL
        WHERE r.enabled
        GROUP BY r.id, r.description, r.size, r.type
        ORDER BY
          NULLIF(REGEXP_REPLACE(r.description, '\\D', '', 'g'), '')::integer,
          r.description
      `,
    )) as Array<RoomAndChairRow>

    if (rows.length === 0) {
      throw new Error(`No allocated game rooms found for ${year}`)
    }

    const pdfBytes = await renderRoomsAndChairsPdf(rows)
    return {
      base64: Buffer.from(pdfBytes).toString('base64'),
      contentType: 'application/pdf',
      filenameLabel: 'rooms-and-chairs',
    }
  })
