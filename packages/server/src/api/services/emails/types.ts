import type { getRuntimeSettingsTx } from '../runtimeSettings'

export type EmailSendResult = {
  sentCount: number
}

export type RuntimeSettings = Awaited<ReturnType<typeof getRuntimeSettingsTx>>
