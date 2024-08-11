import bundleAnalyzer from '@next/bundle-analyzer'
import { headers } from 'amber/utils/next-headers.js'
import withMdxFm from 'next-mdx-frontmatter'

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

const mdxConfig = withMdxFm({
  extension: /\.mdx?$/,
  MDXOptions: {
    // If you use remark-gfm, you'll need to use next.config.mjs
    // as the package is ESM only
    // https://github.com/remarkjs/remark-gfm#install
    remarkPlugins: [],
    rehypePlugins: [],
    // If you use `MDXProvider`, uncomment the following line.
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
      '*': ['node_modules/@swc/**', '.next/**'],
    },
  },
  headers,
}

export default withBundleAnalyzer(mdxConfig(nextConfig))
