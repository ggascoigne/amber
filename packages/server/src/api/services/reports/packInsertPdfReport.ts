import type { DateTime } from 'luxon'
import { slotDateTimePairsByCount } from '@amber/shared'
import { PDFDocument, type PDFFont, type PDFPage, StandardFonts } from 'pdf-lib'

import type { Context } from '../../context'
import type { ReportPdfData, ReportPdfInput } from '../../contracts/reports'
import { inRlsTransaction } from '../../inRlsTransaction'
import { getRuntimeSettingsTx } from '../runtimeSettings'

const pointsPerInch = 72
const pageWidth = 8.5 * pointsPerInch
const pageHeight = 11 * pointsPerInch
const margin = 0.5 * pointsPerInch
const bodySize = 10

const wrap = ({ font, size, text, width }: { font: PDFFont; size: number; text: string; width: number }) => {
  const lines: Array<string> = []
  let line = ''
  text.split(' ').forEach((word) => {
    const candidate = line ? `${line} ${word}` : word
    if (line && font.widthOfTextAtSize(candidate, size) > width) {
      lines.push(line)
      line = word
    } else {
      line = candidate
    }
  })
  if (line) lines.push(line)
  return lines
}

const drawParagraph = ({
  font,
  page,
  size = bodySize,
  text,
  x = margin,
  y,
}: {
  font: PDFFont
  page: PDFPage
  size?: number
  text: string
  x?: number
  y: number
}) => {
  const lines = wrap({ font, size, text, width: pageWidth - margin - x })
  lines.forEach((line) => page.drawText(line, { font, size, x, y: y - lines.indexOf(line) * (size + 2) }))
  return y - lines.length * (size + 2)
}

const formatTime = (date: DateTime) => date.toFormat('h:mm a').replace(':00', '').toLowerCase()
const formatDate = (date: DateTime) => date.toFormat('cccc, LLLL d, yyyy')

const drawPageTitle = ({ font, page, title }: { font: PDFFont; page: PDFPage; title: string }) => {
  const size = 22
  page.drawText(title, {
    font,
    size,
    x: (pageWidth - font.widthOfTextAtSize(title, size)) / 2,
    y: pageHeight - 1.05 * pointsPerInch,
  })
}

