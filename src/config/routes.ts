import { Counter } from '@views/counter.js';
import { NotFound } from '@views/not-found.js';

import type { Route } from '@nxweb/react';

export const routes: Route[] = [
  /** 
   * --------------------------------------------------------------------------------
   * NOTE: 
   * --------------------------------------------------------------------------------
   * Pages routing (@pages/*) are automatically resolved using the `resolvePages` props,
   * No need to define the routes here
   * --------------------------------------------------------------------------------
   */

  // {
  //   element: lazy(() => import('@pages/About.js')),
  //   path: '/about',
  //   title: 'About'
  // },
  // {
  //   element: lazy(() => import('@pages/index.js')),
  //   path: '/',
  //   title: 'index'
  // },

  /** 
   * --------------------------------------------------------------------------------
   * NOTE: 
   * --------------------------------------------------------------------------------
   * SSR implementation with `renderToString` has limited `Suspense` support,
   * so we need to explicitly set `suspended: false` on our routes
   * 
   * See: https://react.dev/reference/react-dom/server/renderToString#caveats
   * 
   * See also discussion at https://github.com/reactwg/react-18/discussions/37 
   * for possible solution using `renderToPipeableStream`
   * 
   * React.lazy or lazy(() => ...) is also somewhat problematic with SSR so we need 
   * to remove those... for now...
   * -------------------------------------------------------------------------------- 
  */

  {
    path: '/',
    element: Counter,
    title: 'Homepage',
    suspended: false  // not supported with current SSR implementation see above note
  },
  {
    element: NotFound,
    fallback: true,
    title: '404: Not Found',
    suspended: false  // not supported with current SSR implementation see above note
  }
];
