import type { DateTime } from 'luxon'
import { slotDateTimePairsByCount } from '@amber/shared'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'

import type { Context } from '../../context'
import type { ReportPdfData, ReportPdfInput } from '../../contracts/reports'
import { inRlsTransaction } from '../../inRlsTransaction'
import { getRuntimeSettingsTx } from '../runtimeSettings'

type BadgeBackSlot = {
  number: number
  text: string
}

const pointsPerInch = 72
const pageWidth = 8.5 * pointsPerInch
const pageHeight = 11 * pointsPerInch
const labelsPerPage = 10
const labelColumns = 2
const labelWidth = 4 * pointsPerInch
const labelHeight = 2 * pointsPerInch
const pageLeftMargin = 0.4375 * pointsPerInch
const pageTopMargin = 0.5 * pointsPerInch
const columnGutter = 0.125 * pointsPerInch
const labelInset = 0.25 * pointsPerInch
const rowHeight = 18
const fontSize = 9.5
const badgeBackVerticalOffset = pointsPerInch / 25.4

const formatTime = (date: DateTime) => {
  const formatted = date.toFormat('h:mm a').replace(':00', '').replace(' ', '').toLowerCase()
  return formatted === '12am' ? 'midnight' : formatted
}

export const buildBadgeBackSlots = ({
  numberOfSlots,
  start,
  virtual,
}: {
  numberOfSlots: number
  start: DateTime
  virtual: boolean
}): Array<BadgeBackSlot> =>
  slotDateTimePairsByCount(start, numberOfSlots, virtual).map(([slotStart, slotEnd], slotIndex) => ({
    number: slotIndex + 1,
    text: `${slotStart.toFormat('cccc, LLLL d, yyyy')} - ${formatTime(slotStart)} to ${formatTime(slotEnd)}`,
  }))

const drawBadgeBack = ({
  font,
  page,
  slots,
  x,
  y,
}: {
  font: Awaited<ReturnType<PDFDocument['embedFont']>>
  page: ReturnType<PDFDocument['addPage']>
  slots: Array<BadgeBackSlot>
  x: number
  y: number
}) => {
  slots.forEach((slot, slotIndex) => {
    const rowY = y + labelHeight - labelInset - fontSize + badgeBackVerticalOffset - slotIndex * rowHeight
    if (slotIndex % 2 === 1) {
      page.drawRectangle({
        color: rgb(0.93, 0.93, 0.93),
        height: rowHeight,
        width: 3.25 * pointsPerInch,
        x,
        y: rowY - 3,
      })
    }

    page.drawText(String(slot.number), {
      font,
      size: fontSize,
      x: x + labelInset + 2,
      y: rowY,
    })
    page.drawText(slot.text, {
      font,
      size: fontSize,
      x: x + labelInset + 12,
      y: rowY,
    })
  })
}

export const renderBadgeBacksPdf = async ({
  count,
  slots,
}: {
  count: number
  slots: Array<BadgeBackSlot>
}): Promise<Uint8Array> => {
  const pdf = await PDFDocument.create()
  const font = await pdf.embedFont(StandardFonts.Helvetica)
  const pageCount = Math.max(1, Math.ceil(count / labelsPerPage))

  for (let pageIndex = 0; pageIndex < pageCount; pageIndex += 1) {
    const page = pdf.addPage([pageWidth, pageHeight])
    const badgeBackCount = Math.min(labelsPerPage, count - pageIndex * labelsPerPage)

    for (let badgeBackIndex = 0; badgeBackIndex < badgeBackCount; badgeBackIndex += 1) {
      const column = badgeBackIndex % labelColumns
      const row = Math.floor(badgeBackIndex / labelColumns)
      drawBadgeBack({
        font,
        page,
        slots,
        x: pageLeftMargin + column * (labelWidth + columnGutter),
        y: pageHeight - pageTopMargin - (row + 1) * labelHeight,
      })
    }
  }

  return pdf.save()
}

export const getBadgeBacksPdfData = async (ctx: Context, input: ReportPdfInput): Promise<ReportPdfData> =>
  inRlsTransaction(ctx, async (tx) => {
    const settings = await getRuntimeSettingsTx(tx)
    const year = input.year ?? settings.year
    const startDateConfig = settings.startDates[year]
    if (!startDateConfig) {
      throw new Error(`No convention dates found for ${year}`)
    }

    const memberCount = await tx.membership.count({
      where: {
        attending: true,
        year,
      },
    })
    if (memberCount === 0) {
      throw new Error(`No attending members found for ${year}`)
    }

    const slots = buildBadgeBackSlots({
      numberOfSlots: startDateConfig.slots,
      start: startDateConfig.date,
      virtual: startDateConfig.virtual,
    })
    const pdfBytes = await renderBadgeBacksPdf({ count: memberCount, slots })

    return {
      base64: Buffer.from(pdfBytes).toString('base64'),
      contentType: 'application/pdf',
      filenameLabel: 'badge-backs',
    }
  })
