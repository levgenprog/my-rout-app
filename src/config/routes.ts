import { lazy } from 'react';

import type { Route } from '@nxweb/react';

export const routes: Route[] = [
  // {
  //   element: lazy(() => import('@views/errors')),
  //   fallback: true,
  //   title: '404: Not Found'
  // },
  {
    element: lazy(() => import('@pages/About.js')),
    path: '/about',
    title: 'About'
  },
  // {
  //   element: lazy(() => import('@pages/index.js')),
  //   path: '/',
  //   title: 'index'
  // },
  {
    element: lazy(() => import('@views/NotFound.js')),
    fallback: true,
    title: '404: Not Found'
  }
];
