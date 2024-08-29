import { Fragment, StrictMode } from "react";
import { createSearchParams } from "react-router-dom";
import { renderToString } from "react-dom/server";

import { AuthRedirect, LayoutRegistry, Redirect, resolveElement, resolvePages, shouldSuspend, wrapLayout } from "@nxweb/react";
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from "react-router-dom/server";

import type { ComponentType, ReactNode } from "react";
import type { RouteObject } from "react-router-dom";
import type { Layout, Layouts, RootProps, Route, RouteProps } from "@nxweb/react";
import type { Request, Response } from "express";

const emptyRoutes: readonly Route[] = [];

interface ResolveStaticRoutesOptions {
  defaultLayout?: string
  error?: ComponentType<RouteProps>
  fallback?: ReactNode
  layouts?: Layouts
  resolvePages?: boolean
  root?: ComponentType<RootProps>
}

// based on: https://gitlab.com/nxweb/react/-/blob/master/src/router/resolver.ts
// - replace `window` with `globalThis` since `window` only exist in browser context
// - remove <Suspense> boundary and <HeadManager /> to workaround SSR issue
const resolveStaticRoutes = (routes: readonly Route[], options: ResolveStaticRoutesOptions): RouteObject[] => {
  const {
    defaultLayout,
    error,
    fallback,
    layouts = new LayoutRegistry(),
    resolvePages: withPages = false,
    root
  } = options;

  const { location } = globalThis;

  // eslint-disable-next-line complexity
  const resolvedRoutes = routes.map((route) => {
    // ** RouterProps to pass them to Layouts
    const { auth, guest, id, path, title, className, meta, ...routeProps } = route;
    const props: RouteProps = { auth, className, guest, id, meta, path, title };

    if ('redirectTo' in routeProps) {
      const hash = routeProps.hash === true ? location.hash : routeProps.hash;
      const replace = routeProps.replace !== false;
      const search = routeProps.search === true
        ? location.search
        : typeof routeProps.search === 'object'
          ? createSearchParams(routeProps.search).toString()
          : undefined;

      // eslint-disable-next-line react/display-name
      const Redirector = auth !== false ? AuthRedirect : Redirect;
      const Root = root || Fragment;

      return {
        id,
        path,
        element:
          <Root route={props}>
            <Redirector
              hash={hash}
              path={routeProps.redirectTo}
              replace={replace}
              search={search} />
          </Root>
      } as RouteObject;

    }

    const { suspended, layout, element, error: errorElement, children, ...others } = routeProps;

    let selectedLayout: Layout | undefined = undefined;
    if (layout !== null) {
      const currentLayout = ((typeof layout === 'object' ? layout.name : layout) ?? defaultLayout) || '';
    
      selectedLayout = layouts?.get(currentLayout);
    
      if (layouts && !selectedLayout) {
        console.warn(`[@nxweb/react] missing layout: "${currentLayout}". Available layouts: [${layouts.names.map((s) => `"${s}"`).join(', ')}]`);
      }
    }
    
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const LayoutTag = selectedLayout
      ? root
        ? wrapLayout(selectedLayout, root)
        : selectedLayout
      : Fragment;

     const Element = element ?? Fragment;
     const ErrorElement = errorElement ?? error;
     const fallbackRoute = ('fallback' in routeProps && routeProps.fallback === true) || path === '*';

    return {
      ...others,

      children: resolveElement(children, props),
      element: 
        LayoutTag !== Fragment
          ? (
            <LayoutTag
              className={className}
              layout={layout !== null && typeof layout === 'object' ? layout : undefined}
              route={props}
            >
              <Element {...props} />
            </LayoutTag>
          ) 
          : <Element {...props} />,
      errorElement: fallbackRoute
        ? undefined
        : ErrorElement && <ErrorElement {...props} />,
      id: fallbackRoute ? '*' : id,
      path: fallbackRoute ? '*' : path
    } as RouteObject;
  });

  const resolved = withPages
    ? resolvePages(options).concat(...resolvedRoutes)
    : resolvedRoutes;
  
  if (resolved.length === 0) {
    resolved.push({ element: null, id: '*', path: '*' });
  }

  return resolved.sort((a, b) => {
    if (a.id === '*') { return 1; }

    if (b.id === '*') { return -1; }

    return (a?.path || '').localeCompare(b?.path || '');
  });
};

const createFetchRequest = (req: Request, res: Response): globalThis.Request => {
  let origin = `${req.protocol}://${req.get("host")}`;
  // Note: This had to take originalUrl into account for presumably vite's proxying
  let url = new URL(req.originalUrl || req.url, origin);

  let controller = new AbortController();
  res.on("close", () => controller.abort());

  let headers = new Headers();

  for (let [key, values] of Object.entries(req.headers)) {
    if (values) {
      if (Array.isArray(values)) {
        for (let value of values) {
          headers.append(key, value);
        }
      } else {
        headers.set(key, values);
      }
    }
  }

  let init: RequestInit = {
    method: req.method,
    headers,
    signal: controller.signal,
  };

  if (req.method !== "GET" && req.method !== "HEAD") {
    init.body = req.body;
  }

  return new globalThis.Request(url.href, init);
}

interface StaticRendererOptions extends ResolveStaticRoutesOptions {
  basePath?: string
  routes: Route[]
  
  hydrate?: boolean
  nonce?: string
}

interface StaticRenderer {
  render: (req: Request, res: Response) => Promise<string>
}

const createStaticRenderer = (options?: StaticRendererOptions): StaticRenderer => {
  const { 
    basePath,
    routes = emptyRoutes,
    hydrate,
    nonce,
    ...opts
  } = options ?? {};

  return {
    render: async (req: Request, res: Response): Promise<string> => {
      const { query, dataRoutes } = createStaticHandler(resolveStaticRoutes(routes, opts), { basename: basePath || '/' });
      const fetchRequest = createFetchRequest(req, res);
      const context = await query(fetchRequest);

      if (context instanceof Response) {
        throw context;
      }

      const router = createStaticRouter(dataRoutes, context);
      return renderToString(
        <StrictMode>
          <StaticRouterProvider context={context} router={router} hydrate={hydrate} nonce={nonce} />
        </StrictMode>
      );
    }
  };
};

export { createStaticRenderer, createFetchRequest, resolveStaticRoutes }
export type { StaticRendererOptions, ResolveStaticRoutesOptions }