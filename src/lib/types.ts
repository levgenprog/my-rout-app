// The changes in this file should be merged to https://gitlab.com/nxweb/react/-/blob/master/src/router/types.ts

import { ComponentType, ReactNode } from "react";
import type { HeadManagerState, Layouts, RootProps, Route, RouteProps } from '@nxweb/react';

interface RouterProps {
  basePath?: string;
  debug?: boolean;
  defaultLayout?: string;
  error?: ComponentType<RouteProps>;
  fallback?: ReactNode;
  headManager?: HeadManagerState | null;  // allow setting headManager to null
  layouts?: Layouts;
  resolvePages?: boolean;
  root?: ComponentType<RootProps>;
  routes?: readonly Route[];
}

export type { RouterProps }