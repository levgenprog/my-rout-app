import { useState } from "react";
import { css } from '@emotion/css';

const style = css`
  display: flex;
  gap: 1rem;
  align-items: center;

  font-size: 2rem;

  button {
    background: initial;
    border: 1px solid #c0c0c0;
    border-radius: .375rem;
    cursor: pointer;

    font-size: 1rem;

    width: 2.5rem;
    height: 2.5rem;
  }
`
const Counter = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1>Hello, World!</h1>
      <div className={style}>
        <button onClick={() => setCount((count) => count+1)}>➖</button>
        <div>{count}</div>
        <button onClick={() => setCount((count) => count+1)}>➕</button>
      </div>
    </div>
  );
};

Counter.displayName = 'Counter';

export { Counter };
