import fs from 'fs';

import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';

import express from 'express';

// import { App } from '@components/app';
import Index from '@pages/index';

const app = express();

app.use('/static', express.static(__dirname));
// eslint-disable-next-line no-magic-numbers, @typescript-eslint/no-magic-numbers
const PORT = process.env.PORT || 3000;

/**
 * Produces the initial non-interactive HTML output of React
 * components. The hydrateRoot method is called on the client
 * to make this HTML interactive.
 * @param {string} location
 * @return {Promise<string>}
 */
const createReactApp = async (location: string) => {
  const reactApp = ReactDOMServer.renderToString(
        <StaticRouter location={location}>
            <Index />
        </StaticRouter>
  );
  const html = await fs.promises.readFile(`${__dirname}/index.html`, 'utf-8');
  const reactHtml = html.replace('<div id="root"></div>', `<div id="root">ITD${reactApp}</div>`);

  return reactHtml;
};

app.get('*', async (req, res) => {
  const indexHtml = await createReactApp(req.url);

  res.status(200).send(indexHtml);
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
