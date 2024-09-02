import fs from 'fs/promises';
import path from 'path';

import express from 'express';

import { App } from '@components/app.js';
import { layouts } from '@config/layouts.js';
import { routes } from '@config/routes.js';
import { RouteError } from '@views/errors.js';
import { createStaticRenderer, StaticRendererOptions } from '@lib/server.js';

import type { Request, Response } from 'express';

const PORT = process.env.PORT || 3000;

const createServer = (port: string | number) => {
  const options: StaticRendererOptions = {
    defaultLayout: "default",
    error: RouteError,
    layouts,
    resolvePages: false,
    root: App,
    routes
  }
  const renderer = createStaticRenderer(options);

  const app = express();
  app.use('/img', express.static(path.resolve(__dirname, '../img'), { index: false, fallthrough: false }));
  app.use('/js', express.static(path.resolve(__dirname, '../js'), { index: false, fallthrough: false }));
  app.use('/views', express.static(path.resolve(__dirname, '../views'), { index: false, fallthrough: false }));
  app.use('/workers', express.static(path.resolve(__dirname, '../workers'), { index: false, fallthrough: false }));

  // Catch-all route to handle rendering
  app.use('*', async (req: Request, res: Response) => {
    const url = req.originalUrl;

    try {
      const template = await fs.readFile(path.resolve(__dirname, '../index.html'), 'utf-8');

      try {
        const content = await renderer.render(req, res);
        const html = template
          .replace('<div id="root"></div>', `<div id="root">${content}</div>`)

          // SSR proof of concept: inject meta generator tag to document HEAD
          .replace('</head>', '  <meta name="generator" content="NextWeb 3.6.0" />\n</head>');

        res.setHeader("Content-Type", "text/html");
        res.status(200).send(html);
      } catch (e) {
        if (e instanceof Response && e.status >= 300 && e.status <= 399) {
          const location = e.headers.get("Location");
          if (location) {
            return res.redirect(e.status, location);
          }
        }

        throw e;
      }
    } catch (e) {
      if (e instanceof Error) {
        console.error(e.stack);
        res.status(500).end(e.stack);
      } else {
        console.error(e);
        res.status(500).end("Internal Server Error");
      }
    }
  });

  app.listen(port, () => {
    console.log(`Server started on port ${PORT}`);
  });

  return app;
}

createServer(PORT);
