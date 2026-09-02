/** @type {import('next').NextConfig} */

const isPlaywright = process.env.PLAYWRIGHT === '1' || process.env.NODE_ENV === 'test'

const nextConfig = {
  reactStrictMode: true,
  // TODO: Remove this after https://github.com/vercel/next.js/issues/96589 is fixed in our Next version.
  // Next 16.3's CLI check cannot resolve the workspace's TS6/TS7 package-alias setup.
  experimental: {
    useTypeScriptCli: false,
  },
  transpilePackages: ['@amber/ui'],
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
