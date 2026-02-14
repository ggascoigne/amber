import { Card, CardBody, CardHeader } from '@amber/ui'
import { Typography } from '@mui/material'

import { GameCard } from '../GameCard'

interface FakeTileProps {
  index: number
}

const FakeTile = ({ index }: FakeTileProps) => {
  const headerGradient =
    index === 2 ? 'linear-gradient(60deg, #23b7cb, #019eb3)' : 'linear-gradient(60deg, #22afc2, #0197ab )'
  const cardSx = index === 2 ? { zIndex: 9, transform: 'rotateZ(1deg)' } : { zIndex: 8, transform: 'rotateZ(5deg)' }
  return (
    <Card
      sx={{
        position: 'absolute',
        top: 20,
        left: 0,
        height: 279,
        width: 295,
        ...cardSx,
      }}
    >
      <CardHeader sx={{ background: headerGradient }} />
      <CardBody />
    </Card>
  )
}

interface YearTileProps {
  year: number
  game: any
  onClick?: any
}

export const YearTile = ({ year, game, onClick }: YearTileProps) => (
  <Card sx={{ width: 220, m: '30px auto' }} onClick={onClick}>
    <CardBody sx={{ height: 267, p: '0.9rem 20px' }}>
      <CardHeader
        sx={{
          color: '#fff',
          background: 'linear-gradient(60deg, #a0a0a0, #888888)',
          boxShadow:
            '0 12px 20px -10px rgba(153, 153, 153, 0.28), 0 4px 20px 0px rgba(0, 0, 0, 0.12), 0 7px 8px -5px rgba(153, 153, 153, 0.2)',
        }}
      >
        <Typography variant='h6' sx={{ color: '#fff', textAlign: 'center', lineHeight: 1.4 }}>
          {year}
        </Typography>
      </CardHeader>
      <div
        style={{
          position: 'relative',
          height: 300,
          width: 295,
          transform: 'scale(0.6,0.6)',
          transformOrigin: 'top left',
          padding: '20px 0px',
        }}
      >
        <GameCard game={game} year={year} slot={1} tiny />
        <FakeTile index={2} />
        <FakeTile index={3} />
      </div>
    </CardBody>
  </Card>
)