const drawSchedule = ({
  boldFont,
  font,
  page,
  slotTimes,
  year,
}: {
  boldFont: PDFFont
  font: PDFFont
  page: PDFPage
  slotTimes: ReadonlyArray<readonly [DateTime, DateTime]>
  year: number
}) => {
  let y = pageHeight - 1.6 * pointsPerInch
  page.drawText(`Welcome to AmberCon Northwest ${year}!`, { font, size: 24, x: 107, y })
  y -= 20
  const subtitle = `the ${year - 1996}th annual NW Amber Diceless RPG convention`
  page.drawText(subtitle, { font, size: 13, x: (pageWidth - font.widthOfTextAtSize(subtitle, 13)) / 2, y })
  y -= 35
  y = drawParagraph({
    font,
    page,
    text: 'In addition to information and schedules, your registration packet includes your badge with your schedule, game locations, and special start times. Please take note of them and save a fellow attendee from being awakened early!',
    y,
  })
  y -= 14
  y = drawParagraph({
    font,
    page,
    text: "At the registration table, we give you your attendee packet, and sign over to you an Edgefield gift card. These are good at the pubs, bars, and restaurants all over the estate. AmberCon NW pre-paid a 21% tip on food orders made with these cards. The service staff have been briefed, but please be patient if you get that person who is not in the loop. Any time you wish, please do tip more. Unfortunately, you can't do the added tip using the card balance.",
    y,
  })
  y -= 16
  page.drawText('CONVENTION SCHEDULE:', { font: boldFont, size: 11, x: margin, y })
  y -= 16

  const drawRow = ({ label, location, time }: { label: string; location?: string; time: string }) => {
    page.drawText(label, { font, size: bodySize, x: margin, y })
    page.drawText(time, { font, size: bodySize, x: 3.2 * pointsPerInch, y })
    if (location) page.drawText(location, { font, size: bodySize, x: 4.5 * pointsPerInch, y })
    y -= 13
  }
  const drawDay = (date: DateTime) => {
    page.drawText(formatDate(date), { font: boldFont, size: 10.5, x: margin, y })
    y -= 14
  }
  const [slot1, slot2, slot3, slot4, slot5, slot6, slot7] = slotTimes
  drawDay(slot1![0])
  drawRow({ label: 'Registration and Reception', location: 'Ballroom', time: '5:00 pm to 6:30 pm' })
  page.drawText('(after 6:30 pm, pick up registrations at front desk)', { font, size: bodySize, x: margin + 72, y })
  y -= 13
  drawRow({ label: 'Announcements', location: 'Ballroom', time: '6:00 pm' })
  drawRow({ label: 'Slot 1', time: `${formatTime(slot1![0])} to ${formatTime(slot1![1])}` })
  y -= 8
  drawDay(slot2![0])
  drawRow({ label: 'Breakfast', location: 'Ballroom', time: '7:00 am to 9:00 am' })
  ;[slot2, slot3, slot4].forEach((slot, index) =>
    drawRow({ label: `Slot ${index + 2}`, time: `${formatTime(slot![0])} to ${formatTime(slot![1])}` }),
  )
  y -= 8
  drawDay(slot5![0])
  drawRow({ label: 'Breakfast', location: 'Ballroom', time: '7:00 am to 9:00 am' })
  ;[slot5, slot6].forEach((slot, index) =>
    drawRow({ label: `Slot ${index + 5}`, time: `${formatTime(slot![0])} to ${formatTime(slot![1])}` }),
  )
  y -= 8
  drawDay(slot7![0])
  drawRow({ label: 'Breakfast', location: 'Ballroom', time: '8:00 am to 10:00 am' })
  drawRow({ label: 'Slot 7', time: `${formatTime(slot7![0])} to ${formatTime(slot7![1])}` })
  drawRow({ label: 'Closing Party', location: 'Ballroom', time: '6:00 pm to 8:00 pm' })
  drawRow({ label: 'Thanks and Announcements', location: 'Ballroom', time: '6:30 pm' })
  drawRow({ label: 'Open Gaming Tables', location: 'Ballroom', time: '8:00 pm to 11:30 pm' })
  drawRow({
    label: 'Gatherings',
    location: 'Admin Lodge, Soaking Pool, Distillery, Little Red Shed',
    time: '8:00 pm to closing',
  })
  y -= 6
  y = drawParagraph({
    font,
    page,
    text: 'LOCATIONS: Winery Wing rooms are down the hall behind the Black Rabbit Restaurant. The Bullfrog, and Red Fox rooms are in between the Black Rabbit restaurant and the Winery Wing. The Study is on the second floor in the central section; rooms 230, 231, 234, 235 are directly across from it. 4, 5 and 6 are on the ground floor, West Wing. 22 and 23 are on the ground floor, East Wing. The Admin Lodge is a separate building to the west.',
    y,
  })
  y -= 10
  y = drawParagraph({
    font,
    page,
    text: 'The Annual Icky Bit: The convention organizers and the hotel reserve the right to ask any member to leave who is endangering others or preventing others from enjoying the convention. Please see the Anti-Harassment Policy on the reverse or on our website for full details. Remember, the hotel and meeting rooms are also used by the public. Please be considerate about noise after 10 pm. The hotel is old and noise carries, especially when your windows are open.',
    y,
  })
  page.drawText('Enjoy!', { font: boldFont, size: 24, x: pageWidth - margin - 70, y: Math.max(y - 24, margin) })
}

const drawBullets = ({
  boldFont,
  font,
  page,
  title,
  bullets,
}: {
  boldFont: PDFFont
  font: PDFFont
  page: PDFPage
  title: string
  bullets: Array<string>
}) => {
  drawPageTitle({ font: boldFont, page, title })
  let y = pageHeight - 1.75 * pointsPerInch
  bullets.forEach((bullet) => {
    const lines = wrap({ font, size: 11, text: bullet, width: pageWidth - margin * 2 - 22 })
    page.drawText('•', { font, size: 11, x: margin + 14, y })
    lines.forEach((line, index) => page.drawText(line, { font, size: 11, x: margin + 34, y: y - index * 14 }))
    y -= lines.length * 14 + 7
  })
}

