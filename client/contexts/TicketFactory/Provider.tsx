import { ReactNode, Reducer, useReducer } from 'react';
import { TicketFactoryContext, reducer, initialState } from './index';

export function Provider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <TicketFactoryContext.Provider value={{ state, dispatch }}>
      {children && children}
    </TicketFactoryContext.Provider>
  );
}
