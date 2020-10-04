import { useLocation } from 'react-router-dom'

const pattern = /(\/.*?)\/(\d+)(?:\/(\d+))?/
const BASE = 1
const YEAR = 2
const SLOT = 3

export const useGameUrl = () => {
  const location = useLocation()
  const match = location?.pathname?.match(pattern)
  // note that we can't just use useParams since we're not the routed-to component
  const base = match?.[BASE]
  const yearStr = match?.[YEAR]
  const slotIdStr = match?.[SLOT]
  const hash = location.hash
  const slot = slotIdStr ? parseInt(slotIdStr) : 1
  const year = yearStr ? parseInt(yearStr) : 0
  return { base, year, slot, hash }
}
