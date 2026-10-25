export const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return ''
  }

  const vercelUrl = process.env.VERCEL_URL
  if (vercelUrl) {
    return `https://${vercelUrl}`
  }

  return `http://localhost:${process.env.NEXT_PUBLIC_PORT ?? 3000}`
}
