import { headers } from '@amber/amber/utils/next-headers.js'
import bundleAnalyzer from '@next/bundle-analyzer'
import createMDX from '@next/mdx'
import { PrismaPlugin } from '@prisma/nextjs-monorepo-workaround-plugin'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
  options: {
    remarkPlugins: [
      // parse YAML (and TOML if you want)
      [remarkFrontmatter, ['yaml']],
      // turn the parsed front matter into: export const metadata = { ... }
      [remarkMdxFrontmatter, { name: 'metadata' }],
    ],
    rehypePlugins: [],
    // Add compile-time components
    providerImportSource: '@mdx-js/react',
  },
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    '@amber/ui',
    '@amber/database',
    '@amber/amber',
    '@mui/material',
    '@amber/api',
    '@auth0/nextjs-auth0',
  ],
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
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  headers,
  // Add experimental features for better HMR stability
  experimental: {
    optimizePackageImports: ['@mui/material', '@mui/icons-material'],
  },
  webpack: (config, { isServer, dev }) => {
    if (isServer) {
      // eslint-disable-next-line no-param-reassign
      config.plugins = [...config.plugins, new PrismaPlugin()]
    }

    // Improve HMR stability in development
    if (dev) {
      // eslint-disable-next-line no-param-reassign
      config.watchOptions = {
        ...config.watchOptions,
        poll: 1000,
        aggregateTimeout: 300,
      }
    }

    return config
  },
}

export default withBundleAnalyzer(withMDX(nextConfig))