export const renderPackInsertPdf = async ({
  slotTimes,
  year,
}: {
  slotTimes: ReadonlyArray<readonly [DateTime, DateTime]>
  year: number
}): Promise<Uint8Array> => {
  const pdf = await PDFDocument.create()
  const font = await pdf.embedFont(StandardFonts.TimesRoman)
  const boldFont = await pdf.embedFont(StandardFonts.TimesRomanBold)

  const schedulePage = pdf.addPage([pageWidth, pageHeight])
  drawSchedule({ boldFont, font, page: schedulePage, slotTimes, year })

  const healthPage = pdf.addPage([pageWidth, pageHeight])
  drawBullets({
    boldFont,
    font,
    page: healthPage,
    title: "AmberCon NW's COVID / Infectious Disease Policy",
    bullets: [
      'If you have any out of the ordinary cold or flu-like symptoms, please do not attend. If you become symptomatic during the convention, isolate and avoid all AmberCon NW spaces, including game rooms.',
      'GMs may choose to require masking in their games. They should add this to their Character/Player Instructions and Restrictions so that players can consider it during game selection.',
      "Otherwise, attendees may choose to mask or not mask as best fits their circumstances and comfort levels. Please respect each other's masking decisions.",
      'We encourage all attendees to have current COVID and flu vaccines, out of respect for members of our community who may be immunocompromised.',
    ],
  })

  const conductPage = pdf.addPage([pageWidth, pageHeight])
  drawBullets({
    boldFont,
    font,
    page: conductPage,
    title: "AmberCon NW's Anti-harassment Policy",
    bullets: [
      'AmberCon NW is committed to a safe, welcoming convention and does not tolerate harassment of participants in any form.',
      'Even if you do not believe that your behavior is harassment, if the recipient does, you need to stop. Participants who violate these rules may be sanctioned or expelled without a refund.',
      'If anyone makes you feel unsafe or unwelcome, please report it to a designated volunteer listed in your registration packet, the hotel front desk, or Eleanor. In an immediate emergency, call 911 or go directly to a McMenamins staff member.',
      'The full policy and reporting resources are available at amberconnw.org.',
    ],
  })

  const notesPage = pdf.addPage([pageWidth, pageHeight])
  drawBullets({
    boldFont,
    font,
    page: notesPage,
    title: 'Other Useful Notes',
    bullets: [
      "The Spa: Ruby's Spa, soaking pool, and Tea House Bar operate west of the Admin Lodge. Mention your membership for a discount on services.",
      'Breakfast: The Ballroom buffet is included in your membership. Please do not arrive late, because the Ballroom is used as event space.',
      'Dining: Dinner reservations are strongly recommended at the Black Rabbit. Smaller groups are generally seated more quickly.',
      'Water service: Please do not remove hallway water pitchers. Notify the front desk if an area needs service.',
      'Finding people: Complete schedules by player, game, and location are posted in the Winery Wing, Admin Lodge, and hotel front desk.',
      'Feedback: We need and read your feedback. Please email details rather than trying to tell Eleanor in passing unless it is an issue that needs immediate attention.',
      'The Stars: Badges with stars identify GMs and volunteers. Please add your thanks to ours - their work makes the convention possible.',
      `Happy ${year - 1996}th AmberCon NW, everyone!`,
    ],
  })

  return pdf.save()
}

export const getPackInsertPdfData = async (ctx: Context, input: ReportPdfInput): Promise<ReportPdfData> =>
  inRlsTransaction(ctx, async (tx) => {
    const settings = await getRuntimeSettingsTx(tx)
    const year = input.year ?? settings.year
    const startDateConfig = settings.startDates[year]
    if (!startDateConfig) throw new Error(`No convention dates found for ${year}`)

    const pdfBytes = await renderPackInsertPdf({
      slotTimes: slotDateTimePairsByCount(startDateConfig.date, startDateConfig.slots, startDateConfig.virtual),
      year,
    })
    return {
      base64: Buffer.from(pdfBytes).toString('base64'),
      contentType: 'application/pdf',
      filenameLabel: 'pack-insert',
    }
  })
