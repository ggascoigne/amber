import type { DateTime } from 'luxon'
import { slotDateTimePairsByCount } from '@amber/shared'
import { PDFDocument, type PDFFont, type PDFPage, StandardFonts } from 'pdf-lib'

import type { Context } from '../../context'
import type { ReportPdfData, ReportPdfInput } from '../../contracts/reports'
import { inRlsTransaction } from '../../inRlsTransaction'
import { getRuntimeSettingsTx } from '../runtimeSettings'

export type GamesBySlotRow = {
  category: 'no_game' | 'user'
  gameId: number
  gameName: string
  isGm: boolean | number
  memberName: string | null
  room: string | null
  slot: number
}

export type GameBySlot = {
  category: 'no_game' | 'user'
  gameName: string
  members: Array<{ isGm: boolean; name: string }>
  room: string
  slot: number
}

const pointsPerInch = 72
const pageWidth = 11 * pointsPerInch
const pageHeight = 8.5 * pointsPerInch
const pageMargin = 0.5 * pointsPerInch
const columnCount = 4
const columnGap = 0.2 * pointsPerInch
const headerFontSize = 15
const gameFontSize = 9
const roomFontSize = 8
const memberFontSize = 8
const lineHeight = 10
const gameGap = 5
const bodyTopOffset = 40
const bodyBottom = pageMargin
const columnWidth = (pageWidth - pageMargin * 2 - columnGap * (columnCount - 1)) / columnCount

const normalizeBoolean = (value: boolean | number): boolean => value === true || value === 1

const formatTime = (date: DateTime) => {
  const formatted = date.toFormat('h:mm a').replace(':00', '').replace(' ', '').toLowerCase()
  return formatted === '12am' ? 'midnight' : formatted
}

const formatSlotHeading = ({ number, start, end }: { end: DateTime; number: number; start: DateTime }) =>
  `Slot: ${number} ${start.toFormat('cccc, LLLL d, yyyy')} - ${formatTime(start)} to ${formatTime(end)}`

export const groupGamesBySlotRows = (rows: Array<GamesBySlotRow>): Array<GameBySlot> => {
  const games: Array<GameBySlot> = []
  let currentGameId: number | null = null
  let currentGame: GameBySlot | null = null

  rows.forEach((row) => {
    if (currentGameId !== row.gameId || !currentGame) {
      currentGameId = row.gameId
      currentGame = {
        category: row.category,
        gameName: row.gameName,
        members: [],
        room: row.room ?? 'N/A',
        slot: row.slot,
      }
      games.push(currentGame)
    }

    if (row.memberName) {
      currentGame.members.push({
        isGm: normalizeBoolean(row.isGm),
        name: row.memberName,
      })
    }
  })

  return games
}

const wrapText = ({
  font,
  fontSize,
  text,
  width,
}: {
  font: PDFFont
  fontSize: number
  text: string
  width: number
}) => {
  const words = text.split(/\s+/)
  const lines: Array<string> = []
  let line = ''

  words.forEach((word) => {
    const candidate = line ? `${line} ${word}` : word
    if (line && font.widthOfTextAtSize(candidate, fontSize) > width) {
      lines.push(line)
      line = word
    } else {
      line = candidate
    }
  })
  if (line) {
    lines.push(line)
  }

  return lines
}

const gameHeight = ({ game, boldFont, font }: { boldFont: PDFFont; font: PDFFont; game: GameBySlot }) => {
  const gameLines = wrapText({ font: boldFont, fontSize: gameFontSize, text: game.gameName, width: columnWidth })
  const roomLines = wrapText({ font: boldFont, fontSize: roomFontSize, text: `Room: ${game.room}`, width: columnWidth })
  const memberLines = game.members.flatMap((member) =>
    wrapText({
      font: member.isGm ? boldFont : font,
      fontSize: memberFontSize,
      text: member.name,
      width: columnWidth - 18,
    }),
  )

  return (gameLines.length + roomLines.length + memberLines.length) * lineHeight + gameGap
}

const drawGame = ({
  boldFont,
  font,
  game,
  page,
  x,
  y,
}: {
  boldFont: PDFFont
  font: PDFFont
  game: GameBySlot
  page: PDFPage
  x: number
  y: number
}) => {
  let cursorY = y
  const drawLines = ({
    font: lineFont,
    fontSize,
    lines,
    indent = 0,
  }: {
    font: PDFFont
    fontSize: number
    indent?: number
    lines: Array<string>
  }) => {
    lines.forEach((line) => {
      page.drawText(line, { font: lineFont, size: fontSize, x: x + indent, y: cursorY })
      cursorY -= lineHeight
    })
  }

  drawLines({
    font: boldFont,
    fontSize: gameFontSize,
    lines: wrapText({ font: boldFont, fontSize: gameFontSize, text: game.gameName, width: columnWidth }),
  })
  drawLines({
    font: boldFont,
    fontSize: roomFontSize,
    lines: wrapText({ font: boldFont, fontSize: roomFontSize, text: `Room: ${game.room}`, width: columnWidth }),
  })
  game.members.forEach((member) => {
    drawLines({
      font: member.isGm ? boldFont : font,
      fontSize: memberFontSize,
      indent: 18,
      lines: wrapText({
        font: member.isGm ? boldFont : font,
        fontSize: memberFontSize,
        text: member.name,
        width: columnWidth - 18,
      }),
    })
  })

  return cursorY - gameGap
}

