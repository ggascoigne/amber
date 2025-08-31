import * as React from 'react'

import { createEmotionCache, theme } from '@amber/ui'
import createEmotionServer from '@emotion/server/create-instance'
import Document, { Head, Html, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  override render() {
    return (
      <Html lang='en'>
        <Head>
          <meta name='application-name' content='AmberCon US' />
          <meta name='apple-mobile-web-app-capable' content='yes' />
          <meta name='apple-mobile-web-app-status-bar-style' content='default' />
          <meta name='apple-mobile-web-app-title' content='AmberCon US' />
          <meta
            name='description'
            content='A fully residential roleplaying convention located in Livonia, Michigan, just outside Detroit, Michigan.'
          />
          <meta
            name='summary'
            content="AmberCon US is a fully residential roleplaying convention devoted to all forms of roleplaying, primarily diceless, and originally set in the world of Roger Zelazny's 'Amber' and based on the rules created by Erick Wujick and published thgrough Phage Ppress."
          />
          <meta
            name='keywords'
            content='game, gaming, rpg, roleplaying, amber, Zelazny, Wujick, convention, science fiction, fantasy, fans, amberites, trumps, gamers, playing, Livonia, Detroit, Michigan, Phage Press'
          />
          <meta name='mobile-web-app-capable' content='yes' />
          <meta name='theme-color' content={theme.palette.primary.main} />

          <link rel='shortcut icon' href='/favicon.ico' />
          <meta name='author' content='guy@wyrdrune.com' />

          <link rel='apple-touch-icon' sizes='180x180' href='/apple-touch-icon.png' />
          <link rel='icon' type='image/png' sizes='32x32' href='/favicon-32x32.png' />
          <link rel='icon' type='image/png' sizes='16x16' href='/favicon-16x16.png' />
          <link rel='manifest' href='/manifest.json' />

          <link
            rel='stylesheet'
            href='https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,900&display=swap'
          />
          <link rel='stylesheet' href='https://fonts.googleapis.com/icon?family=Material+Icons' />
          <meta name='emotion-insertion-point' content='' />
          {(this.props as any).emotionStyleTags}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

// `getInitialProps` belongs to `_document` (instead of `_app`),
// it's compatible with static-site generation (SSG).
MyDocument.getInitialProps = async (ctx) => {
  // Resolution order
  //
  // On the server:
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. document.getInitialProps
  // 4. app.render
  // 5. page.render
  // 6. document.render
  //
  // On the server with error:
  // 1. document.getInitialProps
  // 2. app.render
  // 3. page.render
  // 4. document.render
  //
  // On the client
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. app.render
  // 4. page.render

  const originalRenderPage = ctx.renderPage

  // You can consider sharing the same Emotion cache between all the SSR requests to speed up performance.
  // However, be aware that it can have global side effects.
  const cache = createEmotionCache()
  const { extractCriticalToChunks } = createEmotionServer(cache)

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App: any) =>
        function EnhanceApp(props) {
          return <App emotionCache={cache} {...props} />
        },
    })

  const initialProps = await Document.getInitialProps(ctx)
  // This is important. It prevents Emotion to render invalid HTML.
  // See https://github.com/mamber/material-amber/issues/26561#issuecomment-855286153
  const emotionStyles = extractCriticalToChunks(initialProps.html)
  const emotionStyleTags = emotionStyles.styles.map((style) => (
    <style
      data-emotion={`${style.key} ${style.ids.join(' ')}`}
      key={style.key}
      // eslint-disable-next-line react/no-danger,risxss/catch-potential-xss-react
      dangerouslySetInnerHTML={{ __html: style.css }}
    />
  ))

  return {
    ...initialProps,
    emotionStyleTags,
  }
}

export default MyDocument
