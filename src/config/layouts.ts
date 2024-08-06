import { LayoutRegistry } from '@nxweb/react';

import { DefaultLayout } from '@layouts/default.js';

export const layouts: LayoutRegistry = new LayoutRegistry({
  default: DefaultLayout
});
