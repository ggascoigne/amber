import { createEmotionCache } from '@amber/ui'
import { DocumentHeadTags, documentGetInitialProps } from '@mui/material-nextjs/v16-pagesRouter'
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document(props: any) {
  return (
    <Html lang='en'>
      <Head>
        <DocumentHeadTags {...props} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

Document.getInitialProps = async (ctx: any) => {
  const emotionCache = createEmotionCache()
  const finalProps = await documentGetInitialProps(ctx, { emotionCache })
  return finalProps
}
