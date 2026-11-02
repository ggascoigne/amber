import { PDFDocument, type PDFFont, type PDFPage, StandardFonts } from 'pdf-lib'

import type { Context } from '../../context'
import type { ReportPdfData, ReportPdfInput } from '../../contracts/reports'
import { inRlsTransaction } from '../../inRlsTransaction'
import { getRuntimeSettingsTx } from '../runtimeSettings'

export type GameRoomUseRow = {
  gameName: string | null
  gmNames: string | null
  roomDescription: string
  roomMembers: string
  slot: number | null
}

export type GameRoomUseRoom = {
  games: Array<{ gameName: string; gmNames: string; slot: number }>
  roomDescription: string
  roomMembers: string
}

const pointsPerInch = 72
const pageWidth = 8.5 * pointsPerInch
const pageHeight = 11 * pointsPerInch
const pageMargin = 0.5 * pointsPerInch
const title = 'GAME ROOMS'
const titleFontSize = 16
const preambleFontSize = 9.5
const preambleLineHeight = 11.5
const roomHeadingFontSize = 7.8
const gameFontSize = 6.7
const gameLineHeight = 8.3
const roomGap = 4
const columnGap = 18
const columnWidth = (pageWidth - pageMargin * 2 - columnGap) / 2
const ellipsis = '...'

const preamble = [
  'If you receive a hotel discount from the con for a GAMING room, there are a few things you are responsible for:',
  "Room owners: It isn't always possible to put your own games in your rooms due to size or scheduling. Arrange to meet the GMs and unlock your room at the start of each game. Decide in advance who will open the room for each slot.",
  'Pack personal items out of the way and pull the bedclothes up. Folks in games may have to sit on beds.',
  'CHAIRS: the folding chairs belong to ACNW. Put them outside your room door by MONDAY morning.',
  'GMs and players: You are gaming in someone else’s space. Remove food and beverage items. Do not use room garbage cans. There should be garbage bins and bus trays outside in the halls. If maid service arrives, allow the room to be completely serviced. If you are gaming in a room that is not your own, use the bathrooms down the halls.',
  "GMs, if your game starts at an odd time, arrange with the room's owners to get it opened at the correct time.",
]

