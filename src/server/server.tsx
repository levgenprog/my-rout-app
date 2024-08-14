import fs from 'fs';

import { lazy } from 'react';
import ReactDOMServer from 'react-dom/server';

import express from 'express';

import { SSRRouter2 } from '@nxweb/react';

import { App, renderAppWithEmotion } from '@components/app.js';
import { routes } from '@config/routes.js';

const app = express();
const error = lazy(() => import('@views/NotFound.js'));

app.use('/static', express.static(__dirname));
// eslint-disable-next-line @typescript-eslint/no-magic-numbers
const PORT = process.env.PORT || 3000;

const createReactApp = async (location: string) => {
  const reactAppString = ReactDOMServer.renderToString(
    <SSRRouter2
      error={error}
      location={location}
      root={App}
      resolvePages={true}
      routes={routes} />
  );

  const { app: emotionApp, emotionChunks } = renderAppWithEmotion(
    App,
    reactAppString
  );

  const html = await fs.promises.readFile(`${__dirname}/index.html`, 'utf-8');

  const reactHtml = html
    .replace('<div id="root"></div>', `<div id="root">${emotionApp}</div>`)
    .replace(
      '</head>',
      `${emotionChunks.styles.map((style) => `<style>${style.css}</style>`).join('')}\n</head>`
    );

  return reactHtml;
};

// app.get('/favicon.ico', (req, res) => res.status(204).end());

app.get('*', async (req, res) => {
  try {
    const indexHtml = await createReactApp(req.url);

    res.status(200).send(indexHtml);
  } catch (error) {
    console.error('Error rendering app:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
