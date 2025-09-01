import { headers } from '@amber/amber/utils/next-headers.js'
import bundleAnalyzer from '@next/bundle-analyzer'
import { PrismaPlugin } from '@prisma/nextjs-monorepo-workaround-plugin'
import withMdxFm from 'next-mdx-frontmatter'

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

const mdxConfig = withMdxFm({
  extension: /\.mdx?$/,
  MDXOptions: {
    remarkPlugins: [],
    rehypePlugins: [],
    providerImportSource: '@mdx-js/react',
  },
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@amber/ui', '@amber/database', '@amber/amber', '@mui/material', '@amber/api'],
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
  experimental: {
    outputFileTracingExcludes: {
      '*': ['node_modules/@swc/**'],
    },
  },
  headers,
  webpack: (config, { isServer }) => {
    if (isServer) {
      // eslint-disable-next-line no-param-reassign
      config.plugins = [...config.plugins, new PrismaPlugin()]
    }

    return config
  },
}

export default withBundleAnalyzer(mdxConfig(nextConfig))
