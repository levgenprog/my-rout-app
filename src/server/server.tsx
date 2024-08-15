import fs from 'fs';

import React from 'react';
import ReactDOMServer from 'react-dom/server';

import express from 'express';

import { SSRRouter2 } from '@nxweb/react';

import { App, renderAppWithEmotion } from '@components/app.js';
import { routes } from '@config/routes.js';
import NotFound from '@views/NotFound.js';

const app = express();

app.use('/static', express.static(__dirname));
// eslint-disable-next-line @typescript-eslint/no-magic-numbers
const PORT = process.env.PORT || 3000;

// Function to create the HTML response from the React app
const createReactApp = async (location: string) => {
  try {
    // Render the React app to a string
    const reactAppString = ReactDOMServer.renderToString(
      <SSRRouter2
        error={NotFound}
        location={location}
        root={App}
        routes={routes} />
    );

    // Extract Emotion styles and render them
    const { emotionChunks } = renderAppWithEmotion(
      App,
      reactAppString
    );

    // Read the HTML template file
    const html = await fs.promises.readFile(`${__dirname}/index.html`, 'utf-8');

    // Inject the rendered app and Emotion styles into the template
    const reactHtml = html
      .replace('<div id="root"></div>', `<div id="root">${reactAppString}</div>`)
      .replace(
        '</head>',
        `${emotionChunks.styles
          .map((style) => `<style data-emotion-css="${style.key}">${style.css}</style>`)
          .join('')}\n</head>`
      );

    return reactHtml;
  } catch (err) {
    console.error('Error during server-side rendering:', err);
    throw err;
  }
};

// Catch-all route to handle rendering
app.get('*', async (req, res) => {
  try {
    const indexHtml = await createReactApp(req.url);

    res.status(200).send(indexHtml);
  } catch (error) {
    res.status(500).send('Internal Server Error');
    console.log(error);
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
