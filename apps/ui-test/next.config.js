/** @type {import('next').NextConfig} */

const isPlaywright = process.env.PLAYWRIGHT === '1' || process.env.NODE_ENV === 'test'

const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@electric-sql/pglite', '@amber/ui'],
  modularizeImports: {
    '@mui/icons-material': {
      transform: '@mui/icons-material/{{member}}',
    },
  },
  compiler: {
    emotion: {
      sourceMap: true,
    },
  },
  ...(isPlaywright
    ? {
        devIndicators: false,
      }
    : {}),
}

export default nextConfig