const wrapText = ({ font, size, text, width }: { font: PDFFont; size: number; text: string; width: number }) => {
  const words = text.split(' ')
  const lines: Array<string> = []
  let line = ''

  words.forEach((word) => {
    const candidate = line ? `${line} ${word}` : word
    if (line && font.widthOfTextAtSize(candidate, size) > width) {
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

const fitText = ({ font, size, text, width }: { font: PDFFont; size: number; text: string; width: number }) => {
  if (font.widthOfTextAtSize(text, size) <= width) {
    return text
  }

  let fitted = text
  while (fitted.length > 0 && font.widthOfTextAtSize(`${fitted}${ellipsis}`, size) > width) {
    fitted = fitted.slice(0, -1)
  }
  return `${fitted.trimEnd()}${ellipsis}`
}

export const groupGameRoomUseRows = (rows: Array<GameRoomUseRow>): Array<GameRoomUseRoom> => {
  const rooms: Array<GameRoomUseRoom> = []
  let currentRoom: GameRoomUseRoom | null = null
  let currentRoomDescription: string | null = null

  rows.forEach((row) => {
    if (row.roomDescription !== currentRoomDescription || !currentRoom) {
      currentRoomDescription = row.roomDescription
      currentRoom = { games: [], roomDescription: row.roomDescription, roomMembers: row.roomMembers }
      rooms.push(currentRoom)
    }

    if (row.slot && row.gameName) {
      currentRoom.games.push({ gameName: row.gameName, gmNames: row.gmNames ?? '', slot: row.slot })
    }
  })

  return rooms
}

const splitRoomColumns = (rooms: Array<GameRoomUseRoom>) => {
  const roomHeight = (room: GameRoomUseRoom) => 1 + Math.max(room.games.length, 1)
  const targetHeight = Math.ceil(rooms.reduce((total, room) => total + roomHeight(room), 0) / 2)
  let leftHeight = 0
  const splitIndex = rooms.findIndex((room) => {
    leftHeight += roomHeight(room)
    return leftHeight >= targetHeight
  })
  return [rooms.slice(0, splitIndex + 1), rooms.slice(splitIndex + 1)] as const
}

const drawRoom = ({
  boldFont,
  font,
  page,
  room,
  x,
  y,
}: {
  boldFont: PDFFont
  font: PDFFont
  page: PDFPage
  room: GameRoomUseRoom
  x: number
  y: number
}) => {
  const heading = `${room.roomDescription} - ${room.roomMembers}`
  page.drawText(fitText({ font: boldFont, size: roomHeadingFontSize, text: heading, width: columnWidth }), {
    font: boldFont,
    size: roomHeadingFontSize,
    x,
    y,
  })

  room.games.forEach((game, index) => {
    const text = `${game.slot} ${game.gameName}${game.gmNames ? ` - ${game.gmNames}` : ''}`
    page.drawText(fitText({ font, size: gameFontSize, text, width: columnWidth - 4 }), {
      font,
      size: gameFontSize,
      x: x + 4,
      y: y - roomHeadingFontSize - 2 - index * gameLineHeight,
    })
  })

  return y - roomHeadingFontSize - Math.max(room.games.length, 1) * gameLineHeight - roomGap
}

export const renderGameRoomUsePdf = async (rooms: Array<GameRoomUseRoom>): Promise<Uint8Array> => {
  const pdf = await PDFDocument.create()
  const font = await pdf.embedFont(StandardFonts.TimesRoman)
  const boldFont = await pdf.embedFont(StandardFonts.TimesRomanBold)
  const page = pdf.addPage([pageWidth, pageHeight])
  let cursorY = pageHeight - pageMargin

  page.drawText(title, { font: boldFont, size: titleFontSize, x: pageMargin, y: cursorY })
  cursorY -= 34

  preamble.forEach((paragraph, index) => {
    const prefix = index === 0 ? '' : '• '
    const lines = wrapText({ font, size: preambleFontSize, text: paragraph, width: pageWidth - pageMargin * 2 - 8 })
    lines.forEach((line, lineIndex) => {
      page.drawText(`${lineIndex === 0 ? prefix : '  '}${line}`, {
        font,
        size: preambleFontSize,
        x: pageMargin,
        y: cursorY,
      })
      cursorY -= preambleLineHeight
    })
    cursorY -= index === 0 ? 7 : 1
  })
  cursorY -= 8

  const [leftRooms, rightRooms] = splitRoomColumns(rooms)
  leftRooms.forEach((room) => {
    cursorY = drawRoom({ boldFont, font, page, room, x: pageMargin, y: cursorY })
  })

  let rightCursorY = pageHeight - pageMargin - 34
  preamble.forEach((paragraph, index) => {
    const lines = wrapText({ font, size: preambleFontSize, text: paragraph, width: pageWidth - pageMargin * 2 - 8 })
    rightCursorY -= lines.length * preambleLineHeight + (index === 0 ? 7 : 1)
  })
  rightCursorY -= 8
  rightRooms.forEach((room) => {
    rightCursorY = drawRoom({ boldFont, font, page, room, x: pageMargin + columnWidth + columnGap, y: rightCursorY })
  })

  return pdf.save()
}

export const getGameRoomUsePdfData = async (ctx: Context, input: ReportPdfInput): Promise<ReportPdfData> =>
  inRlsTransaction(ctx, async (tx) => {
    const settings = await getRuntimeSettingsTx(tx)
    const year = input.year ?? settings.year
    const rows = (await tx.$queryRawUnsafe(
      `
        WITH gaming_rooms AS (
          SELECT
            r.id AS room_id,
            r.description AS "roomDescription",
            STRING_AGG(u.full_name, ', ' ORDER BY u.full_name) AS "roomMembers"
          FROM room r
          JOIN member_room_assignment mra ON mra.room_id = r.id AND mra.year = ${year}
          JOIN membership m ON m.id = mra.member_id AND m.year = ${year} AND m.attending
          JOIN "user" u ON u.id = m.user_id AND NULLIF(u.full_name, '') IS NOT NULL
          WHERE r.enabled
          GROUP BY r.id, r.description
        ), assigned_games AS (
          SELECT
            COALESCE(gra.room_id, g.room_id) AS room_id,
            g.slot_id AS slot,
            g.name AS "gameName",
            STRING_AGG(
              DISTINCT COALESCE(NULLIF(gm_user.full_name, ''), gm_user.display_name, gm_user.email),
              ', ' ORDER BY COALESCE(NULLIF(gm_user.full_name, ''), gm_user.display_name, gm_user.email)
            ) FILTER (WHERE ga.gm > 0) AS "gmNames"
          FROM game g
          LEFT JOIN game_room_assignment gra ON
            gra.game_id = g.id
            AND gra.slot_id = g.slot_id
            AND gra.year = g.year
          LEFT JOIN game_assignment ga ON ga.game_id = g.id AND ga.year = ${year} AND ga.gm >= 0
          LEFT JOIN membership gm_membership ON gm_membership.id = ga.member_id AND gm_membership.year = ${year}
          LEFT JOIN "user" gm_user ON gm_user.id = gm_membership.user_id
          WHERE g.year = ${year} AND g.category = 'user' AND g.slot_id IS NOT NULL
          GROUP BY COALESCE(gra.room_id, g.room_id), g.id, g.slot_id, g.name
        )
        SELECT
          gaming_rooms."roomDescription",
          gaming_rooms."roomMembers",
          assigned_games.slot AS "slot",
          assigned_games."gameName",
          assigned_games."gmNames"
        FROM gaming_rooms
        LEFT JOIN assigned_games ON assigned_games.room_id = gaming_rooms.room_id
        ORDER BY
          NULLIF(REGEXP_REPLACE(gaming_rooms."roomDescription", '\\D', '', 'g'), '')::integer,
          gaming_rooms."roomDescription",
          assigned_games.slot,
          assigned_games."gameName"
      `,
    )) as Array<GameRoomUseRow>

    const rooms = groupGameRoomUseRows(rows)
    if (rooms.length === 0) {
      throw new Error(`No allocated game rooms found for ${year}`)
    }

    const pdfBytes = await renderGameRoomUsePdf(rooms)
    return {
      base64: Buffer.from(pdfBytes).toString('base64'),
      contentType: 'application/pdf',
      filenameLabel: 'game-room-use',
    }
  })
