import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';

import { ServiceWorker } from '@nxweb/core/web';
import { disableReactDevTools } from '@nxweb/react';

import { App } from '@components/app.js';
import { layouts } from '@config/layouts.js';
import { routes } from '@config/routes.js';

import { BrowserRouter } from '@lib/router';
import { RouteError } from '@views/errors.js';

if (process.env.NODE_ENV === 'production') {
  disableReactDevTools();
}

// const root = createRoot(document.getElementById('root') as HTMLElement);
// root.render(
//   <StrictMode>
//     <BrowserRouter
//       defaultLayout="default"
//       error={RouteError}
//       headManager={null}   // headManager must be null in SSR
//       layouts={layouts}
//       resolvePages={false} // resolvePages is NOT yet supported; need to patch the resolvePages function
//       root={App}
//       routes={routes} />
//   </StrictMode>
// );

hydrateRoot(
  document.getElementById('root') as HTMLElement,
  <StrictMode>
    <BrowserRouter
      defaultLayout="default"
      error={RouteError}
      headManager={null}    // headManager must be null in SSR
      layouts={layouts}
      resolvePages={false}  // resolvePages is NOT yet supported; need to patch the resolvePages function
      root={App}
      routes={routes} />
  </StrictMode>
);

/**
 * ServiceWorker registration
 * If you want your app to work offline and load faster, you can change
 * unregister() to register() below, and set the pwa property to true in .nextweb.ts.
 *
 * Note:
 * This comes with some pitfalls though, make sure you know the implications.
 */

ServiceWorker.unregister();

/**
 * Performance metric reporting
 * If you want your app to send anlytics metrics you can pass a custom
 * handler for processing the metrics below.
 * The `console.debug` is provided as example only.
 *
 * WebVitals.register(console.debug);
 */

/**
 * The default application export
 * If enabled, this will be available as global `NX` object
 *
 * Note:
 * At runtime these could be overwritten by the host application.
 */

export default {};
