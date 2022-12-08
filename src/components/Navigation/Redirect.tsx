import { useRouter } from 'next/router'
import React from 'react'

export const Redirect: React.FC<{ to: string }> = ({ to }) => {
  const router = useRouter()
  router.push(to)
  return null
}
