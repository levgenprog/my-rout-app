import type { PageComponent } from '@nxweb/react';

// eslint-disable-next-line no-restricted-syntax
import Navbar from '@components/Navbar';
// import { app } from '@config/app.js';

const Index: PageComponent = () => {
  return (
    <div className="app">
      <Navbar />
      <header className="app-header">
        {/* <img alt="logo" className="app-logo" src={app.logo} /> */}
        <p>
          Edit <code>@pages/index.tsx</code> and save to reload.
        </p>
        <a
          className="app-link"
          href="https://nxweb.gitlab.io/docs"
          rel="noopener noreferrer"
          target="_blank"
        >
          Learn NextWeb
        </a>
      </header>
    </div>
  );
};

Index.displayName = 'Index';

export default Index;
