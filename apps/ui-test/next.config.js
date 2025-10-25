import path from 'path'

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@electric-sql/pglite', '@amber/ui'],
  eslint: {
    ignoreDuringBuilds: true,
  },
  modularizeImports: {
    '@mui/material': {
      transform: '@mui/material/{{member}}',
    },
    '@mui/icons-material': {
      transform: '@mui/icons-material/{{member}}',
    },
  },
  // Add experimental features for better HMR stability
  experimental: {
    optimizePackageImports: ['@mui/material', '@mui/icons-material'],
  },
  webpack: (config, { dev, dir }) => {
    // Improve HMR stability in development
    if (dev) {
      // eslint-disable-next-line no-param-reassign
      config.watchOptions = {
        ...config.watchOptions,
        poll: 1000,
        aggregateTimeout: 300,
      }
    }

    // Handle the special side-channel resolution
    // eslint-disable-next-line no-param-reassign
    config.resolve.alias = {
      ...config.resolve.alias,
      'side-channel': path.resolve(dir, dev ? 'src/shims/dev-side-channel.cjs' : 'src/shims/side-channel.cjs'),
    }

    return config
  },
}

export default nextConfig
