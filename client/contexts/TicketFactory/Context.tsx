import { createContext } from 'react';

export const initialState: State = {
  event: {
    TicketCreated: [],
    TicketMinted: [],
  },
};

export const TicketFactoryContext = createContext<AppContext>({
  state: initialState,
  dispatch: () => {},
});
