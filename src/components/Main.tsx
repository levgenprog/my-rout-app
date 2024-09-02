import { useState } from 'react';

// import Index from '@pages/index.js';

import Navbar from './Navbar.js';

const Main = () => {
  const [n, setN] = useState(0);

  return (
    <main>
      <Navbar />
      ITD
      {/* <Index /> */}
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto provident enim consequuntur ducimus neque repudiandae aperiam non, sit fugit quisquam aspernatur voluptate eligendi ut quidem! Id sunt minima doloremque fugiat!
      </p>

      <p>{n}</p>
      <button type="button" onClick={() => setN(n + 1)}>Click</button>
    </main>
  );
};

Main.displayName = 'Main';
export default Main;
