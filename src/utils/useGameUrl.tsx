import { useLocation } from 'react-router-dom'

const pattern = /(?<base>\/.*?)\/(?<year>\d+)(?:\/(?<slot>\d+))?/

export const useGameUrl = () => {
  const location = useLocation()
  const match = pattern.exec(location.pathname)
  // note that we can't just use useParams since we're not the routed-to component
  const base = match?.groups?.base
  const yearStr = match?.groups?.year
  const slotIdStr = match?.groups?.slot
  const { hash } = location
  const slot = slotIdStr ? parseInt(slotIdStr, 10) : 1
  const year = yearStr ? parseInt(yearStr, 10) : 0
  return { base, year, slot, hash }
}
