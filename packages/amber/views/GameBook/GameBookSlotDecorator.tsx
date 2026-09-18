import { useMemo } from 'react'

import { useTRPC } from '@amber/client'
import type { GameChoice } from '@amber/client'
import { Box } from '@mui/material'
import { useQuery } from '@tanstack/react-query'

import type { SlotDecorator } from '../../components/types'
import { useGetMemberShip } from '../../utils/membership'
import { useGameUrl } from '../../utils/useGameUrl'
import { useUser } from '../../utils/useUserFilterState'

type GameMasterSlotDecoratorProps = SlotDecorator & {
  gmSlotIds?: Set<number>
}

export const GameMasterSlotDecorator = ({ slot, gmSlotIds }: GameMasterSlotDecoratorProps) =>
  gmSlotIds?.has(slot + 1) ? (
    <Box
      component='span'
      aria-label='You are the GM for this slot'
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: 26,
        height: 26,
        border: '2px solid #ffe100',
        borderRadius: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
      }}
    />
  ) : null

export const useGameMasterChoiceIds = () => {
  const trpc = useTRPC()
  const { year } = useGameUrl()
  const { userId } = useUser()
  const membership = useGetMemberShip(userId)
  const { data: gameChoiceData } = useQuery(
    trpc.gameChoices.getGameChoices.queryOptions({ year, memberId: membership?.id ?? 0 }, { enabled: !!membership }),
  )

  return useMemo(() => {
    const gameMasterChoices = gameChoiceData?.gameChoices?.filter(
      (choice): choice is GameChoice => choice?.rank === 0 && !!choice.gameId,
    )
    return {
      gameIds: new Set(gameMasterChoices?.map((choice) => choice.gameId)),
      slotIds: new Set(gameMasterChoices?.map((choice) => choice.slotId)),
    }
  }, [gameChoiceData])
}
