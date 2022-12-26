/** @type {import('next').NextConfig} */

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

module.exports = withMdxFm({
  reactStrictMode: true,
  experimental: {
    transpilePackages: ['ui', 'database', 'amber'],
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  // Append the default value with md extensions
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  webpack: (config) => {
    Object.assign(config.externals, {
      bufferutil: 'bufferutil',
      'utf-8-validate': 'utf-8-validate',
    })
    return config
  },
})
