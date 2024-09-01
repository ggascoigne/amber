export const headers = async () => [
  {
    source: '/:path*',
    headers: [
      {
        key: 'X-Clacks-Overhead',
        value: 'GNU Terry Pratchett',
      },
    ],
  },
]
