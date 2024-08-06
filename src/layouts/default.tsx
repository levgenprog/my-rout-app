import type { FC } from 'react';

import { classNames } from '@nxweb/core/strings';
import type { LayoutProps } from '@nxweb/react';

const DefaultLayout: FC<LayoutProps> = ({
  children = null, className
}) => {
  return (
    <div className={classNames('default-layout', className)}>
      {children}
    </div>
  );
};

DefaultLayout.displayName = 'DefaultLayout';

export { DefaultLayout };
