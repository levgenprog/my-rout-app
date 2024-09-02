// The changes in this file should be merged to https://gitlab.com/nxweb/react/-/blob/master/src/router/resolver.tsx

import { Fragment } from 'react';
import { createSearchParams, RouteObject } from 'react-router-dom';

import { AuthRedirect, HeadManagerContext, LayoutRegistry, Redirect, resolveElement, resolvePages, shouldSuspend, wrapLayout } from '@nxweb/react';
import { initHeadManager } from '@nxweb/react/components/head';

import type { ComponentType, ReactNode } from 'react';
import type {  HeadManagerState, Layout, Layouts, RootProps, Route, RouteProps } from '@nxweb/react';

interface ResolveRoutesOptions {
  defaultLayout?: string
  error?: ComponentType<RouteProps>
  fallback?: ReactNode
  headManager?: HeadManagerState | null
  layouts?: Layouts
  resolvePages?: boolean
  root?: ComponentType<RootProps>
}

const resolveRoutes = (routes: readonly Route[], options: ResolveRoutesOptions = {}): RouteObject[] => {
  const {
    defaultLayout,
    error,
    fallback,
    headManager = initHeadManager(),
    layouts = new LayoutRegistry(),
    resolvePages: withPages = false,
    root
  } = options;

  const { location } = window;

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
        headManager 
          ? <HeadManagerContext.Provider value={headManager}>
              <Root route={props}>
                <Redirector
                  hash={hash}
                  path={routeProps.redirectTo}
                  replace={replace}
                  search={search} />
              </Root>
            </HeadManagerContext.Provider>
          : <Root route={props}>
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
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const Element = element ?? Fragment;
    const ErrorElement = errorElement ?? error;
    const fallbackRoute = ('fallback' in routeProps && routeProps.fallback === true) || path === '*';

    return {
      ...others,

      children: resolveElement(children, props),
      element: LayoutTag !== Fragment
        ? shouldSuspend(
          headManager
            ? <HeadManagerContext.Provider value={headManager}>
                <LayoutTag
                  className={className}
                  layout={layout !== null && typeof layout === 'object' ? layout : undefined}
                  route={props}
                >
                  <Element {...props} />
                </LayoutTag>
              </HeadManagerContext.Provider>
            : <LayoutTag
                className={className}
                layout={layout !== null && typeof layout === 'object' ? layout : undefined}
                route={props}
              >
                <Element {...props} />
              </LayoutTag>,
          suspended !== false,
          fallback
        )
        : shouldSuspend(
          headManager 
            ? <HeadManagerContext.Provider value={headManager}>
                <Element {...props} />
              </HeadManagerContext.Provider>
            : <Element {...props} />,
          suspended !== false,
          fallback
        ),
      errorElement: fallbackRoute
        ? undefined
        : ErrorElement && shouldSuspend(<ErrorElement {...props} />, suspended !== false, fallback),
      id: fallbackRoute ? '*' : id,
      path: fallbackRoute ? '*' : path
    } as RouteObject;
  });

  const resolved = withPages
    ? resolvePages(options as any).concat(...resolvedRoutes)
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

// TODO:
// Update resolvePages, make sure <HeadManagerContext.Provider> is used only when headManager is specified (not null).
// See the resolveRoutes implementation above.
// 
// The <HeadManager /> component cannot be used in SSR, so we need to disable it by setting it to null

export { resolveRoutes }


