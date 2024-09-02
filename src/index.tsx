/* eslint-disable react/display-name */
import { StrictMode } from 'react';
// import { createRoot } from 'react-dom/client';
import { hydrateRoot } from 'react-dom/client';
import {BrowserRouter} from '@nxweb/react';
// import { createBrowserRouter, RouteObject, RouterProvider } from 'react-router-dom';

import { ServiceWorker } from '@nxweb/core/web';
import { disableReactDevTools } from '@nxweb/react';

import  Main  from '@components/Main.js';
// import { App } from '@components/app.js';
import { routes } from '@config/routes.js';

// import About from '@pages/About.js';

// import Index from './pages/index.js';

if (process.env.NODE_ENV === 'production') {
  disableReactDevTools();
}

// const HomeComponent = () => <Index />;
// const AboutComponent = () => <About />;

// const routes: RouteObject[] = [
//   {
//     element: <Main />,
//     path: '/'
//   },
//   {
//     element: <AboutComponent />,
//     path: '/about'
//   }
// ];

// const router = createBrowserRouter([
//   {
//     children: routes,
//     element: <Main />,
//     id: 'root',
//     path: '/'
//   }
// ]);

hydrateRoot(
  document.getElementById('root') as HTMLElement,
  <StrictMode>
    <BrowserRouter basePath="/" routes={routes} fallback={<div>Loading...</div>}>
      <Main />
    </BrowserRouter>
    {/* <RouterProvider router={router} /> */}
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
