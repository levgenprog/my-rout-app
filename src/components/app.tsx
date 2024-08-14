import type { FC } from 'react';

import { CacheProvider } from '@emotion/react';
// eslint-disable-next-line import/no-extraneous-dependencies
import createEmotionServer from '@emotion/server/create-instance';

import type { LayoutWrapperProps } from '@nxweb/react';
import { createEmotionCache, Head } from '@nxweb/react';

// Import { app } from '@config/app.js';

// import '@styles/index.scss';

const clientEmotionCache = createEmotionCache();

const App: FC<LayoutWrapperProps> = ({
  children = null,
  emotionCache = clientEmotionCache
}) => {
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>My Application</title>
        <meta content="My Application Description" name="description" />
        <meta content="application, react, ssr" name="keywords" />
        <meta content="initial-scale=1, width=device-width" name="viewport" />
      </Head>
      {children}
    </CacheProvider>
  );
};

App.displayName = 'App';

export { App };

export const renderAppWithEmotion = (AppComponent: FC, html: string) => {
  const key = 'custom';
  const cache = createEmotionCache(key);
  const { extractCriticalToChunks } = createEmotionServer(cache);

  const emotionChunks = extractCriticalToChunks(html);

  return {
    emotionChunks,
    html,
    app: (
      <CacheProvider value={cache}>
        <AppComponent />
      </CacheProvider>
    )
  };
};
