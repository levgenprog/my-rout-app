// The changes in this file should be merged to https://gitlab.com/nxweb/react/-/blob/master/src/router/router.tsx

import { FC, useMemo } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { ConsoleLogger, NullLogger } from '@nxweb/core';

import { resolveRoutes } from './resolver.js';

import type { Route } from '@nxweb/react';
import type { RouterProps } from './types.js';

const emptyRoutes: readonly Route[] = [];

const BrowserRouter: FC<RouterProps> = ({
  debug = false,
  basePath,
  routes = emptyRoutes,
  defaultLayout,
  error,
  headManager,
  layouts,
  resolvePages,
  root,

  fallback
}) => {
  const options = useMemo(() => ({
    defaultLayout,
    error,
    fallback,
    headManager,
    layouts,
    resolvePages,
    root
  }), [defaultLayout, error, fallback, headManager, layouts, resolvePages, root]);

  const logger = useMemo(() => (debug ? new ConsoleLogger({ prefix: '[@nxweb/react]' }) : NullLogger), [debug]);
  const router = useMemo(() => {
    const routed = resolveRoutes(routes, options); // Use our patched resolveRoutes here
    if (process.env.NODE_ENV !== 'production') {
      logger.debug('routes', { options, routes: routed });
    }

    return createBrowserRouter(routed, { basename: basePath || '/' });
  }, [logger, basePath, routes, options]);

  return (
    <RouterProvider fallbackElement={fallback} router={router} />
  );
};

BrowserRouter.displayName = 'BrowserRouter';

// TODO
// - HashRouter
// - MemoryRouter

export { BrowserRouter };