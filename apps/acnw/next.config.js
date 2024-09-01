import bundleAnalyzer from '@next/bundle-analyzer'
import { headers } from 'amber/utils/next-headers.js'
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
  transpilePackages: ['ui', 'database', 'amber', '@mui/material', '@amber/api'],
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
}

export default withBundleAnalyzer(mdxConfig(nextConfig))
