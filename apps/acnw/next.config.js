/** @type {import('next').NextConfig} */

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})
const { headers } = require('amber/utils/next-headers')
const withMdxFm = require('next-mdx-frontmatter')({
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

module.exports = withBundleAnalyzer(
  withMdxFm({
    reactStrictMode: true,
    transpilePackages: ['ui', 'database', 'amber', '@mui/material', '@amber/api'],
    eslint: {
      // Warning: This allows production builds to successfully complete even if
      // your project has ESLint errors.
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
    // Append the default value with md extensions
    pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
    experimental: {
      outputFileTracingExcludes: {
        '*': ['node_modules/@swc/**'],
      },
    },
    headers,
  })
)
