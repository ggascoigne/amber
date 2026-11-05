import { PDFDocument, type PDFFont, type PDFPage, StandardFonts } from 'pdf-lib'

import type { Context } from '../../context'
import type { ReportPdfData, ReportPdfInput } from '../../contracts/reports'
import { inRlsTransaction } from '../../inRlsTransaction'
import { getRuntimeSettingsTx } from '../runtimeSettings'

export type MemberSignupRow = {
  memberName: string
}

const pointsPerInch = 72
const pageWidth = 8.5 * pointsPerInch
const pageHeight = 11 * pointsPerInch
const pageMargin = 0.5 * pointsPerInch
const titleFontSize = 20
const headingFontSize = 10
const rowFontSize = 12
const nameColumnWidth = 2.75 * pointsPerInch
const signatureColumnX = pageMargin + nameColumnWidth + 12
const firstRowY = pageHeight - 1.45 * pointsPerInch
const bodyBottom = 0.5 * pointsPerInch
const preferredPageCount = 6
const maximumRowsPerPage = 20
const ellipsis = '...'

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

const drawSignupPage = ({
  font,
  page,
  pageNumber,
  rowHeight,
  rows,
  year,
}: {
  font: PDFFont
  page: PDFPage
  pageNumber: number
  rowHeight: number
  rows: Array<MemberSignupRow>
  year: number
}) => {
  const title = `${year} Member Sign-in Sheet`
  page.drawText(title, {
    font,
    size: titleFontSize,
    x: pageMargin,
    y: pageHeight - pageMargin - titleFontSize,
  })
  page.drawText(`Page ${pageNumber}`, {
    font,
    size: headingFontSize,
    x: pageWidth - pageMargin - font.widthOfTextAtSize(`Page ${pageNumber}`, headingFontSize),
    y: pageHeight - pageMargin - headingFontSize,
  })
  page.drawText('Name', { font, size: headingFontSize, x: pageMargin, y: firstRowY + 16 })
  page.drawText('Signature', { font, size: headingFontSize, x: signatureColumnX, y: firstRowY + 16 })

  rows.forEach((row, rowIndex) => {
    const y = firstRowY - rowIndex * rowHeight
    page.drawText(fitText({ font, text: row.memberName, width: nameColumnWidth }), {
      font,
      size: rowFontSize,
      x: pageMargin,
      y,
    })
    page.drawLine({
      end: { x: pageWidth - pageMargin, y: y - 3 },
      start: { x: signatureColumnX, y: y - 3 },
      thickness: 0.75,
    })
  })
}

export const renderMemberSignupPdf = async ({
  rows,
  year,
}: {
  rows: Array<MemberSignupRow>
  year: number
}): Promise<Uint8Array> => {
  const pdf = await PDFDocument.create()
  const font = await pdf.embedFont(StandardFonts.Helvetica)
  const pageCount = Math.max(preferredPageCount, Math.ceil(rows.length / maximumRowsPerPage))
  const rowsPerPage = Math.ceil(rows.length / pageCount)
  const rowHeight = (firstRowY - bodyBottom) / rowsPerPage

  for (let pageIndex = 0; pageIndex < pageCount; pageIndex += 1) {
    const page = pdf.addPage([pageWidth, pageHeight])
    drawSignupPage({
      font,
      page,
      pageNumber: pageIndex + 1,
      rowHeight,
      rows: rows.slice(pageIndex * rowsPerPage, (pageIndex + 1) * rowsPerPage),
      year,
    })
  }

  return pdf.save()
}

export const getMemberSignupPdfData = async (ctx: Context, input: ReportPdfInput): Promise<ReportPdfData> =>
  inRlsTransaction(ctx, async (tx) => {
    const settings = await getRuntimeSettingsTx(tx)
    const year = input.year ?? settings.year
    const rows = (await tx.$queryRawUnsafe(
      `
        SELECT COALESCE(NULLIF(u.full_name, ''), u.display_name, u.email) AS "memberName"
        FROM membership m
        JOIN "user" u ON m.user_id = u.id
        WHERE m.year = ${year} AND m.attending
        ORDER BY u.last_name, u.first_name, "memberName", m.id
      `,
    )) as Array<MemberSignupRow>

    if (rows.length === 0) {
      throw new Error(`No attending members found for ${year}`)
    }

    const pdfBytes = await renderMemberSignupPdf({ rows, year })
    return {
      base64: Buffer.from(pdfBytes).toString('base64'),
      contentType: 'application/pdf',
      filenameLabel: 'member-signup-sheet',
    }
  })
