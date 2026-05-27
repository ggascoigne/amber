import { discordGameReport } from './discordGameReport'
import { donorReport } from './donorReport'
import { gameAndPlayersReport } from './gameAndPlayersReport'
import { gameAssignmentsReport } from './gameAssignmentsReport'
import { gameChoicesForPlayerSchedulerReport } from './gameChoicesForPlayerSchedulerReport'
import { gameReport } from './gameReport'
import { gamesForPlayerSchedulerReport } from './gamesForPlayerSchedulerReport'
import { gamesSchedulerReport } from './gamesSchedulerReport'
import { gmReport } from './gmReport'
import { memberPaymentDetailsReport } from './memberPaymentDetailsReport'
import { membersForPlayerSchedulerReport } from './membersForPlayerSchedulerReport'
import { membershipReport } from './membershipReport'
import { membersWithoutGameChoicesReport } from './membersWithoutGameChoicesReport'
import { roomReport } from './roomReport'
import { roomsByGameReport } from './roomsByGameReport'
import { roomsByRoomReport } from './roomsByRoomReport'
import type { ReportDefinitions } from './types'
import { voucherReport } from './voucherReport'
import { defaultWorkbook } from './workbook'

export { defaultWorkbook }

export const reportDefinitions: ReportDefinitions = {
  membershipReport,
  donorReport,
  gameReport,
  discordGameReport,
  gmReport,
  gameAndPlayersReport,
  roomReport,
  membersWithoutGameChoicesReport,
  gamesSchedulerReport,
  membersForPlayerSchedulerReport,
  gamesForPlayerSchedulerReport,
  gameChoicesForPlayerSchedulerReport,
  roomsByRoomReport,
  roomsByGameReport,
  gameAssignmentsReport,
  voucherReport,
  memberPaymentDetailsReport,
}