const drawSlotPages = ({
  boldFont,
  font,
  games,
  heading,
  pdf,
}: {
  boldFont: PDFFont
  font: PDFFont
  games: Array<GameBySlot>
  heading: string
  pdf: PDFDocument
}) => {
  let gameIndex = 0
  do {
    const page = pdf.addPage([pageWidth, pageHeight])
    const headingWidth = boldFont.widthOfTextAtSize(heading, headerFontSize)
    page.drawText(heading, {
      font: boldFont,
      size: headerFontSize,
      x: (pageWidth - headingWidth) / 2,
      y: pageHeight - pageMargin - headerFontSize,
    })

    let didDrawGame = false
    for (let column = 0; column < columnCount && gameIndex < games.length; column += 1) {
      const x = pageMargin + column * (columnWidth + columnGap)
      let cursorY = pageHeight - pageMargin - bodyTopOffset
      while (gameIndex < games.length) {
        const game = games[gameIndex]!
        const height = gameHeight({ boldFont, font, game })
        if (cursorY - height < bodyBottom && didDrawGame) {
          break
        }
        cursorY = drawGame({ boldFont, font, game, page, x, y: cursorY })
        gameIndex += 1
        didDrawGame = true
      }
    }
  } while (gameIndex < games.length)
}

export const renderGamesBySlotPdf = async ({
  games,
  numberOfSlots,
  start,
  virtual,
}: {
  games: Array<GameBySlot>
  numberOfSlots: number
  start: DateTime
  virtual: boolean
}): Promise<Uint8Array> => {
  const pdf = await PDFDocument.create()
  const font = await pdf.embedFont(StandardFonts.TimesRoman)
  const boldFont = await pdf.embedFont(StandardFonts.TimesRomanBold)
  const slotTimes = slotDateTimePairsByCount(start, numberOfSlots, virtual)

  slotTimes.forEach(([slotStart, slotEnd], slotIndex) => {
    const slot = slotIndex + 1
    drawSlotPages({
      boldFont,
      font,
      games: games.filter((game) => game.slot === slot),
      heading: formatSlotHeading({ end: slotEnd, number: slot, start: slotStart }),
      pdf,
    })
  })

  return pdf.save()
}

export const getGamesBySlotPdfData = async (ctx: Context, input: ReportPdfInput): Promise<ReportPdfData> =>
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
          g.id AS "gameId",
          g.name AS "gameName",
          g.category AS "category",
          g.slot_id AS "slot",
          COALESCE(r.description, 'N/A') AS "room",
          COALESCE(NULLIF(u.full_name, ''), u.display_name, u.email) AS "memberName",
          CASE WHEN ga.gm > 0 THEN TRUE ELSE FALSE END AS "isGm"
        FROM game g
        LEFT JOIN room r ON g.room_id = r.id
        LEFT JOIN game_assignment ga ON
          ga.game_id = g.id
          AND ga.year = ${year}
          AND ga.gm >= 0
          AND EXISTS (
            SELECT 1
            FROM membership attending_membership
            WHERE
              attending_membership.id = ga.member_id
              AND attending_membership.year = ${year}
              AND attending_membership.attending
          )
        LEFT JOIN membership m ON m.id = ga.member_id AND m.year = ${year}
        LEFT JOIN "user" u ON u.id = m.user_id
        WHERE
          g.year = ${year}
          AND g.category IN ('user', 'no_game')
          AND g.slot_id IS NOT NULL
        ORDER BY
          g.slot_id,
          CASE WHEN g.category = 'no_game' THEN 1 ELSE 0 END,
          g.name,
          ga.gm DESC,
          u.last_name,
          u.first_name,
          "memberName"
      `,
    )) as Array<GamesBySlotRow>

    const pdfBytes = await renderGamesBySlotPdf({
      games: groupGamesBySlotRows(rows),
      numberOfSlots: startDateConfig.slots,
      start: startDateConfig.date,
      virtual: startDateConfig.virtual,
    })

    return {
      base64: Buffer.from(pdfBytes).toString('base64'),
      contentType: 'application/pdf',
      filenameLabel: 'games-by-slot',
    }
  })
