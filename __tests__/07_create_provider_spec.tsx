import React, { StrictMode, useRef, useState } from 'react';
import {
  cleanup,
  fireEvent,
  render,
  screen,
} from '@testing-library/react';
import { createProviderFromHook } from '../src/index';

describe('createProvider spec', () => {
  afterEach(cleanup);

  it('counter', () => {
    const initialState = {
      count1: 0,
      count2: 0,
    };
    const [StateProvider, useCounterSelector] = createProviderFromHook(
      () => useState(initialState),
    );
    const Counter1 = () => {
      const count1 = useCounterSelector((v) => v[0].count1);
      const setState = useCounterSelector((v) => v[1]);
      const increment = () => setState((s) => ({
        ...s,
        count1: s.count1 + 1,
      }));
      const renderCount = useRef(0);
      renderCount.current += 1;
      return (
        <div>
          <span>count1: {count1}</span>
          <button type="button" onClick={increment}>+1</button>
          <span>{renderCount.current}</span>
        </div>
      );
    };
    const Counter2 = () => {
      const count2 = useCounterSelector((v) => v[0].count2);
      const renderCount = useRef(0);
      renderCount.current += 1;
      return (
        <div>
          <span>count2: {count2}</span>
          <span data-testid="counter2">{renderCount.current}</span>
        </div>
      );
    };
    const App = () => (
      <StrictMode>
        <StateProvider>
          <Counter1 />
          <Counter2 />
        </StateProvider>
      </StrictMode>
    );
    const { container } = render(<App />);
    expect(container).toMatchSnapshot();
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByTestId('counter2').textContent).toEqual('1');
    expect(container).toMatchSnapshot();
  });
});
