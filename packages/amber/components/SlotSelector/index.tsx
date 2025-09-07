import React, { ChangeEvent, useCallback } from 'react'

import { Card, CardHeader, range } from '@amber/ui'
import { Tab, Tabs } from '@mui/material'
import { useRouter } from 'next/router'

import { getSlotDescription, SlotFormat, useConfiguration, useGameUrl } from '../../utils'
import { SlotDecorator, SlotDecoratorParams } from '../types'

// styles inlined via sx

interface SlotSelectorProps {
  small: boolean
  name?: string
  decorator?: (props: SlotDecorator) => React.ReactNode
  decoratorParams?: SlotDecoratorParams

  children: ({ slot, year }: { slot: number; year: number }) => React.ReactNode
}

export const SlotSelector: React.FC<SlotSelectorProps> = ({ small, children, decorator, decoratorParams = {} }) => {
  const configuration = useConfiguration()
  const router = useRouter()
  const { base, year, slot } = useGameUrl()

  const handleChange = useCallback(
    (event: ChangeEvent<unknown>, value: any) => {
      const slotId = value + 1
      router.replace(`${base}/${year}/${slotId}`)
    },
    [base, router, year],
  )

  const slots = range(configuration.numberOfSlots)

  if (year === 0) return null
  return (
    <div style={small ? { marginTop: 35, marginRight: 5, marginLeft: 5, marginBottom: 10, width: '95%' } : undefined}>
      <Card>
        <CardHeader color='success' plain sx={[{ display: 'flex', alignItems: 'center' }, small && { p: 0 }]}>
          {!small && <span style={{ fontSize: '1.125rem', paddingRight: 20 }}>Slot</span>}
          <Tabs
            value={slot - 1}
            onChange={handleChange}
            variant='scrollable'
            allowScrollButtonsMobile
            // scrollButtons={scrollButtons}
            sx={{
              minHeight: 'unset',
              pl: small ? '3px' : 0,
              '& .MuiTabs-indicator': { display: 'none' },
            }}
          >
            {slots.map((s) => (
              <Tab
                sx={{
                  minHeight: 'unset',
                  minWidth: 'unset',
                  width: 'unset',
                  height: 'unset',
                  maxWidth: 'unset',
                  maxHeight: 'unset',
                  p: small ? '8px 9px' : '10px 15px',
                  borderRadius: '3px',
                  lineHeight: '24px',
                  border: 0,
                  color: '#fff',
                  opacity: 1,
                  ml: '4px',
                  fontWeight: 500,
                  fontSize: '12px',
                  '&:last-child': { ml: 0 },
                  '&.Mui-selected': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    transition: '0.2s background-color 0.1s',
                    color: '#fff',
                  },
                }}
                key={s + 1}
                label={
                  <div style={{ position: 'relative' }}>
                    {s + 1}
                    {decorator?.({ year, slot: s, ...decoratorParams })}
                  </div>
                }
              />
            ))}
          </Tabs>
        </CardHeader>
      </Card>
      <h4
        style={
          small
            ? { marginBottom: 10, marginTop: -16, fontSize: '1em', lineHeight: '1.2em', paddingLeft: '16px' }
            : { marginBottom: 55 }
        }
      >
        {getSlotDescription(configuration, { slot, year, altFormat: SlotFormat.SHORT })}
      </h4>
      {children({ slot, year })}
    </div>
  )
}
