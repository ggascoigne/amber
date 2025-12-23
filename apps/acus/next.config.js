import { headers } from '@amber/amber/utils/next-headers.js'
import bundleAnalyzer from '@next/bundle-analyzer'
import createMDX from '@next/mdx'

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
  options: {
    remarkPlugins: [
      // parse YAML (and TOML if you want)
      ['remark-frontmatter', ['yaml']],
      // turn the parsed front matter into: export const metadata = { ... }
      ['remark-mdx-frontmatter', { name: 'metadata' }],
    ],
    rehypePlugins: [],
    // Add compile-time components
    providerImportSource: '@mdx-js/react',
  },
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@amber/ui', '@amber/amber', '@mui/material', '@amber/api', '@auth0/nextjs-auth0'],
  modularizeImports: {
    '@mui/icons-material': {
      transform: '@mui/icons-material/{{member}}',
    },
  },
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  headers,
  compiler: {
    emotion: {
      sourceMap: true,
    },
  },
}

export default withBundleAnalyzer(withMDX(nextConfig))
